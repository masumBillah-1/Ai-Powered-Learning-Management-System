"use client";

import React from "react";
import { Shield, Lock, Eye, Database, Scale, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Data Collection",
      icon: <Database className="w-6 h-6 text-[#FF0F7B]" />,
      content:
        "We collect account data (name, email, hashed passwords), profile information, and learning progress. Technical data like IP addresses and usage patterns are gathered to optimize your experience.",
    },
    {
      title: "How We Use Data",
      icon: <Eye className="w-6 h-6 text-[#E3436B]" />,
      content:
        "Information is used for AI-driven personalization, adaptive learning paths, tracking gamification streaks, and providing instructors with student performance analytics.",
    },
    {
      title: "AI Processing",
      icon: <Lock className="w-6 h-6 text-[#832388]" />,
      content:
        "Our AI features (summarization, grading) process data through secure APIs. We ensure that third-party AI models are never trained on your personally identifiable information.",
    },
    {
      title: "Your Rights",
      icon: <UserCheck className="w-6 h-6 text-[#F89B29]" />,
      content:
        "You have the right to access, correct, or request the permanent deletion of your data (the 'Right to be Forgotten') directly through your Student or Instructor dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#05010D] text-gray-800 dark:text-gray-200 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF0F7B] via-[#E3436B] to-[#F89B29] bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Last Updated: March 4, 2026
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-[#832388] to-[#FDE047] rounded-full" />
          </div>
        </motion.div>

        {/* Introduction Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gray-50 dark:bg-[#120B1E] border border-gray-100 dark:border-[#2D2438] rounded-2xl p-8 mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-8 h-8 text-[#FF0F7B]" />
            <h2 className="text-2xl font-semibold">Our Commitment</h2>
          </div>
          <p className="leading-relaxed opacity-90">
            At <strong>CareerCanvas</strong>, we believe education and privacy
            go hand-in-hand. This policy outlines our transparent approach to
            data handling within our AI-powered ecosystem.
          </p>
        </motion.div>

        {/* Grid Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04 }}
              className="p-6 rounded-xl border border-gray-100 dark:border-[#2D2438] bg-white dark:bg-[#0b1120] hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                {section.icon}
                <h3 className="text-xl font-bold">{section.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Security Box */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#832388] to-[#E3436B] p-[1px] rounded-2xl"
        >
          <div className="bg-white dark:bg-[#05010D] rounded-[15px] p-8">
            <div className="flex items-center gap-4 mb-4">
              <Scale className="w-8 h-8 text-[#FDE047]" />
              <h2 className="text-2xl font-semibold">Compliance & Security</h2>
            </div>
            <ul className="space-y-3 list-disc list-inside opacity-90">
              <li>End-to-end encryption for all data in transit.</li>
              <li>JWT-based authentication to secure student records.</li>
              <li>Strict adherence to GDPR and FERPA principles.</li>
              <li>
                Regular security audits of our MongoDB and AWS infrastructure.
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500">
            Have questions about your data? Reach out to our Privacy Team at
            <span className="text-[#FF0F7B] font-medium ml-1">
              privacy@smartlms-pro.com
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
