"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {
  User as UserIcon, Mail, Phone, Clock, Loader2, AlertCircle,
  BookOpen, Award, DollarSign, Users, TrendingUp, Calendar,
  Globe, Linkedin, Github, Twitter, Briefcase, GraduationCap,
  Save, X, Edit2, MapPin
} from "lucide-react";

type Role = "student" | "instructor" | "admin";

interface ProfileFormData {
  name: string;
  phone: string;
  bio: string;
  expertise: string;
  experience: number;
  education: string;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: Role;
  phone?: string;
  profile?: {
    bio?: string;
    expertise?: string[];
    experience?: number;
    education?: string;
    socialLinks?: {
      website?: string;
      linkedin?: string;
      github?: string;
      twitter?: string;
    };
  };
  stats?: {
    // Instructor
    totalCourses?: number;
    totalStudents?: number;
    totalEarnings?: number;
    rating?: number;
    reviewCount?: number;
    // Student
    enrolledCourses?: number;
    completedCourses?: number;
    certificatesEarned?: number;
    totalLearningTime?: number;
    joinedAt?: string;
    lastActiveAt?: string;
    // Admin
    totalUsers?: number;
    totalRevenue?: number;
    activeUsers?: number;
  };
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: "light" | "dark" | "system";
    language: "en" | "bn";
    timezone?: string;
  };
  createdAt?: string;
}

