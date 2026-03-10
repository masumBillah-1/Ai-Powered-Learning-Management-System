"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";

import ima from "../../../public/image.png";
import ima2 from "../../../public/image copy.png";
import ima3 from "../../../public/image copy 2.png";
import ima4 from "../../../public/image copy 3.png";
import ima5 from "../../../public/image copy 4.png";
import ima6 from "../../../public/image copy 5.png";

interface ServiceCard {
  title: string;
  description: string;
  badgeText: string;
  badgeColor: string;
  bgColor: string;
  imgSrc: StaticImageData;
}

const services: ServiceCard[] = [
  {
    badgeText: "লার্নিং স্টাইল",
    badgeColor: "bg-blue-500",
    title: "AI পার্সোনালাইজড",
    description:
      "তোমার লার্নিং স্টাইল অনুযায়ী আমাদের ডেভেলপ করা AI সিস্টেম তোমাকে গাইড করবে, চ্যালেঞ্জ দিবে শেখার, ট্র্যাকে রাখবে - যাতে হারিয়ে না যাও।",
    bgColor: "bg-blue-50/50",
    imgSrc: ima2,
  },
  {
    badgeText: "মেন্টরশিপ",
    badgeColor: "bg-purple-500",
    title: "১:১ মেন্টরশিপ",
    description:
      "একদল দক্ষ মেন্টর তোমার পাশে থাকবে, প্রয়োজনে তোমার সাথে আলাদাভাবে গুগল মিটে বসে তোমার জন্য প্ল্যান সাজাবে, প্রব্লেম সলভ করবে, গাইড করবে লক্ষ্যে পৌছাতে।",
    bgColor: "bg-purple-50/50",
    imgSrc: ima3,
  },
  {
    badgeText: "লাইভ  সেশন",
    badgeColor: "bg-red-500",
    title: "১:১ সাপোর্ট সেশন",
    description:
      "দিনে ৩ বেলা আমাদের সিস্টেমে লাইভ ক্লাসে সরাসরি প্রশ্ন করো, স্ক্রিন শেয়ার করে প্রব্লেম দেখাও। সমাধান নাও। কিছু বুঝতে না পারলে হাজারবার বুঝিয়ে নাও, একসাথে শেখো সবার সাথে",
    bgColor: "bg-pink-50/100",
    imgSrc: ima4,
  },
  {
    badgeText: "সাপোর্ট সিস্টেম",
    badgeColor: "bg-orange-400",
    title: "২৪/৭ কমিউনিটি সাপোর্ট",
    description:
      "দিন-রাত ২৪ ঘন্টা, সপ্তাহের ৭ দিন, যেখানে তোমার যেকোনো সমস্যা থাকবে সহজেই পাবে সমাধান। ডেডিকেটেড ফেসবুক গ্রুপ ও নিজস্ব হেল্পডেস্ক প্লাটফর্মে।",
    bgColor: "bg-yellow-50/50",
    imgSrc: ima,
  },
  {
    badgeText: "এনভায়রনমেন্ট",
    badgeColor: "bg-[#A3B68D]",
    title: "গাইডেড এনভায়রনমেন্ট",
    description:
      "আমাদের সাথে শিখবে ৬০+ মডিউল, ১০০০+ ভিডিও, ৩৫+ কন্সেপচুয়াল সেশন, ১০+ এসাইনমেন্টের মাধ্যমে। দেশসেরা যে এনভারনমেন্টে গতো ৪ বছরে ৫৪০০+ স্টুডেন্ট জব পেয়েছে।",
    bgColor: "bg-gradient-to-b from-[#FBFDFB] to-[#F4F8F4]",
    imgSrc: ima5,
  },
  {
    badgeText: "রেজাল্ট",
    badgeColor: "bg-green-600",
    title: "ইন্টার্ন/চাকরি গ্যারান্টি",
    description:
      "তোমার সাফল্যের নিশ্চয়তা, যদি তুমি আমাদের সাথে লেগে থাকো। শুধুমাত্র গতো ১ বছরেই ১৪০০+ শিক্ষার্থী ইতোমধ্যে ক্যারিয়ার শুরু করেছে এই বুটক্যাম্প শেষে।",
    bgColor: "bg-green-50/100",
    imgSrc: ima6,
  },
];

const BootcampFeatures = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
          className="flex justify-center items-center gap-2 mb-12"
        >
          <h2 className="text-4xl font-extrabold text-slate-800">
            এই বুটক্যাম্পের
          </h2>
          <div className="bg-gradient-to-r from-orange-400 to-purple-600 text-white px-4 py-1 rounded-full text-2xl font-bold italic flex items-center gap-1 shadow-lg">
            <span className="text-white">X</span> ফ্যাক্টর
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.1 }}
              viewport={{ once: false }}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300 ${item.bgColor}`}
            >
              <div>
                <span
                  className={`${item.badgeColor} text-white text-xs px-4 py-1.5 rounded-full font-medium inline-block mb-6`}
                >
                  {item.badgeText}
                </span>

                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                  {item.description}
                </p>
              </div>

              <div className="flex justify-end mt-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.imgSrc}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BootcampFeatures;
