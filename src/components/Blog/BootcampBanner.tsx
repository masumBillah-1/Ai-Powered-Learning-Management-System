"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaUsers, FaStar, FaTimes } from "react-icons/fa";

const BootcampBanner = () => {
  const [bootcampData, setBootcampData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    fetch('/data/blogs.json')
      .then(res => res.json())
      .then(data => {
        setBootcampData(data.bootcamp);
      })
      .catch(err => console.error('Error loading bootcamp data:', err));
  }, []);

  useEffect(() => {
    if (!bootcampData) return;
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(bootcampData.startDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [bootcampData]);

  // Testimonial auto-rotation
  useEffect(() => {
    if (!bootcampData?.testimonials) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % bootcampData.testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bootcampData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowRegistration(false);
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '' });
    }, 2000);
  };

  if (!bootcampData) return null;

  const discountPercentage = Math.round(((bootcampData.price - bootcampData.discountPrice) / bootcampData.price) * 100);

  return (
    <section className="py-12 px-4 md:px-0">
      <div className="max-w-[1200px] mx-auto bg-[#0c0422] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative">
        <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-10">
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <p className="text-gray-400 text-lg mb-4 font-medium tracking-wide">
              AI Powered
            </p>
            <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-6">
              Complete <span className="bg-gradient-to-r from-[#C81D77] to-[#8B2FF1] bg-clip-text text-transparent">Digital Creator</span> <br />
              Bootcamp Batch 1
            </h1>

            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <div className="text-3xl font-black text-white">{value}</div>
                  <div className="text-xs text-gray-400 uppercase mt-1">{unit}</div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-white">
                <FaUsers className="text-[#C81D77]" />
                <span className="font-bold">{bootcampData.seatsRemaining}/{bootcampData.seatsTotal} Seats Left</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <FaClock className="text-[#6710C2]" />
                <span className="font-bold">{bootcampData.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <FaStar />
                <span className="font-bold">4.9/5 Rating</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-black text-white">৳{bootcampData.discountPrice.toLocaleString()}</span>
                <span className="text-xl text-gray-400 line-through">৳{bootcampData.price.toLocaleString()}</span>
                <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                  {discountPercentage}% OFF
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Early bird discount ends: {new Date(bootcampData.discountEndDate).toLocaleDateString()}
              </p>
            </div>

            <button 
              onClick={() => setShowRegistration(true)}
              className="px-10 py-4 bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white text-xl font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-purple-500/20 active:scale-95"
            >
              Enroll Now
            </button>

            {/* Testimonials Slider */}
            {bootcampData.testimonials && bootcampData.testimonials.length > 0 && (
              <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="flex items-start gap-4">
                  <img 
                    src={bootcampData.testimonials[currentTestimonial].image} 
                    alt={bootcampData.testimonials[currentTestimonial].name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-bold text-white">{bootcampData.testimonials[currentTestimonial].name}</p>
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(bootcampData.testimonials[currentTestimonial].rating)].map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{bootcampData.testimonials[currentTestimonial].role}</p>
                    <p className="text-white/90 text-sm italic">"{bootcampData.testimonials[currentTestimonial].comment}"</p>
                  </div>
                </div>
                {/* Testimonial Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {bootcampData.testimonials.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentTestimonial 
                          ? 'w-8 bg-white' 
                          : 'w-2 bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Side: Image with Grid Background */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 relative group"
          >
            {/* White card container like the image */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-rotate-1">
              <img 
                src={bootcampData.image}
                alt="Bootcamp" 
                className="w-full h-auto object-cover"
              />
              {/* Overlay elements like icons can be added here */}
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none"></div>
            </div>
          </motion.div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6710C2] blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C81D77] blur-[120px] opacity-20 pointer-events-none"></div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRegistration(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => setShowRegistration(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FaTimes size={24} />
              </button>

              {!submitted ? (
                <>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                    Register for Bootcamp
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#C81D77] outline-none transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#C81D77] outline-none transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Your Phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#C81D77] outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white font-bold rounded-xl hover:scale-105 transition-transform"
                    >
                      Submit Registration
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    Registration Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We'll contact you soon with more details.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BootcampBanner;
