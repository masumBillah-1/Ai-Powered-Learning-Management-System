"use client";
import React from "react";
import { motion } from "framer-motion";

const StepSection = () => {
  const steps = [
    {
      id: "০১",
      title: "ভর্তি হও",
      description:
        "আমাদের ৪০০+ কমপ্লিট ওয়েব ডেভেলপমেন্ট বুটক্যাম্পে জয়েন করার মাধ্যমে তুমি তোমার লার্নিং যাত্রা শুরু করতে পারো এখনই!",
    },
    {
      id: "০২",
      title: "গাইডলাইন/মেন্টরশীপ নাও",
      description:
        "আমাদের ডেডিকেটেড মেন্টর ও গাইডলাইন নিয়ে এগিয়ে যাও সফলতার সাথে। আমরা তোমাকে দেব প্রপার রোডম্যাপ ও গাইডলাইন।",
    },
    {
      id: "০৩",
      title: "কোর্স ফিনিশ করো",
      description:
        "প্রতিনিয়ত লাইভ ক্লাস ও প্রজেক্ট এর মাধ্যমে তুমি কোর্স সম্পন্ন করবে। প্রতিটি মডিউল শেষে থাকবে অ্যাসাইনমেন্ট ও কুইজ।",
    },
    {
      id: "০৪",
      title: "জব/ইন্টার্ন স্টার্ট করো",
      description:
        "আমাদের ক্যারিয়ার সাপোর্ট টিম তোমাকে ইন্টারভিউ ও পোর্টফোলিও বিল্ডিং এ সাহায্য করবে যাতে তুমি তোমার স্বপ্নের জব পাও।",
    },
  ];

  return (
    <section className="py-16 px-4  min-h-screen font-sans">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
          className="flex items-center justify-center gap-2 mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800">
            জব/ইন্টার্ন পাওয়ার
          </h2>
          <span className="px-6 py-2 bg-gradient-to-r from-orange-400 to-fuchsia-600 text-white rounded-full text-2xl md:text-4xl font-bold shadow-lg">
            ৪টি সহজ ধাপ
          </span>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.15 }}
              viewport={{ once: false, margin: "-80px" }}
              className="relative group"
            >
              {/* Number Circle */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center border-2 border-fuchsia-100 z-10 shadow-sm">
                <span className="text-fuchsia-600 font-bold text-xl">
                  {step.id}
                </span>
              </div>

              {/* Card */}
              <div className="h-full pt-10 pb-8 px-6 rounded-[2.5rem] border border-fuchsia-200  shadow-sm transition-all duration-300 hover:shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          <button className="btn btn-md md:btn-lg rounded-xl border-none bg-gradient-to-r from-fuchsia-600 to-orange-400 text-white hover:opacity-90 transition-opacity px-8">
            এখনই এনরোল করো
          </button>
          <button className="btn btn-outline btn-md md:btn-lg rounded-xl border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-50 hover:border-fuchsia-300 px-8">
            ফ্রি কাউন্সেলিং নাও
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default StepSection;
