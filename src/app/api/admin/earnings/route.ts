import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { Course, Enrollment, Transaction, User } from "@/models";
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

    // Total revenue
    const totalRevenue = Array.from(courseRevenue.values()).reduce((sum, c) => sum + c.amount, 0);
    
    // Calculate this month revenue
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnrollments = enrollments.filter(
      (e: any) => new Date(e.enrolledAt) >= firstDayOfMonth
    );
    
    const thisMonthRevenue = thisMonthEnrollments.reduce((sum, e: any) => {
      const enrollCourseId = typeof e.courseId === 'object' ? e.courseId?._id?.toString() : e.courseId?.toString();
      const course = courses.find(c => c._id.toString() === enrollCourseId);
      const price = course?.originalPrice || course?.price || 0;
      return sum + price;
    }, 0);

    // Platform profit (30% of total revenue)
    const platformFee = 0.3;
    const platformProfit = Math.round(totalRevenue * platformFee);
    const instructorPayouts = totalRevenue - platformProfit;

    // Revenue breakdown by course (top courses)
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

    // Fetch pending payouts (transactions with type=payout and status=pending)
    const pendingPayouts = await Transaction.find({ type: "payout", status: "pending" })
      .populate("instructorId", "name email photoURL")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean() as any[];

    // Recent statements (completed payments)
    const recentStatements = await Transaction.find({ type: "payment", status: "completed" })
      .populate("studentId", "name email photoURL")
      .populate("instructorId", "name email photoURL")
      .populate("courseId", "title")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean() as any[];

    let statements = recentStatements.map((t: any) => ({
      _id: t._id,
      instructor: t.instructorId?.name || t.instructorName || "Unknown",
      instructorPhoto: t.instructorId?.photoURL || null,
      course: t.courseId?.title || t.courseName || "Unknown",
      student: t.studentId?.name || "Student",
      studentPhoto: t.studentId?.photoURL || null,
      date: t.createdAt,
      amount: t.amount,
      status: t.status,
    }));

    // If no transactions, create sample data from enrollments
    if (statements.length === 0 && enrollments.length > 0) {
      statements = enrollments.slice(0, 20).map((e: any) => {
        // Get course info (already populated)
        const course = typeof e.courseId === 'object' ? e.courseId : null;
        const price = course?.originalPrice || course?.price || 0;
        
        // Get instructor info from populated courseId
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
          status: "completed",
        };
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        thisMonthRevenue,
        instructorPayouts,
        platformProfit,
      },
      breakdown,
      payouts: pendingPayouts.map((p: any) => ({
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
      debug: {
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        totalUsers: users.length,
        sampleCourse: courses[0] ? {
          title: courses[0].title,
          instructorId: typeof courses[0].instructorId === 'object' ? courses[0].instructorId?._id : courses[0].instructorId,
          instructorName: courses[0].instructorId?.name,
          instructorPhoto: courses[0].instructorId?.photoURL,
        } : null,
        sampleUser: users.find(u => u.role === 'instructor') ? {
          name: users.find(u => u.role === 'instructor')?.name,
          photoURL: users.find(u => u.role === 'instructor')?.photoURL,
        } : null,
        sampleStatement: statements[0] || null,
      },
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