const roleCfg: Record<Role, { accent: string; label: string; bg: string }> = {
  student: { accent: "#FF0F7B", label: "Student", bg: "rgba(255,15,123,0.08)" },
  instructor: { accent: "#832388", label: "Instructor", bg: "rgba(131,35,136,0.08)" },
  admin: { accent: "#F89B29", label: "Admin", bg: "rgba(248,155,41,0.08)" },
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormData>();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile", { credentials: "include" });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);

        // Set form default values
        reset({
          name: data.user.name || "",
          phone: data.user.phone || "",
          bio: data.user.profile?.bio || "",
          expertise: data.user.profile?.expertise?.join(", ") || "",
          experience: data.user.profile?.experience || 0,
          education: data.user.profile?.education || "",
          website: data.user.profile?.socialLinks?.website || "",
          linkedin: data.user.profile?.socialLinks?.linkedin || "",
          github: data.user.profile?.socialLinks?.github || "",
          twitter: data.user.profile?.socialLinks?.twitter || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: ProfileFormData) => {
    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone || null,
        profile: {
          bio: formData.bio || undefined,
          expertise: formData.expertise ? formData.expertise.split(",").map(s => s.trim()).filter(Boolean) : undefined,
          experience: formData.experience > 0 ? formData.experience : undefined,
          education: formData.education || undefined,
          socialLinks: {
            website: formData.website || undefined,
            linkedin: formData.linkedin || undefined,
            github: formData.github || undefined,
            twitter: formData.twitter || undefined,
          },
        },
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Profile updated successfully!");
        setEditMode(false);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#832388" }} />
          <p className="text-sm opacity-60">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-bold mb-2">Failed to load profile</p>
          <button onClick={fetchUserData} className="btn btn-sm" style={{ backgroundColor: "#832388", color: "white" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const cfg = roleCfg[user.role];
  const letter = (user.name || user.email || "?").charAt(0).toUpperCase();
  const showPhoto = !!user.photoURL && !imgErr;

  // Calculate stats based on role
  const getStats = () => {
    if (user.role === "student") {
      return [
        { label: "Enrolled", value: user.stats?.enrolledCourses || 0, icon: BookOpen, color: "#FF0F7B" },
        { label: "Completed", value: user.stats?.completedCourses || 0, icon: Award, color: "#00C48C" },
        { label: "Certificates", value: user.stats?.certificatesEarned || 0, icon: Award, color: "#F89B29" },
        { label: "Learning Time", value: `${Math.floor((user.stats?.totalLearningTime || 0) / 60)}h ${(user.stats?.totalLearningTime || 0) % 60}m`, icon: Clock, color: "#832388" },
      ];
    } else if (user.role === "instructor") {
      return [
        { label: "Courses", value: user.stats?.totalCourses || 0, icon: BookOpen, color: "#FF0F7B" },
        { label: "Students", value: user.stats?.totalStudents || 0, icon: Users, color: "#832388" },
        { label: "Rating", value: user.stats?.rating?.toFixed(1) || "0.0", icon: Award, color: "#F89B29" },
        { label: "Earnings", value: `৳${(user.stats?.totalEarnings || 0).toLocaleString()}`, icon: DollarSign, color: "#00C48C" },
      ];
    } else {
      // Admin
      return [
        { label: "Total Users", value: user.stats?.totalUsers ?? "—", icon: Users, color: "#FF0F7B" },
        { label: "Published Courses", value: user.stats?.totalCourses ?? "—", icon: BookOpen, color: "#832388" },
        { label: "Revenue", value: user.stats?.totalRevenue !== undefined ? `৳${user.stats.totalRevenue.toLocaleString()}` : "—", icon: DollarSign, color: "#F89B29" },
        { label: "Active (30d)", value: user.stats?.activeUsers ?? "—", icon: TrendingUp, color: "#00C48C" },
      ];
    }
  };

  const stats = getStats();

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />

      {/* Hero Card */}
      <div className="rounded-3xl border border-base-300 overflow-hidden mb-5 shadow-sm bg-base-100">
        <div className="relative h-36 overflow-hidden" style={{
          background: `linear-gradient(135deg, ${cfg.accent}22 0%, #83238822 50%, #F89B2922 100%)`,
        }}>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: cfg.accent }} />
          <div className="absolute top-4 right-24 w-16 h-16 rounded-full opacity-10" style={{ background: "#832388" }} />
          <div className="absolute -bottom-4 left-32 w-24 h-24 rounded-full opacity-10" style={{ background: "#F89B29" }} />
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4 flex-wrap gap-3">
            <div className="w-20 h-20 rounded-2xl border-4 border-base-100 flex items-center justify-center text-white text-3xl font-black overflow-hidden shadow-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${cfg.accent}, #F89B29)` }}>
              {showPhoto
                ? <img src={user.photoURL} alt={user.name} onError={() => setImgErr(true)} className="w-full h-full object-cover" />
                : letter}
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="btn btn-sm gap-1.5 border-0 cursor-pointer text-white mb-1"
              style={{ backgroundColor: editMode ? "#64748b" : cfg.accent }}>
              {editMode ? <><X size={13} /> Cancel</> : <><Edit2 size={13} /> Edit Profile</>}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
            <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider text-white"
              style={{ backgroundColor: cfg.accent }}>
              {cfg.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mb-2">
            <span className="flex items-center gap-1.5 text-xs opacity-50 font-medium">
              <Mail size={12} /> {user.email}
            </span>
            {user.phone && (
              <span className="flex items-center gap-1.5 text-xs opacity-50 font-medium">
                <Phone size={12} /> {user.phone}
              </span>
            )}
            {user.createdAt && (
              <span className="flex items-center gap-1.5 text-xs opacity-50 font-medium">
                <Calendar size={12} /> Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            )}
          </div>
          {user.profile?.bio && (
            <p className="text-sm opacity-60 mt-2 max-w-2xl leading-relaxed">{user.profile.bio}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl bg-base-100 border border-base-300 p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl" style={{ background: s.color }} />
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-widest opacity-40">{s.label}</p>
              <s.icon size={16} style={{ color: s.color, opacity: 0.3 }} />
            </div>
            <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editMode && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-base-100 border border-base-300 p-6 mb-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-5 flex items-center gap-2">
            <Edit2 size={14} /> Edit Profile Information
          </p>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold opacity-50 block mb-1.5 flex items-center gap-1">
                <UserIcon size={12} /> Full Name *
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="input input-sm w-full bg-base-200 border-base-300 focus:outline-none focus:border-purple-400"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-xs font-bold opacity-50 block mb-1.5 flex items-center gap-1">
                <Phone size={12} /> Phone Number
              </label>
              <input
                type="tel"
                {...register("phone")}
                className="input input-sm w-full bg-base-200 border-base-300 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="text-xs font-bold opacity-50 block mb-1.5">Bio</label>
            <textarea
              {...register("bio")}
              rows={3}
              placeholder="Tell us about yourself..."
              className="textarea w-full bg-base-200 border-base-300 text-sm focus:outline-none resize-none focus:border-purple-400"
            />
          </div>

          {/* Professional Info (for instructor/admin) */}
          {(user.role === "instructor" || user.role === "admin") && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold opacity-50 block mb-1.5 flex items-center gap-1">
                    <Briefcase size={12} /> Expertise (comma separated)
                  </label>
                  <input
                    type="text"
                    {...register("expertise")}
                    placeholder="e.g. React, Node.js, Python"
                    className="input input-sm w-full bg-base-200 border-base-300 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold opacity-50 block mb-1.5 flex items-center gap-1">
                    <Clock size={12} /> Years of Experience
                  </label>
                  <input
                    type="number"
                    {...register("experience", { min: 0, max: 50 })}
                    className="input input-sm w-full bg-base-200 border-base-300 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold opacity-50 block mb-1.5 flex items-center gap-1">
                  <GraduationCap size={12} /> Education
                </label>
                <input
                  type="text"
                  {...register("education")}
                  placeholder="e.g. BSc in Computer Science"
                  className="input input-sm w-full bg-base-200 border-base-300 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Social Links */}
              <p className="text-xs font-bold opacity-40 uppercase tracking-wider mb-3 mt-5">Social Links</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold opacity-50 block mb-1.5 flex items-center gap-1">
                    <Globe size={12} /> Website
                  </label>
                  <input
                    type="url"
                    {...register("website")}
                    placeholder="https://yourwebsite.com"
                    className="input input-sm w-full bg-base-200 border-base-300 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold opacity-50 block mb-1.5 flex items-center gap-1">
                    <Linkedin size={12} /> LinkedIn
                  </label>
                  <input
                    type="url"
                    {...register("linkedin")}
                    placeholder="https://linkedin.com/in/username"
                    className="input input-sm w-full bg-base-200 border-base-300 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold opacity-50 block mb-1.5 flex items-center gap-1">
                    <Github size={12} /> GitHub
                  </label>
                  <input
                    type="url"
                    {...register("github")}
                    placeholder="https://github.com/username"
                    className="input input-sm w-full bg-base-200 border-base-300 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold opacity-50 block mb-1.5 flex items-center gap-1">
                    <Twitter size={12} /> Twitter
                  </label>
                  <input
                    type="url"
                    {...register("twitter")}
                    placeholder="https://twitter.com/username"
                    className="input input-sm w-full bg-base-200 border-base-300 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-sm gap-2 w-full border-0 text-white cursor-pointer font-bold disabled:opacity-50"
            style={{ backgroundColor: cfg.accent }}>
            {isSubmitting ? (
              <><Loader2 size={13} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={13} /> Save Changes</>
            )}
          </button>
        </form>
      )}

      {/* Profile Details */}
      {!editMode && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Account Info */}
          <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-base-300">
              <p className="text-xs font-black uppercase tracking-widest opacity-40">Account Information</p>
            </div>
            <div className="divide-y divide-base-300">
              {[
                { label: "Full Name", value: user.name, icon: UserIcon },
                { label: "Email", value: user.email, icon: Mail },
                { label: "Phone", value: user.phone || "Not provided", icon: Phone },
                { label: "Role", value: cfg.label, icon: UserIcon, badge: true },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 px-5 py-3.5">
                  <item.icon size={13} className="opacity-30 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold opacity-40 uppercase tracking-wider">{item.label}</p>
                    {item.badge ? (
                      <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: cfg.accent }}>
                        {item.value}
                      </span>
                    ) : (
                      <p className="text-sm font-semibold mt-0.5 break-words">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Info */}
          <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-base-300">
              <p className="text-xs font-black uppercase tracking-widest opacity-40">
                {user.role === "instructor" ? "Professional Details" : "Additional Information"}
              </p>
            </div>
            <div className="p-5 space-y-4">
              {user.profile?.education && (
                <div>
                  <p className="text-xs font-bold opacity-40 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <GraduationCap size={12} /> Education
                  </p>
                  <p className="text-sm font-semibold">{user.profile.education}</p>
                </div>
              )}

              {user.profile?.experience !== undefined && user.profile.experience > 0 && (
                <div>
                  <p className="text-xs font-bold opacity-40 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Briefcase size={12} /> Experience
                  </p>
                  <p className="text-sm font-semibold">{user.profile.experience} years</p>
                </div>
              )}

              {user.profile?.expertise && user.profile.expertise.length > 0 && (
                <div>
                  <p className="text-xs font-bold opacity-40 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Award size={12} /> Expertise
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.expertise.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ backgroundColor: cfg.bg, color: cfg.accent }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user.profile?.socialLinks && (
                <div>
                  <p className="text-xs font-bold opacity-40 uppercase tracking-wider mb-2">Social Links</p>
                  <div className="space-y-2">
                    {user.profile.socialLinks.website && (
                      <a href={user.profile.socialLinks.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
                        <Globe size={14} style={{ color: cfg.accent }} />
                        <span className="truncate">{user.profile.socialLinks.website}</span>
                      </a>
                    )}
                    {user.profile.socialLinks.linkedin && (
                      <a href={user.profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
                        <Linkedin size={14} style={{ color: cfg.accent }} />
                        <span className="truncate">LinkedIn</span>
                      </a>
                    )}
                    {user.profile.socialLinks.github && (
                      <a href={user.profile.socialLinks.github} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
                        <Github size={14} style={{ color: cfg.accent }} />
                        <span className="truncate">GitHub</span>
                      </a>
                    )}
                    {user.profile.socialLinks.twitter && (
                      <a href={user.profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
                        <Twitter size={14} style={{ color: cfg.accent }} />
                        <span className="truncate">Twitter</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {!user.profile?.education && !user.profile?.experience && !user.profile?.expertise?.length && !user.profile?.socialLinks && (
                <div className="text-center py-8">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm opacity-40">No additional information provided</p>
                  <button onClick={() => setEditMode(true)} className="btn btn-xs mt-3" style={{ backgroundColor: cfg.accent, color: "white" }}>
                    Add Details
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
