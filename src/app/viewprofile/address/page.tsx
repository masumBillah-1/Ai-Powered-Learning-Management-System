"use client";
import React, { useState } from "react";
import { FaMapMarkerAlt, FaGlobe, FaEdit, FaPlus } from "react-icons/fa";


interface AddressState {
  presentCountry: string;
  presentStreet: string;
  permanentCountry: string;
  permanentStreet: string;
}

const AddressPage = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [sameAsPresent, setSameAsPresent] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<AddressState>({
    presentCountry: "Bangladesh",
    presentStreet: "",
    permanentCountry: "",
    permanentStreet: "",
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsPresent(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        permanentCountry: prev.presentCountry,
        permanentStreet: prev.presentStreet,
      }));
    }
  };

  return (
    <div className="bg-[#11081a] border border-white/5 rounded-2xl p-6 md:p-8 min-h-[500px]">
      {/* হেডার সেকশন */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4 border-dashed">
        <h2 className="text-xl font-semibold text-purple-400">Address</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 bg-purple-600/10 text-purple-400 rounded-lg hover:bg-purple-600/20 transition-all"
        >
          <FaEdit size={18} />
        </button>
      </div>

      {!isEditing ? (
      
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
              <FaMapMarkerAlt size={40} className="text-red-500" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-yellow-500/40 blur-md rounded-full"></div>
          </div>
          <p className="text-gray-400 max-w-xs mb-8">
            Currently no data exists! Please click on the following button to add your details Address.
          </p>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-purple-900/20"
          >
            <FaPlus size={14} /> Add Address
          </button>
        </div>
      ) : (

        <form className="space-y-8 animate-in fade-in duration-300">
          {/* Present Address */}
          <div>
            <h3 className="text-[#F89B29] font-medium mb-4 uppercase text-sm tracking-wider">Present Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <FaGlobe className="text-gray-400" /> Select your Country
                </label>
                <select 
                  name="presentCountry"
                  value={formData.presentCountry}
                  onChange={handleInputChange}
                  className="w-full bg-[#1c1226] border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-purple-500 transition-all"
                >
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="USA">USA</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <FaMapMarkerAlt className="text-gray-400" /> Street Address
                </label>
                <input 
                  type="text" 
                  name="presentStreet"
                  value={formData.presentStreet}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className="w-full bg-[#1c1226] border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Permanent Address */}
          <div className="pt-4">
            <h3 className="text-[#F89B29] font-medium mb-4 uppercase text-sm tracking-wider">Permanent Address</h3>
            <div className="flex items-center gap-3 mb-6">
              <input 
                type="checkbox" 
                id="sameAsPresent" 
                checked={sameAsPresent}
                onChange={handleCheckbox}
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="sameAsPresent" className="text-sm text-gray-400 cursor-pointer select-none">
                Current address and permanent address are the same
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <FaGlobe className="text-gray-400" /> Select your Country
                </label>
                <select 
                  name="permanentCountry"
                  disabled={sameAsPresent}
                  value={sameAsPresent ? formData.presentCountry : formData.permanentCountry}
                  onChange={handleInputChange}
                  className={`w-full bg-[#1c1226] border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-purple-500 ${sameAsPresent ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select</option>
                  <option value="Bangladesh">Bangladesh</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <FaMapMarkerAlt className="text-gray-400" /> Street Address
                </label>
                <input 
                  type="text" 
                  name="permanentStreet"
                  disabled={sameAsPresent}
                  value={sameAsPresent ? formData.presentStreet : formData.permanentStreet}
                  onChange={handleInputChange}
                  className={`w-full bg-[#1c1226] border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-purple-500 ${sameAsPresent ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-white/5 transition-all font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] text-white font-medium transition-all shadow-lg shadow-purple-900/20"
            >
              Save changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressPage;