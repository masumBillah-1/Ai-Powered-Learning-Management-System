"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import {
  Trophy, Medal, Star, Flame, Search, Crown,
  ArrowUp, ArrowDown, Zap, Target, BookOpen,
  ChevronLeft, Minus, Sparkles, GraduationCap,
  TrendingUp, Award, Users, ChevronRight, Activity, Database
} from "lucide-react";

// ── Design tokens matching the project palette ─────────────────────────────
const COLORS = {
  gold: "#F89B29",
  silver: "#94A3B8",
  bronze: "#C97A3A",
  purple: "#832388",
  purpleDark: "#6710C2",
  pink: "#FF0F7B",
  green: "#00C48C",
  bg: "#0b1120",
  card: "#0f172a",
  cardAlt: "#1a1a2e",
  border: "#1f2937",
};

// ── Mock Data ──────────────────────────────────────────────────────────────
const TOP_3_MOCK = [
  {
    id: "1", name: "Masum Billah", level: 42, xp: 21500, streak: 45,
    photo: "", rank: 1, badges: 12, trend: "up", courses: 8,
    initials: "MB",
  },
  {
    id: "2", name: "Zuhair Ahmed", level: 38, xp: 19200, streak: 32,
    photo: "", rank: 2, badges: 9, trend: "up", courses: 7,
    initials: "ZA",
  },
  {
    id: "3", name: "Tasmia Khan", level: 35, xp: 18400, streak: 15,
    photo: "", rank: 3, badges: 7, trend: "stable", courses: 6,
    initials: "TK",
  },
];

const SCHOLARS_MOCK = Array.from({ length: 17 }).map((_, i) => {
  const names = [
    "Rafiq Islam", "Nadia Hossain", "Arif Karim", "Sadia Akter",
    "Imran Hasan", "Mitu Begum", "Farhan Ali", "Priya Roy",
    "Yusuf Khan", "Lamia Sultana", "Bashir Ahmed", "Tania Chowdhury",
    "Karim Uddin", "Faria Khatun", "Salim Reza", "Nasrin Jahan",
    "Jakir Hossain",
  ];
  const trends = ["up", "down", "stable"] as const;
  return {
    id: String(i + 4),
    name: names[i] || `Scholar ${i + 4}`,
    initials: (names[i] || "S").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
    level: 32 - i,
    xp: 15800 - i * 520,
    streak: Math.max(1, 18 - i),
    rank: i + 4,
    badges: Math.max(1, 6 - Math.floor(i / 3)),
    courses: Math.max(1, 5 - Math.floor(i / 4)),
    trend: trends[i % 3],
  } as any;
});

const PERIOD_TABS = [
  { id: "all-time", label: "All Time" },
  { id: "monthly", label: "Monthly" },
  { id: "weekly", label: "Weekly" },
];

const STATS = [
  { label: "Total Scholars", value: "2,847", icon: <Users size={20} />, color: COLORS.purple },
  { label: "XP Awarded", value: "1.2M", icon: <Zap size={20} />, color: COLORS.pink },
  { label: "Badges Earned", value: "8,400", icon: <Award size={20} />, color: COLORS.gold },
  { label: "Streak Record", value: "120d", icon: <Flame size={20} />, color: COLORS.green },
];

const ROLE_DASHBOARD: Record<string, string> = {
  admin: "/dashboard/admin",
  instructor: "/dashboard/instructor",
  student: "/dashboard/student",
};

// ── Helper Components ──────────────────────────────────────────────────────

function Avatar({ initials, photo, size = 80, rank }: { initials: string; photo?: string; size?: number; rank?: number }) {
  const gradients: Record<number, string> = {
    1: "from-[#F89B29] via-[#832388] to-[#FF0F7B]",
    2: "from-[#94A3B8] via-[#64748B] to-[#475569]",
    3: "from-[#C97A3A] via-[#92400E] to-[#78350F]",
  };
  const defaultGrad = "from-[#832388] to-[#FF0F7B]";
  const grad = rank ? (gradients[rank] || defaultGrad) : defaultGrad;

  return (
    <div
      className={`rounded-2xl flex items-center justify-center text-white font-black flex-shrink-0 overflow-hidden relative`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        background: photo ? "#1e293b" : undefined, // Solid dark bg for images to avoid bleed
      }}
    >
      {!photo && (
        <div className={`absolute inset-0 bg-gradient-to-br ${grad}`} />
      )}
      {photo ? (
        <img
          src={photo}
          alt={initials}
          className="w-full h-full object-cover relative z-10"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="relative z-10">{initials}</span>
      )}
    </div>
  );
}

