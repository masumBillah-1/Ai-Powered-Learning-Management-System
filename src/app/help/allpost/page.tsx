"use client";

import React, { useState, useEffect, useCallback } from "react";
import { HiOutlinePhotograph, HiOutlineSearch, HiOutlineSpeakerphone } from "react-icons/hi";
import { BiMessageRoundedDetail, BiCategory, BiUpvote } from "react-icons/bi";
import { MdOutlineBugReport, MdOutlineLightbulb, MdCheckCircleOutline } from "react-icons/md";
import { FiMoreHorizontal, FiLoader, FiRefreshCw } from "react-icons/fi";
import { LuClock } from "react-icons/lu";
import Link from "next/link";
import CreatePostModal from "../modal";

// ✅ Navbar.tsx এর মতোই localStorage pattern
interface UserData { name: string; email: string; photoURL?: string; role: string; }

function getStoredUser(): UserData | null {
  if (typeof window === "undefined") return null;
  try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}

interface HelpPost {
  _id: string; title: string; content: string; postType: string; batch: string;
  status: "Open" | "Resolved" | "Reopened" | "Pending";
  author: { userId: string; name: string; image: string; email: string };
  votes: string[];
  comments: { _id: string; userName: string; userImage: string; content: string; createdAt: string }[];
  createdAt: string;
}

interface SidebarCount { _id: string; count: number }

const timeAgo = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(m / 60), days = Math.floor(h / 24);
  if (days > 0) return `${days}d ago`; if (h > 0) return `${h}h ago`; if (m > 0) return `${m}m ago`; return "just now";
};

const TYPE_COLOR: Record<string, string> = {
  "Courses Topics":   "text-red-400    bg-red-500/10    border-red-500/20",
  "Bugs":             "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  "Feature Requests": "text-pink-400   bg-pink-500/10   border-pink-500/20",
  "Announcements":    "text-blue-400   bg-blue-500/10   border-blue-500/20",
  "Others":           "text-purple-400 bg-purple-500/10 border-purple-500/20",
};
const STATUS_COLOR: Record<string, string> = {
  Open: "text-green-400 bg-green-500/10 border-green-500/20",
  Resolved: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  Reopened: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Pending: "text-gray-400 bg-gray-500/10 border-gray-500/20",
};

