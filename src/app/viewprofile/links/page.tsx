"use client";

import { useState } from "react";
import { FiLink, FiEdit3 } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdOutlineImage } from "react-icons/md";
import { IoIosInformationCircleOutline } from "react-icons/io";

type Links = {
  cv: string;
  github: string;
  portfolio: string;
  linkedin: string;
  image: string;
};

export default function ImportantLinks() {
  const [showForm, setShowForm] = useState(false);
  const [links, setLinks] = useState<Links>({
    cv: "",
    github: "",
    portfolio: "",
    linkedin: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinks({ ...links, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saved Data:", links);
    setShowForm(false);
  };

  return (
    <div className=" bg-[#11081a] rounded-2xl p-6 md:p-8 text-white border border-white/5 shadow-2xl">
      <div className="  rounded-2xl   shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 border-b border-dashed border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#b366ff]">Important Link</h2>
            <IoIosInformationCircleOutline className="text-[#b366ff] text-xl cursor-help" />
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <FiEdit3 className="text-gray-300 text-xl" />
          </button>
        </div>

        <div className="p-8">
          {!showForm ? (
            /* --- EMPTY STATE (Image 2) --- */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-6">
                <div className="text-8xl transform -rotate-12 opacity-80">
                  <span className="text-gray-500">🔗</span>
                </div>
                {/* Custom Chain Icon Mockup based on image */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                   <FiLink className="text-7xl text-yellow-500 rotate-45" />
                </div>
              </div>

              <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
                Currently no data exists! Please click on the following button to
                add your details Important Link.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] hover:to-[#832388]  px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-purple-500/20"
              >
                + Add Important Link
              </button>
            </div>
          ) : (
            /* --- FORM STATE (Image 1) --- */
            <div className="space-y-6">
              {[
                { label: "CV link (Google Drive)", name: "cv", icon: <FiLink /> },
                { label: "Github Profile", name: "github", icon: <FaGithub /> },
                { label: "Portfolio link", name: "portfolio", icon: <FiLink /> },
                { label: "LinkedIn Profile link", name: "linkedin", icon: <FaLinkedin /> },
                { label: "Good professional Profile image link", name: "image", icon: <MdOutlineImage /> },
              ].map((field) => (
                <div key={field.name}>
                  <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-300">
                    <span className="text-lg">{field.icon}</span> {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={links[field.name as keyof Links]}
                    onChange={handleChange}
                    placeholder="Enter link here..."
                    className="w-full bg-[#130921] border border-gray-800 focus:border-purple-500 p-4 rounded-xl outline-none transition-all text-gray-200 placeholder:text-gray-600 shadow-inner"
                  />
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-8 py-2.5 rounded-lg border border-[#b366ff] text-[#b366ff] font-medium hover:bg-[#b366ff]/10 transition-all"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 rounded-lg bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] hover:brightness-110 text-white font-medium transition-all shadow-lg"
                >
                  Save changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}