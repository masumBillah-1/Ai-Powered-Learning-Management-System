"use client";

import React from 'react';
import { Star, Edit2, Trash2, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

const ReviewsPage = () => {
  const reviews = [
    {
      id: 1,
      name: "Ronald Richard",
      date: "6 months ago",
      rating: 4,
      comment: "This is the second Photoshop course I have completed with Nancy Duarte. Worth every penny and recommend it highly. To get the most out of this course, its best to to take the Beginner to Advanced course first. The sound and video quality is of a good standard. Thank you Nancy Duarte.",
      reply: "As a learner who has navigated through various online platforms, the sophistication and user-centric design of this website set a new benchmark for what digital education should look like.",
      image: "https://dreamslms.dreamstechnologies.com/html/assets/img/user/user-11.jpg"
    },
    {
      id: 2,
      name: "Ronald Richard",
      date: "9 months ago",
      rating: 5,
      comment: "I've been using this LMS for several months for my online courses, and it's been a game-changer. The interface is incredibly user-friendly, making it easy for both instructors and students to navigate through the courses. The variety of tools available for creating interactive and engaging content has significantly enhanced the learning experience.",
      image: "https://dreamslms.dreamstechnologies.com/html/assets/img/user/user-11.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFD] p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Page Title - Extra Large */}
        <h1 className="text-3xl md:text-4xl font-black text-[#171717] mb-10 tracking-tight">Reviews</h1>

        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="border-2 border-gray-100 rounded-[32px] p-8 md:p-10 shadow-sm bg-white hover:shadow-md transition-shadow">
              
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div className="flex items-center gap-5">
                  <img src={review.image} alt={review.name} className="w-16 h-16 rounded-full object-cover border-2 border-pink-50" />
                  <div>
                    <h3 className="text-xl font-black text-[#171717]">{review.name}</h3>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">{review.date}</p>
                  </div>
                </div>
                {/* Bigger Stars */}
                <div className="flex gap-1 bg-gray-50 px-4 py-2 rounded-full">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < review.rating ? "#FFB800" : "none"} 
                      className={i < review.rating ? "text-[#FFB800]" : "text-gray-200"} 
                    />
                  ))}
                </div>
              </div>

              {/* Review Comment - Large Readable Font */}
              <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed mb-8">
                "{review.comment}"
              </p>

              {/* Reply Section - Styled like image_7121a2.png */}
              {review.reply && (
                <div className="bg-[#F8F9FB] rounded-[24px] p-6 md:p-8 mb-8 border-l-8 border-[#FF4667]">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={18} className="text-[#FF4667]" />
                    <h4 className="text-lg font-black text-[#171717]">Instructor Reply</h4>
                  </div>
                  <p className="text-md md:text-lg font-bold text-gray-500 italic leading-relaxed">
                    {review.reply}
                  </p>
                </div>
              )}

              {/* Action Buttons - Bold & Large */}
              <div className="flex items-center gap-8 pt-6 border-t-2 border-gray-50">
                <button className="flex items-center gap-2 text-md font-black text-gray-400 hover:text-[#FF4667] transition-all group">
                  <Edit2 size={18} className="group-hover:scale-110 transition-transform" /> Edit Review
                </button>
                <button className="flex items-center gap-2 text-md font-black text-gray-400 hover:text-red-500 transition-all group">
                  <Trash2 size={18} className="group-hover:scale-110 transition-transform" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination - Large Style */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 pb-10">
          <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Page 1 of 12</p>
          
          <div className="flex items-center gap-3">
            <button className="p-3 border-2 border-gray-100 rounded-2xl text-gray-400 hover:bg-gray-50 transition-all shadow-sm">
              <ChevronLeft size={24} />
            </button>
            {[1, 2, 3].map((num) => (
              <button 
                key={num}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl text-md font-black transition-all ${
                  num === 1 
                  ? "bg-[#FF4667] text-white shadow-xl shadow-pink-200 scale-110" 
                  : "border-2 border-gray-100 text-gray-500 hover:border-[#FF4667] hover:text-[#FF4667]"
                }`}
              >
                {num}
              </button>
            ))}
            <button className="p-3 border-2 border-gray-100 rounded-2xl text-gray-400 hover:bg-gray-50 transition-all shadow-sm">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;