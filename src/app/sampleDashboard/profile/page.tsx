"use client";
import { useState, useEffect } from "react";
import { Check, Pencil, X, Mail, Phone, MapPin, Clock } from "lucide-react";

type Role = "student" | "instructor" | "admin";
interface UserData { name: string; email: string; photoURL?: string; role: string; phone?: string; bio?: string; }

const roleStats: Record<Role, { label: string; value: string; color: string }[]> = {
  student:    [{ label: "Enrolled", value: "5", color: "#FF0F7B" }, { label: "Completed", value: "2", color: "#00C48C" }, { label: "Certificates", value: "2", color: "#F89B29" }, { label: "Avg Score", value: "82%", color: "#832388" }],
  instructor: [{ label: "Courses", value: "4", color: "#FF0F7B" }, { label: "Students", value: "320", color: "#832388" }, { label: "Rating", value: "4.8", color: "#F89B29" }, { label: "Earnings", value: "৳48k", color: "#00C48C" }],
  admin:      [{ label: "Users", value: "1,278", color: "#FF0F7B" }, { label: "Courses", value: "94", color: "#832388" }, { label: "Revenue", value: "৳4.8L", color: "#F89B29" }, { label: "Pending", value: "3", color: "#E3436B" }],
};

const roleActivity: Record<Role, { text: string; time: string; color: string }[]> = {
  student:    [{ text: "Scored 85% on HTML Basics Quiz", time: "2 days ago", color: "#832388" }, { text: "Submitted Todo App Assignment", time: "5 days ago", color: "#F89B29" }, { text: "Enrolled in Python for Beginners", time: "1 week ago", color: "#00C48C" }, { text: "Earned Web Fundamentals Certificate", time: "2 weeks ago", color: "#FF0F7B" }],
  instructor: [{ text: "Rahim submitted Build a Todo App", time: "1 day ago", color: "#832388" }, { text: "New student enrolled in Web Dev Bootcamp", time: "3 days ago", color: "#F89B29" }, { text: "Published Python for Beginners course", time: "1 week ago", color: "#00C48C" }, { text: "Received payout of ৳5,000", time: "2 weeks ago", color: "#FF0F7B" }],
  admin:      [{ text: "Approved payout for Karim Hossain", time: "2 hours ago", color: "#00C48C" }, { text: "Approved course: React Advanced", time: "1 day ago", color: "#832388" }, { text: "Verified instructor: Sadia Islam", time: "2 days ago", color: "#F89B29" }, { text: "Blocked suspicious user account", time: "3 days ago", color: "#FF0F7B" }],
};

const roleCfg: Record<Role, { accent: string; label: string }> = {
  student:    { accent: "#FF0F7B", label: "Student"    },
  instructor: { accent: "#832388", label: "Instructor" },
  admin:      { accent: "#F89B29", label: "Admin"      },
};

