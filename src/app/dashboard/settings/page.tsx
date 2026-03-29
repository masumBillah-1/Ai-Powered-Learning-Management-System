"use client";
import { useState, useEffect } from "react";
import {
  User, Shield, Bell, CreditCard, Star, Settings,
  Eye, EyeOff, Check, Smartphone, RotateCw, Activity, Database, Server, Clock
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

type Role = "student" | "instructor" | "admin";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Security");
  const [role, setRole] = useState<Role>("student");
  const [theme, setTheme] = useState("light");
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [notifs, setNotifs] = useState({ email: true, push: true, assign: true, msg: false });
  const [twoFA, setTwoFA] = useState({ app: true, sms: false });
  const [saved, setSaved] = useState(false);

  // System settings state
  const [showDemoLogin, setShowDemoLogin] = useState(true);
  const [platformCommission, setPlatformCommission] = useState(30);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Database health states
  const [dbData, setDbData] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(true);

  // Withdrawal states
  const [withdrawStats, setWithdrawStats] = useState({ available: 0, pending: 0, totalWithdrawn: 0 });
  const [withdrawForm, setWithdrawForm] = useState({ amount: "", method: "bkash", account: "" });
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Logo customization states
  const [logoSettings, setLogoSettings] = useState({
    logoImage: "/mortarboard.png",
    logoName: "Career",
    logoNameSecondary: "Canvas",
    tagline1: "ELEVATE",
    tagline2: "SKILLS"
  });
  const [logoUploading, setLogoUploading] = useState(false);

  // ── Dark/Light + Role sync ──
  useEffect(() => {
    const t = localStorage.getItem("theme") || "light";

    // Get role from user object first, fallback to dashboardRole
    let r: Role = "student";
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        r = user.role || "student";
      }
    } catch {
      r = (localStorage.getItem("dashboardRole") as Role) || "student";
    }

    setTheme(t);
    setRole(r);
    document.documentElement.setAttribute("data-theme", t);

    const interval = setInterval(() => {
      const ct = localStorage.getItem("theme") || "light";

      let cr: Role = "student";
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          cr = user.role || "student";
        }
      } catch {
        cr = (localStorage.getItem("dashboardRole") as Role) || "student";
      }

      if (ct !== theme) { setTheme(ct); document.documentElement.setAttribute("data-theme", ct); }
      if (cr !== role) setRole(cr);
    }, 100);
    return () => clearInterval(interval);
  }, [theme, role]);

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs: Record<Role, { id: string; icon: React.ElementType }[]> = {
    student: [{ id: "Security", icon: Shield }, { id: "Notifications", icon: Bell }],
    instructor: [{ id: "Security", icon: Shield }, { id: "Notifications", icon: Bell }, { id: "Plans", icon: Star }, { id: "Withdraw", icon: CreditCard }],
    admin: [{ id: "Security", icon: Shield }, { id: "Notifications", icon: Bell }, { id: "System", icon: Settings }, { id: "Health", icon: Activity }],
  };
  const currentTabs = tabs[role];

  // Auto-adjust active tab if current tab not available for role
  useEffect(() => {
    if (!currentTabs.find(t => t.id === activeTab)) {
      setActiveTab(currentTabs[0]?.id || "Security");
    }
  }, [role, currentTabs, activeTab]);

  useEffect(() => {
    if (role === "admin" && activeTab === "Health") {
      fetchDBStatus();
    }
    if (role === "admin" && activeTab === "System") {
      fetchSystemSettings();
    }
  }, [role, activeTab]);

  const fetchDBStatus = async (silent = false) => {
    if (!silent) setDbLoading(true);
    try {
      const res = await fetch("/api/admin/db-status");
      const data = await res.json();
      if (data.success) setDbData(data);
    } catch (err) {
      console.error("DB Status fetch error:", err);
    } finally {
      setDbLoading(false);
    }
  };

  // Auto-refresh DB status
  useEffect(() => {
    if (activeTab === "Health" && role === "admin") {
      const timer = setInterval(() => fetchDBStatus(true), 10000);
      return () => clearInterval(timer);
    }
  }, [activeTab, role]);

  const fetchWithdrawStats = async (silent = false) => {
    if (!silent) setLoadingWithdraw(true);
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (data.withdrawStats) {
        setWithdrawStats(data.withdrawStats);
      }
    } catch (err) {
      console.error("Failed to fetch withdraw stats:", err);
    } finally {
      setLoadingWithdraw(false);
    }
  };

  const handleWithdrawalRequest = async () => {
    const numAmount = Number(withdrawForm.amount);

    if (!numAmount || numAmount < 500) {
      toast.error("Minimum withdrawal amount is ৳500");
      return;
    }

    if (numAmount > withdrawStats.available) {
      toast.error("Insufficient balance");
      return;
    }

    if (!withdrawForm.account || !withdrawForm.method) {
      toast.error("Please fill all details correctly.");
      return;
    }

    setIsWithdrawing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "withdraw",
          amount: numAmount,
          payoutMethod: withdrawForm.method,
          accountDetails: withdrawForm.account
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Withdrawal request submitted successfully!");
        setWithdrawForm({ amount: "", method: "bkash", account: "" });
        fetchWithdrawStats();
      } else {
        toast.error(data.error || "Submission failed");
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setShowDemoLogin(data.settings.showDemoLogin ?? true);
        setPlatformCommission(data.settings.platform_commission ?? 30);

        // Load logo settings
        setLogoSettings({
          logoImage: data.settings.logoImage || "/mortarboard.png",
          logoName: data.settings.logoName || "Career",
          logoNameSecondary: data.settings.logoNameSecondary || "Canvas",
          tagline1: data.settings.tagline1 || "ELEVATE",
          tagline2: data.settings.tagline2 || "SKILLS"
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const updateSystemSetting = async (key: string, value: any) => {
    setSettingsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key, value }),
      });

      const data = await res.json();
      if (data.success) {
        showSaved();
        // Update local state
        if (key === "showDemoLogin") setShowDemoLogin(value);
        if (key === "platform_commission") setPlatformCommission(value);

        // Clear logo cache when logo settings change
        if (key.startsWith("logo") || key.startsWith("tagline")) {
          localStorage.removeItem("logoSettings");
          // Trigger logo refresh by dispatching storage event
          window.dispatchEvent(new Event("storage"));
        }
      } else {
        toast.error("Failed to update setting");
      }
    } catch (error) {
      console.error("Failed to update setting:", error);
      toast.error("Failed to update setting");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setLogoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (uploadData.url) {
        await updateSystemSetting("logoImage", uploadData.url);
        setLogoSettings(prev => ({ ...prev, logoImage: uploadData.url }));
        toast.success("Logo uploaded successfully!");
      } else {
        toast.error("Failed to upload logo");
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      toast.error("Failed to upload logo");
    } finally {
      setLogoUploading(false);
    }
  };

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
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Account</p>
          <h1 className="text-3xl font-black tracking-tight">Settings</h1>
          <p className="text-sm opacity-50 mt-1">Manage your account preferences</p>
        </div>

        <button
          onClick={async () => {
            setRefreshing(true);
            try {
              if (activeTab === "Health" && role === "admin") await fetchDBStatus(true);
              else if (activeTab === "System" && role === "admin") await fetchSystemSettings();
              else if (activeTab === "Withdraw" && role === "instructor") await fetchWithdrawStats(true);
              else if (activeTab === "Security" || activeTab === "Notifications") {
                // Default categories don't have separate fetch for now, but we can show success
                toast.success(`${activeTab} refreshed!`, { duration: 2000 });
              }
            } finally {
              setRefreshing(false);
            }
          }}
          disabled={dbLoading || settingsLoading || loadingWithdraw || refreshing}
          className="btn btn-sm btn-ghost gap-1.5 mt-2 cursor-pointer"
        >
          <RotateCw size={14} className={(dbLoading || settingsLoading || loadingWithdraw || refreshing) ? "animate-spin" : ""} />
          <span className="text-xs">Refresh</span>
        </button>
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

      {/* ── SECURITY ── */}
      {
        activeTab === "Security" && (
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
                { key: "app" as const, icon: Smartphone, title: "Authenticator App", sub: "Use Google Authenticator or Authy" },
                { key: "sms" as const, icon: Shield, title: "SMS Authentication", sub: "Receive OTP on your mobile" },
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
        )
      }

      {/* ── NOTIFICATIONS ── */}
      {
        activeTab === "Notifications" && (
          <div className="rounded-2xl bg-base-100 border border-base-300 p-6">
            <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4">Notification Preferences</p>
            {[
              { key: "email" as const, label: "Email Notifications", sub: "Receive updates via email" },
              { key: "push" as const, label: "Push Notifications", sub: "Browser push notifications" },
              { key: "assign" as const, label: "Assignment Updates", sub: "New submissions and grades" },
              { key: "msg" as const, label: "Direct Messages", sub: "Notifications for new messages" },
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
        )
      }

      {/* ── PLANS (instructor) ── */}
      {
        activeTab === "Plans" && role === "instructor" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Free", price: "$0", features: ["3 courses", "Basic analytics"], current: false },
              { name: "Pro", price: "$19/mo", features: ["Unlimited courses", "Advanced analytics", "Priority support"], current: true },
              { name: "Enterprise", price: "$49/mo", features: ["Everything in Pro", "White labeling", "API access"], current: false },
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
        )
      }

      {/* ── WITHDRAW (instructor) ── */}
      {
        activeTab === "Withdraw" && role === "instructor" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Available", value: `৳${withdrawStats.available.toLocaleString()}`, color: "#00C48C" },
                { label: "Pending", value: `৳${withdrawStats.pending.toLocaleString()}`, color: "#F89B29" },
                { label: "Total", value: `৳${withdrawStats.totalWithdrawn.toLocaleString()}`, color: "#832388" },
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
                  <input
                    type="number"
                    placeholder="1000"
                    className="input input-sm bg-base-200 border-base-300 focus:outline-none"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold opacity-50">Payment Method</label>
                  <select
                    className="select select-sm bg-base-200 border-base-300 focus:outline-none"
                    value={withdrawForm.method}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, method: e.target.value })}
                  >
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold opacity-50">Account Details</label>
                  <input
                    type="text"
                    placeholder="Account number or details..."
                    className="input input-sm bg-base-200 border-base-300 focus:outline-none"
                    value={withdrawForm.account}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, account: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-5">
                <button
                  onClick={handleWithdrawalRequest}
                  disabled={isWithdrawing || !withdrawForm.amount}
                  className="btn btn-sm gap-2 border-0 text-white cursor-pointer"
                  style={{ backgroundColor: "#832388" }}
                >
                  {isWithdrawing ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <CreditCard size={13} />
                  )}
                  {isWithdrawing ? "Processing..." : "Request Withdrawal"}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* ── SYSTEM (admin) ── */}
      {
        activeTab === "System" && role === "admin" && (
          <div className="space-y-6">

            {/* Logo Customization */}
            <div className="rounded-2xl bg-base-100 border border-base-300 p-6">
              <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1">Brand Identity</p>
              <p className="text-xs opacity-50 mb-4">Customize your platform logo, name, and tagline</p>

              {/* Logo Preview */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-base-200 mb-4">
                <div className="relative">
                  <img
                    src={logoSettings.logoImage}
                    alt="Logo Preview"
                    className="w-16 h-16 object-contain rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/mortarboard.png";
                    }}
                  />
                  {logoUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <span className="loading loading-spinner loading-sm text-white"></span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xl font-black">{logoSettings.logoName}</span>
                    <span className="text-xl font-black bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] bg-clip-text text-transparent">
                      {logoSettings.logoNameSecondary}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase">{logoSettings.tagline1}</span>
                    <div className="w-1 h-1 rounded-full bg-gradient-to-r from-[#FF0F7B] to-[#F89B29]" />
                    <span className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase">{logoSettings.tagline2}</span>
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold opacity-50 mb-2 block">Logo Image</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={logoUploading || settingsLoading}
                      className="file-input file-input-sm file-input-bordered w-full max-w-xs"
                    />
                    {logoUploading && <span className="loading loading-spinner loading-sm"></span>}
                  </div>
                  <p className="text-xs opacity-40 mt-1">Recommended: 512x512px, PNG or SVG, max 2MB</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold opacity-50 mb-1 block">Brand Name (Part 1)</label>
                    <input
                      type="text"
                      value={logoSettings.logoName}
                      onChange={(e) => setLogoSettings(prev => ({ ...prev, logoName: e.target.value }))}
                      className="input input-sm bg-base-200 border-base-300 w-full focus:outline-none"
                      placeholder="Career"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-50 mb-1 block">Brand Name (Part 2)</label>
                    <input
                      type="text"
                      value={logoSettings.logoNameSecondary}
                      onChange={(e) => setLogoSettings(prev => ({ ...prev, logoNameSecondary: e.target.value }))}
                      className="input input-sm bg-base-200 border-base-300 w-full focus:outline-none"
                      placeholder="Canvas"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold opacity-50 mb-1 block">Tagline 1</label>
                    <input
                      type="text"
                      value={logoSettings.tagline1}
                      onChange={(e) => setLogoSettings(prev => ({ ...prev, tagline1: e.target.value }))}
                      className="input input-sm bg-base-200 border-base-300 w-full focus:outline-none"
                      placeholder="ELEVATE"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-50 mb-1 block">Tagline 2</label>
                    <input
                      type="text"
                      value={logoSettings.tagline2}
                      onChange={(e) => setLogoSettings(prev => ({ ...prev, tagline2: e.target.value }))}
                      className="input input-sm bg-base-200 border-base-300 w-full focus:outline-none"
                      placeholder="SKILLS"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={async () => {
                      await Promise.all([
                        updateSystemSetting("logoName", logoSettings.logoName),
                        updateSystemSetting("logoNameSecondary", logoSettings.logoNameSecondary),
                        updateSystemSetting("tagline1", logoSettings.tagline1),
                        updateSystemSetting("tagline2", logoSettings.tagline2),
                      ]);
                      toast.success("Logo settings updated!");
                    }}
                    disabled={settingsLoading}
                    className="btn btn-sm text-white border-0"
                    style={{ backgroundColor: "#832388" }}
                  >
                    {settingsLoading ? <span className="loading loading-spinner loading-xs"></span> : "Save Logo Settings"}
                  </button>
                  <button
                    onClick={() => {
                      setLogoSettings({
                        logoImage: "/mortarboard.png",
                        logoName: "Career",
                        logoNameSecondary: "Canvas",
                        tagline1: "ELEVATE",
                        tagline2: "SKILLS"
                      });
                    }}
                    className="btn btn-sm btn-ghost"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            </div>

            {/* Demo Login Control */}
            <div className="rounded-2xl bg-base-100 border border-base-300 p-6">
              <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1">Demo Login</p>
              <p className="text-xs opacity-50 mb-4">Control demo login buttons visibility on login page</p>

              <div className="flex items-center justify-between p-4 rounded-xl bg-base-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#832388", opacity: 0.8 }}>
                    <User size={18} color="#fff" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Show Demo Login Buttons</p>
                    <p className="text-xs opacity-50">Enable quick demo access for Admin, Instructor, Student</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-md cursor-pointer"
                  checked={showDemoLogin}
                  onChange={(e) => updateSystemSetting("showDemoLogin", e.target.checked)}
                  disabled={settingsLoading}
                  style={showDemoLogin ? { backgroundColor: "#832388", borderColor: "#832388" } : {}}
                />
              </div>

              {settingsLoading && (
                <p className="text-xs text-center mt-3 opacity-50">Updating...</p>
              )}
            </div>

            {/* Platform Commission Control */}
            <div className="rounded-2xl bg-base-100 border border-base-300 p-6">
              <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1">Platform Earnings</p>
              <p className="text-xs opacity-50 mb-4">Set the commission percentage for the platform</p>

              <div className="flex items-center justify-between p-4 rounded-xl bg-base-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#832388", opacity: 0.8 }}>
                    <CreditCard size={18} color="#fff" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Platform Commission (%)</p>
                    <p className="text-xs opacity-50">Percentage taken from each course sale</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={platformCommission}
                    className="input input-sm w-20 bg-base-100 border-base-300 focus:outline-none font-bold"
                    onChange={(e) => setPlatformCommission(Number(e.target.value))}
                    disabled={settingsLoading}
                  />
                  <button
                    onClick={() => updateSystemSetting("platform_commission", platformCommission)}
                    disabled={settingsLoading}
                    className="btn btn-sm text-white border-0"
                    style={{ backgroundColor: "#832388" }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Future Settings Placeholder */}
            <div className="rounded-2xl bg-base-100 border border-base-300 p-6 opacity-50">
              <p className="text-xs font-bold uppercase tracking-wider mb-1">More Settings Coming Soon</p>
              <p className="text-xs opacity-50">Maintenance mode, registration control, and more...</p>
            </div>

          </div>
        )
      }

      {/* ── SYSTEM HEALTH (admin) ── */}
      {
        activeTab === "Health" && role === "admin" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-base-300 flex items-center justify-between bg-base-200/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20">
                    <Database size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-black text-base">Database Infrastructure</p>
                    <p className="text-xs opacity-50 font-medium">MongoDB Atlas Shared Cluster Health</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-base-100 border border-base-300 shadow-sm">
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-2 h-2 rounded-full ${dbData?.health.isHealthy ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-red-500"}`}
                  />
                  <span className="text-[11px] font-black uppercase tracking-wider opacity-60">
                    {dbData?.connection.status || "Checking..."}
                  </span>
                </div>
              </div>

              {dbLoading && !dbData ? (
                <div className="p-10 flex flex-col items-center justify-center gap-4">
                  <RotateCw size={30} className="animate-spin opacity-20" />
                  <p className="text-xs font-bold opacity-30 uppercase tracking-widest">Polling Server...</p>
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Usage Chart/Radial */}
                    <div className="flex flex-col items-center justify-center p-6 bg-base-200/50 rounded-2xl border border-base-300/50">
                      <svg className="w-48 h-48" viewBox="0 0 200 200">
                        {/* Background circle (gray) */}
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="rgba(98, 75, 75, 0.13)"
                          strokeWidth="15"
                        />
                        {/* Progress circle  (purple) */}
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="15"
                          strokeLinecap="round"
                          strokeDasharray={`${(dbData?.health.poolUsagePercent || 0) * 5.03} 503`}
                          transform="rotate(-90 100 100)"
                          style={{ transition: "stroke-dasharray 0.5s ease" }}
                        />
                        {/* Gradient definition */}
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#832388" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                        {/* Center text */}
                        <text
                          x="100"
                          y="110"
                          textAnchor="middle"
                          className="text-2xl font-black fill-current"
                          style={{ fontSize: "30px", fontWeight: 900 }}
                        >
                          {dbData?.health.poolUsagePercent || 0}%
                        </text>
                      </svg>
                      <p className="text-xs font-black uppercase tracking-widest opacity-40 mt-4">Pool Usage</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                      <div className="p-5 bg-base-100 rounded-2xl border border-base-300 shadow-sm hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity size={14} className="opacity-40" />
                          <span className="text-xs font-bold uppercase tracking-wider opacity-40">Active Connections</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <p className="text-3xl font-black">
                            {(dbData?.connection.poolSize || 0) - (dbData?.connection.availableConnections || 0)}
                          </p>
                          <p className="text-sm font-bold opacity-30 mb-1">/ {dbData?.connection.poolSize || 50}</p>
                        </div>
                        <div className="mt-4 w-full bg-base-200 h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${dbData?.health.poolUsagePercent}%` }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>

                      <div className="p-5 bg-base-100 rounded-2xl border border-base-300 shadow-sm hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Server size={14} className="opacity-40" />
                          <span className="text-xs font-bold uppercase tracking-wider opacity-40">Available Slot</span>
                        </div>
                        <p className="text-3xl font-black text-emerald-500">{dbData?.connection.availableConnections || 0}</p>
                        <p className="text-xs font-bold opacity-30 mt-1 uppercase">Ready to serve</p>
                      </div>

                      <div className="col-span-2 p-5 bg-base-100 rounded-2xl border border-base-300 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-base-200">
                            <Database size={16} className="opacity-40" />
                          </div>
                          <div>
                            <p className="text-xs font-bold opacity-30 uppercase tracking-tighter leading-none mb-1">Database Name</p>
                            <p className="text-lg font-black">{dbData?.connection.name || "N/A"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold opacity-30 uppercase mb-1">Last Update</p>
                          <p className="text-xs font-black font-mono">{new Date().toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning/Health Message */}
                  {dbData?.health.warning ? (
                    <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
                      <Clock size={18} />
                      <p className="text-xs font-bold">{dbData.health.warning}</p>
                    </div>
                  ) : (
                    <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Activity size={18} />
                      </motion.div>
                      <p className="text-xs font-bold">System performing at optimal capacity. Connection pooled and shared.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      }

    </div >
  );
}
