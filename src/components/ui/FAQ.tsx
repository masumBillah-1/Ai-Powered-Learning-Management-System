"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      id: "01",
      question: "Who is this course for?",
      answer: "This course is designed for absolute beginners who want to start their journey in web development and eventually work as professional developers in top companies. Whether you are from a CSE background or non-CSE, if you are willing to work hard, this course is for you.",
    },
    {
      id: "02",
      question: "How do you guarantee a job or internship?",
      answer: "We provide extensive support through our placement cell, resume building workshops, and mock interviews. If you complete the course with good marks and finish all assignments on time, we will push your profile to our partner companies.",
    },
    {
      id: "03",
      question: "Will AI replace web developers?",
      answer: "AI is a tool to make developers more productive, not a replacement. Our course teaches you how to leverage AI tools to build better applications faster, keeping you ahead in the job market.",
    },
    {
      id: "04",
      question: "Can non-CSE students get a job in web development?",
      answer: "Yes, absolutely! Most tech companies care about your skills and portfolio rather than your degree. We have many successful students from various backgrounds working as professional developers.",
    },
    {
      id: "05",
      question: "Can I do this course while working or studying?",
      answer: "Yes, the course is self-paced with specific deadlines. You can manage your time effectively between your studies/job and the course modules.",
    },
    {
      id: "06",
      question: "Can I complete this course alongside my exams?",
      answer: "The course is structured to be flexible. If you have exams, you can plan ahead and complete your assignments early or use the buffer time we provide.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white dark:bg-[#0b1120] transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto px-4">
        
        {/* Section Heading with Gradient 3 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white flex flex-wrap items-center justify-center gap-3">
            Your Questions <span 
              style={{ background: "linear-gradient(90deg, #832388, #E3436B, #F0772F)" }}
              className="text-white px-6 py-2 rounded-full text-2xl md:text-4xl rotate-[-1deg] shadow-xl"
            >
              Answered
            </span> About Bootcamp
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-5">
          {faqData.map((faq, index) => (
            <div 
              key={index}
              className={`rounded-[24px] border transition-all duration-500 overflow-hidden ${
                openIndex === index 
                ? "bg-[#F9F5FF] dark:bg-[#161d2f] border-purple-200 dark:border-gray-700 shadow-lg" 
                : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-purple-300 shadow-sm"
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
              >
                <div className="flex items-center gap-6">
                  {/* Number with Gradient 1 */}
                  <span 
                    style={openIndex === index ? { 
                      background: "linear-gradient(90deg, #C81D77, #6710C2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    } : {}}
                    className={`text-3xl font-black transition-all duration-300 ${
                      openIndex === index ? "" : "text-gray-200 dark:text-gray-700"
                    }`}
                  >
                    {faq.id}
                  </span>
                  <span className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#C81D77] transition-colors">
                    {faq.question}
                  </span>
                </div>
                
                {/* Plus/Minus Icon */}
                <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 ${
                  openIndex === index 
                  ? "bg-gray-900 text-white rotate-180" 
                  : "bg-gray-50 dark:bg-gray-700 text-gray-400"
                }`}>
                  {openIndex === index ? <FaMinus size={14} /> : <FaPlus size={14} />}
                </div>
              </button>

              {/* Answer Body */}
              <div className={`transition-all duration-500 ease-in-out ${
                openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}>
                <div className="px-6 md:px-8 pb-8 ml-0 md:ml-[76px]">
                   <div className="h-[1px] w-full bg-gradient-to-r from-purple-100 to-transparent dark:from-gray-700 mb-6"></div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[16px] md:text-lg">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

 {/* Bottom Button with Gradient 2 */}
<div className="mt-16 text-center">
  <Link href="/faq"> {/* href-e folder name-ta hobe */}
    <button 
      style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
      className="text-white px-10 py-4 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all active:scale-95 animate-shimmer relative overflow-hidden"
    >
      More Questions <span>→</span>
    </button>
  </Link>
</div>

      </div>
    </section>
  );
};

export default FAQ;