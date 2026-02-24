"use client";

import { useState, useEffect } from "react";
import { Camera, Pencil, X, Check, User, Mail, Phone, Shield, Clock, LogIn } from "lucide-react";
import toast from "react-hot-toast";

import Footer from "@/components/layout/Footer";

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  role: "student" | "instructor" | "admin";
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    photoURL: "",
  });

  // ✅ MongoDB থেকে user data নাও
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setUser(data.user);
        setForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
          photoURL: data.user.photoURL || "",
        });
      } catch (err: any) {
        toast.error(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Profile update
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUser(data.user);
      // localStorage ও update করো
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...savedUser,
        name: data.user.name,
        photoURL: data.user.photoURL,
      }));

      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";

  const roleColors = {
    admin: "from-red-500 to-orange-500",
    instructor: "from-blue-500 to-purple-500",
    student: "from-[#832388] to-[#F0772F]",
  };

  const roleLabel = {
    admin: "Administrator",
    instructor: "Instructor",
    student: "Student",
  };

  if (loading) {
    return (
      <>
        
        <div className="min-h-screen bg-white dark:bg-[#05010D] flex items-center justify-center transition-colors">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
      
        <div className="min-h-screen bg-white dark:bg-[#05010D] flex items-center justify-center transition-colors">
          <p className="text-gray-400 dark:text-gray-400">Profile not found. Please login again.</p>
        </div>
    
      </>
    );
  }

  return (
    <>
      
      <div className="min-h-screen bg-white dark:bg-[#05010D] py-10 px-4 transition-colors">
        <div className="max-w-4xl mx-auto space-y-6">

        {/* ===== TOP CARD ===== */}
        <div className="relative bg-gray-50 dark:bg-[#120B1E] border border-gray-200 dark:border-[#2D2438] rounded-3xl overflow-hidden transition-colors">
          {/* Banner */}
          <div className={`h-32 bg-gradient-to-r ${roleColors[user.role]} opacity-80`} />

          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-14 mb-5">
              <div className="relative">
                {isEditing && form.photoURL ? (
                  <img src={form.photoURL} alt={user.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-[#120B1E] shadow-xl" />
                ) : user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-[#120B1E] shadow-xl" />
                ) : (
                  <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white border-4 border-gray-50 dark:border-[#120B1E] shadow-xl bg-gradient-to-br ${roleColors[user.role]}`}>
                    {firstLetter}
                  </div>
                )}
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-1.5 rounded-lg cursor-pointer hover:bg-purple-700 transition">
                    <Camera size={14} />
                  </label>
                )}
              </div>

              {/* Edit Button */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-white rounded-xl text-sm font-medium transition border border-gray-300 dark:border-white/10"
                >
                  <Pencil size={14} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setIsEditing(false); setForm({ name: user.name, phone: user.phone || "", photoURL: user.photoURL || "" }); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-white rounded-xl text-sm font-medium transition border border-gray-300 dark:border-white/10"
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#832388] to-[#F0772F] text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
                  >
                    <Check size={14} /> {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            {/* Name & Role */}
            {isEditing ? (
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-2xl font-bold bg-transparent border-b border-purple-500 text-gray-900 dark:text-white outline-none w-full mb-2"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h1>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${roleColors[user.role]}`}>
                {roleLabel[user.role]}
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</span>
              {user.provider === "google" && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/10">
                  Google Account
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ===== INFO CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Personal Info */}
          <div className="bg-gray-50 dark:bg-[#120B1E] border border-gray-200 dark:border-[#2D2438] rounded-3xl p-6 space-y-5 transition-colors">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg">Personal Information</h2>

            {/* Name */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                <User size={16} className="text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Full Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] rounded-lg px-3 py-1.5 text-gray-900 dark:text-white text-sm outline-none focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium text-sm">{user.name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Mail size={16} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Email Address</p>
                <p className="text-gray-900 dark:text-white font-medium text-sm">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <Phone size={16} className="text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Phone Number</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] rounded-lg px-3 py-1.5 text-gray-900 dark:text-white text-sm outline-none focus:border-purple-500"
                    placeholder="+880 1XXXXXXXXX"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium text-sm">{user.phone || "Not provided"}</p>
                )}
              </div>
            </div>

            {/* Photo URL (editing only) */}
            {isEditing && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Camera size={16} className="text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Photo URL</p>
                  <input
                    type="url"
                    value={form.photoURL}
                    onChange={(e) => setForm({ ...form, photoURL: e.target.value })}
                    className="w-full bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] rounded-lg px-3 py-1.5 text-gray-900 dark:text-white text-sm outline-none focus:border-purple-500"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-gray-50 dark:bg-[#120B1E] border border-gray-200 dark:border-[#2D2438] rounded-3xl p-6 space-y-5 transition-colors">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg">Account Information</h2>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
                <Shield size={16} className="text-pink-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Role</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${roleColors[user.role]}`}>
                  {roleLabel[user.role]}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                <LogIn size={16} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Login Provider</p>
                <p className="text-gray-900 dark:text-white font-medium text-sm capitalize">{user.provider}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                <Clock size={16} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Member Since</p>
                <p className="text-gray-900 dark:text-white font-medium text-sm">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                <User size={16} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">User ID</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs font-mono truncate max-w-[180px]">{user._id}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>
    
    </>
  );
}