"use client";

import React, { useEffect, useState } from "react";
import { BiMessageSquareDetail, BiUpvote } from "react-icons/bi";
import { CiGlobe } from "react-icons/ci";
import { MdOutlineSmartphone } from "react-icons/md";
import { LuMonitor } from "react-icons/lu";
import { FaHeadphonesAlt } from "react-icons/fa";
import { FiLoader, FiX, FiPlus } from "react-icons/fi";

interface UserData { name: string; email: string; photoURL?: string; role: string; }

function getStoredUser(): UserData | null {
  if (typeof window === "undefined") return null;
  try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}

interface FeatureRequest {
  _id: string;
  user: { userId: string; name: string; image: string; email: string };
  title: string; description: string;
  platform: "Desktop App" | "Android App" | "Website";
  status: "Acknowledged" | "Planned" | "In Progress" | "Resolved";
  votes: string[];
  comments: { _id: string; userName: string; content: string; createdAt: string }[];
  createdAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  "Acknowledged": "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  "Planned":      "text-blue-400   bg-blue-400/10   border-blue-400/20",
  "In Progress":  "text-green-400  bg-green-400/10  border-green-400/20",
  "Resolved":     "text-teal-400   bg-teal-400/10   border-teal-400/20",
};

const NewIdeaModal = ({ onClose, onSuccess, user }: { onClose: () => void; onSuccess: () => void; user: UserData }) => {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [platform,    setPlatform]    = useState<"Desktop App" | "Android App" | "Website">("Website");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return; setLoading(true); setError("");
    try {
      const res = await fetch("/api/help/features", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, platform,
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
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {user.photoURL
              ? <img src={user.photoURL} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
              : <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs bg-gradient-to-br from-[#832388] to-[#F0772F]">{firstLetter}</div>
            }
            <h3 className="text-slate-800 dark:text-white font-bold">Share New Idea</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><FiX /></button>
        </div>
        {error && <p className="text-red-500 text-xs bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3 py-2 rounded-lg">{error}</p>}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-slate-500 font-bold block mb-1">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What feature do you want?" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-purple-400" />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-bold block mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain in detail..." rows={3} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-purple-400 resize-none" />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-bold block mb-1">Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value as typeof platform)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white outline-none">
              <option>Website</option><option>Android App</option><option>Desktop App</option>
            </select>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={!title.trim() || loading} className="w-full bg-gradient-to-r from-fuchsia-600 to-orange-400 text-white text-sm font-bold py-2.5 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2">
          {loading ? <FiLoader className="animate-spin" size={14} /> : <FiPlus size={14} />}
          {loading ? "Submitting..." : "Submit Idea"}
        </button>
      </div>
    </div>
  );
};

const FeatureBoard = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser(getStoredUser());
  }, []);

  const [requests,    setRequests]    = useState<FeatureRequest[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [voteLoading, setVoteLoading] = useState<string | null>(null);

  const fetchFeatures = async () => {
    setLoading(true);
    try { const res = await fetch("/api/help/features"); setRequests(await res.json()); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchFeatures(); }, []);

  const handleVote = async (id: string) => {
    if (!user) return; setVoteLoading(id);
    try {
      await fetch(`/api/help/features/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote", userId: user.email }),
      });
      setRequests((prev) => prev.map((r) => {
        if (r._id !== id) return r;
        const voted = r.votes.includes(user.email);
        return { ...r, votes: voted ? r.votes.filter((v) => v !== user.email) : [...r.votes, user.email] };
      }));
    } finally { setVoteLoading(null); }
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="container mx-auto p-6 bg-base-100 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Requested Features</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Here is a list of all the features that many of you asked for.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* ✅ localStorage user chip */}
          {user && (
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 shadow-sm">
              {user.photoURL
                ? <img src={user.photoURL} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-purple-400/30" />
                : <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs bg-gradient-to-br from-[#832388] to-[#F0772F]">{firstLetter}</div>
              }
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-800 dark:text-white">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{user.email}</p>
              </div>
            </div>
          )}
          <button onClick={() => user ? setShowModal(true) : alert("Please login first")}
            className="btn btn-secondary bg-gradient-to-r from-fuchsia-600 to-orange-400 text-white normal-case rounded-xl shadow-lg">
            <FiPlus /> Share New Idea
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><FiLoader className="animate-spin text-purple-500" size={28} /></div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 text-slate-400">No feature requests yet. Be the first!</div>
      ) : (
        <div className="space-y-4">
          {requests.map((item) => {
            const hasVoted = user ? item.votes.includes(user.email) : false;
            return (
              <div key={item._id} className="card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="card-body p-5 flex-row items-start gap-4">
                  <div className="avatar"><div className="w-10 rounded-full">
                    {item.user.image
                      ? <img src={item.user.image} alt={item.user.name} />
                      : <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-[#832388] to-[#F0772F]">{item.user.name?.charAt(0)}</div>
                    }
                  </div></div>

                  <div className="flex-1">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700 dark:text-white">{item.user.name}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <FaHeadphonesAlt />
                        {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100 mt-2">{item.title}</h2>
                    {item.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <div className="badge border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 py-3 px-3 gap-2 rounded-lg">
                        <BiMessageSquareDetail /> {item.comments.length} Comments
                      </div>
                      <div className="badge border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 py-3 px-3 gap-2 rounded-lg">
                        {item.platform === "Website" ? <CiGlobe /> : item.platform === "Android App" ? <MdOutlineSmartphone /> : <LuMonitor />}
                        {item.platform}
                      </div>
                      <div className={`badge py-3 px-3 gap-2 rounded-lg border text-[10px] font-black ${STATUS_COLOR[item.status]}`}>
                        <FaHeadphonesAlt /> {item.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <button onClick={() => handleVote(item._id)} disabled={!user || voteLoading === item._id} title={!user ? "Login to vote" : hasVoted ? "Remove vote" : "Upvote"}
                      className={`btn btn-sm border flex items-center gap-2 px-4 transition-all ${hasVoted ? "bg-purple-600 border-purple-500 text-white hover:bg-purple-700" : "btn-ghost border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200"} disabled:opacity-40`}>
                      {voteLoading === item._id ? <FiLoader className="animate-spin" size={12} /> : <BiUpvote size={14} className={hasVoted ? "text-white" : ""} />}
                      {item.votes.length} Votes
                    </button>
                    {!user && <p className="text-[9px] text-slate-400">Login to vote</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && user && <NewIdeaModal onClose={() => setShowModal(false)} onSuccess={fetchFeatures} user={user} />}
    </div>
  );
};

export default FeatureBoard;