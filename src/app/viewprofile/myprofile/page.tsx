"use client";
import React, { useState } from 'react';
import Image from "next/image";
import { LuPencilLine, LuTrash2, LuUser, LuMail, LuHash, LuPhone, LuUpload } from "react-icons/lu";

interface ProfileData {
  fullName: string;
  email: string;
  studentId: string;
  mobileNumber: string;
  whatsappNumber: string;
}
interface InputFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  isEditing: boolean;
  onChange: (val: string) => void;
}
const InputField = ({ label, value, icon, isEditing, onChange }: InputFieldProps) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-gray-400">
      {icon}
      <label className="text-sm font-medium">{label}</label>
    </div>
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full bg-[#1b1429] border border-gray-800 rounded-lg px-4 py-3 text-gray-100 outline-none focus:border-purple-500/50 transition-all"
      />
    ) : (
      <p className="text-gray-100 font-semibold text-base md:text-lg pl-1">{value || "N/A"}</p>
    )}
  </div>
);

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "Sakib Al Hasan",
    email: "sadmansakib8530@gmail.com",
    studentId: "WEB12-5243",
    mobileNumber: "+8801937636760",
    whatsappNumber: "01792138530",
  });

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    console.log(`${field}: ${value}`); 
  };

  return (
    <div className="bg-[#11081a] rounded-2xl p-6 md:p-8 text-white border border-white/5 shadow-2xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[#a855f7] text-xl md:text-2xl font-bold font-sans">My Profile</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-purple-600 text-white' : 'hover:bg-white/5 text-purple-400'}`}
        >
          <LuPencilLine size={20} />
        </button>
      </div>
      <div className="border-t border-gray-800 border-dashed mb-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-12">
        <InputField 
          label="Full Name" 
          value={profileData.fullName} 
          icon={<LuUser size={16}/>} 
          isEditing={isEditing} 
          onChange={(val: string) => handleChange("fullName", val)} 
        />
        <InputField 
          label="Email" 
          value={profileData.email} 
          icon={<LuMail size={16}/>} 
          isEditing={isEditing} 
          onChange={(val: string) => handleChange("email", val)}
        />
        <InputField 
          label="Student ID" 
          value={profileData.studentId} 
          icon={<LuHash size={16}/>} 
          isEditing={isEditing} 
          onChange={(val: string) => handleChange("studentId", val)}
        />
        <InputField 
          label="Mobile Number" 
          value={profileData.mobileNumber} 
          icon={<LuPhone size={16}/>} 
          isEditing={isEditing} 
          onChange={(val: string) => handleChange("mobileNumber", val)}
        />
        <InputField 
          label="WhatsApp Number" 
          value={profileData.whatsappNumber} 
          icon={<LuPhone size={16}/>} 
          isEditing={isEditing} 
          onChange={(val: string) => handleChange("whatsappNumber", val)}
        />

        {isEditing && (
          <div className="space-y-3">
             <label className="block text-gray-300 text-sm font-medium">Profile Image</label>
             <div className="flex flex-col gap-3">
                <button className="flex items-center gap-2 text-sm text-gray-200 hover:text-white transition-all">
                  <LuUpload size={16} /> Change Profile Image
                </button>
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500/50">
                  <Image src="/profile.jpg" alt="profile" fill className="object-cover" />
                </div>
             </div>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="flex justify-end mt-8">
          <button 
            onClick={() => setIsEditing(false)}
            className="bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] text-gray-300 hover:text-white px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-lg"
          >
            Save changes
          </button>
        </div>
      )}
      
    </div>
  );
};




export default MyProfile;