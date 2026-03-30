"use client";

import React, { useEffect, useState } from "react";
import { FaSearch, FaSyncAlt, FaCheckCircle } from "react-icons/fa";
import { FiLoader, FiPlus, FiX } from "react-icons/fi";

interface UserData { name: string; email: string; photoURL?: string; role: string; }

function getStoredUser(): UserData | null {
  if (typeof window === "undefined") return null;
  try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}

interface Ticket {
  _id: string;
  user: { userId: string; name: string; image: string; email: string };
  title: string; tags: string[]; category: string;
  column: "investigating" | "inProgress" | "resolved";
  createdAt: string;
}

const COLUMN_META = {
  investigating: { label: "Investigating",   icon: <FaSearch size={14} />,      color: "text-purple-400", bg: "bg-purple-900/20", border: "border-purple-900/30" },
  inProgress:    { label: "Dev In-Progress", icon: <FaSyncAlt size={14} />,     color: "text-blue-400",   bg: "bg-blue-900/20",   border: "border-blue-900/30"   },
  resolved:      { label: "Resolved",        icon: <FaCheckCircle size={14} />, color: "text-emerald-400",bg: "bg-emerald-900/20",border: "border-emerald-900/30" },
};

const AddTicketModal = ({ onClose, onSuccess, user }: { onClose: () => void; onSuccess: () => void; user: UserData }) => {
  const [title,    setTitle]    = useState("");
  const [tags,     setTags]     = useState("");
  const [category, setCategory] = useState("Website");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return; setLoading(true); setError("");
    try {
      const res = await fetch("/api/help/roadmap", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, category,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          column: "investigating",
          user: { userId: user.email, name: user.name, email: user.email, image: user.photoURL || "" },
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      onSuccess(); onClose();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  const firstLetter = user.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f0b1e] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {user.photoURL
              ? <img src={user.photoURL} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
              : <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs bg-gradient-to-br from-[#832388] to-[#F0772F]">{firstLetter}</div>
            }
            <h3 className="text-white font-bold">{user.name}</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><FiX /></button>
        </div>
        {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-gray-400 font-bold block mb-1">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Describe the issue..." className="w-full bg-[#1a1530] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/50" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-bold block mb-1">Tags (comma separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Bugs, Website..." className="w-full bg-[#1a1530] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/50" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-bold block mb-1">Platform</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#1a1530] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
              <option>Website</option><option>Android App</option><option>Desktop App</option>
            </select>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={!title.trim() || loading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
          {loading ? <FiLoader className="animate-spin" size={14} /> : <FiPlus size={14} />}
          {loading ? "Submitting..." : "Submit Issue"}
        </button>
      </div>
    </div>
  );
};

const TicketCard = ({ ticket, borderColor }: { ticket: Ticket; borderColor: string }) => (
  <div className={`p-5 rounded-xl border ${borderColor} bg-white/[0.01] hover:bg-white/[0.03] transition-colors`}>
    <div className="flex items-center gap-3 mb-3">
      {ticket.user.image
        ? <img src={ticket.user.image} alt={ticket.user.name} className="w-8 h-8 rounded-full border border-gray-600 object-cover" />
        : <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-[#832388] to-[#F0772F]">{ticket.user.name?.charAt(0)}</div>
      }
      <div>
        <span className="text-sm font-bold text-black dark:text-white block">{ticket.user.name}</span>
        <span className="text-[10px] text-gray-500">{new Date(ticket.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
      </div>
    </div>
    <h3 className="font-bold text-black dark:text-white mb-4 leading-tight">{ticket.title}</h3>
    <div className="flex gap-2 flex-wrap">
      {ticket.tags.map((tag) => <span key={tag} className="text-[10px] text-gray-300 px-2 py-1 rounded border border-white/10 uppercase tracking-wider">{tag}</span>)}
      {ticket.category && <span className="text-[10px] text-gray-400 px-2 py-1 rounded border border-white/10 uppercase font-bold">{ticket.category}</span>}
    </div>
  </div>
);

const Roadmap = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser(getStoredUser());
  }, []);

  const [tickets,   setTickets]   = useState<{ investigating: Ticket[]; inProgress: Ticket[]; resolved: Ticket[] }>({ investigating: [], inProgress: [], resolved: [] });
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try { const res = await fetch("/api/help/roadmap"); setTickets(await res.json()); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, []);

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen p-8 text-gray-200 font-sans">
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Roadmap</h1>
          <p className="text-gray-500 text-sm mt-1">Track issues and development progress</p>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              {user.photoURL
                ? <img src={user.photoURL} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                : <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-[10px] bg-gradient-to-br from-[#832388] to-[#F0772F]">{firstLetter}</div>
              }
              <span className="text-xs font-bold text-white">{user.name}</span>
            </div>
          )}
          {user && (
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition">
              <FiPlus size={14} /> Report Issue
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><FiLoader className="animate-spin text-purple-500" size={28} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {(Object.keys(COLUMN_META) as (keyof typeof COLUMN_META)[]).map((col) => {
            const meta = COLUMN_META[col]; const items = tickets[col] || [];
            return (
              <section key={col}>
                <div className={`flex items-center gap-2 mb-4 ${meta.color} font-medium ${meta.bg} w-fit px-3 py-1 rounded-md`}>
                  {meta.icon} {meta.label} ({items.length})
                </div>
                <div className="space-y-4">
                  {items.length === 0
                    ? <div className={`p-5 rounded-xl border ${meta.border} text-center text-gray-600 text-xs`}>No tickets yet</div>
                    : items.map((t) => <TicketCard key={t._id} ticket={t} borderColor={meta.border} />)
                  }
                </div>
              </section>
            );
          })}
        </div>
      )}

      {showModal && user && <AddTicketModal onClose={() => setShowModal(false)} onSuccess={fetchTickets} user={user} />}
    </div>
  );
};

export default Roadmap;