function TrendBadge({ trend }: { trend: string }) {
  if (trend === "up") return (
    <span className="flex items-center gap-0.5 text-[#00C48C] font-bold text-[11px]">
      <ArrowUp size={11} /><span>Up</span>
    </span>
  );
  if (trend === "down") return (
    <span className="flex items-center gap-0.5 text-[#FF0F7B] font-bold text-[11px]">
      <ArrowDown size={11} /><span>Down</span>
    </span>
  );
  return (
    <span className="flex items-center gap-0.5 text-gray-500 font-bold text-[11px]">
      <Minus size={11} /><span>Same</span>
    </span>
  );
}

function XPBar({ level }: { level: number }) {
  const pct = Math.min(100, (level % 10) * 10 + 30);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-black text-white/50 min-w-[36px]">Lv.{level}</span>
      <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#832388] to-[#FF0F7B]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy size={18} style={{ color: COLORS.gold }} />;
  if (rank === 2) return <Medal size={18} style={{ color: COLORS.silver }} />;
  if (rank === 3) return <Medal size={18} style={{ color: COLORS.bronze }} />;
  return (
    <span className="text-sm font-black text-white/30 tabular-nums w-6 text-center">
      {rank}
    </span>
  );
}

function BadgeDots({ count }: { count: number }) {
  const badgeColors = [COLORS.gold, COLORS.purple, COLORS.green, COLORS.pink, "#06B6D4", "#A855F7"];
  return (
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
        <div
          key={i}
          className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{
            backgroundColor: badgeColors[i % badgeColors.length] + "22",
            border: `1px solid ${badgeColors[i % badgeColors.length]}44`,
            color: badgeColors[i % badgeColors.length],
          }}
        >
          {i === 0 ? <Star size={9} /> : i === 1 ? <Target size={9} /> : i === 2 ? <Flame size={9} /> : i === 3 ? <BookOpen size={9} /> : <Zap size={9} />}
        </div>
      ))}
      {count > 5 && (
        <div className="w-5 h-5 rounded-md flex items-center justify-center bg-white/5 text-white/30 text-[8px] font-black">
          +{count - 5}
        </div>
      )}
    </div>
  );
}

