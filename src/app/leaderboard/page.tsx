"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import {
  Trophy, Medal, Star, Flame, Search, Crown,
  ArrowUp, ArrowDown, Zap, Target, BookOpen,
  ChevronLeft, Minus, Sparkles, GraduationCap,
  TrendingUp, Award, Users, ChevronRight
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
const TOP_3 = [
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

const SCHOLARS = Array.from({ length: 17 }).map((_, i) => {
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
  };
});

const TABS = [
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

// ── Helper: gradient avatar ────────────────────────────────────────────────
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
      className={`rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-black flex-shrink-0 overflow-hidden`}
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {photo ? <img src={photo} alt={initials} className="w-full h-full object-cover" /> : initials}
    </div>
  );
}

// ── Trend badge ────────────────────────────────────────────────────────────
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

// ── XP Progress bar ────────────────────────────────────────────────────────
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

// ── Rank medal ────────────────────────────────────────────────────────────
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

// ── Mini badge dots ───────────────────────────────────────────────────────
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

// ── PODIUM CARD ───────────────────────────────────────────────────────────
function PodiumCard({ student, rank }: { student: typeof TOP_3[0]; rank: number }) {
  const rankColors: Record<number, { border: string; glow: string; badge: string }> = {
    1: { border: "#F89B29", glow: "#F89B29", badge: "from-[#F89B29] to-[#ff6b00]" },
    2: { border: "#94A3B8", glow: "#94A3B8", badge: "from-[#94A3B8] to-[#64748B]" },
    3: { border: "#C97A3A", glow: "#C97A3A", badge: "from-[#C97A3A] to-[#92400E]" },
  };
  const c = rankColors[rank];
  const isFirst = rank === 1;

  return (
    <div
      className={`relative group flex flex-col items-center ${isFirst ? "order-first md:order-none" : ""}`}
      style={{ animationDelay: `${rank * 0.1}s` }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-2xl pointer-events-none"
        style={{ backgroundColor: c.glow }}
      />

      {/* Crown for rank 1 */}
      {isFirst && (
        <div className="mb-3 relative">
          <Crown size={36} style={{ color: COLORS.gold, filter: "drop-shadow(0 0 12px #F89B2966)" }}
            className="animate-bounce" />
        </div>
      )}

      {/* Card */}
      <div
        className={`relative w-full rounded-3xl p-6 flex flex-col items-center gap-4 border-2 transition-all duration-500 group-hover:-translate-y-1 ${isFirst ? "pb-8 pt-8" : "pt-10"}`}
        style={{
          backgroundColor: COLORS.card,
          borderColor: c.border + "66",
          boxShadow: isFirst ? `0 0 40px ${c.glow}18` : "none",
        }}
      >
        {/* Rank Badge */}
        <div
          className={`absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-2xl flex items-center justify-center text-white text-base font-black shadow-xl bg-gradient-to-br ${c.badge} z-10`}
        >
          {rank}
        </div>

        {/* Avatar */}
        <div className="relative">
          <div
            className="absolute inset-[-3px] rounded-2xl"
            style={{ background: `linear-gradient(135deg, ${c.border}, transparent)`, opacity: 0.6 }}
          />
          <Avatar initials={student.initials} photo={student.photo} size={isFirst ? 88 : 72} rank={rank} />
          {/* Streak badge */}
          <div
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-lg"
            style={{ backgroundColor: COLORS.cardAlt, border: `1px solid ${COLORS.border}` }}
          >
            <span style={{ color: COLORS.gold }}>🔥</span>
          </div>
        </div>

        {/* Info */}
        <div className="text-center w-full">
          <h3 className={`font-black truncate ${isFirst ? "text-xl" : "text-base"} text-white`}>
            {student.name}
          </h3>
          <p className="text-xs font-black uppercase tracking-widest mt-0.5"
            style={{ color: c.border }}>
            {student.xp.toLocaleString()} XP
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {[
            { label: "Streak", val: `${student.streak}d`, icon: "🔥" },
            { label: "Level", val: String(student.level), icon: "⚡" },
            { label: "Badges", val: String(student.badges), icon: "🏅" },
          ].map(({ label, val, icon }) => (
            <div key={label} className="flex flex-col items-center py-2 px-1 rounded-xl"
              style={{ backgroundColor: "#ffffff06", border: "1px solid #ffffff08" }}>
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
const ROLE_DASHBOARD: Record<string, string> = {
  admin: "/dashboard/admin",
  instructor: "/dashboard/instructor",
  student: "/dashboard/student",
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("all-time");
  const [search, setSearch] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [dashboardHref, setDashboardHref] = useState("/dashboard/student");
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    // Read role from localStorage to determine correct dashboard link
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        const role = parsed?.role as string;
        setDashboardHref(ROLE_DASHBOARD[role] ?? "/dashboard/student");
      }
    } catch { /* ignore */ }
    return () => clearTimeout(timer);
  }, []);

  const filtered = SCHOLARS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: COLORS.bg, fontFamily: "'Inter', 'Geist', sans-serif" }}
    >
      {/* ── Ambient Background ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] rounded-full"
          style={{ background: `radial-gradient(circle, ${COLORS.purple}12, transparent 70%)` }} />
        <div className="absolute bottom-[-20%] right-[-15%] w-[70%] h-[70%] rounded-full"
          style={{ background: `radial-gradient(circle, ${COLORS.pink}10, transparent 70%)` }} />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full"
          style={{ background: `radial-gradient(circle, ${COLORS.gold}08, transparent 70%)` }} />
      </div>

      {/* ── Top Nav ────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{ backgroundColor: `${COLORS.bg}cc`, borderColor: COLORS.border }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Back to dashboard */}
          <Link
            href={dashboardHref}
            className="flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors group"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          {/* Brand */}
          <Logo />

          {/* Leaderboard label */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
            style={{
              backgroundColor: `${COLORS.pink}18`,
              border: `1px solid ${COLORS.pink}33`,
              color: COLORS.pink,
            }}
          >
            <Crown size={12} /> Leaderboard
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-28 pt-10 relative z-10">

        {/* ── Hero Header ─────────────────────────────────────────────── */}
        <div
          className={`text-center mb-14 space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.18em]"
            style={{
              backgroundColor: `${COLORS.pink}14`,
              border: `1px solid ${COLORS.pink}30`,
              color: COLORS.pink,
            }}
          >
            <Sparkles size={13} /> Global Hall of Fame
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none">
            Leader
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})` }}
            >
              board
            </span>
          </h1>

          <p className="text-base text-white/40 max-w-md mx-auto font-medium leading-relaxed">
            Celebrating top learners pushing boundaries and mastering new skills every single day.
          </p>
        </div>

        {/* ── Platform Stats ───────────────────────────────────────────── */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-14 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 flex flex-col gap-3 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: stat.color + "20", color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-xs font-bold text-white/30 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Control Bar ─────────────────────────────────────────────── */}
        <div
          className={`flex flex-col sm:flex-row gap-4 mb-12 items-center justify-between transition-all duration-700 delay-150 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {/* Period Tabs */}
          <div
            className="flex p-1.5 rounded-2xl gap-1"
            style={{ backgroundColor: `${COLORS.card}`, border: `1px solid ${COLORS.border}` }}
          >
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  style={active ? {
                    background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`,
                    color: "white",
                    boxShadow: `0 4px 20px ${COLORS.purple}30`,
                  } : { color: "rgba(255,255,255,0.35)" }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72 group">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: search ? COLORS.pink : "rgba(255,255,255,0.2)" }}
            />
            <input
              type="text"
              placeholder="Search scholar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl outline-none transition-all"
              style={{
                backgroundColor: COLORS.card,
                border: `1px solid ${search ? COLORS.purple + "60" : COLORS.border}`,
                color: "white",
              }}
            />
          </div>
        </div>

        {/* ── Podium ──────────────────────────────────────────────────── */}
        {!search && (
          <div
            className={`mb-16 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="flex items-center gap-2.5 mb-8">
              <Trophy size={20} style={{ color: COLORS.gold }} />
              <h2 className="font-black text-lg text-white">Top Champions</h2>
            </div>

            {/* Podium layout: 2-1-3 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              {/* 2nd */}
              <div className="mt-0 sm:mt-8">
                <PodiumCard student={TOP_3[1]} rank={2} />
              </div>
              {/* 1st — center, elevated */}
              <div>
                <PodiumCard student={TOP_3[0]} rank={1} />
              </div>
              {/* 3rd */}
              <div className="mt-0 sm:mt-14">
                <PodiumCard student={TOP_3[2]} rank={3} />
              </div>
            </div>
          </div>
        )}

        {/* ── Scholar Table (Rank 4+) ──────────────────────────────────── */}
        <div
          ref={tableRef}
          className={`rounded-3xl overflow-hidden border transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
        >
          {/* Table header */}
          <div
            className="flex items-center justify-between px-6 py-5 border-b"
            style={{ borderColor: COLORS.border }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.gold}20`, color: COLORS.gold }}
              >
                <Zap size={18} />
              </div>
              <div>
                <h3 className="font-black text-base text-white">Scholars Ranking</h3>
                <p className="text-[11px] text-white/30 font-bold uppercase tracking-wide">
                  {filtered.length + (search ? 0 : TOP_3.length)} participants
                </p>
              </div>
            </div>
            <div
              className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}
            >
              Top 20
            </div>
          </div>

          {/* Desktop Table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full">
              <thead>
                <tr
                  className="text-[10px] font-black uppercase tracking-widest text-left border-b"
                  style={{ borderColor: COLORS.border, color: "rgba(255,255,255,0.2)" }}
                >
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Scholar</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4">XP Points</th>
                  <th className="px-6 py-4">🔥 Streak</th>
                  <th className="px-6 py-4">Badges</th>
                  <th className="px-6 py-4">Trend</th>
                </tr>
              </thead>
              <tbody>
                {/* Top 3 if searching */}
                {search && TOP_3.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((s, i) => (
                  <TableRow key={s.id} student={s} isTop3 delay={i * 0.04} />
                ))}
                {/* Rank 4+ */}
                {filtered.map((s, i) => (
                  <TableRow key={s.id} student={s} delay={i * 0.04} />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-white/30 font-bold">
                      No scholars found matching "{search}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y" style={{ borderColor: COLORS.border }}>
            {search && TOP_3.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((s) => (
              <MobileCard key={s.id} student={s} isTop3 />
            ))}
            {filtered.map(s => (
              <MobileCard key={s.id} student={s} />
            ))}
            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-white/30 font-bold">
                No scholars found for "{search}"
              </div>
            )}
          </div>
        </div>

        {/* ── See More ───────────────────────────────────────────────── */}
        {!search && (
          <div className="flex justify-center mt-8">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Load More Scholars <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ── Sticky My Rank Card ──────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-3xl mx-auto px-4 pb-4 pointer-events-auto">
          <div
            className="rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 backdrop-blur-2xl border shadow-2xl"
            style={{
              backgroundColor: `${COLORS.cardAlt}ee`,
              borderColor: `${COLORS.purple}40`,
              boxShadow: `0 0 40px ${COLORS.purple}20, 0 20px 60px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Left: My info */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})` }}
                >
                  8
                </div>
                <div
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2"
                  style={{ backgroundColor: COLORS.purple, borderColor: COLORS.cardAlt }}
                >
                  #
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 leading-none mb-1">Your Standing</p>
                <h4 className="text-base sm:text-lg font-black text-white leading-tight truncate">Masum Billah</h4>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-[11px] font-bold flex items-center gap-1" style={{ color: COLORS.gold }}>
                    🔥 45d Streak
                  </span>
                  <span className="text-[11px] font-bold flex items-center gap-1" style={{ color: COLORS.green }}>
                    <Zap size={11} /> Level 42
                  </span>
                </div>
              </div>
            </div>

            {/* Right: XP progress */}
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Next Rank</p>
              <p
                className="text-lg sm:text-xl font-black bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.pink})` }}
              >
                1,240 XP
              </p>
              <div className="w-24 sm:w-28 h-1.5 rounded-full mt-1.5 overflow-hidden ml-auto" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: "40%", background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.pink})` }}
                />
              </div>
              <p className="text-[9px] text-white/20 font-bold mt-1">40% to #7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TABLE ROW (Desktop) ───────────────────────────────────────────────────
function TableRow({ student, isTop3 = false, delay = 0 }: {
  student: any; isTop3?: boolean; delay?: number;
}) {
  return (
    <tr
      className="group border-b transition-all duration-200 hover:bg-white/[0.025]"
      style={{ borderColor: COLORS.border, animationDelay: `${delay}s` }}
    >
      <td className="px-6 py-4">
        <RankBadge rank={student.rank} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar
            initials={student.initials}
            photo={student.photo}
            size={38}
            rank={isTop3 ? student.rank : undefined}
          />
          <div>
            <p className="text-sm font-black text-white leading-tight">{student.name}</p>
            <p className="text-[11px] font-bold text-white/30">{student.courses} courses</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <XPBar level={student.level} />
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-black text-white/80">
          {student.xp.toLocaleString()}
          <span className="text-[10px] font-bold text-white/30 ml-1">XP</span>
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 font-black text-sm" style={{ color: COLORS.gold }}>
          🔥 <span>{student.streak}d</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <BadgeDots count={student.badges} />
      </td>
      <td className="px-6 py-4">
        <TrendBadge trend={student.trend} />
      </td>
    </tr>
  );
}

// ── MOBILE CARD ───────────────────────────────────────────────────────────
function MobileCard({ student, isTop3 = false }: { student: any; isTop3?: boolean }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors"
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-7 flex justify-center">
        <RankBadge rank={student.rank} />
      </div>

      {/* Avatar */}
      <Avatar
        initials={student.initials}
        photo={student.photo}
        size={42}
        rank={isTop3 ? student.rank : undefined}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-white truncate">{student.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-bold text-white/40">Lv.{student.level}</span>
          <span className="text-[11px] font-bold" style={{ color: COLORS.gold }}>🔥{student.streak}d</span>
        </div>
      </div>

      {/* XP + trend */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-black text-white/80">{(student.xp / 1000).toFixed(1)}k <span className="text-white/30 text-[10px]">XP</span></p>
        <TrendBadge trend={student.trend} />
      </div>
    </div>
  );
}
