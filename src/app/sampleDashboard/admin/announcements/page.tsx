"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Megaphone, Calendar } from "lucide-react";

type Target = "all" | "students" | "instructors";

interface Announcement {
  id: number;
  title: string;
  content: string;
  target: Target;
  date: string;
  author: string;
}

export default function AdminAnnouncementsPage() {
  const [theme, setTheme] = useState("light");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState<Target>("all");

  // ── Dark/Light sync ──
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    const interval = setInterval(() => {
      const current = localStorage.getItem("theme") || "light";
      if (current !== theme) {
        setTheme(current);
        document.documentElement.setAttribute("data-theme", current);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [theme]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, title: "Platform Maintenance",   content: "আগামীকাল রাত ১২টায় ১ ঘণ্টা maintenance থাকবে।",        target: "all",         date: "Mar 1, 2024",  author: "Admin" },
    { id: 2, title: "New Feature: Live Classes", content: "এখন থেকে live class করা যাবে। Instructors দেখুন।", target: "instructors", date: "Feb 25, 2024", author: "Admin" },
    { id: 3, title: "Enrollment Open",        content: "নতুন batch এর enrollment শুরু হয়েছে।",                 target: "students",    date: "Feb 20, 2024", author: "Admin" },
  ]);

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) return;
    setAnnouncements(prev => [{
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      target,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      author: "Admin",
    }, ...prev]);
    setTitle(""); setContent(""); setTarget("all"); setShowForm(false);
  };

  const handleDelete = (id: number) => setAnnouncements(prev => prev.filter(a => a.id !== id));

  const targetCfg: Record<Target, { bg: string; text: string }> = {
    all:         { bg: "bg-purple-500/10",  text: "text-purple-500"  },
    students:    { bg: "bg-error/10",       text: "text-error"       },
    instructors: { bg: "bg-warning/10",     text: "text-warning"     },
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Admin Panel</p>
          <h1 className="text-3xl font-black tracking-tight">Announcements</h1>
          <p className="text-sm opacity-50 mt-1">Broadcast messages to your platform</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="btn btn-sm gap-2 border-0 text-white cursor-pointer"
          style={{ backgroundColor: "#832388" }}
        >
          <Plus size={15} /> New Announcement
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="rounded-2xl bg-base-100 border border-base-300 p-6 mb-6">
          <h3 className="text-sm font-black uppercase tracking-wider opacity-50 mb-4">Create Announcement</h3>
          <div className="flex flex-col gap-3">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Announcement title..."
              className="input input-sm bg-base-200 border-base-300 text-sm w-full focus:outline-none"
            />
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your message..."
              rows={3}
              className="textarea bg-base-200 border-base-300 text-sm w-full focus:outline-none resize-none"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold opacity-50 uppercase tracking-wider">Target:</span>
              {(["all", "students", "instructors"] as Target[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  className="px-3 py-1 rounded-full text-xs font-bold capitalize cursor-pointer transition-all border-0"
                  style={target === t ? { backgroundColor: "#832388", color: "#fff" } : {}}
                >
                  {t}
                </button>
              ))}
              <div className="ml-auto flex gap-2">
                <button onClick={() => setShowForm(false)} className="btn btn-xs cursor-pointer">Cancel</button>
                <button
                  onClick={handlePublish}
                  disabled={!title.trim() || !content.trim()}
                  className="btn btn-xs border-0 text-white cursor-pointer disabled:opacity-40"
                  style={{ backgroundColor: "#832388" }}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
        {announcements.length === 0 && (
          <div className="text-center py-16 opacity-40 text-sm font-semibold">No announcements yet</div>
        )}
        {announcements.map((a, i) => {
          const t = targetCfg[a.target];
          return (
            <div
              key={a.id}
              className={`flex items-start justify-between gap-4 px-6 py-5 ${i !== announcements.length - 1 ? "border-b border-base-300" : ""}`}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "#832388", opacity: 0.85 }}
              >
                <Megaphone size={16} color="#fff" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-sm font-black">{a.title}</h3>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold capitalize ${t.bg} ${t.text}`}>
                    {a.target}
                  </span>
                </div>
                <p className="text-sm opacity-60 mb-2">{a.content}</p>
                <div className="flex items-center gap-1 text-xs opacity-40">
                  <Calendar size={11} />
                  {a.author} · {a.date}
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(a.id)}
                className="btn btn-xs btn-square border-0 text-white cursor-pointer tooltip flex-shrink-0"
                data-tip="Delete"
                style={{ backgroundColor: "#FF0F7B" }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}