function PodiumCard({ student, rank }: { student: any; rank: number }) {
  const rankColors: Record<number, { border: string; glow: string; badge: string }> = {
    1: { border: "#F89B29", glow: "#F89B29", badge: "from-[#F89B29] to-[#ff6b00]" },
    2: { border: "#94A3B8", glow: "#94A3B8", badge: "from-[#94A3B8] to-[#64748B]" },
    3: { border: "#C97A3A", glow: "#C97A3A", badge: "from-[#C97A3A] to-[#92400E]" },
  };
  const c = rankColors[rank];
  const isFirst = rank === 1;

  return (
    <div className={`relative group flex flex-col items-center ${isFirst ? "order-first md:order-none" : ""}`} style={{ animationDelay: `${rank * 0.1}s` }}>
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-2xl pointer-events-none" style={{ backgroundColor: c.glow }} />
      {isFirst && <div className="mb-3 relative"><Crown size={36} style={{ color: COLORS.gold, filter: "drop-shadow(0 0 12px #F89B2966)" }} className="animate-bounce" /></div>}
      <div className={`relative w-full rounded-3xl p-6 flex flex-col items-center gap-4 border-2 transition-all duration-500 group-hover:-translate-y-1 ${isFirst ? "pb-8 pt-8" : "pt-10"}`}
        style={{ backgroundColor: COLORS.card, borderColor: c.border + "66", boxShadow: isFirst ? `0 0 40px ${c.glow}18` : "none" }}>
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-2xl flex items-center justify-center text-white text-base font-black shadow-xl bg-gradient-to-br ${c.badge} z-10`}>{rank}</div>
        <div className="relative">
          <div className="absolute inset-[-3px] rounded-2xl" style={{ background: `linear-gradient(135deg, ${c.border}, transparent)`, opacity: 0.6 }} />
          <Avatar initials={student.initials} photo={student.photo} size={isFirst ? 88 : 72} rank={rank} />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-lg" style={{ backgroundColor: COLORS.cardAlt, border: `1px solid ${COLORS.border}` }}><span style={{ color: COLORS.gold }}>🔥</span></div>
        </div>
        <div className="text-center w-full">
          <h3 className={`font-black truncate ${isFirst ? "text-xl" : "text-base"} text-white`}>{student.name}</h3>
          <p className="text-xs font-black uppercase tracking-widest mt-0.5" style={{ color: c.border }}>{student.xp.toLocaleString()} XP</p>
        </div>
        <div className="grid grid-cols-3 gap-2 w-full">
          {[
            { label: "Streak", val: `${student.streak}d`, icon: "🔥" },
            { label: "Level", val: String(student.level), icon: "⚡" },
            { label: "Badges", val: String(student.badges), icon: "🏅" },
          ].map(({ label, val, icon }) => (
            <div key={label} className="flex flex-col items-center py-2 px-1 rounded-xl" style={{ backgroundColor: "#ffffff06", border: "1px solid #ffffff08" }}>
              <span className="text-base leading-none">{icon}</span>
              <span className="text-[11px] font-black text-white mt-1">{val}</span>
              <span className="text-[8px] uppercase font-bold text-white/30 tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("all-time");
  const [dataMode, setDataMode] = useState<"demo" | "real">("demo");
  const [search, setSearch] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [dashboardHref, setDashboardHref] = useState("/dashboard/student");
  const [realData, setRealData] = useState<any[]>([]);
  const [loadingReal, setLoadingReal] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setDashboardHref(ROLE_DASHBOARD[parsed?.role] ?? "/dashboard/student");
      }
    } catch { }
    return () => clearTimeout(timer);
  }, []);

  const fetchRealData = useCallback(async () => {
    setLoadingReal(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/dashboard?leaderboard=true", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success) {
        setRealData(data.leaderboard);
      }
    } catch (err) {
      console.error("Failed to fetch real leaderboard:", err);
    } finally {
      setLoadingReal(false);
    }
  }, []);

  useEffect(() => {
    if (dataMode === "real" && realData.length === 0) {
      fetchRealData();
    }
  }, [dataMode, realData.length, fetchRealData]);

  // Handle data selection
  const currentTop3 = dataMode === "demo" ? TOP_3_MOCK : realData.slice(0, 3);
  const currentScholars = dataMode === "demo" ? SCHOLARS_MOCK : realData.slice(3);

  const filtered = currentScholars.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white pb-20" style={{ backgroundColor: COLORS.bg, fontFamily: "'Inter', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] rounded-full" style={{ background: `radial-gradient(circle, ${COLORS.purple}12, transparent 70%)` }} />
        <div className="absolute bottom-[-20%] right-[-15%] w-[70%] h-[70%] rounded-full" style={{ background: `radial-gradient(circle, ${COLORS.pink}10, transparent 70%)` }} />
      </div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ backgroundColor: `${COLORS.bg}cc`, borderColor: COLORS.border }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href={dashboardHref} className="flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors group">
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Logo />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
            style={{ backgroundColor: `${COLORS.pink}18`, border: `1px solid ${COLORS.pink}33`, color: COLORS.pink }}>
            <Crown size={12} /> Leaderboard
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-10 relative z-10">
        <div className={`text-center mb-14 space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.18em]"
            style={{ backgroundColor: `${COLORS.pink}14`, border: `1px solid ${COLORS.pink}30`, color: COLORS.pink }}>
            <Sparkles size={13} /> Global Hall of Fame
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter">Leader<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})` }}>board</span></h1>
          
          {/* ── Mode Selection Tab ────────────────────────────────────── */}
          <div className="flex justify-center mt-6">
            <div className="flex p-1.5 rounded-2xl gap-1" style={{ backgroundColor: `${COLORS.card}`, border: `1px solid ${COLORS.border}` }}>
              <button onClick={() => setDataMode("demo")} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer"
                style={dataMode === "demo" ? { background: `linear-gradient(135deg, ${COLORS.purple}, #6366f1)`, color: "white", boxShadow: `0 4px 20px ${COLORS.purple}30` } : { color: "rgba(255,255,255,0.3)" }}>
                <Activity size={14} /> Demo Look
              </button>
              <button onClick={() => setDataMode("real")} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer"
                style={dataMode === "real" ? { background: `linear-gradient(135deg, #FF0F7B, #F89B29)`, color: "white", boxShadow: `0 4px 20px ${COLORS.pink}30` } : { color: "rgba(255,255,255,0.3)" }}>
                <Database size={14} /> Live Stats
              </button>
            </div>
          </div>
        </div>

        {loadingReal && dataMode === "real" ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-12 h-12 border-4 border-[#FF0F7B]/20 border-t-[#FF0F7B] rounded-full animate-spin" />
             <p className="text-sm font-bold text-white/40 animate-pulse">Fetching Live Data...</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {!search && currentTop3.length > 0 && (
              <div className="mb-16 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
                <div className="mt-0 sm:mt-8"><PodiumCard student={currentTop3[1] || currentTop3[0]} rank={2} /></div>
                <div><PodiumCard student={currentTop3[0]} rank={1} /></div>
                <div className="mt-0 sm:mt-14"><PodiumCard student={currentTop3[2] || currentTop3[0]} rank={3} /></div>
              </div>
            )}

            {/* Table Control */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
              <div className="flex p-1.5 rounded-2xl gap-1" style={{ backgroundColor: `${COLORS.card}`, border: `1px solid ${COLORS.border}` }}>
                {PERIOD_TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                    style={activeTab === tab.id ? { background: "rgba(255,255,255,0.08)", color: "white" } : { color: "rgba(255,255,255,0.3)" }}>{tab.label}</button>
                ))}
              </div>
              <div className="relative w-full sm:w-72 group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: search ? COLORS.pink : "rgba(255,255,255,0.2)" }} />
                <input type="text" placeholder="Search scholar..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl outline-none" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, color: "white" }} />
              </div>
            </div>

            {/* List */}
            <div className="rounded-3xl overflow-hidden border" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead>
                     <tr className="text-[10px] font-black uppercase tracking-widest text-left border-b" style={{ borderColor: COLORS.border, color: "rgba(255,255,255,0.2)" }}>
                       <th className="px-6 py-4">Rank</th>
                       <th className="px-6 py-4">Scholar</th>
                       <th className="px-6 py-4">Level</th>
                       <th className="px-6 py-4">XP Points</th>
                       <th className="px-6 py-4">🔥 Streak</th>
                       <th className="px-6 py-4">Trend</th>
                     </tr>
                   </thead>
                   <tbody>
                      {filtered.map((s, i) => (
                        <tr key={s.id} className="group border-b transition-all hover:bg-white/[0.025]" style={{ borderColor: COLORS.border }}>
                          <td className="px-6 py-4"><RankBadge rank={s.rank} /></td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar initials={s.initials} photo={s.photo} size={38} />
                              <div>
                                <p className="text-sm font-black text-white leading-tight">{s.name}</p>
                                <p className="text-[11px] font-bold text-white/30">{s.courses} courses</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4"><XPBar level={s.level} /></td>
                          <td className="px-6 py-4"><span className="text-sm font-black text-white/80">{s.xp.toLocaleString()}<span className="text-[10px] font-bold text-white/30 ml-1">XP</span></span></td>
                          <td className="px-6 py-4"><div className="flex items-center gap-1.5 font-black text-sm" style={{ color: COLORS.gold }}>🔥 <span>{s.streak}d</span></div></td>
                          <td className="px-6 py-4"><TrendBadge trend={s.trend} /></td>
                        </tr>
                      ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </>
        )}

        {/* Sticky standing */}
        {dataMode === "real" && !loadingReal && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none">
            <div className="rounded-3xl p-5 flex items-center justify-between gap-4 backdrop-blur-2xl border shadow-2xl pointer-events-auto"
              style={{ backgroundColor: `${COLORS.cardAlt}ee`, borderColor: `${COLORS.purple}40`, boxShadow: `0 0 40px ${COLORS.purple}20` }}>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white" style={{ background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})` }}>?</div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-white/30 mb-0.5">Your Live Stand</p>
                    <h4 className="text-base font-black text-white">View Ranking</h4>
                 </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-white/30 mb-1">XP Goal</p>
                <p className="text-lg font-black bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.pink})` }}>Next Milestone</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
