"use client";
import React, { useState } from "react";
import { FaPaperPlane, FaCheckCircle } from "react-icons/fa";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");

  const topics = ["Web Development", "Digital Marketing", "Graphics Design", "Career Tips", "Tech Updates"];
  const frequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" }
  ];

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && selectedTopics.length > 0) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
        setSelectedTopics([]);
      }, 3000);
    }
  };

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div
          className="relative rounded-[40px] overflow-hidden p-8 md:p-16 shadow-2xl"
          style={{ background: "linear-gradient(90deg, #6710C2, #C81D77)" }}
        >
          {/* Background Pattern/Decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
            <div className="absolute bottom-10 right-20 w-24 h-24 border-4 border-white rounded-lg rotate-45"></div>
            <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/20 rounded-full"></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Side: Content */}
            <div className="w-full lg:w-1/2 text-white">
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                Stay Up To Date
              </h2>
              <p className="text-lg md:text-xl leading-relaxed mb-8 text-white/90 font-medium">
                Get exclusive insights, industry trends, and expert analysis delivered straight to your inbox.
                Join thousands of professionals who trust our curated content to stay ahead in
                <span className="font-bold"> Digital Marketing, Graphics Design, and Web Development</span>.
              </p>

              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-6 py-4 rounded-2xl text-gray-800 font-medium text-base outline-none focus:ring-4 focus:ring-white/30 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg"
                    style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
                  >
                    Join Our Newsletter
                    <FaPaperPlane size={14} />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-white/40">
                  <FaCheckCircle size={24} color="#86efac" />
                  <span className="text-lg font-bold">Successfully subscribed! Check your inbox.</span>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✉️</span>
                  <span className="font-bold">{frequency.charAt(0).toUpperCase() + frequency.slice(1)} Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔒</span>
                  <span className="font-bold">No Spam, Ever</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span className="font-bold">10,000+ Subscribers</span>
                </div>
              </div>
            </div>

            {/* Right Side: Illustration */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px]">
                {/* Main Illustration Container */}
                <div className="relative">
                  {/* Email/Document Icon */}
                  <div className="relative z-20 bg-white rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="space-y-4">
                      {/* Email Header */}
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                          <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                        </div>
                      </div>
                      {/* Email Body Lines */}
                      <div className="space-y-3">
                        <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-full"></div>
                        <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-5/6"></div>
                        <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-4/6"></div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce z-30">
                    <span className="text-3xl">✏️</span>
                  </div>

                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl z-30 border-4 border-purple-200">
                    <span className="text-4xl">🔔</span>
                  </div>

                  <div className="absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl z-10">
                    <FaPaperPlane size={20} color="white" />
                  </div>

                  {/* Decorative Dashed Lines */}
                  <svg className="absolute -top-10 right-20 w-32 h-32 text-white/30" viewBox="0 0 100 100">
                    <path d="M 10 50 Q 30 20, 50 50 T 90 50" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Wave */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
