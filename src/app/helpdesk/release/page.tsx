"use client";

import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";

interface UserData { name: string; email: string; photoURL?: string; role: string; }

function getStoredUser(): UserData | null {
  if (typeof window === "undefined") return null;
  try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}

interface ReleaseNote {
  _id: string; date: string; title: string;
  version: string; tag: string; description: string;
}

const SIDEBAR_STATS = [
  { label: "Courses Topics",   icon: "🎯" },
  { label: "Bugs",             icon: "🪲" },
  { label: "Feature Requests", icon: "📊" },
  { label: "Others",           icon: "📂" },
  { label: "Announcements",    icon: "📢" },
  { label: "Resolved",         icon: "✅" },
];

const ReleaseNotesPage = () => {
  const [user,    setUser]    = useState<UserData | null>(null);
  const [notes,   setNotes]   = useState<ReleaseNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ localStorage থেকে user
    const token = localStorage.getItem("token");
    if (token) setUser(getStoredUser());

    fetch("/api/help/releases")
      .then((r) => r.json())
      .then((d) => setNotes(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-8 font-sans transition-colors duration-300">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 h-full">

        {/* Main */}
        <div className="flex-1 space-y-12 pr-2">
          {loading ? (
            <div className="flex justify-center py-20"><FiLoader className="animate-spin text-purple-500" size={28} /></div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20 text-slate-400">No release notes yet.</div>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="bg-slate-50 dark:bg-slate-900 py-6 text-center">
                  <h2 className="text-xl font-bold text-secondary dark:text-white uppercase tracking-wider">RELEASE NOTE : {note.date}</h2>
                </div>
                <div className="p-8 space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{note.title} <span className="text-slate-500 dark:text-slate-400">- {note.version}</span></h3>
                    <p className="text-sm text-slate-400 mt-1">Web Course • {note.date}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 italic py-2">{note.tag}</p>
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                    <div className="badge badge-secondary badge-lg rounded-md font-semibold px-4">Published</div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed pt-4">{note.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 sticky top-8 self-start space-y-4">

          {/* ✅ localStorage user card */}
          {user && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 flex items-center gap-4">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30" />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg bg-gradient-to-br from-[#832388] to-[#F0772F] border-2 border-purple-500/30">
                  {firstLetter}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                <span className="inline-block mt-1 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] text-white">{user.role}</span>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <ul className="space-y-6">
              {SIDEBAR_STATS.map((stat) => (
                <li key={stat.label} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{stat.icon}</span>
                    <span className="text-slate-600 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">{stat.label}</span>
                  </div>
                  <span className="font-bold text-slate-700 dark:text-white">—</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ReleaseNotesPage;