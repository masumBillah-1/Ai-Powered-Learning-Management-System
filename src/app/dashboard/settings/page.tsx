"use client";
import { useState, useEffect } from "react";
import {
  User, Shield, Bell, Globe, CreditCard, Star,
  Upload, Trash2, Eye, EyeOff, Check, Lock,
  Smartphone, Plus, X
} from "lucide-react";

type Role = "student" | "instructor" | "admin";

export default function SettingsPage() {
  const [activeTab, setActiveTab]   = useState("Profile");
  const [role, setRole]             = useState<Role>("student");
  const [theme, setTheme]           = useState("light");
  const [showPw, setShowPw]         = useState({ current: false, new: false, confirm: false });
  const [education, setEducation]   = useState([{ degree: "", university: "", from: "", to: "" }]);
  const [notifs, setNotifs]         = useState({ email: true, push: true, assign: true, msg: false });
  const [twoFA, setTwoFA]           = useState({ app: true, sms: false });
  const [saved, setSaved]           = useState(false);

  // ── Dark/Light + Role sync ──
  useEffect(() => {
    const t = localStorage.getItem("theme") || "light";
    const r = (localStorage.getItem("dashboardRole") as Role) || "student";
    setTheme(t); setRole(r);
    document.documentElement.setAttribute("data-theme", t);

    const interval = setInterval(() => {
      const ct = localStorage.getItem("theme") || "light";
      const cr = (localStorage.getItem("dashboardRole") as Role) || "student";
      if (ct !== theme) { setTheme(ct); document.documentElement.setAttribute("data-theme", ct); }
      if (cr !== role) setRole(cr);
    }, 100);
    return () => clearInterval(interval);
  }, [theme, role]);

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs: Record<Role, { id: string; icon: React.ElementType }[]> = {
    student:    [{ id: "Profile", icon: User }, { id: "Security", icon: Shield }, { id: "Notifications", icon: Bell }, { id: "Social", icon: Globe }],
    instructor: [{ id: "Profile", icon: User }, { id: "Security", icon: Shield }, { id: "Notifications", icon: Bell }, { id: "Social", icon: Globe }, { id: "Plans", icon: Star }, { id: "Withdraw", icon: CreditCard }],
    admin:      [{ id: "Profile", icon: User }, { id: "Security", icon: Shield }, { id: "Notifications", icon: Bell }],
  };
  const currentTabs = tabs[role];

  // ── Save button ──
  const SaveBtn = ({ label = "Save Changes" }: { label?: string }) => (
    <button
      onClick={showSaved}
      className="btn btn-sm gap-2 border-0 text-white cursor-pointer"
      style={{ backgroundColor: "#832388" }}
    >
      {saved ? <><Check size={13} /> Saved!</> : <><Check size={13} /> {label}</>}
    </button>
  );

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Account</p>
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-sm opacity-50 mt-1">Manage your account preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap bg-base-200 p-1 rounded-xl mb-6 w-fit">
        {currentTabs.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
            style={activeTab === id ? { backgroundColor: "#832388", color: "#fff" } : {}}
          >
            <Icon size={13} /> {id}
          </button>
        ))}
      </div>

      {/* ── PROFILE ── */}
      {activeTab === "Profile" && (
        <div className="space-y-6">

          {/* Avatar */}
          <div className="rounded-2xl bg-base-100 border border-base-300 p-6">
            <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4">Profile Picture</p>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-black flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#FF0F7B,#F89B29)" }}
              >
                E
              </div>
              <div className="flex gap-2">
                <button className="btn btn-xs gap-1 cursor-pointer"><Upload size={12} /> Upload</button>
                <button className="btn btn-xs btn-ghost gap-1 cursor-pointer"><Trash2 size={12} /> Remove</button>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="rounded-2xl bg-base-100 border border-base-300 p-6">
            <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4">Personal Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "First Name", val: "Eugene",              type: "text"  },
                { label: "Last Name",  val: "Andre",               type: "text"  },
                { label: "Email",      val: "eugene@example.com",  type: "email" },
                { label: "Phone",      val: "+880-1712-345678",    type: "tel"   },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-1">
                  <label className="text-xs font-bold opacity-50">{f.label}</label>
                  <input type={f.type} defaultValue={f.val} className="input input-sm bg-base-200 border-base-300 focus:outline-none" />
                </div>
              ))}
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold opacity-50">Bio</label>
                <textarea defaultValue="Web developer with expertise in modern technologies." rows={3} className="textarea bg-base-200 border-base-300 text-sm focus:outline-none resize-none" />
              </div>
            </div>

            {/* Education */}
            {role !== "admin" && (
              <>
                <div className="divider my-4" />
                <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-3">Education</p>
                {education.map((_, i) => (
                  <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                    {["Degree", "University", "From", "To"].map((ph, j) => (
                      <div key={ph} className="relative">
                        <input placeholder={ph} className="input input-xs bg-base-200 border-base-300 w-full focus:outline-none" />
                        {j === 3 && (
                          <button onClick={() => setEducation(e => e.filter((_, k) => k !== i))} className="absolute -right-2 -top-2 btn btn-xs btn-circle btn-ghost cursor-pointer">
                            <X size={10} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <button onClick={() => setEducation(e => [...e, { degree: "", university: "", from: "", to: "" }])} className="btn btn-xs btn-ghost gap-1 cursor-pointer mt-1" style={{ color: "#832388" }}>
                  <Plus size={12} /> Add Education
                </button>
              </>
            )}

            <div className="mt-5"><SaveBtn label="Update Profile" /></div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl bg-base-100 border-2 border-error/30 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-error mb-1">Danger Zone</p>
            <p className="text-xs opacity-50 mb-4">Permanently delete your account. This cannot be undone.</p>
            <button className="btn btn-xs btn-error gap-1 cursor-pointer"><Trash2 size={12} /> Delete Account</button>
          </div>
        </div>
      )}

      {/* ── SECURITY ── */}
      {activeTab === "Security" && (
        <div className="space-y-6">

          {/* Password */}
          <div className="rounded-2xl bg-base-100 border border-base-300 p-6">
            <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4">Change Password</p>
            <div className="space-y-3 max-w-md">
              {(["current", "new", "confirm"] as const).map((key, i) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs font-bold opacity-50">{["Current Password", "New Password", "Confirm Password"][i]}</label>
                  <div className="relative">
                    <input type={showPw[key] ? "text" : "password"} placeholder="••••••••" className="input input-sm bg-base-200 border-base-300 w-full pr-10 focus:outline-none" />
                    <button onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 cursor-pointer">
                      {showPw[key] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5"><SaveBtn label="Update Password" /></div>
          </div>

          {/* 2FA */}
          <div className="rounded-2xl bg-base-100 border border-base-300 p-6">
            <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4">Two-Factor Authentication</p>
            {[
              { key: "app" as const,  icon: Smartphone, title: "Authenticator App", sub: "Use Google Authenticator or Authy" },
              { key: "sms" as const,  icon: Shield,      title: "SMS Authentication", sub: "Receive OTP on your mobile" },
            ].map(({ key, icon: Icon, title, sub }) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-base-200 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#832388", opacity: 0.8 }}>
                    <Icon size={15} color="#fff" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{title}</p>
                    <p className="text-xs opacity-50">{sub}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-sm cursor-pointer"
                  checked={twoFA[key]}
                  onChange={() => setTwoFA(s => ({ ...s, [key]: !s[key] }))}
                  style={twoFA[key] ? { backgroundColor: "#832388", borderColor: "#832388" } : {}}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {activeTab === "Notifications" && (
        <div className="rounded-2xl bg-base-100 border border-base-300 p-6">
          <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4">Notification Preferences</p>
          {[
            { key: "email" as const, label: "Email Notifications",  sub: "Receive updates via email"        },
            { key: "push"  as const, label: "Push Notifications",   sub: "Browser push notifications"       },
            { key: "assign"as const, label: "Assignment Updates",   sub: "New submissions and grades"       },
            { key: "msg"   as const, label: "Direct Messages",      sub: "Notifications for new messages"   },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-base-300 last:border-0">
              <div>
                <p className="text-sm font-bold">{label}</p>
                <p className="text-xs opacity-50">{sub}</p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-sm cursor-pointer"
                checked={notifs[key]}
                onChange={() => setNotifs(s => ({ ...s, [key]: !s[key] }))}
                style={notifs[key] ? { backgroundColor: "#832388", borderColor: "#832388" } : {}}
              />
            </div>
          ))}
          <div className="mt-5"><SaveBtn label="Save Preferences" /></div>
        </div>
      )}

      {/* ── SOCIAL ── */}
      {activeTab === "Social" && (
        <div className="rounded-2xl bg-base-100 border border-base-300 p-6">
          <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4">Social Profiles</p>
          <div className="space-y-3 max-w-md">
            {[
              { label: "Website",  emoji: "🌐", ph: "https://yoursite.com"         },
              { label: "LinkedIn", emoji: "💼", ph: "https://linkedin.com/in/..."  },
              { label: "Twitter",  emoji: "🐦", ph: "https://twitter.com/..."      },
              { label: "GitHub",   emoji: "🐙", ph: "https://github.com/..."       },
            ].map(({ label, emoji, ph }) => (
              <div key={label} className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-50">{emoji} {label}</label>
                <input type="url" placeholder={ph} className="input input-sm bg-base-200 border-base-300 focus:outline-none" />
              </div>
            ))}
          </div>
          <div className="mt-5"><SaveBtn label="Save Links" /></div>
        </div>
      )}

      {/* ── PLANS (instructor) ── */}
      {activeTab === "Plans" && role === "instructor" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Free",       price: "$0",     features: ["3 courses", "Basic analytics"],                                   current: false },
            { name: "Pro",        price: "$19/mo", features: ["Unlimited courses", "Advanced analytics", "Priority support"],    current: true  },
            { name: "Enterprise", price: "$49/mo", features: ["Everything in Pro", "White labeling", "API access"],              current: false },
          ].map(p => (
            <div key={p.name} className={`rounded-2xl bg-base-100 p-6 border-2 ${p.current ? "" : "border-base-300"}`}
              style={p.current ? { borderColor: "#832388" } : {}}>
              {p.current && <span className="inline-block text-xs font-black px-2 py-0.5 rounded-full text-white mb-3" style={{ backgroundColor: "#832388" }}>CURRENT</span>}
              <h3 className="text-lg font-black">{p.name}</h3>
              <p className="text-3xl font-black mb-4" style={p.current ? { color: "#832388" } : {}}>{p.price}</p>
              <ul className="space-y-2 mb-5">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm opacity-70"><Check size={13} className="text-success flex-shrink-0" /> {f}</li>
                ))}
              </ul>
              <button
                className="btn btn-sm w-full border-0 cursor-pointer"
                style={p.current
                  ? { backgroundColor: "transparent", border: "2px solid #832388", color: "#832388" }
                  : { backgroundColor: "#832388", color: "#fff" }}
              >
                {p.current ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── WITHDRAW (instructor) ── */}
      {activeTab === "Withdraw" && role === "instructor" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Available", value: "৳1,248", color: "#00C48C" },
              { label: "Pending",   value: "৳340",   color: "#F89B29" },
              { label: "Total",     value: "৳8,920", color: "#832388" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-2xl bg-base-100 border border-base-300 p-5 text-center">
                <p className="text-xs font-bold uppercase opacity-50 mb-1">{label}</p>
                <p className="text-2xl font-black" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-base-100 border border-base-300 p-6">
            <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4">Request Withdrawal</p>
            <div className="space-y-3 max-w-md">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-50">Amount (৳)</label>
                <input type="number" placeholder="1000" className="input input-sm bg-base-200 border-base-300 focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-50">Payment Method</label>
                <select className="select select-sm bg-base-200 border-base-300 focus:outline-none">
                  <option>Bank Transfer</option>
                  <option>bKash</option>
                  <option>Nagad</option>
                  <option>PayPal</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-50">Account Details</label>
                <input type="text" placeholder="Account number..." className="input input-sm bg-base-200 border-base-300 focus:outline-none" />
              </div>
            </div>
            <div className="mt-5">
              <button className="btn btn-sm gap-2 border-0 text-white cursor-pointer" style={{ backgroundColor: "#832388" }}>
                <CreditCard size={13} /> Request Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}