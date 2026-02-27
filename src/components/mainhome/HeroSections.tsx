


// "use client";

// import { useEffect, useState } from "react";
// import { FaPlayCircle, FaArrowRight } from "react-icons/fa";

// export default function HeroSections() {
//   const texts: string[] = [
//     "Learn Web Development",
//     "Build Real Projects",
//     "Grow Your Career",
//   ];

//   const [currentText, setCurrentText] = useState<string>("");
//   const [index, setIndex] = useState<number>(0);
//   const [charIndex, setCharIndex] = useState<number>(0);

//   // Typewriter Effect
//   useEffect(() => {
//     if (charIndex < texts[index].length) {
//       const timeout = setTimeout(() => {
//         setCurrentText((prev) => prev + texts[index][charIndex]);
//         setCharIndex(charIndex + 1);
//       }, 80);
//       return () => clearTimeout(timeout);
//     } else {
//       setTimeout(() => {
//         setCurrentText("");
//         setCharIndex(0);
//         setIndex((prev) => (prev + 1) % texts.length);
//       }, 1500);
//     }
//   }, [charIndex, index, texts]);

//   return (
//     <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0b2e] via-[#2b0f45] to-[#12061c] text-white">
//       <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 items-center gap-12">

//         {/* LEFT CONTENT */}
//         <div>
//           <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
//             {currentText}
//             <span className="text-yellow-400 animate-pulse">|</span>
//           </h1>

//           <p className="text-gray-300 text-lg mb-8 max-w-lg">
//             Join thousands of students and start mastering modern web
//             development today.
//           </p>

//           <div className="flex gap-4">
//             <button className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
//               <FaPlayCircle />
//               Start Learning
//             </button>

//             <button className="flex items-center gap-2 border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
//               Explore Courses
//               <FaArrowRight />
//             </button>
//           </div>
//         </div>

//         {/* RIGHT IMAGE */}
//         {/* <div className="relative">
//           <img
//             src="/ruhi.jpeg"
//             alt="Ruhi"
//             className="rounded-3xl shadow-2xl hover:scale-70 transition duration-300 "
//           /> */}
// <div className="relative flex justify-center">

//   {/* Glow Background */}
//   <div className="absolute w-[420px] h-[420px] bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 blur-3xl opacity-30 rounded-full"></div>

//   <img
//     src="/ruhi.png"
//     alt="ruhi"
//     className="relative w-[400px] h-[450px] object-cover rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:scale-105 transition duration-500 border-4 border-white/10 backdrop-blur-lg"
//   />

//   {/* Floating Badge */}
//   <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-xl shadow-xl animate-bounce font-semibold">
//     Co-Scrum Leader 🚀
//   </div>

// </div>


//           {/* Floating Effect Box */}
//           <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-black px-6 py-3 rounded-xl shadow-lg animate-bounce">
//             10K+ Students Enrolled 🚀
//           </div>
//         </div>
//       {/* </div> */}

//       {/* Background Blur Circle */}
//       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/20 blur-3xl rounded-full"></div>
//     </section>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function HeroSections() {
  const texts: string[] = [
    "Corporate Training",
    "Modern Learning",
    "Career Growth",
  ];

  const [currentText, setCurrentText] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);

  useEffect(() => {
    if (charIndex < texts[index].length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + texts[index][charIndex]);
        setCharIndex(charIndex + 1);
      }, 70);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        setCurrentText("");
        setCharIndex(0);
        setIndex((prev) => (prev + 1) % texts.length);
      }, 1500);
    }
  }, [charIndex, index, texts]);

  return (
    <section className="relative bg-[#243B6B] overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 items-center gap-12">

        {/* LEFT SIDE */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {currentText}
            <br />
            Made Easy
          </h1>

          <p className="text-gray-200 mb-6 text-lg max-w-lg">
            Engaging and empowering learning through technology.
            Build your future with modern LMS solutions.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" />
              <span>Professional Training Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" />
              <span>Interactive Learning Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" />
              <span>Modern LMS Platform</span>
            </div>
          </div>

          <button className="bg-pink-600 hover:bg-pink-700 px-8 py-3 rounded-lg font-semibold transition">
            Get Started
          </button>
        </div>

      {/* RIGHT SIDE */}
{/* RIGHT SIDE */}
<div className="relative flex justify-center items-center">

  {/* Soft Gradient Glow Behind */}
  <div className="absolute w-[820px] h-[520px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-3xl opacity-20 rounded-full"></div>

  {/* Rotated Background Shape */}
  <div className="absolute w-[700px] h-[500px] bg-pink-600 rounded-[60px] rotate-12 opacity-90"></div>

  {/* Large Hexagon Video */}
  <div className="relative w-[850px] h-[550px] clip-hexagon overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/10 backdrop-blur-lg">

    <video
      src="/bubbles.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover scale-110"
    />

    {/* Subtle Dark Overlay */}
    <div className="absolute inset-0 bg-black/20"></div>

  </div>

</div>
      </div>
    </section>
  );
}