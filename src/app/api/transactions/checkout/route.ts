// src/app/api/transactions/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { Course, Transaction, Enrollment, User } from "@/models";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
});

function getDecoded(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
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

// ─── POST — PaymentIntent──────────────────────────────────────────
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

    // Course খোঁজো
    const course = await Course.findById(courseId)
      .populate("instructorId", "name")
      .lean() as any;

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Free course enroll
    if (course.pricing?.type === "free") {
      const existing = await Enrollment.findOne({ studentId: decoded.userId, courseId });
      if (!existing) {
        await Enrollment.create({
          studentId:      decoded.userId,
          courseId,
          courseName:     course.title,
          courseImage:    course.coverImage?.url || "",
          instructorName: course.instructorId?.name || "",
          status:         "active",
          enrolledAt:     new Date(),
          progress: { completedLessons: [], progressPercentage: 0, totalTimeSpent: 0 },
        });
        await Promise.all([
          Course.findByIdAndUpdate(courseId, { $inc: { "stats.enrolledCount": 1, enrolledCount: 1 } }),
          User.findByIdAndUpdate(decoded.userId, { $inc: { "stats.enrolledCourses": 1 } }),
        ]);
      }
      return NextResponse.json({ success: true, free: true });
    }

   
    const alreadyEnrolled = await Enrollment.findOne({ studentId: decoded.userId, courseId });
    if (alreadyEnrolled) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 });
    }

    // Price calculate
    const priceInBDT = course.pricing?.discountPrice || course.pricing?.price || 0;
    if (priceInBDT <= 0) {
      return NextResponse.json({ error: "Invalid course price" }, { status: 400 });
    }

    // BDT → USD convert (1 USD ≈ 110 BDT)
    const priceInUSD   = parseFloat((priceInBDT / 110).toFixed(2));
    const amountInCents = Math.max(Math.round(priceInUSD * 100), 50);
    const platformFee   = Math.round(priceInBDT * 0.3);
    const netAmount     = priceInBDT - platformFee;

    // Stripe PaymentIntent 
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

    // Transaction DB তে save (pending)
    const transaction = await Transaction.create({
      type:           "payment",
      amount:         priceInBDT,
      netAmount,
      platformFee,
      currency:       "BDT",
      status:         "pending",
      studentId:      decoded.userId,
      courseId,
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

// ─── GET — Payment verify ────────────────────────────────────────────────
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

    // Transaction completed mark 
    await Transaction.findOneAndUpdate(
      { paymentId: paymentIntentId },
      { status: "completed", processedAt: new Date() }
    );

    // Enrollment  (duplicate safe)
    const alreadyEnrolled = await Enrollment.findOne({ studentId: decoded.userId, courseId });
    if (!alreadyEnrolled) {
      const course = await Course.findById(courseId).populate("instructorId", "name").lean() as any;
      if (course) {
        await Enrollment.create({
          studentId:      decoded.userId,
          courseId,
          courseName:     course.title,
          courseImage:    course.coverImage?.url || "",
          instructorName: course.instructorId?.name || "",
          status:         "active",
          enrolledAt:     new Date(),
          progress: { completedLessons: [], progressPercentage: 0, totalTimeSpent: 0 },
        });
        await Promise.all([
          Course.findByIdAndUpdate(courseId, { $inc: { "stats.enrolledCount": 1, enrolledCount: 1 } }),
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