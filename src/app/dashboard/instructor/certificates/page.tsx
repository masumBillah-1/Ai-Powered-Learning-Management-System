"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Eye, Edit2, Trash2, 
  X, Upload, ChevronDown 
} from 'lucide-react';

const Certificates = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const certificates = [
    { id: "01", title: "Certificate 01", img: "https://img.freepik.com/free-vector/elegant-certificate-template-set_23-2148403275.jpg" },
    { id: "02", title: "Certificate 02", img: "https://img.freepik.com/free-vector/gradient-certificate-template-set_23-2148401394.jpg" },
    { id: "03", title: "Certificate 03", img: "https://img.freepik.com/free-vector/flat-certificate-template_23-2148148301.jpg" },
    { id: "04", title: "Certificate 04", img: "https://img.freepik.com/free-vector/creative-certificate-template_23-2148154189.jpg" },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen"
    >
      {/* --- Header Section --- */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Certificates</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          style={{ background: 'linear-gradient(90deg, #FF0F7B, #F89B29)' }}
          className="text-white px-6 py-2.5 rounded-full font-bold shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={18} strokeWidth={3} /> Add Certificate
        </motion.button>
      </div>

      {/* --- Certificates Grid --- */}
      <motion.div 
        variants={containerVars}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
      >
        {certificates.map((cert) => (
          <motion.div 
            key={cert.id}
            variants={itemVars}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm group"
          >
            {/* Certificate Preview Image */}
            <div className="relative aspect-[1.4/1] mb-4 overflow-hidden rounded-xl bg-gray-100">
              <img 
                src={cert.img} 
                alt={cert.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Certificate Footer */}
            <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-gray-700 dark:text-gray-200">{cert.title}</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-indigo-500 rounded-lg transition-all border border-gray-50 dark:border-slate-800">
                  <Eye size={18} />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-green-500 rounded-lg transition-all border border-gray-50 dark:border-slate-800">
                  <Edit2 size={18} />
                </button>
                <button className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all border border-gray-50 dark:border-slate-800">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* --- Add Certificate Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/30">
                <h2 className="text-xl font-black text-gray-800 dark:text-white">Add New Certificate</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Certificate Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Enter certificate name (e.g. Graphic Design)" 
                    className="w-full p-3.5 border dark:border-slate-700 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Upload Template <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-slate-800/50 hover:border-pink-300 transition-colors cursor-pointer group">
                    <div className="p-4 bg-white dark:bg-slate-700 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={28} className="text-pink-500" />
                    </div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG or SVG (Max. 5MB)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Assign to Course</label>
                  <div className="relative">
                    <select className="w-full p-3.5 border dark:border-slate-700 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 appearance-none text-gray-600 font-bold">
                      <option>Select a course</option>
                      <option>UI/UX Design Masterclass</option>
                      <option>Fullstack Web Development</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  style={{ background: 'linear-gradient(90deg, #832388, #E3436B, #F0772F)' }}
                  className="px-8 py-2.5 rounded-xl font-bold text-white shadow-lg hover:opacity-90 transition-all"
                >
                  Save Certificate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Certificates;