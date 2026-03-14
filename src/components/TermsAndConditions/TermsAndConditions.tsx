"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Scale,
  BookOpen,
  UserCheck,
  Zap,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

const TermsAndConditions = () => {
  const policies = [
    {
      title: "User Accounts",
      icon: <UserCheck className="w-6 h-6 text-[#FF0F7B]" />,
      content:
        "To access most features, you must register for an account. You are responsible for maintaining the confidentiality of your credentials. Accounts are non-transferable.",
    },
    {
      title: "Content & Licensing",
      icon: <BookOpen className="w-6 h-6 text-[#F89B29]" />,
      content:
        "All course materials are the intellectual property of CareerCanvas or its instructors. You are granted a limited, personal, non-exclusive license to view content for educational purposes.",
    },
    {
      title: "Prohibited Conduct",
      icon: <AlertTriangle className="w-6 h-6 text-[#832388]" />,
      content:
        "Users may not scrape data, share login credentials, upload malicious code, or use AI features to generate harmful or plagiarized content.",
    },
    {
      title: "AI Usage",
      icon: <Zap className="w-6 h-6 text-[#FDE047]" />,
      content:
        "Our AI-powered features are tools to assist learning. While we strive for accuracy, CareerCanvas is not responsible for errors in AI-generated summaries or automated grading.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15, duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" },
  };

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-[#05010D] text-gray-800 dark:text-gray-200 py-16 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-xl bg-gradient-to-br from-[#FF0F7B] to-[#F89B29]">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF0F7B] via-[#E3436B] to-[#F89B29] bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Please read these terms carefully before using the CareerCanvas
            platform.
          </p>
        </motion.div>

        {/* Main Terms Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-16"
          variants={containerVariants}
        >
          {policies.map((item, index) => (
            <motion.div
              key={index}
              className="group p-8 rounded-2xl border border-gray-100 dark:border-[#2D2438] bg-white dark:bg-[#120B1E]"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#1a0f2e]">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {item.content}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Sections */}
        <motion.div className="space-y-12" variants={containerVariants}>
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-[#00C48C]" /> 1. Acceptance of Terms
            </h2>
            <p className="text-sm leading-7 opacity-80">
              By accessing or using CareerCanvas, you agree to be bound by these
              Terms and Conditions and our Privacy Policy. If you do not agree
              with any part of these terms, you must not use our services. We
              reserve the right to update these terms at any time, and continued
              use of the platform constitutes acceptance of updated terms.
            </p>
          </motion.section>

          <motion.section
            className="p-8 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#0b1120] dark:to-[#120B1E] border-l-4 border-[#FF0F7B]"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-4">
              2. Instructor & Student Roles
            </h2>
            <div className="space-y-4 text-sm leading-7 opacity-80">
              <p>
                <strong>Instructors:</strong> Are responsible for the accuracy
                and legality of the courses they upload. CareerCanvas takes a
                commission on course sales as defined in the Instructor
                Agreement.
              </p>
              <p>
                <strong>Students:</strong> Are granted a lifetime access license
                to purchased courses (unless otherwise stated) but are
                prohibited from reproducing or redistributing course content.
              </p>
            </div>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-4">3. Termination</h2>
            <p className="text-sm leading-7 opacity-80">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms. Upon termination, your
              right to use the Service will cease immediately.
            </p>
          </motion.section>
        </motion.div>

        {/* Action Footer */}
        <motion.div
          className="mt-20 p-10 text-center border-t border-gray-100 dark:border-[#2D2438]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-xl font-semibold mb-6">
            By clicking "Sign Up", you agree to these terms.
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-10 py-4 rounded-full bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] text-white font-bold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Accept Terms & Continue
            </motion.button>
            <motion.button
              className="px-10 py-4 rounded-full border border-gray-200 dark:border-[#2D2438] font-semibold"
              whileHover={{ scale: 1.03, backgroundColor: "#F3F4F6" }}
              whileTap={{ scale: 0.95 }}
            >
              Download PDF
            </motion.button>
          </div>
          <p className="mt-8 text-xs text-gray-500">
            Questions? Contact our legal team at{" "}
            <span className="text-[#FF0F7B]">legal@smartlms-pro.com</span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TermsAndConditions;
