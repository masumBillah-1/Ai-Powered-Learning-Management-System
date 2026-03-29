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
  darkBgColor: string;
  imgSrc: StaticImageData;
}

const services: ServiceCard[] = [
  {
    badgeText: "Learning Style",
    badgeColor: "bg-blue-500",
    title: "AI Personalized",
    description:
      "Our AI system guides you based on your learning style, providing challenges and keeping you on track so you never feel lost.",
    bgColor: "bg-blue-50/50",
    darkBgColor: "dark:bg-blue-900/20",
    imgSrc: ima2,
  },
  {
    badgeText: "Mentorship",
    badgeColor: "bg-purple-500",
    title: "1:1 Mentorship",
    description:
      "A team of expert mentors will be by your side, joining Google Meet sessions to create personalized plans and solve your problems.",
    bgColor: "bg-purple-50/50",
    darkBgColor: "dark:bg-purple-900/20",
    imgSrc: ima3,
  },
  {
    badgeText: "Live Sessions",
    badgeColor: "bg-red-500",
    title: "1:1 Support Session",
    description:
      "Ask questions directly in our 3 daily live sessions. Share your screen to show problems and get solutions until everything is clear.",
    bgColor: "bg-pink-50/100",
    darkBgColor: "dark:bg-pink-900/20",
    imgSrc: ima4,
  },
  {
    badgeText: "Support System",
    badgeColor: "bg-orange-400",
    title: "24/7 Community Support",
    description:
      "Get solutions anytime, 24/7, through our dedicated Facebook group and custom helpdesk platform whenever you face an issue.",
    bgColor: "bg-yellow-50/50",
    darkBgColor: "dark:bg-yellow-900/10",
    imgSrc: ima,
  },
  {
    badgeText: "Environment",
    badgeColor: "bg-[#A3B68D]",
    title: "Guided Environment",
    description:
      "Learn with 60+ modules, 1000+ videos, and 35+ conceptual sessions. An environment where 5400+ students found jobs in 4 years.",
    bgColor: "bg-gradient-to-b from-[#FBFDFB] to-[#F4F8F4]",
    darkBgColor: "dark:from-slate-800 dark:to-slate-900",
    imgSrc: ima5,
  },
  {
    badgeText: "Results",
    badgeColor: "bg-green-600",
    title: "Intern/Job Guarantee",
    description:
      "Your success is guaranteed if you stay dedicated. Over 1400 students have started their careers after this bootcamp in the last year alone.",
    bgColor: "bg-green-50/100",
    darkBgColor: "dark:bg-green-900/20",
    imgSrc: ima6,
  },
];

const BootcampFeatures = () => {
  return (
    <section className="py-16 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
          className="flex justify-center items-center gap-2 mb-12"
        >
          <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white">
            Bootcamp
          </h2>
          <div className="bg-gradient-to-r from-orange-400 to-purple-600 text-white px-4 py-1 rounded-full text-2xl font-bold italic flex items-center gap-1 shadow-lg">
            <span className="text-white">X</span> Factors
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
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all hover:scale-[1.02] duration-300 border border-transparent dark:border-slate-800 ${item.bgColor} ${item.darkBgColor}`}
            >
              <div>
                <span
                  className={`${item.badgeColor} text-white text-xs px-4 py-1.5 rounded-full font-medium inline-block mb-6`}
                >
                  {item.badgeText}
                </span>

                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
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
                    className="object-contain brightness-100 dark:brightness-90"
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