// ── Comment Box ───────────────────────────────────────────────────────────────
const CommentBox = ({ postId, user, onDone }: { postId: string; user: UserData; onDone: () => void }) => {
  const [text, setText] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!text.trim()) return; setLoading(true);
    try {
      await fetch(`/api/help/posts/${postId}`, { method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "comment", userId: user.email, userName: user.name, userImage: user.photoURL || "", content: text.trim() }) });
      setText(""); onDone();
    } finally { setLoading(false); }
  };
  return (
    <div className="mt-4 flex gap-2">
      {user.photoURL
        ? <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full flex-shrink-0 object-cover" />
        : <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-xs bg-gradient-to-br from-[#832388] to-[#F0772F]">{user.name?.charAt(0)}</div>
      }
      <div className="flex-1 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Write a comment..." className="flex-1 bg-[#1a1530] border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-600 outline-none focus:border-purple-500/40" />
        <button onClick={submit} disabled={!text.trim() || loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition">
          {loading ? <FiLoader className="animate-spin" size={12} /> : "Post"}
        </button>
      </div>
    </div>
  );
};

// ── Post Card ─────────────────────────────────────────────────────────────────
const PostCard = ({ post, currentUser, onRefresh }: { post: HelpPost; currentUser: UserData | null; onRefresh: () => void }) => {
  const [expanded, setExpanded] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const userId = currentUser?.email || "";
  const hasVoted = post.votes.includes(userId);

  const handleVote = async () => {
    if (!userId) return; setVoteLoading(true);
    try {
      await fetch(`/api/help/posts/${post._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "vote", userId }) });
      onRefresh();
    } finally { setVoteLoading(false); }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            {post.author.image
              ? <img src={post.author.image} alt={post.author.name} className="w-9 h-9 rounded-full border border-white/10 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              : <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-[#832388] to-[#F0772F]">{post.author.name?.charAt(0)}</div>
            }
            <div>
              <p className="font-bold text-sm text-white">{post.author.name}</p>
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <LuClock size={10} /> {timeAgo(post.createdAt)}
                {post.batch && <span className="ml-1 text-purple-400">· {post.batch}</span>}
              </p>
            </div>
          </div>
          <span className={`text-[9px] font-black px-2.5 py-1 rounded border ${STATUS_COLOR[post.status]}`}>{post.status}</span>
        </div>

        {post.title && <h3 className="text-white font-bold text-base mb-1">{post.title}</h3>}
        <p className={`text-gray-400 text-xs leading-relaxed ${!expanded && "line-clamp-3"}`}>{post.content}</p>
        {post.content.length > 200 && (
          <button onClick={() => setExpanded((p) => !p)} className="text-purple-400 text-[10px] font-bold mt-1 hover:opacity-80">
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-3">
            <button onClick={handleVote} disabled={!userId || voteLoading}
              className={`flex items-center gap-1.5 text-xs font-bold transition px-2.5 py-1 rounded-lg border ${hasVoted ? "text-purple-400 bg-purple-500/10 border-purple-500/30" : "text-gray-500 border-white/5 hover:text-purple-400 hover:border-purple-500/20"}`}>
              <BiUpvote size={14} />
              {voteLoading ? <FiLoader className="animate-spin" size={12} /> : post.votes.length}
            </button>
            <button onClick={() => setShowComment((p) => !p)} className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white transition">
              <BiMessageRoundedDetail size={16} /> {post.comments.length} Comment{post.comments.length !== 1 ? "s" : ""}
            </button>
          </div>
          <span className={`text-[9px] font-black px-2.5 py-1 rounded border ${TYPE_COLOR[post.postType] || TYPE_COLOR["Others"]}`}>{post.postType}</span>
        </div>

        {showComment && (
          <div className="mt-3 space-y-2">
            {post.comments.map((c) => (
              <div key={c._id} className="flex gap-2 items-start">
                {c.userImage
                  ? <img src={c.userImage} alt="" className="w-6 h-6 rounded-full flex-shrink-0 object-cover" />
                  : <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-[10px] bg-gradient-to-br from-[#832388] to-[#F0772F]">{c.userName?.charAt(0)}</div>
                }
                <div className="bg-[#1a1530] rounded-xl px-3 py-2 text-xs text-gray-300 flex-1">
                  <span className="text-purple-400 font-bold mr-1">{c.userName}</span>{c.content}
                </div>
              </div>
            ))}
            {currentUser && <CommentBox postId={post._id} user={currentUser} onDone={onRefresh} />}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const AllPost = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // ✅ localStorage থেকে user — Navbar.tsx এর মতোই
    const token = localStorage.getItem("token");
    if (token) setUser(getStoredUser());
  }, []);

  const [posts,        setPosts]        = useState<HelpPost[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [search,       setSearch]       = useState("");
  const [activeType,   setActiveType]   = useState("");
  const [activeTab,    setActiveTab]    = useState<"all" | "my">("all");
  const [typeCounts,   setTypeCounts]   = useState<SidebarCount[]>([]);
  const [statusCounts, setStatusCounts] = useState<SidebarCount[]>([]);
  const [total,        setTotal]        = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeType) params.set("postType", activeType);
      if (search)     params.set("search",   search);
      if (activeTab === "my" && user) params.set("authorId", user.email);
      const res  = await fetch(`/api/help/posts?${params.toString()}`);
      const data = await res.json();
      setPosts(data.posts || []); setTotal(data.total || 0);
      setTypeCounts(data.typeCounts || []); setStatusCounts(data.statusCounts || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [activeType, search, activeTab, user]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);
  useEffect(() => { const t = setTimeout(() => fetchPosts(), 400); return () => clearTimeout(t); }, [search]); // eslint-disable-line

  const sidebarItems = [
    { icon: <BiCategory />,            label: "Courses Topics",   color: "text-red-400"    },
    { icon: <MdOutlineBugReport />,    label: "Bugs",             color: "text-yellow-400" },
    { icon: <MdOutlineLightbulb />,    label: "Feature Requests", color: "text-pink-400"   },
    { icon: <FiMoreHorizontal />,      label: "Others",           color: "text-purple-400" },
    { icon: <HiOutlineSpeakerphone />, label: "Announcements",    color: "text-blue-400"   },
    { icon: <MdCheckCircleOutline />,  label: "Resolved",         color: "text-green-400"  },
  ];

  const getCount = (label: string) => {
    const tc = typeCounts.find((t) => t._id === label); if (tc) return tc.count;
    return statusCounts.find((s) => s._id === label)?.count ?? 0;
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left */}
        <div className="lg:col-span-3 space-y-6">
          {/* Create box */}
          <div className="dark:bg-[#110c1d] p-5 shadow rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-500 flex-shrink-0">
                {user?.photoURL
                  ? <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-[#832388] to-[#F0772F]">{firstLetter}</div>
                }
              </div>
              <input type="text"
                placeholder={user ? `What's on your mind, ${user.name?.split(" ")[0]}?` : "Share or Ask something..."}
                onClick={() => user && setModalOpen(true)} readOnly
                className="w-full bg-gray-100 dark:bg-[#1a162e] rounded-full px-5 py-2.5 text-lg text-black dark:text-gray-300 outline-none border border-white/5 cursor-pointer"
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <button onClick={() => user && setModalOpen(true)} className="flex items-center gap-2 text-pink-500 text-sm font-semibold hover:opacity-80"><HiOutlinePhotograph size={20} /> Photo/Video</button>
              <button onClick={() => user && setModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-xs font-bold transition">Create Post</button>
            </div>
          </div>

          {/* Tabs + Search */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex p-1 rounded-xl border border-white/5">
              {(["all", "my"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 text-xs font-bold rounded-lg transition ${activeTab === tab ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-gray-500 hover:text-white"}`}>
                  {tab === "all" ? `All Posts (${total})` : "My Posts"}
                </button>
              ))}
              <Link href="/help/allpost" className="px-5 py-1.5 text-xs font-bold text-gray-500 hover:text-white">Admin Posts</Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="border border-white/5 bg-[#1a1530] px-4 py-1.5 rounded-lg flex items-center gap-2">
                <HiOutlineSearch className="text-gray-500" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="bg-transparent text-xs text-white outline-none placeholder-gray-600 w-32" />
              </div>
              {(activeType || search) && (
                <button onClick={() => { setActiveType(""); setSearch(""); }} className="text-[10px] text-gray-500 hover:text-red-400 font-bold flex items-center gap-1"><FiRefreshCw size={11} /> Clear</button>
              )}
            </div>
          </div>

          {activeType && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">Filtering:</span>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded border ${TYPE_COLOR[activeType]}`}>{activeType}</span>
              <button onClick={() => setActiveType("")} className="text-gray-600 hover:text-red-400 text-[10px]">✕ remove</button>
            </div>
          )}

          {/* Posts */}
          {loading ? (
            <div className="flex justify-center py-16"><FiLoader className="animate-spin text-purple-500" size={28} /></div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 border border-white/5 rounded-2xl">
              <p className="text-gray-500 font-bold">No posts found</p>
              <p className="text-gray-600 text-xs mt-1">Be the first to post!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => <PostCard key={post._id} post={post} currentUser={user} onRefresh={fetchPosts} />)}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-white/5 p-5 sticky top-8">
            {/* ✅ localStorage user card */}
            {user && (
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
                {user.photoURL
                  ? <img src={user.photoURL} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-purple-500/30" />
                  : <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-[#832388] to-[#F0772F]">{firstLetter}</div>
                }
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                  <span className="inline-block mt-0.5 text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] text-white">{user.role}</span>
                </div>
              </div>
            )}

            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Filter by type</p>
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <button key={item.label} onClick={() => setActiveType((prev) => (prev === item.label ? "" : item.label))}
                  className={`w-full flex justify-between items-center text-xs font-bold p-2.5 rounded-xl transition ${activeType === item.label ? "bg-white/10 " + item.color : "hover:bg-white/5 text-gray-400"}`}>
                  <div className={`flex items-center gap-3 ${activeType === item.label ? item.color : ""}`}>{item.icon} {item.label}</div>
                  <span className="text-gray-600 font-mono">{getCount(item.label)}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Status</p>
              {statusCounts.map((s) => (
                <div key={s._id} className="flex justify-between text-xs text-gray-400">
                  <span className={`font-bold ${STATUS_COLOR[s._id]?.split(" ")[0] || ""}`}>{s._id}</span>
                  <span className="text-gray-600 font-mono">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && user && <CreatePostModal onClose={() => setModalOpen(false)} onSuccess={fetchPosts} />}
    </div>
  );
};

export default AllPost;