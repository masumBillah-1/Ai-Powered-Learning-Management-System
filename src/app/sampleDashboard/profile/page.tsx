"use client";
import { useState, useEffect } from "react";

type Role = "student" | "instructor" | "admin";

interface UserData {
  name: string;
  email: string;
  photoURL?: string;
  role: string;
  phone?: string;
  bio?: string;
}

// ─── Role stats ───────────────────────────────────────────────────────────────
const roleStats: Record<Role, { label: string; value: string; icon: string; color: string }[]> = {
  student: [
    { label: "Enrolled",     value: "5",   icon: "📚", color: "#FF0F7B" },
    { label: "Completed",    value: "2",   icon: "✅", color: "#00C48C" },
    { label: "Certificates", value: "2",   icon: "🏆", color: "#F89B29" },
    { label: "Avg Score",    value: "82%", icon: "🎯", color: "#832388" },
  ],
  instructor: [
    { label: "Courses",  value: "4",    icon: "📚", color: "#FF0F7B" },
    { label: "Students", value: "320",  icon: "🎓", color: "#832388" },
    { label: "Rating",   value: "4.8",  icon: "⭐", color: "#F89B29" },
    { label: "Earnings", value: "৳48k", icon: "💰", color: "#00C48C" },
  ],
  admin: [
    { label: "Total Users",   value: "1,278", icon: "👥", color: "#FF0F7B" },
    { label: "Courses Live",  value: "94",    icon: "📚", color: "#832388" },
    { label: "Revenue",       value: "৳4.8L", icon: "💰", color: "#F89B29" },
    { label: "Pending Tasks", value: "3",     icon: "⚡", color: "#E3436B" },
  ],
};

// ─── Role activity ─────────────────────────────────────────────────────────────
const roleActivity: Record<Role, { text: string; time: string; icon: string }[]> = {
  student: [
    { text: "Scored 85% on HTML Basics Quiz",    time: "2 days ago",  icon: "🎯" },
    { text: "Submitted Todo App Assignment",       time: "5 days ago",  icon: "📝" },
    { text: "Enrolled in Python for Beginners",    time: "1 week ago",  icon: "📚" },
    { text: "Earned Web Fundamentals Certificate", time: "2 weeks ago", icon: "🏆" },
  ],
  instructor: [
    { text: "Rahim submitted Build a Todo App",         time: "1 day ago",   icon: "📝" },
    { text: "New student enrolled in Web Dev Bootcamp", time: "3 days ago",  icon: "🎓" },
    { text: "Published Python for Beginners course",    time: "1 week ago",  icon: "🚀" },
    { text: "Received payout of ৳5,000",                time: "2 weeks ago", icon: "💸" },
  ],
  admin: [
    { text: "Approved payout for Karim Hossain", time: "2 hours ago", icon: "💸" },
    { text: "Approved course: React Advanced",   time: "1 day ago",   icon: "✅" },
    { text: "Verified instructor: Sadia Islam",  time: "2 days ago",  icon: "👨‍🏫" },
    { text: "Blocked suspicious user account",   time: "3 days ago",  icon: "🚫" },
  ],
};

const roleBadge: Record<Role, { bg: string; color: string; label: string }> = {
  student:    { bg: "#fff5f8", color: "#FF0F7B", label: "Student"    },
  instructor: { bg: "#f5f0ff", color: "#832388", label: "Instructor" },
  admin:      { bg: "#fff8f0", color: "#F89B29", label: "Admin"      },
};

