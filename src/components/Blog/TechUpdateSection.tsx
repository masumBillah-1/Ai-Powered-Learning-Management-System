"use client";
import React from "react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

const TechUpdateSection = () => {
  const techUpdates = [
    {
      id: 1,
      category: "Tech Update",
      title: "AI-Powered SEO Tools – The Future of Digital Marketing",
      description: "AI-Powered SEO! আধুনিক Digital Marketing এ Artificial Intelligence (AI) কে নিয়ে লিখলে...",
      image: "https://i.ibb.co.com/FkxynQ3K/carlos-muza-hpj-Sk-U2-UYSU-unsplash.jpg",
      slug: "ai-powered-seo-tools",
      bgGradient: "bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500",
    },
    {
      id: 2,
      category: "Tech Update",
      title: "Figma Variables: A System-Ready Design Token Revolution",
      description: "Figma Variables হলো Figma font family-এর pixel-based direction, যেটা...",
      image: "https://i.ibb.co.com/fzkDftYT/theme-photos-CGpif-H3-Fj-OA-unsplash.jpg",
      slug: "figma-variables-design-tokens",
      bgGradient: "bg-gradient-to-br from-gray-900 via-gray-800 to-black",
    },
    {
      id: 3,
      category: "Tech Update",
      title: "Introducing Next.js 15 | The Open Source Web Framework",
      description: "Introducing Next.js 15.sh! Next.js New Big Update! AI agents এখন...",
      image: "https://i.ibb.co.com/Zp6LgsPy/christopher-gower-m-HRf-Lhg-ABo-unsplash.jpg",
      slug: "nextjs-15-web-framework",
      bgGradient: "bg-gradient-to-br from-purple-900 via-indigo-900 to-black",
    },
    {
      id: 4,
      category: "Tech Update",
      title: "Introducing React 19 Best Practices: Boost Performance & Scalability",
      description: "React Best Practices Are Now Essential! React গিয়ে আপনি প্রায়ই ভাবছেন...",
      image: "https://i.ibb.co.com/LXDMbD4X/farzad-p-x-Sl33-Wxyc-unsplash.jpg",
      slug: "react-19-best-practices",
      bgGradient: "bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-900",
    },
    {
      id: 5,
      category: "Tech Update",
      title: "Introducing Meta Ads AI: Revolutionary Ad Campaign Automation",
      description: "Meta Ads এর নতুন AI feature ChatGPT Health নামের একটি শক্তিশালী health-focused experience introduce...",
      image: "https://i.ibb.co.com/spjv99Yy/campaign-creators-g-Msn-Xq-ILjp4-unsplash.jpg",
      slug: "meta-ads-ai-automation",
      bgGradient: "bg-gradient-to-br from-pink-300 via-rose-300 to-orange-300",
    },
    {
      id: 6,
      category: "Tech Update",
      title: "Critical Adobe Creative Cloud Security Vulnerability",
      description: "Critical Adobe Creative Cloud Server, ভারো যেটা, তুমি একজন modern Adobe ব্যবহারকারী...",
      image: "https://i.ibb.co.com/mYSqCRw/anita-chong-wrib-B9uv3-g-unsplash.jpg",
      slug: "adobe-creative-cloud-security",
      bgGradient: "bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-[#0b1120] transition-colors duration-300">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            Tech Update <span className="text-orange-500">🔥🔥</span>
          </h2>
          
        </div>

        {/* Tech Update Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techUpdates.map((update) => (
            <Link 
              key={update.id} 
              href={`/blog/${update.slug}`}
              className="group bg-white dark:bg-[#161d2f] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
            >
              {/* Image Container with Gradient Background */}
              <div className={`relative h-56 w-full overflow-hidden ${update.bgGradient} flex items-center justify-center`}>
                {/* Top Left Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                  <span className="text-purple-400 text-sm">▶</span>
                  <span className="text-xs font-bold text-white">BrainBoost</span>
                </div>

                {/* Center Text - Different for each card */}
                <div className="text-center px-6 z-10">
                  {update.id === 1 && (
                    <h3 className="text-white text-4xl md:text-5xl font-black drop-shadow-lg">
                      AI SEO Tools
                    </h3>
                  )}
                  {update.id === 2 && (
                    <div className="space-y-2">
                      <p className="text-gray-300 text-xl font-light">Design</p>
                      <p className="text-gray-400 text-2xl font-light">Tokens</p>
                      <p className="text-white text-4xl font-black">#Variables</p>
                      <p className="text-gray-300 text-xl font-light">Figma</p>
                    </div>
                  )}
                  {update.id === 3 && (
                    <div className="space-y-3">
                      <h3 className="text-white text-3xl font-black">Introducing</h3>
                      <h4 className="text-purple-300 text-4xl font-black">Next.js 15</h4>
                      <p className="text-gray-300 text-sm">The Open Source Framework</p>
                    </div>
                  )}
                  {update.id === 4 && (
                    <div className="space-y-3">
                      <h3 className="text-white text-2xl font-bold">Introducing</h3>
                      <h4 className="text-white text-3xl font-black">React 19</h4>
                      <h4 className="text-purple-300 text-3xl font-black">Best Practices</h4>
                    </div>
                  )}
                  {update.id === 5 && (
                    <div className="flex items-center justify-center gap-6">
                      <h3 className="text-gray-700 text-4xl font-black">Meta Ads</h3>
                      <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                        </svg>
                      </div>
                      <h3 className="text-gray-700 text-4xl font-black">AI</h3>
                    </div>
                  )}
                  {update.id === 6 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-4 text-white">
                        <span className="text-5xl font-black">Adobe</span>
                        <span className="text-5xl font-black text-cyan-300">CC</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-3xl">⚠</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Right Badge */}
                <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                  <span className="text-xs font-bold text-white">BrainBoost</span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Category Badge */}
                <span className="inline-block px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold mb-4 w-fit">
                  {update.category}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-[#6710C2] transition-colors line-clamp-2">
                  {update.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6">
                  {update.description}
                </p>

                {/* Read More Link */}
                <div className="mt-auto">
                  <span className="text-[#8B2FF1] font-black text-sm uppercase border-b-2 border-transparent group-hover:border-[#8B2FF1] transition-all">
                    Read More
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechUpdateSection;