export default function ProfilePage() {
  const [user, setUser]     = useState<UserData | null>(null);
  const [role, setRole]     = useState<Role>("student");
  const [theme, setTheme]   = useState("light");
  const [editMode, setEdit] = useState(false);
  const [name, setName]     = useState("");
  const [phone, setPhone]   = useState("");
  const [bio, setBio]       = useState("");
  const [imgError, setErr]  = useState(false);
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("theme") || "light";
    const r = (localStorage.getItem("dashboardRole") as Role) || "student";
    setTheme(t); setRole(r);
    document.documentElement.setAttribute("data-theme", t);
    const u = localStorage.getItem("user");
    if (u) { const p: UserData = JSON.parse(u); setUser(p); setName(p.name||""); setPhone(p.phone||""); setBio(p.bio||""); }
    const iv = setInterval(() => {
      const ct = localStorage.getItem("theme") || "light";
      const cr = (localStorage.getItem("dashboardRole") as Role) || "student";
      if (ct !== theme) { setTheme(ct); document.documentElement.setAttribute("data-theme", ct); }
      if (cr !== role) setRole(cr);
    }, 100);
    return () => clearInterval(iv);
  }, [theme, role]);

  const handleSave = () => {
    if (!user) return;
    const updated = { ...user, name, phone, bio };
    setUser(updated); localStorage.setItem("user", JSON.stringify(updated));
    setSaved(true); setTimeout(() => { setSaved(false); setEdit(false); }, 1200);
  };

  if (!user) return <div className="flex items-center justify-center h-48 opacity-30 text-sm font-semibold">Loading…</div>;

  const stats    = roleStats[role];
  const activity = roleActivity[role];
  const cfg      = roleCfg[role];
  const letter   = (user.name || user.email || "?").charAt(0).toUpperCase();
  const showPhoto = !!user.photoURL && !imgError;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">

      {/* ── Hero Card ── */}
      <div className="rounded-3xl bg-base-100 border border-base-300 overflow-hidden mb-5">

        {/* Cover — mesh gradient with geometric accent */}
        <div className="relative h-36 overflow-hidden" style={{ background: `linear-gradient(135deg, ${cfg.accent}22 0%, #83238822 50%, #F89B2922 100%)` }}>
          {/* decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: cfg.accent }} />
          <div className="absolute top-4 right-24 w-16 h-16 rounded-full opacity-10" style={{ background: "#832388" }} />
          <div className="absolute -bottom-4 left-32 w-24 h-24 rounded-full opacity-10" style={{ background: "#F89B29" }} />
          {/* role watermark */}
          <span className="absolute bottom-3 right-5 text-5xl font-black opacity-5 select-none uppercase tracking-widest">{cfg.label}</span>
        </div>

        {/* Avatar + Info row */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl border-4 border-base-100 flex items-center justify-center text-white text-3xl font-black overflow-hidden shadow-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg,${cfg.accent},#F89B29)` }}
            >
              {showPhoto
                ? <img src={user.photoURL} alt={user.name} onError={() => setErr(true)} className="w-full h-full object-cover" />
                : letter
              }
            </div>

            {/* Edit btn */}
            <button
              onClick={() => setEdit(v => !v)}
              className="btn btn-sm gap-1.5 border-0 cursor-pointer text-white mb-1"
              style={{ backgroundColor: editMode ? "#64748b" : cfg.accent }}
            >
              {editMode ? <><X size={13} /> Cancel</> : <><Pencil size={13} /> Edit Profile</>}
            </button>
          </div>

          {/* Name + badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
            <span
              className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider text-white"
              style={{ backgroundColor: cfg.accent }}
            >
              {cfg.label}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5 text-xs opacity-50 font-medium"><Mail size={12} /> {user.email}</span>
            {user.phone && <span className="flex items-center gap-1.5 text-xs opacity-50 font-medium"><Phone size={12} /> {user.phone}</span>}
          </div>
          {user.bio && <p className="text-sm opacity-60 mt-2 max-w-lg leading-relaxed">{user.bio}</p>}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map((s, i) => (
          <div key={s.label} className="rounded-2xl bg-base-100 border border-base-300 p-5 overflow-hidden relative group">
            {/* left accent bar */}
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl" style={{ background: s.color }} />
            <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 pl-2">{s.label}</p>
            <p className="text-3xl font-black pl-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Edit Form ── */}
      {editMode && (
        <div className="rounded-2xl bg-base-100 border border-base-300 p-6 mb-5">
          <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-5">Edit Profile</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[{ label: "Full Name", val: name, set: setName, type: "text" }, { label: "Phone", val: phone, set: setPhone, type: "tel" }].map(f => (
              <div key={f.label}>
                <label className="text-xs font-bold opacity-50 block mb-1.5">{f.label}</label>
                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                  className="input input-sm w-full bg-base-200 border-base-300 focus:outline-none" />
              </div>
            ))}
          </div>
          <div className="mb-5">
            <label className="text-xs font-bold opacity-50 block mb-1.5">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="textarea w-full bg-base-200 border-base-300 text-sm focus:outline-none resize-none" />
          </div>
          <button onClick={handleSave} className="btn btn-sm gap-2 w-full border-0 text-white cursor-pointer font-bold" style={{ backgroundColor: cfg.accent }}>
            {saved ? <><Check size={13} /> Saved!</> : <><Check size={13} /> Save Changes</>}
          </button>
        </div>
      )}

      {/* ── Info + Activity ── */}
      {!editMode && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Account Info — 2 cols */}
          <div className="lg:col-span-2 rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
            <div className="px-5 py-4 border-b border-base-300">
              <p className="text-xs font-black uppercase tracking-widest opacity-40">Account Info</p>
            </div>
            {[
              { label: "Full Name", value: user.name,         icon: <User size={13}/> },
              { label: "Email",     value: user.email,        icon: <Mail size={13}/> },
              { label: "Phone",     value: user.phone || "—", icon: <Phone size={13}/> },
              { label: "Role",      value: cfg.label,         icon: <MapPin size={13}/> },
              { label: "Bio",       value: user.bio || "—",   icon: <Clock size={13}/> },
            ].map((item, i, arr) => (
              <div key={item.label} className={`flex items-start gap-3 px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-base-300" : ""}`}>
                <span className="opacity-30 mt-0.5 flex-shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold opacity-40 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold mt-0.5 break-words">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Activity — 3 cols */}
          <div className="lg:col-span-3 rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
            <div className="px-5 py-4 border-b border-base-300">
              <p className="text-xs font-black uppercase tracking-widest opacity-40">Recent Activity</p>
            </div>
            <div className="p-5 space-y-1">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-4 py-3 group">
                  {/* timeline */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full mt-1" style={{ backgroundColor: a.color }} />
                    {i < activity.length - 1 && <div className="w-px flex-1 mt-1 bg-base-300" style={{ minHeight: "24px" }} />}
                  </div>
                  <div className="pb-3 flex-1">
                    <p className="text-sm font-semibold leading-snug">{a.text}</p>
                    <p className="text-xs opacity-40 mt-0.5 flex items-center gap-1"><Clock size={10} /> {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// tiny icon stub to avoid import error if lucide doesn't have User
function User({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
}