export const coursesDatabase: Record<string, {
  title: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  rating: number;
  students: number;
  duration: string;
  lessons: number;
  level: string;
  language: string;
  thumbnail: string;
  videoUrl: string;
  features: string[];
  curriculum: Array<{
    module: string;
    lessons: number;
    duration: string;
    topics: string[];
  }>;
  instructor: {
    name: string;
    title: string;
    image: string;
    students: number;
    courses: number;
  };
  testimonials: Array<{
    name: string;
    role: string;
    image: string;
    text: string;
  }>;
  overview: {
    description: string;
    whoIsFor: string[];
    whatYouLearn: string[];
  };
}> = {
  "1": {
    title: "Complete Web Development Bootcamp 2026",
    subtitle: "Master HTML, CSS, JavaScript, React, Next.js and become a professional web developer",
    price: "৳15,000",
    originalPrice: "৳25,000",
    rating: 4.9,
    students: 5420,
    duration: "6 Months",
    lessons: 180,
    level: "Beginner to Advanced",
    language: "Bangla",
    thumbnail: "https://i.ibb.co.com/Zp6LgsPy/christopher-gower-m-HRf-Lhg-ABo-unsplash.jpg",
    videoUrl: "https://www.youtube.com/embed/z58Sh8IndkY",
    features: [
      "180+ Video Lessons",
      "Lifetime Access",
      "Certificate of Completion",
      "24/7 Support",
      "Real-world Projects",
      "Job Placement Support"
    ],
    curriculum: [
      {
        module: "Module 1: HTML & CSS Fundamentals",
        lessons: 25,
        duration: "4 weeks",
        topics: ["HTML5 Basics", "CSS3 Styling", "Responsive Design", "Flexbox & Grid"]
      },
      {
        module: "Module 2: JavaScript Mastery",
        lessons: 35,
        duration: "6 weeks",
        topics: ["ES6+ Features", "DOM Manipulation", "Async Programming", "APIs"]
      },
      {
        module: "Module 3: React Development",
        lessons: 40,
        duration: "8 weeks",
        topics: ["Components", "Hooks", "State Management", "React Router"]
      },
      {
        module: "Module 4: Next.js & Full Stack",
        lessons: 45,
        duration: "8 weeks",
        topics: ["Server Components", "API Routes", "Database Integration", "Deployment"]
      },
      {
        module: "Module 5: Final Projects",
        lessons: 35,
        duration: "6 weeks",
        topics: ["E-commerce Site", "Social Media App", "Portfolio", "Job Interview Prep"]
      }
    ],
    instructor: {
      name: "Arif Almas",
      title: "Senior Web Developer",
      image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      students: 10000,
      courses: 5
    },
    testimonials: [
      {
        name: "Sakib Rahman",
        role: "Frontend Developer at Pathao",
        image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
        text: "এই কোর্সটি আমার ক্যারিয়ার পরিবর্তন করে দিয়েছে। এখন আমি একটি ভালো কোম্পানিতে কাজ করছি।"
      },
      {
        name: "Nusrat Jahan",
        role: "Freelance Web Developer",
        image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
        text: "প্র্যাক্টিক্যাল প্রজেক্ট এবং সাপোর্ট সিস্টেম অসাধারণ। Freelancing করে মাসে ৫০,০০০+ টাকা আয় করছি।"
      }
    ],
    overview: {
      description: "এই কোর্সে আপনি শিখবেন কীভাবে একজন প্রফেশনাল ওয়েব ডেভেলপার হতে হয়। HTML, CSS, JavaScript থেকে শুরু করে React, Next.js পর্যন্ত সম্পূর্ণ ওয়েব ডেভেলপমেন্ট শিখবেন।",
      whoIsFor: [
        "যারা ওয়েব ডেভেলপমেন্ট শিখতে চান",
        "যারা ফ্রিল্যান্সিং করতে চান",
        "যারা টেক কোম্পানিতে চাকরি করতে চান"
      ],
      whatYouLearn: [
        "HTML5 & CSS3 Mastery",
        "JavaScript ES6+ Features",
        "React.js Development",
        "Next.js Framework",
        "Responsive Design",
        "API Integration",
        "Database Management",
        "Deployment & Hosting"
      ]
    }
  },
  "2": {
    title: "Digital Marketing Masterclass",
    subtitle: "Master Facebook Ads, Google Ads, SEO, Content Marketing and become a digital marketing expert",
    price: "৳12,000",
    originalPrice: "৳20,000",
    rating: 4.8,
    students: 3200,
    duration: "4 Months",
    lessons: 120,
    level: "Beginner to Advanced",
    language: "Bangla",
    thumbnail: "https://i.ibb.co.com/FkxynQ3K/carlos-muza-hpj-Sk-U2-UYSU-unsplash.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    features: [
      "120+ Video Lessons",
      "Lifetime Access",
      "Certificate of Completion",
      "24/7 Support",
      "Live Campaign Projects",
      "Agency Job Support"
    ],
    curriculum: [
      {
        module: "Module 1: Digital Marketing Fundamentals",
        lessons: 20,
        duration: "3 weeks",
        topics: ["Marketing Basics", "Customer Psychology", "Market Research", "Branding"]
      },
      {
        module: "Module 2: Facebook & Instagram Ads",
        lessons: 30,
        duration: "5 weeks",
        topics: ["Ad Manager", "Audience Targeting", "Creative Strategy", "Campaign Optimization"]
      },
      {
        module: "Module 3: Google Ads & SEO",
        lessons: 35,
        duration: "6 weeks",
        topics: ["Search Ads", "Display Ads", "Keyword Research", "On-page SEO", "Link Building"]
      },
      {
        module: "Module 4: Content Marketing",
        lessons: 20,
        duration: "4 weeks",
        topics: ["Content Strategy", "Copywriting", "Email Marketing", "Social Media Marketing"]
      },
      {
        module: "Module 5: Analytics & Reporting",
        lessons: 15,
        duration: "3 weeks",
        topics: ["Google Analytics", "Facebook Pixel", "Data Analysis", "Client Reporting"]
      }
    ],
    instructor: {
      name: "Mehedi Hasan",
      title: "Digital Marketing Expert",
      image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      students: 8000,
      courses: 4
    },
    testimonials: [
      {
        name: "Tasnim Ahmed",
        role: "Digital Marketing Manager at Daraz",
        image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
        text: "এই কোর্স করার পর আমি একটি বড় ই-কমার্স কোম্পানিতে চাকরি পেয়েছি। প্র্যাক্টিক্যাল শিক্ষা অসাধারণ ছিল।"
      },
      {
        name: "Rafiq Islam",
        role: "Freelance Digital Marketer",
        image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
        text: "Facebook Ads এবং Google Ads শিখে এখন মাসে ৮০,০০০+ টাকা আয় করছি। কোর্সটি সত্যিই লাইফ চেঞ্জিং।"
      }
    ],
    overview: {
      description: "এই কোর্সে আপনি শিখবেন কীভাবে একজন প্রফেশনাল ডিজিটাল মার্কেটার হতে হয়। Facebook Ads, Google Ads, SEO থেকে শুরু করে Content Marketing পর্যন্ত সম্পূর্ণ ডিজিটাল মার্কেটিং শিখবেন।",
      whoIsFor: [
        "যারা ডিজিটাল মার্কেটিং শিখতে চান",
        "যারা নিজের বিজনেস গ্রো করতে চান",
        "যারা মার্কেটিং এজেন্সিতে কাজ করতে চান"
      ],
      whatYouLearn: [
        "Facebook & Instagram Ads",
        "Google Ads Mastery",
        "SEO Optimization",
        "Content Marketing",
        "Email Marketing",
        "Social Media Strategy",
        "Analytics & Reporting",
        "Campaign Management"
      ]
    }
  },
  "3": {
    title: "Graphics Design Professional",
    subtitle: "Master Adobe Photoshop, Illustrator, Figma and become a professional graphics designer",
    price: "৳10,000",
    originalPrice: "৳18,000",
    rating: 4.7,
    students: 2800,
    duration: "3 Months",
    lessons: 90,
    level: "Beginner to Advanced",
    language: "Bangla",
    thumbnail: "https://i.ibb.co.com/fzkDftYT/theme-photos-CGpif-H3-Fj-OA-unsplash.jpg",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    features: [
      "90+ Video Lessons",
      "Lifetime Access",
      "Certificate of Completion",
      "24/7 Support",
      "Portfolio Projects",
      "Freelancing Guide"
    ],
    curriculum: [
      {
        module: "Module 1: Design Fundamentals",
        lessons: 15,
        duration: "2 weeks",
        topics: ["Color Theory", "Typography", "Layout Design", "Design Principles"]
      },
      {
        module: "Module 2: Adobe Photoshop Mastery",
        lessons: 25,
        duration: "4 weeks",
        topics: ["Photo Editing", "Manipulation", "Retouching", "Effects & Filters"]
      },
      {
        module: "Module 3: Adobe Illustrator",
        lessons: 20,
        duration: "3 weeks",
        topics: ["Vector Graphics", "Logo Design", "Icon Design", "Illustration"]
      },
      {
        module: "Module 4: Figma & UI/UX",
        lessons: 20,
        duration: "3 weeks",
        topics: ["Interface Design", "Prototyping", "User Experience", "Design Systems"]
      },
      {
        module: "Module 5: Portfolio & Freelancing",
        lessons: 10,
        duration: "2 weeks",
        topics: ["Portfolio Building", "Client Communication", "Pricing", "Marketplace"]
      }
    ],
    instructor: {
      name: "Sadia Rahman",
      title: "Senior Graphics Designer",
      image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      students: 6000,
      courses: 3
    },
    testimonials: [
      {
        name: "Fahim Hossain",
        role: "UI/UX Designer at Chaldal",
        image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
        text: "এই কোর্স করার পর আমার ডিজাইন স্কিল অনেক উন্নত হয়েছে। এখন একটি টপ কোম্পানিতে UI/UX Designer হিসেবে কাজ করছি।"
      },
      {
        name: "Lamia Sultana",
        role: "Freelance Graphics Designer",
        image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
        text: "Figma এবং Photoshop শিখে Fiverr এ কাজ শুরু করেছি। এখন মাসে ৪০,০০০+ টাকা আয় করছি।"
      }
    ],
    overview: {
      description: "এই কোর্সে আপনি শিখবেন কীভাবে একজন প্রফেশনাল গ্রাফিক্স ডিজাইনার হতে হয়। Adobe Photoshop, Illustrator থেকে শুরু করে Figma পর্যন্ত সম্পূর্ণ গ্রাফিক্স ডিজাইন শিখবেন।",
      whoIsFor: [
        "যারা গ্রাফিক্স ডিজাইন শিখতে চান",
        "যারা UI/UX ডিজাইনার হতে চান",
        "যারা ফ্রিল্যান্সিং করতে চান"
      ],
      whatYouLearn: [
        "Adobe Photoshop Mastery",
        "Adobe Illustrator",
        "Figma Design",
        "Logo Design",
        "UI/UX Design",
        "Photo Editing",
        "Vector Graphics",
        "Portfolio Building"
      ]
    }
  }
};
