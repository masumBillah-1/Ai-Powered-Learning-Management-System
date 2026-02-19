import React from "react";

const SuccessSection = () => {
  const companies = [
    {
      name: "BRAIN STATION 23",
      logo: "https://via.placeholder.com/20?text=B",
      dotColor: "bg-[#00a7e1]",
      top: "25%",
      left: "55%",
    },
    {
      name: "Truck Lagbe",
      logo: "https://via.placeholder.com/20?text=T",
      dotColor: "bg-[#ed1c24]",
      top: "38%",
      left: "72%",
    },
    {
      name: "রকমারি",
      logo: "https://via.placeholder.com/20?text=R",
      dotColor: "bg-[#10b981]",
      top: "45%",
      left: "52%",
    },
    {
      name: "vivesoft",
      logo: "https://via.placeholder.com/20?text=V",
      dotColor: "bg-[#2563eb]",
      top: "58%",
      left: "68%",
    },
    {
      name: "WellDev",
      logo: "https://via.placeholder.com/20?text=W",
      dotColor: "bg-[#f97316]",
      top: "62%",
      left: "45%",
    },
    {
      name: "SELISSE",
      logo: "https://via.placeholder.com/20?text=S",
      dotColor: "bg-[#0ea5e9]",
      top: "78%",
      left: "75%",
    },
  ];

  return (
    <section className="relative w-full max-w-7xl my-20 mx-auto min-h-[450px] bg-[#020617] rounded-[40px] overflow-hidden flex flex-col md:flex-row items-center px-10 md:px-20 py-12 shadow-2xl border border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,_rgba(16,185,129,0.08)_0%,_transparent_50%)]" />

      {/* Left Content - The Success Stats */}
      <div className="w-full md:w-1/2 z-10 text-left">
        <p className="mt-6 text-slate-400 text-base md:text-lg leading-relaxed max-w-lg">
          শুধু কোড শেখানোই নয়, আমরা শেখাই সমস্যা সমাধান, টিমওয়ার্ক এবং
          বাস্তব প্রজেক্টে কাজ করার দক্ষতা।
        </p>

        <p className="mt-4 text-slate-500 text-sm md:text-base max-w-lg">
          ধারাবাহিক প্র্যাকটিস ও সঠিক গাইডলাইনের মাধ্যমে তুমি তৈরি হতে পারো
          আগামী দিনের দক্ষ ডেভেলপার হিসেবে।
        </p>

        <div className="flex flex-wrap gap-2 mt-8">
          {["রিমোট জব", "লোকাল জব", "ইন্টারন্যাশনাল জব"].map((label) => (
            <button
              key={label}
              className="px-4 py-2 text-sm bg-[#1e293b]/60 hover:bg-[#334155] border border-white/10 rounded-lg text-slate-300 transition-all"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Content - The Network Map */}
      <div className="w-full md:w-1/2 relative h-[350px] md:h-[450px]">
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 500 500"
        >
          <path
            d="M100,250 L250,150 L400,200 L450,400 L200,450 Z"
            stroke="#10b981"
            fill="none"
            strokeWidth="0.5"
          />
          <path
            d="M150,100 L300,50 L480,150"
            stroke="#10b981"
            fill="none"
            strokeWidth="0.5"
          />
          <path
            d="M50,300 L200,320 L350,280"
            stroke="#10b981"
            fill="none"
            strokeWidth="0.5"
          />
          <path
            d="M250,150 L250,450 M400,200 L100,250"
            stroke="#10b981"
            fill="none"
            strokeWidth="0.3"
          />
        </svg>

        {/* Company Floating Cards */}
        {companies.map((company, idx) => (
          <div
            key={idx}
            className="absolute flex items-center gap-2 group transition-transform hover:scale-105"
            style={{ top: company.top, left: company.left }}
          >
            <div
              className={`relative w-2.5 h-2.5 rounded-full ${company.dotColor}`}
            >
              <div
                className={`absolute inset-0 rounded-full ${company.dotColor} animate-ping opacity-75`}
              />
            </div>

            <div className="bg-white px-2 py-1.5 rounded-md flex items-center gap-2 shadow-xl">
              <div className="w-4 h-4 bg-slate-100 rounded flex-shrink-0" />{" "}
              <span className="text-[10px] md:text-[11px] font-bold text-slate-800 whitespace-nowrap uppercase tracking-tighter">
                {company.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuccessSection;