// ─── Input Field ──────────────────────────────────────────────────────────────
const Field = ({ label, value, onChange, type = "text", multiline = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; multiline?: boolean;
}) => (
  <div>
    <label style={{ fontSize: "12px", fontWeight: "700", color: "#888", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
      {label}
    </label>
    {multiline ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e5e5e5", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e5e5e5", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
    )}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [user, setUser]     = useState<UserData | null>(null);
  const [role, setRole]     = useState<Role>("student");
  const [editMode, setEditMode] = useState(false);
  const [name,  setName]    = useState("");
  const [phone, setPhone]   = useState("");
  const [bio,   setBio]     = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed: UserData = JSON.parse(saved);
      setUser(parsed);
      setName(parsed.name || "");
      setPhone(parsed.phone || "");
      setBio(parsed.bio || "");
    }

    // ── sidebar এ যে role select করা আছে সেটা নাও ──
    const dashRole = localStorage.getItem("dashboardRole");
    if (dashRole === "student" || dashRole === "instructor" || dashRole === "admin") {
      setRole(dashRole as Role);
    }
  }, []);

  // storage event — sidebar role change হলে এই page update হবে
  useEffect(() => {
    const onStorage = () => {
      const dashRole = localStorage.getItem("dashboardRole");
      if (dashRole === "student" || dashRole === "instructor" || dashRole === "admin") {
        setRole(dashRole as Role);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // polling fallback (same-tab localStorage change detect)
  useEffect(() => {
    const interval = setInterval(() => {
      const dashRole = localStorage.getItem("dashboardRole");
      if (dashRole && dashRole !== role) {
        if (dashRole === "student" || dashRole === "instructor" || dashRole === "admin") {
          setRole(dashRole as Role);
        }
      }
    }, 300);
    return () => clearInterval(interval);
  }, [role]);

  const handleSave = () => {
    if (!user) return;
    const updated = { ...user, name, phone, bio };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setEditMode(false);
  };

  if (!user) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
      <p style={{ color: "#aaa" }}>Loading profile...</p>
    </div>
  );

  const badge    = roleBadge[role];
  const stats    = roleStats[role];
  const activity = roleActivity[role];
  const firstLetter = (user.name || user.email || "?").charAt(0).toUpperCase();
  const showPhoto = !!user.photoURL && !imgError;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: "920px" }}>

      {/* ── Cover + Avatar Card ─────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", marginBottom: "16px", position: "relative" }}>

        {/* Cover — solid color */}
        <div style={{
          height: "130px",
          background: "#FF0F7B",
          borderRadius: "16px 16px 0 0",
        }} />

        {/* Avatar — absolute, cover এর উপরে থাকবে */}
        <div style={{
          position: "absolute", top: "80px", left: "28px",
          width: "96px", height: "96px", borderRadius: "50%",
          border: "4px solid #fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          overflow: "hidden",
          background: "linear-gradient(135deg, #FF0F7B, #F89B29)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}>
          {showPhoto ? (
            <img
              src={user.photoURL}
              alt={user.name}
              onError={() => setImgError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <span style={{ color: "#fff", fontWeight: "800", fontSize: "34px", lineHeight: 1 }}>
              {firstLetter}
            </span>
          )}
        </div>

        {/* Edit button */}
        <div style={{ position: "absolute", top: "148px", right: "28px" }}>
          <button onClick={() => setEditMode(!editMode)} style={{
            padding: "9px 22px", borderRadius: "8px", border: "none", cursor: "pointer",
            fontWeight: "700", fontSize: "14px",
            background: editMode ? "#f0f0f0" : "linear-gradient(90deg, #FF0F7B, #F89B29)",
            color: editMode ? "#555" : "#fff",
          }}>
            {editMode ? "✕ Cancel" : "✏️ Edit Profile"}
          </button>
        </div>

        <div style={{ padding: "64px 28px 28px" }}>
          <div style={{ marginBottom: "14px" }} />

          {/* Name + meta */}
          <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: "800", color: "#1a1a1a" }}>
            {user.name}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ padding: "3px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", background: badge.bg, color: badge.color }}>
              {badge.label}
            </span>
            <span style={{ fontSize: "13px", color: "#888" }}>📧 {user.email}</span>
            {user.phone && <span style={{ fontSize: "13px", color: "#888" }}>📞 {user.phone}</span>}
          </div>
          {user.bio && (
            <p style={{ margin: 0, fontSize: "14px", color: "#666", lineHeight: "1.6", maxWidth: "560px" }}>{user.bio}</p>
          )}
        </div>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: "12px", padding: "16px 18px", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", background: s.color + "18", flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "11px", color: "#aaa", fontWeight: "600", textTransform: "uppercase" }}>{s.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: "18px", fontWeight: "800", color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom ──────────────────────────────────────────────────────── */}
      {editMode ? (
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", padding: "28px" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "800" }}>Edit Profile</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Full Name" value={name} onChange={setName} />
            <Field label="Phone" value={phone} onChange={setPhone} />
          </div>
          <div style={{ marginTop: "16px" }}>
            <Field label="Bio" value={bio} onChange={setBio} multiline />
          </div>
          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #f0f0f0" }}>
            <h4 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "700", color: "#555" }}>Change Password</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
              <Field label="Current Password" value="" onChange={() => {}} type="password" />
              <Field label="New Password"     value="" onChange={() => {}} type="password" />
              <Field label="Confirm Password" value="" onChange={() => {}} type="password" />
            </div>
          </div>
          <button onClick={handleSave} style={{
            marginTop: "22px", width: "100%", padding: "12px", borderRadius: "8px",
            border: "none", cursor: "pointer",
            background: "linear-gradient(90deg, #FF0F7B, #F89B29)",
            color: "#fff", fontWeight: "700", fontSize: "15px",
          }}>
            💾 Save Changes
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "16px" }}>

          {/* Account Info */}
          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", padding: "24px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "800" }}>Account Info</h3>
            <p style={{ margin: "0 0 18px", fontSize: "13px", color: "#aaa" }}>Your personal details</p>
            {[
              { label: "Full Name", value: user.name,           icon: "👤" },
              { label: "Email",     value: user.email,          icon: "📧" },
              { label: "Phone",     value: user.phone || "—",   icon: "📞" },
              { label: "Role",      value: badge.label,         icon: "🎭" },
              { label: "Bio",       value: user.bio   || "—",   icon: "📄" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", gap: "14px", padding: "13px 0", borderBottom: "1px solid #f7f7f7", alignItems: "flex-start" }}>
                <span style={{ fontSize: "18px", marginTop: "1px" }}>{item.icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: "11px", color: "#aaa", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</p>
                  <p style={{ margin: "3px 0 0", fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", padding: "24px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "800" }}>Recent Activity</h3>
            <p style={{ margin: "0 0 18px", fontSize: "13px", color: "#aaa" }}>Your latest actions</p>
            {activity.map((a, i) => (
              <div key={i} style={{
                display: "flex", gap: "12px", alignItems: "flex-start",
                padding: "12px 0", borderBottom: i < activity.length - 1 ? "1px solid #f7f7f7" : "none",
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "8px", flexShrink: 0,
                  background: "linear-gradient(135deg, #FF0F7B12, #F89B2912)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px",
                }}>{a.icon}</div>
                <div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#333", fontWeight: "500", lineHeight: "1.5" }}>{a.text}</p>
                  <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#bbb" }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}