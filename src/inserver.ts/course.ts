import { connectDB } from "@/db/connect"; // আপনার ডাটাবেস কানেকশন পাথ
import Course from "@/models/course";
  // আপনার কোর্স মডেল পাথ

export const getCourses = async (params?: any) => {
  try {
    // সরাসরি ডাটাবেস কানেক্ট করুন
    await connectDB();

    // ডাটাবেস থেকে সব কোর্স আনুন
    const courses = await Course.find({}).sort({ createdAt: -1 });

    // ড্যাশবোর্ডের কার্ডের জন্য ক্যালকুলেশন
   // ড্যাশবোর্ডের কার্ডের জন্য ক্যালকুলেশন
const stats = {
  activeCourses: courses.filter((c: any) => c.status === "PUBLISHED").length,
  pendingCourses: courses.filter((c: any) => c.status === "PENDING").length,
  draftCourses: courses.filter((c: any) => c.status === "DRAFT").length,
  
  // সংশোধন: শুধুমাত্র Published কোর্সগুলোর মধ্যে যেগুলো ফ্রিতে দেওয়া হচ্ছে
  freeCourses: courses.filter((c: any) => c.status === "PUBLISHED" && c.price === 0).length,
  
  // সংশোধন: শুধুমাত্র Published কোর্সগুলোর মধ্যে যেগুলোর দাম ০ এর বেশি
  paidCourses: courses.filter((c: any) => c.status === "PUBLISHED" && c.price > 0).length,
};

    // Mongoose ডাটাকে সাধারণ JSON অবজেক্টে কনভার্ট করা (Next.js এর জন্য জরুরি)
    return { 
      success: true, 
      stats, 
      data: JSON.parse(JSON.stringify(courses)) 
    };

  } catch (error: any) {
    console.error("Error in getCourses inserver:", error.message);
    return { 
      success: false, 
      stats: { activeCourses: 0, pendingCourses: 0, draftCourses: 0, freeCourses: 0, paidCourses: 0 }, 
      data: [] 
    };
  }
};