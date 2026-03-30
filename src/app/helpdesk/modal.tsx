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
const BATCHES: BatchType[] = ["Batch-10", "Batch-11", "Batch-12", "Batch-13"];
const TYPE_COLORS: Record<PostType, string> = {
  "Courses Topics": "text-red-400",
  "Bugs": "text-yellow-400",
  "Feature Requests": "text-pink-400",
  "Announcements": "text-blue-400",
  "Others": "text-purple-400",
};

const CreatePostModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser(getStoredUser());
  }, []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<PostType>("Courses Topics");
  const [batch, setBatch] = useState<BatchType>("Batch-12");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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
          title: title.trim(),
          content: content.trim(),
          postType,
          batch,
          mediaUrls: [],
          author: {
            userId: user.email,          // ✅ localStorage user এ uid নেই, email use করছি
            name: user.name,
            email: user.email,
            image: user.photoURL || "",
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
    <div className="modal modal-open" style={{ zIndex: 9999 }}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-box relative w-full max-w-[740px] p-0 overflow-hidden rounded-2xl shadow-2xl" style={{ border: "1px solid rgba(131,35,136,0.25)", zIndex: 10000 }}>
        {/* ✅ Gradient top border matching announcements */}
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#832388,#E3436B,#F89B29)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-lg" style={{ background: "linear-gradient(135deg,#832388,#E3436B)" }}>📝</div>
            <div>
              <h3 className="text-lg font-bold leading-tight">Create Post</h3>
              {user && <p className="text-xs opacity-40 mt-0.5">{user.name} · {user.email}</p>}
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle opacity-50 hover:opacity-100 cursor-pointer"><FiX size={18} /></button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-red-400 text-xs font-semibold">{error}</div>}

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-bold uppercase tracking-wider opacity-50">Title <span className="opacity-30">(optional)</span></span>
            </label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your post a title..." className="input input-bordered w-full" style={{ borderColor: title ? "#832388" : undefined, boxShadow: title ? "0 0 0 3px rgba(131,35,136,0.1)" : undefined }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-bold uppercase tracking-wider opacity-50">Post Type</span>
              </label>
              <div className="relative">
                <button type="button" onClick={() => { setShowTypeDropdown((p) => !p); setShowBatchDropdown(false); }} className={`select select-bordered w-full flex justify-between items-center cursor-pointer ${TYPE_COLORS[postType]}`} style={{ borderColor: "#832388", boxShadow: "0 0 0 3px rgba(131,35,136,0.1)" }}>
                  {postType} <FiChevronDown className={`transition-transform ${showTypeDropdown ? "rotate-180" : ""}`} />
                </button>
                {showTypeDropdown && (
                  <div className="absolute top-full mt-1 w-full bg-base-100 border border-base-300 rounded-xl overflow-hidden z-20 shadow-lg">
                    {POST_TYPES.map((t) => (
                      <button key={t} type="button" onClick={() => { setPostType(t); setShowTypeDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-purple-600/20 transition ${postType === t ? TYPE_COLORS[t] : "opacity-60"}`}>{t}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-bold uppercase tracking-wider opacity-50">Batch</span>
              </label>
              <div className="relative">
                <button type="button" onClick={() => { setShowBatchDropdown((p) => !p); setShowTypeDropdown(false); }} className="select select-bordered w-full flex justify-between items-center cursor-pointer" style={{ borderColor: "#832388", boxShadow: "0 0 0 3px rgba(131,35,136,0.1)" }}>
                  {batch} <FiChevronDown className={`transition-transform ${showBatchDropdown ? "rotate-180" : ""}`} />
                </button>
                {showBatchDropdown && (
                  <div className="absolute top-full mt-1 w-full bg-base-100 border border-base-300 rounded-xl overflow-hidden z-20 shadow-lg">
                    {BATCHES.map((b) => (
                      <button key={b} type="button" onClick={() => { setBatch(b); setShowBatchDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-purple-600/20 transition ${batch === b ? "text-purple-400" : "opacity-60"}`}>{b}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-bold uppercase tracking-wider opacity-50">Content <span className="text-red-500">*</span></span>
              <span className="label-text-alt opacity-30 text-xs">{content.length}/1000</span>
            </label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} onPaste={handlePaste} rows={6} maxLength={1000} placeholder="Describe your issue, question or idea..." className="textarea textarea-bordered w-full resize-none" style={{ borderColor: content ? "#832388" : undefined, boxShadow: content ? "0 0 0 3px rgba(131,35,136,0.1)" : undefined }} />
          </div>

          {!content.trim() && <p className="text-red-500 text-xs font-semibold -mt-2">Content is required!</p>}
          <p className="text-green-400 text-xs -mt-2">💡 Clipboard থেকে সরাসরি image paste করতে পারো (Ctrl+V / Cmd+V)</p>

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
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-base-300" style={{ backgroundColor: "rgba(131,35,136,0.05)" }}>
          <div>
            <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 text-pink-500 text-sm font-semibold hover:opacity-80 transition cursor-pointer">
              <HiOutlinePhotograph size={22} /> Photo/Video
            </button>
            <p className="text-xs opacity-40 mt-0.5">Image ≤ 5MB · Video ≤ 30MB</p>
            <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />
          </div>
          <button type="button" onClick={handleSubmit} disabled={!content.trim() || loading || success || !user}
            className={`btn btn-sm gap-1.5 text-white border-0 cursor-pointer ${success ? "bg-green-600" : ""}`}
            style={{
              background: success ? "#16a34a" : loading || !content.trim() || !user ? "#ccc" : "linear-gradient(135deg,#832388,#E3436B,#F89B29)",
              boxShadow: loading || !content.trim() || !user ? "none" : "0 4px 12px rgba(131,35,136,0.35)"
            }}>
            {loading && <FiLoader className="animate-spin" size={14} />}
            {success ? "✓ Posted!" : loading ? "Posting..." : "Submit Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;