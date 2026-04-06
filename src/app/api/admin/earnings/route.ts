import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { Course, Enrollment, Transaction, User, SystemSettings } from "@/models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

function getDecoded(req: NextRequest) {
  let token = req.cookies.get("token")?.value;
  if (!token) {
    const auth = req.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) token = auth.slice(7);
  }
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const decoded = getDecoded(req);
    
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all courses with instructor info
    const courses = await Course.find()
      .populate("instructorId", "name email photoURL")
      .lean() as any[];

    // Fetch all users to get instructor photos
    const users = await User.find({}, "name email photoURL role").lean() as any[];
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    // Calculate total revenue from enrollments (fetch all without user filter)
    const enrollments = await Enrollment.find({})
      .populate({
        path: "courseId",
        select: "title price originalPrice instructorId",
      })
      .lean() as any[];
    
    // Calculate revenue per course
    const courseRevenue = new Map<string, { amount: number; enrollments: number; courseName: string; instructorName: string; instructorId: string }>();
    
    for (const course of courses) {
      const courseIdStr = course._id.toString();
      const courseEnrollments = enrollments.filter((e: any) => {
        const enrollCourseId = typeof e.courseId === 'object' ? e.courseId?._id?.toString() : e.courseId?.toString();
        return enrollCourseId === courseIdStr;
      });
      
      const price = course.originalPrice || course.price || 0;
      const amount = price * courseEnrollments.length;
      const instructorId = typeof course.instructorId === 'object' ? course.instructorId?._id?.toString() : course.instructorId?.toString();
      
      courseRevenue.set(courseIdStr, {
        amount,
        enrollments: courseEnrollments.length,
        courseName: course.title,
        instructorName: course.instructorId?.name || "Unknown",
        instructorId: instructorId || "",
      });
    }

    // Calculate fallbacks from enrollments (Used if transactions are missing)
    const totalEnrollmentRevenue = Array.from(courseRevenue.values()).reduce((sum, c) => sum + c.amount, 0);
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnrollments = enrollments.filter(
      (e: any) => new Date(e.enrolledAt) >= firstDayOfMonth
    );
    const thisMonthEnrollmentRevenue = thisMonthEnrollments.reduce((sum, e: any) => {
      const enrollCourseId = typeof e.courseId === 'object' ? e.courseId?._id?.toString() : e.courseId?.toString();
      const course = courses.find(c => c._id.toString() === enrollCourseId);
      const price = course?.originalPrice || course?.price || 0;
      return sum + price;
    }, 0);
    
    const commissionSetting = await SystemSettings.findOne({ key: "platform_commission" });
    const commissionRate = commissionSetting ? Number(commissionSetting.value) / 100 : 0.3;

    // Use transaction aggregation to get precise financial data for PLATFORM PROFIT & REVENUE
    const financialStats = await Transaction.aggregate([
      {
        $match: {
          type: "payment",
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: "$amount" },
          totalProfit: { $sum: "$platformFee" },
          totalNetAmount: { $sum: "$netAmount" },
        },
      },
    ]);

    // Monthly transaction revenue
    const monthlyStats = await Transaction.aggregate([
      {
        $match: {
          type: "payment",
          status: "completed",
          createdAt: { $gte: firstDayOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    // Use transaction aggregation to get actual PAID OUT amount
    const payoutStats = await Transaction.aggregate([
      {
        $match: {
          type: "payout",
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: "$amount" },
        },
      },
    ]);

    const statsFromDB = financialStats[0] || { totalPayments: 0, totalProfit: 0, totalNetAmount: 0 };
    const monthStatsFromDB = monthlyStats[0] || { totalRevenue: 0 };
    const totalPaidOut = payoutStats[0]?.totalPaid || 0;
    
    // Final calculations with fallbacks to ensure "REAL DATA" from transactions is prioritized
    const finalTotalRevenue = statsFromDB.totalPayments || totalEnrollmentRevenue;
    const thisMonthRevenue = monthStatsFromDB.totalRevenue || thisMonthEnrollmentRevenue;
    const platformProfit = statsFromDB.totalProfit || Math.round(finalTotalRevenue * commissionRate);
    const instructorPayouts = totalPaidOut; 
    
    // Revenue breakdown by course (top courses) - Keep enrollment based for visual breakdown if transactions aren't course-mapped deeply
    const breakdown = Array.from(courseRevenue.entries())
      .map(([courseId, data]) => ({
        courseId,
        courseName: data.courseName,
        amount: data.amount,
        enrollments: data.enrollments,
        instructorName: data.instructorName,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // Fetch all payouts (transactions with type=payout)
    const allPayouts = await Transaction.find({ type: "payout" })
      .populate("instructorId", "name email photoURL")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean() as any[];

    // Recent statements (completed payments)
    const recentStatements = await Transaction.find({ type: "payment", status: "completed" })
      .populate("studentId", "name email photoURL")
      .populate("instructorId", "name email photoURL")
      .populate({
        path: "courseId",
        select: "title instructorId",
        populate: {
          path: "instructorId",
          select: "name photoURL",
        },
      })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean() as any[];

    let statements = recentStatements.map((t: any) => {
      const courseInstructor = t.courseId?.instructorId || {};
      const txInstructor = t.instructorId || {};
      
      return {
        _id: t._id,
        instructor: txInstructor.name || courseInstructor.name || t.instructorName || "Unknown",
        instructorPhoto: txInstructor.photoURL || courseInstructor.photoURL || null,
        course: t.courseId?.title || t.courseName || "Unknown",
        student: t.studentId?.name || "Student",
        studentPhoto: t.studentId?.photoURL || null,
        date: t.createdAt,
        amount: t.amount,
        platformFee: t.platformFee || 0,
        netAmount: t.netAmount || (t.amount - (t.platformFee || 0)),
        paymentMethod: t.paymentMethod || "Unknown",
        status: t.status,
      };
    });

    // If no transactions, create sample data from enrollments
    if (statements.length === 0 && enrollments.length > 0) {
      statements = enrollments.slice(0, 20).map((e: any) => {
        const course = typeof e.courseId === 'object' ? e.courseId : null;
        const price = course?.originalPrice || course?.price || 0;
        const fee = price * commissionRate;
        
        let instructorName = "Instructor";
        let instructorPhoto = null;
        
        if (course?.instructorId && typeof course.instructorId === 'object') {
          instructorName = course.instructorId.name || "Instructor";
          instructorPhoto = course.instructorId.photoURL || null;
        }
        
        return {
          _id: e._id,
          instructor: instructorName,
          instructorPhoto: instructorPhoto,
          course: e.courseName || course?.title || "Course",
          student: "Student",
          studentPhoto: null,
          date: e.enrolledAt,
          amount: price,
          platformFee: fee,
          netAmount: price - fee,
          paymentMethod: "unknown",
          status: "completed",
        };
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: finalTotalRevenue,
        thisMonthRevenue,
        instructorPayouts,
        platformProfit,
        totalPaidOut,
      },
      breakdown,
      payouts: allPayouts.map((p: any) => ({
        _id: p._id,
        instructor: p.instructorId?.name || p.instructorName || "Unknown",
        instructorEmail: p.instructorId?.email || "",
        amount: p.amount,
        requested: p.createdAt,
        status: p.status,
        payoutMethod: p.payoutMethod,
        accountDetails: p.accountDetails,
      })),
      statements,
    });

  } catch (error: any) {
    console.error("GET /api/admin/earnings:", error);
    return NextResponse.json({ error: `Failed: ${error.message}` }, { status: 500 });
  }
}

// Update payout status (approve/reject)
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const decoded = getDecoded(req);
    
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payoutId, action } = await req.json();
    
    if (!payoutId || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const newStatus = action === "approve" ? "completed" : "failed";
    
    const updated = await Transaction.findByIdAndUpdate(
      payoutId,
      { 
        status: newStatus,
        processedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Payout ${action}d successfully`,
      payout: updated,
    });

  } catch (error: any) {
    console.error("PATCH /api/admin/earnings:", error);
    return NextResponse.json({ error: `Failed: ${error.message}` }, { status: 500 });
  }
}
