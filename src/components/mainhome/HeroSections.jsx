"use client";

import { useEffect, useState } from "react";
import { FaPlayCircle, FaArrowRight } from "react-icons/fa";

export default function HeroSections() {
  const texts = [
    "Learn Web Development",
    "Build Real Projects",
    "Grow Your Career",
  ];

  const [currentText, setCurrentText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Typewriter Effect
  useEffect(() => {
    if (charIndex < texts[index].length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + texts[index][charIndex]);
        setCharIndex(charIndex + 1);
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        setCurrentText("");
        setCharIndex(0);
        setIndex((prev) => (prev + 1) % texts.length);
      }, 1500);
    }
  }, [charIndex, index]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0b2e] via-[#2b0f45] to-[#12061c] text-white">
      <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 items-center gap-12">

        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {currentText}
            <span className="text-yellow-400 animate-pulse">|</span>
          </h1>

          <p className="text-gray-300 text-lg mb-8 max-w-lg">
            Join thousands of students and start mastering modern web
            development today.
          </p>

          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
              <FaPlayCircle />
              Start Learning
            </button>

            <button className="flex items-center gap-2 border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
              Explore Courses
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1581090700227-4c4f50c1f6c9"
            alt="Student Learning"
            className="rounded-3xl shadow-2xl hover:scale-105 transition duration-500"
          />

          {/* Floating Effect Box */}
          <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-black px-6 py-3 rounded-xl shadow-lg animate-bounce">
            10K+ Students Enrolled 🚀
          </div>
        </div>
      </div>

      {/* Background Blur Circle */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/20 blur-3xl rounded-full"></div>
    </section>
  );
}


