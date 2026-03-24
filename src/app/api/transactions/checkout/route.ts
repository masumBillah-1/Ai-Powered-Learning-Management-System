// src/app/api/transactions/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { Course, Transaction, Enrollment, User, SystemSettings } from "@/models";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-02-25.clover",
});

function getDecoded(req: NextRequest) {
  let token = req.cookies.get("token")?.value;
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };
  } catch {
    return null;
  }
}

// ✅ DB schema অনুযায়ী price extract
// DB তে pricing object নেই — flat price & originalPrice field আছে
function extractPrice(course: any): { isFree: boolean; priceInBDT: number } {
  // Free check — pricing.type === "free" অথবা price === 0
  if (course.pricing?.type === "free" || course.price === 0) {
    return { isFree: true, priceInBDT: 0 };
  }

  // ✅ DB schema: flat price field (primary)
  const basePrice = course.pricing?.price ?? course.price ?? 0;

  // ✅ DB schema: originalPrice = discounted/sale price
  // (form এ discountPrice → API route এ originalPrice হিসেবে save হয়)
  const discountPrice = course.pricing?.discountPrice ?? course.originalPrice ?? null;

  // discountPrice থাকলে এবং basePrice এর চেয়ে কম হলে সেটাই final price
  const finalPrice = (discountPrice && discountPrice > 0 && discountPrice < basePrice)
    ? discountPrice
    : basePrice;

  return { isFree: finalPrice === 0, priceInBDT: finalPrice };
}

// ─── POST — PaymentIntent ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const decoded = getDecoded(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized - Please login first" }, { status: 401 });
    }

    const body = await req.json();
    const { courseId } = body;

    if (!courseId || !mongoose.isValidObjectId(courseId)) {
      return NextResponse.json({ error: "Valid courseId required" }, { status: 400 });
    }

    const course = await Course.findById(courseId)
      .populate("instructorId", "name")
      .lean() as any;

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // ✅ Price extract — DB flat field থেকে
    const { isFree, priceInBDT } = extractPrice(course);

    // Free course enroll
    if (isFree) {
      const existing = await Enrollment.findOne({ studentId: decoded.userId, courseId });
      if (!existing) {
        await Enrollment.create({
          studentId:      decoded.userId,
          courseId,
          courseName:     course.title,
          // ✅ DB schema: thumbnail field
          courseImage:    course.thumbnail || course.coverImage?.url || "",
          instructorName: course.instructorId?.name || "",
          status:         "active",
          enrolledAt:     new Date(),
          progress: {
            completedLessons:   [],
            progressPercentage: 0,
            totalTimeSpent:     0,
            lastAccessedAt:     new Date(),
          },
        });
        await Promise.all([
          // ✅ enrollmentCount (DB schema field)
          Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } }),
          User.findByIdAndUpdate(decoded.userId, { $inc: { "stats.enrolledCourses": 1 } }),
        ]);
      }
      return NextResponse.json({ success: true, free: true });
    }

    // Already enrolled check (paid)
    const alreadyEnrolled = await Enrollment.findOne({ studentId: decoded.userId, courseId });
    if (alreadyEnrolled) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 });
    }

    // ✅ Price validate
    if (priceInBDT <= 0) {
      return NextResponse.json({ error: "Invalid course price" }, { status: 400 });
    }

    const commissionSetting = await SystemSettings.findOne({ key: "platform_commission" });
    const commissionRate = commissionSetting ? Number(commissionSetting.value) / 100 : 0.3;

    const priceInUSD    = parseFloat((priceInBDT / 110).toFixed(2));
    const amountInCents = Math.max(Math.round(priceInUSD * 100), 50);
    const platformFee   = Math.round(priceInBDT * commissionRate);
    const netAmount     = priceInBDT - platformFee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amountInCents,
      currency: "usd",
      metadata: {
        courseId:   courseId.toString(),
        studentId:  decoded.userId,
        courseName: course.title,
      },
      automatic_payment_methods: { enabled: true },
    });

    const transaction = await Transaction.create({
      type:           "payment",
      amount:         priceInBDT,
      netAmount,
      platformFee,
      currency:       "BDT",
      status:         "pending",
      studentId:      decoded.userId,
      courseId,
      instructorId:   course.instructorId?._id || course.instructorId,
      paymentMethod:  "card",
      paymentId:      paymentIntent.id,
      description:    `Course enrollment: ${course.title}`,
      courseName:     course.title,
      instructorName: course.instructorId?.name || "",
    });

    return NextResponse.json({
      success:       true,
      clientSecret:  paymentIntent.client_secret,
      transactionId: transaction._id,
      amount:        priceInBDT,
      courseName:    course.title,
    });

  } catch (error: any) {
    console.error("❌ POST /api/transactions/checkout:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── GET — Payment verify ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const decoded = getDecoded(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const paymentIntentId = searchParams.get("payment_intent");
    const courseId        = searchParams.get("courseId");

    if (!paymentIntentId || !courseId) {
      return NextResponse.json({ error: "payment_intent and courseId required" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ success: false, status: paymentIntent.status });
    }

    await Transaction.findOneAndUpdate(
      { paymentId: paymentIntentId },
      { status: "completed", processedAt: new Date() }
    );

    const alreadyEnrolled = await Enrollment.findOne({ studentId: decoded.userId, courseId });
    if (!alreadyEnrolled) {
      const course = await Course.findById(courseId)
        .populate("instructorId", "name")
        .lean() as any;
      if (course) {
        await Enrollment.create({
          studentId:      decoded.userId,
          courseId,
          courseName:     course.title,
          // ✅ DB schema: thumbnail field
          courseImage:    course.thumbnail || course.coverImage?.url || "",
          instructorName: course.instructorId?.name || "",
          status:         "active",
          enrolledAt:     new Date(),
          progress: {
            completedLessons:   [],
            progressPercentage: 0,
            totalTimeSpent:     0,
            lastAccessedAt:     new Date(),
          },
        });
        await Promise.all([
          // ✅ enrollmentCount (DB schema field)
          Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } }),
          User.findByIdAndUpdate(decoded.userId, { $inc: { "stats.enrolledCourses": 1 } }),
        ]);
      }
    }

    return NextResponse.json({ success: true, status: "succeeded" });

  } catch (error: any) {
    console.error("❌ GET /api/transactions/checkout:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}