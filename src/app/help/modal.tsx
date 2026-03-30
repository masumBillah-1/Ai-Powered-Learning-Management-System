"use client";

import React, { useState, useRef, useEffect } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { FiX, FiChevronDown, FiLoader } from "react-icons/fi";

type PostType = "Courses Topics" | "Bugs" | "Feature Requests" | "Announcements" | "Others";
type BatchType = "Batch-10" | "Batch-11" | "Batch-12" | "Batch-13";

interface UserData { name: string; email: string; photoURL?: string; role: string; }

// ✅ Navbar.tsx এর মতোই
function getStoredUser(): UserData | null {
  if (typeof window === "undefined") return null;
  try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}

interface Props { onClose: () => void; onSuccess?: () => void; }

const POST_TYPES: PostType[] = ["Courses Topics", "Bugs", "Feature Requests", "Announcements", "Others"];
const BATCHES:    BatchType[] = ["Batch-10", "Batch-11", "Batch-12", "Batch-13"];
const TYPE_COLORS: Record<PostType, string> = {
  "Courses Topics":   "text-red-400",
  "Bugs":             "text-yellow-400",
  "Feature Requests": "text-pink-400",
  "Announcements":    "text-blue-400",
  "Others":           "text-purple-400",
};

const CreatePostModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser(getStoredUser());
  }, []);

  const [title,             setTitle]             = useState("");
  const [content,           setContent]           = useState("");
  const [postType,          setPostType]          = useState<PostType>("Courses Topics");
  const [batch,             setBatch]             = useState<BatchType>("Batch-12");
  const [mediaFiles,        setMediaFiles]        = useState<File[]>([]);
  const [showTypeDropdown,  setShowTypeDropdown]  = useState(false);
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState("");
  const [success,           setSuccess]           = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMediaFiles((p) => [...p, ...Array.from(e.target.files ?? [])]);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    for (const item of Array.from(e.clipboardData?.items ?? []))
      if (item.type.startsWith("image/")) { const f = item.getAsFile(); if (f) setMediaFiles((p) => [...p, f]); }
  };

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/help/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:     title.trim(),
          content:   content.trim(),
          postType,
          batch,
          mediaUrls: [],
          author: {
            userId: user.email,          // ✅ localStorage user এ uid নেই, email use করছি
            name:   user.name,
            email:  user.email,
            image:  user.photoURL || "",
          },
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSuccess(true);
      setTimeout(() => { onSuccess?.(); onClose(); }, 1200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[740px] bg-[#0f0b1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden" style={{ animation: "modalIn 0.2s ease-out forwards" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-purple-500/30" />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-[#832388] to-[#F0772F]">{firstLetter}</div>
            )}
            <div>
              <h2 className="text-white font-bold text-base">Create Post</h2>
              {user && <p className="text-[10px] text-gray-500">{user.name} · {user.email}</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5"><FiX size={18} /></button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-red-400 text-xs font-semibold">{error}</div>}

          <div>
            <label className="text-[11px] text-gray-400 font-bold mb-1.5 block">Title <span className="text-gray-600">(optional)</span></label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your post a title..." className="w-full bg-[#1a1530] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/50 transition" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-gray-400 font-bold mb-1.5 block">Post Type</label>
              <div className="relative">
                <button type="button" onClick={() => { setShowTypeDropdown((p) => !p); setShowBatchDropdown(false); }} className={`w-full bg-[#1a1530] border border-white/5 rounded-xl px-4 py-2.5 text-sm flex justify-between items-center hover:border-purple-500/30 transition ${TYPE_COLORS[postType]}`}>
                  {postType} <FiChevronDown className={`text-gray-500 transition-transform ${showTypeDropdown ? "rotate-180" : ""}`} />
                </button>
                {showTypeDropdown && (
                  <div className="absolute top-full mt-1 w-full bg-[#1a1530] border border-white/10 rounded-xl overflow-hidden z-20 shadow-lg">
                    {POST_TYPES.map((t) => (
                      <button key={t} type="button" onClick={() => { setPostType(t); setShowTypeDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-purple-600/20 transition ${postType === t ? TYPE_COLORS[t] : "text-gray-400"}`}>{t}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-[11px] text-gray-400 font-bold mb-1.5 block">Batch</label>
              <div className="relative">
                <button type="button" onClick={() => { setShowBatchDropdown((p) => !p); setShowTypeDropdown(false); }} className="w-full bg-[#1a1530] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white flex justify-between items-center hover:border-purple-500/30 transition">
                  {batch} <FiChevronDown className={`text-gray-500 transition-transform ${showBatchDropdown ? "rotate-180" : ""}`} />
                </button>
                {showBatchDropdown && (
                  <div className="absolute top-full mt-1 w-full bg-[#1a1530] border border-white/10 rounded-xl overflow-hidden z-20 shadow-lg">
                    {BATCHES.map((b) => (
                      <button key={b} type="button" onClick={() => { setBatch(b); setShowBatchDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-purple-600/20 transition ${batch === b ? "text-purple-400" : "text-gray-400"}`}>{b}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-bold mb-1.5 block">Content <span className="text-red-500">*</span></label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} onPaste={handlePaste} rows={6} placeholder="Describe your issue, question or idea..." className="w-full bg-[#1a1530] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/50 transition resize-none" />
          </div>

          {!content.trim() && <p className="text-red-500 text-[11px] font-semibold -mt-2">Content is required!</p>}
          <p className="text-green-400 text-[11px] -mt-2">💡 Clipboard থেকে সরাসরি image paste করতে পারো (Ctrl+V / Cmd+V)</p>

          {mediaFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mediaFiles.map((file, idx) => (
                <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setMediaFiles((p) => p.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"><FiX size={10} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <div>
            <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 text-pink-500 text-sm font-semibold hover:opacity-80 transition">
              <HiOutlinePhotograph size={22} /> Photo/Video
            </button>
            <p className="text-[9px] text-gray-600 mt-0.5">Image ≤ 5MB · Video ≤ 30MB</p>
            <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />
          </div>
          <button type="button" onClick={handleSubmit} disabled={!content.trim() || loading || success || !user}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${success ? "bg-green-600 text-white scale-95" : content.trim() && !loading && user ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-600/30 text-purple-400/50 cursor-not-allowed"}`}>
            {loading && <FiLoader className="animate-spin" size={14} />}
            {success ? "✓ Posted!" : loading ? "Posting..." : "Submit Post"}
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
};

export default CreatePostModal;