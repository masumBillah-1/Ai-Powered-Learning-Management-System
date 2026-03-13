"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
    Plus, Search, BookOpen, Clock, Tag, Edit3, Trash2, Eye, TrendingUp,
    CheckCircle, XCircle, AlertCircle, LayoutGrid, List,
} from "lucide-react";

interface Blog {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    authorId: string;
    authorRole: string;
    category: string;
    tags: string[];
    coverImage?: string;
    views: number;
    createdAt: string;
    updatedAt: string;
    published: boolean;
    status: "pending" | "approved" | "rejected";
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    Technology: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
    Education: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
    Science: { bg: "bg-cyan-500/10", text: "text-cyan-400", dot: "bg-cyan-400" },
    Design: { bg: "bg-pink-500/10", text: "text-pink-400", dot: "bg-pink-400" },
    Career: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
    General: { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400" },
};

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string; label: string }> = {
    pending: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", label: "⏳ Pending" },
    approved: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", label: "✅ Approved" },
    rejected: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", label: "❌ Rejected" },
};

function getCategoryStyle(cat: string) {
    return CATEGORY_COLORS[cat] || CATEGORY_COLORS["General"];
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function readTime(content: string) {
    const words = content?.split(" ").length || 0;
    return Math.max(1, Math.ceil(words / 200));
}

function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden border border-base-300 animate-pulse">
            <div className="h-44 bg-base-300" />
            <div className="p-5 space-y-3">
                <div className="h-3 w-20 rounded bg-base-300" />
                <div className="h-5 w-3/4 rounded bg-base-300" />
                <div className="h-3 w-full rounded bg-base-300" />
                <div className="h-3 w-2/3 rounded bg-base-300" />
                <div className="flex gap-2 pt-2">
                    <div className="h-8 w-8 rounded-full bg-base-300" />
                    <div className="space-y-1.5 flex-1">
                        <div className="h-3 w-24 rounded bg-base-300" />
                        <div className="h-2.5 w-16 rounded bg-base-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse border-b border-base-300">
            <td className="px-4 py-3"><div className="h-4 w-6 rounded bg-base-300" /></td>
            <td className="px-4 py-3"><div className="h-4 w-48 rounded bg-base-300" /></td>
            <td className="px-4 py-3"><div className="h-4 w-20 rounded bg-base-300" /></td>
            <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-base-300" /></td>
            <td className="px-4 py-3"><div className="h-4 w-20 rounded bg-base-300" /></td>
            <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-base-300" /></td>
            <td className="px-4 py-3"><div className="h-4 w-28 rounded bg-base-300" /></td>
        </tr>
    );
}

function BlogCard({
    blog, onDelete, isOwner, isAdmin, onApprove, onReject,
}: {
    blog: Blog; onDelete: (b: Blog) => void; isOwner: boolean;
    isAdmin: boolean; onApprove: (b: Blog) => void; onReject: (b: Blog) => void;
}) {
    const cat = getCategoryStyle(blog.category);
    const minutes = readTime(blog.content);
    const status = STATUS_STYLE[blog.status || "pending"];

    return (
        <article className="group rounded-2xl overflow-hidden border border-base-300 bg-base-100 hover:border-purple-500/40 hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
                {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-2 opacity-30">
                            <BookOpen size={36} className="mx-auto text-white" />
                            <p className="text-xs text-white font-medium uppercase tracking-widest">Blog</p>
                        </div>
                        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-purple-500/20 blur-2xl" />
                        <div className="absolute bottom-2 left-6 w-16 h-16 rounded-full bg-pink-500/20 blur-2xl" />
                    </div>
                )}
                <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-white/10 ${cat.bg} ${cat.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                    {blog.category}
                </span>
                <span className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.bg} ${status.text} ${status.border}`}>
                    {status.label}
                </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-[15px] font-bold text-base-content leading-snug mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {blog.title}
                </h3>
                <p className="text-[13px] text-base-content/55 leading-relaxed line-clamp-2 mb-4 flex-1">
                    {blog.excerpt || blog.content?.substring(0, 120) + "..."}
                </p>

                {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {blog.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-base-200 text-base-content/50 border border-base-300">
                                <Tag size={9} /> {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-base-300">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                            {blog.author?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-[12px] font-semibold text-base-content leading-tight m-0">{blog.author}</p>
                            <p className="text-[10px] text-base-content/40 leading-none m-0">{formatDate(blog.createdAt)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-base-content/40">
                        <span className="flex items-center gap-1"><Eye size={11} /> {blog.views || 0}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {minutes}m</span>
                    </div>
                </div>

                {isAdmin && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-base-300">
                        {blog.status !== "approved" && (
                            <button onClick={() => onApprove(blog)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[12px] font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 cursor-pointer">
                                <CheckCircle size={12} /> Approve
                            </button>
                        )}
                        {blog.status !== "rejected" && (
                            <button onClick={() => onReject(blog)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[12px] font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 cursor-pointer">
                                <XCircle size={12} /> {blog.status === "approved" ? "Unpublish" : "Reject"}
                            </button>
                        )}
                        <Link href={`/dashboard/blog/${blog._id}`}
                            className="flex items-center justify-center px-3 py-1.5 rounded-lg text-[12px] bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20 no-underline">
                            <Edit3 size={12} />
                        </Link>
                        <button onClick={() => onDelete(blog)}
                            className="flex items-center justify-center px-3 py-1.5 rounded-lg text-[12px] bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 cursor-pointer">
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}

                {isOwner && !isAdmin && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-base-300">
                        <Link href={`/dashboard/blog/${blog._id}`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[12px] font-semibold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors no-underline border border-purple-500/20">
                            <Edit3 size={12} /> Edit
                        </Link>
                        <button onClick={() => onDelete(blog)}
                            className="flex items-center justify-center px-3 py-1.5 rounded-lg text-[12px] bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 cursor-pointer">
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}

function BlogTableRow({
    blog, index, onDelete, isOwner, isAdmin, onApprove, onReject,
}: {
    blog: Blog; index: number; onDelete: (b: Blog) => void; isOwner: boolean;
    isAdmin: boolean; onApprove: (b: Blog) => void; onReject: (b: Blog) => void;
}) {
    const cat = getCategoryStyle(blog.category);
    const status = STATUS_STYLE[blog.status || "pending"];
    const minutes = readTime(blog.content);

    return (
        <tr className="border-b border-base-300 hover:bg-base-200/40 transition-colors group">
            <td className="px-4 py-3 text-[12px] text-base-content/40 font-mono w-10">{index + 1}</td>
            <td className="px-4 py-3 max-w-[220px]">
                <div className="flex items-center gap-2">
                    {blog.coverImage ? (
                        <img src={blog.coverImage} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-base-300" />
                    ) : (
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center flex-shrink-0 border border-base-300">
                            <BookOpen size={14} className="text-white/30" />
                        </div>
                    )}
                    <span className="text-[13px] font-semibold text-base-content line-clamp-1 group-hover:text-purple-400 transition-colors">
                        {blog.title}
                    </span>
                </div>
            </td>
            <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-white/5 ${cat.bg} ${cat.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                    {blog.category}
                </span>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {blog.author?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[12px] text-base-content/70">{blog.author}</span>
                </div>
            </td>
            <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                    {status.label}
                </span>
            </td>
            <td className="px-4 py-3">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-base-content/40">{formatDate(blog.createdAt)}</span>
                    <div className="flex items-center gap-2 text-[11px] text-base-content/30">
                        <span className="flex items-center gap-0.5"><Eye size={10} /> {blog.views || 0}</span>
                        <span className="flex items-center gap-0.5"><Clock size={10} /> {minutes}m</span>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                    {isAdmin && (
                        <>
                            {blog.status !== "approved" && (
                                <button onClick={() => onApprove(blog)} title="Approve"
                                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 cursor-pointer">
                                    <CheckCircle size={13} />
                                </button>
                            )}
                            {blog.status !== "rejected" && (
                                <button onClick={() => onReject(blog)} title={blog.status === "approved" ? "Unpublish" : "Reject"}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors border border-orange-500/20 cursor-pointer">
                                    <XCircle size={13} />
                                </button>
                            )}
                            <Link href={`/dashboard/blog/${blog._id}`} title="Edit"
                                className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20 no-underline">
                                <Edit3 size={13} />
                            </Link>
                            <button onClick={() => onDelete(blog)} title="Delete"
                                className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 cursor-pointer">
                                <Trash2 size={13} />
                            </button>
                        </>
                    )}
                    {isOwner && !isAdmin && (
                        <>
                            <Link href={`/dashboard/blog/${blog._id}`} title="Edit"
                                className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20 no-underline">
                                <Edit3 size={13} />
                            </Link>
                            <button onClick={() => onDelete(blog)} title="Delete"
                                className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 cursor-pointer">
                                <Trash2 size={13} />
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeStatus, setActiveStatus] = useState("All");
    const [viewMode, setViewMode] = useState<"card" | "table">("table"); // ✅ default table
    const [currentUser, setCurrentUser] = useState<{ name: string; role: string; id: string } | null>(null);
    const [deleteItem, setDeleteItem] = useState<Blog | null>(null);
    const [deleting, setDeleting] = useState(false);

    const categories = ["All", "Technology", "Education", "Science", "Design", "Career", "General"];
    const statusFilters = ["All", "pending", "approved", "rejected"];

    useEffect(() => {
        const raw = localStorage.getItem("user");
        if (raw) { try { setCurrentUser(JSON.parse(raw)); } catch { } }
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/blogs", { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.success) setBlogs(data.blogs || []);
            else toast.error("Blog load করতে সমস্যা হয়েছে");
        } catch { toast.error("Server এর সাথে connect হচ্ছে না"); }
        finally { setLoading(false); }
    };

    const handleDelete = (blog: Blog) => {
        setDeleteItem(blog);
        (document.getElementById("delete_blog_modal") as HTMLDialogElement)?.showModal();
    };

    const handleDeleteConfirm = async () => {
        if (!deleteItem) return;
        setDeleting(true);
        const toastId = toast.loading("Deleting blog...");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/blogs?action=delete&id=${deleteItem._id}`, {
                method: "POST", headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setBlogs(prev => prev.filter(b => b._id !== deleteItem._id));
                toast.success("✅ Blog delete হয়েছে!", { id: toastId });
                setDeleteItem(null);
                (document.getElementById("delete_blog_modal") as HTMLDialogElement)?.close();
            } else { toast.error(data.message || "Delete করতে সমস্যা হয়েছে", { id: toastId }); }
        } catch { toast.error("Server error! আবার চেষ্টা করুন", { id: toastId }); }
        finally { setDeleting(false); }
    };

    const handleApprove = async (blog: Blog) => {
        const toastId = toast.loading("Approving...");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/blogs?action=approve&id=${blog._id}`, {
                method: "POST", headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setBlogs(prev => prev.map(b => b._id === blog._id ? { ...b, status: "approved", published: true } : b));
                toast.success("✅ Blog approved & published!", { id: toastId });
            } else { toast.error(data.message || "Approve করতে সমস্যা", { id: toastId }); }
        } catch { toast.error("Server error!", { id: toastId }); }
    };

    const handleReject = async (blog: Blog) => {
        const toastId = toast.loading("Processing...");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/blogs?action=reject&id=${blog._id}`, {
                method: "POST", headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setBlogs(prev => prev.map(b => b._id === blog._id ? { ...b, status: "rejected", published: false } : b));
                toast.success("Blog unpublished/rejected.", { id: toastId });
            } else { toast.error(data.message || "সমস্যা হয়েছে", { id: toastId }); }
        } catch { toast.error("Server error!", { id: toastId }); }
    };

    const isAdmin = currentUser?.role === "admin";
    const pendingCount = blogs.filter(b => b.status === "pending").length;

    const filtered = blogs.filter(b => {
        const matchSearch =
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.excerpt?.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === "All" || b.category === activeCategory;
        const matchStatus = activeStatus === "All" || b.status === activeStatus;
        return matchSearch && matchCat && matchStatus;
    });

    return (
        <div className="space-y-6">
            <Toaster position="top-right"
                toastOptions={{
                    style: { borderRadius: "12px", fontSize: "13px" },
                    success: { style: { background: "#0f2a1a", color: "#4ade80", border: "1px solid #166534" } },
                    error: { style: { background: "#2a0f0f", color: "#f87171", border: "1px solid #991b1b" } },
                    loading: { style: { background: "#1a1a2e", color: "#c084fc", border: "1px solid #7c3aed" } },
                }} />

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-base-content m-0 leading-tight">
                        Blog{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                            Posts
                        </span>
                    </h1>
                    <p className="text-[13px] text-base-content/45 mt-0.5 m-0 flex items-center gap-2">
                        {blogs.length} article{blogs.length !== 1 ? "s" : ""} total
                        {isAdmin && pendingCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                {pendingCount} pending approval
                            </span>
                        )}
                    </p>
                </div>
                {/* ✅ Header এ শুধু Create Blog */}
                <Link href="/dashboard/blog/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[13.5px] text-white no-underline bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25 self-start sm:self-auto flex-shrink-0">
                    <Plus size={16} /> Create Blog
                </Link>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: isAdmin ? "Total Posts" : "My Posts", value: blogs.length, icon: <BookOpen size={16} />, color: "text-purple-400", bg: "bg-purple-500/10" },
                    { label: "Pending", value: blogs.filter(b => b.status === "pending").length, icon: <AlertCircle size={16} />, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { label: "Approved", value: blogs.filter(b => b.status === "approved").length, icon: <CheckCircle size={16} />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Total Views", value: blogs.reduce((a, b) => a + (b.views || 0), 0), icon: <TrendingUp size={16} />, color: "text-pink-400", bg: "bg-pink-500/10" },
                ].map(stat => (
                    <div key={stat.label} className="rounded-xl p-3.5 bg-base-100 border border-base-300 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.bg} ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[18px] font-black text-base-content m-0 leading-none">{stat.value}</p>
                            <p className="text-[11px] text-base-content/40 m-0 mt-0.5">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-col gap-3">
                {/* Search + Category */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30" />
                        <input type="text" placeholder="Search blogs..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="input input-bordered w-full pl-10 h-10 text-[13.5px] bg-base-100" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all cursor-pointer
                                    ${activeCategory === cat
                                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white border-transparent shadow-sm"
                                        : "bg-base-100 text-base-content/50 border-base-300 hover:border-purple-500/40 hover:text-purple-400"}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ✅ Status filter + View toggle একই row এ */}
                <div className="flex items-center gap-2 flex-wrap">
                    {statusFilters.map(s => {
                        const count = s === "All" ? blogs.length : blogs.filter(b => b.status === s).length;
                        return (
                            <button key={s} onClick={() => setActiveStatus(s)}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5
                                    ${activeStatus === s
                                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white border-transparent"
                                        : "bg-base-100 text-base-content/50 border-base-300 hover:border-purple-500/40 hover:text-purple-400"}`}>
                                {s === "pending" && <AlertCircle size={11} />}
                                {s === "approved" && <CheckCircle size={11} />}
                                {s === "rejected" && <XCircle size={11} />}
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20">{count}</span>
                            </button>
                        );
                    })}

                    {/* ✅ View toggle — right side এ, ml-auto দিয়ে */}
                    <div className="ml-auto flex items-center rounded-xl border border-base-300 bg-base-100 p-1 gap-1">
                        <button
                            onClick={() => setViewMode("card")}
                            title="Card view"
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer border-0
                                ${viewMode === "card"
                                    ? "bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-sm"
                                    : "text-base-content/40 hover:text-base-content bg-transparent"}`}>
                            <LayoutGrid size={15} />
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            title="Table view"
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer border-0
                                ${viewMode === "table"
                                    ? "bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-sm"
                                    : "text-base-content/40 hover:text-base-content bg-transparent"}`}>
                            <List size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Card View ── */}
            {viewMode === "card" && (
                <>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center">
                                <BookOpen size={28} className="text-base-content/20" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-base-content/50 m-0">No blogs found</p>
                                <p className="text-[13px] text-base-content/30 m-0 mt-1">
                                    {search ? "Try a different search" : "Be the first to write one!"}
                                </p>
                            </div>
                            <Link href="/dashboard/blog/create"
                                className="px-4 py-2 rounded-xl text-[13px] font-bold text-white no-underline bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity">
                                Create Blog
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map(blog => (
                                <BlogCard
                                    key={blog._id} blog={blog}
                                    onDelete={handleDelete}
                                    isOwner={blog.authorId === currentUser?.id || blog.author === currentUser?.name}
                                    isAdmin={isAdmin}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ── Table View ── */}
            {viewMode === "table" && (
                <div className="rounded-2xl border border-base-300 bg-base-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-base-300 bg-base-200/50">
                                    <th className="px-4 py-3 text-left text-[11px] font-bold text-base-content/40 uppercase tracking-wider w-10">#</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold text-base-content/40 uppercase tracking-wider">Title</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold text-base-content/40 uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold text-base-content/40 uppercase tracking-wider">Author</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold text-base-content/40 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold text-base-content/40 uppercase tracking-wider">Date / Stats</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold text-base-content/40 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <BookOpen size={28} className="text-base-content/20" />
                                                <p className="text-[13px] text-base-content/40 m-0">No blogs found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((blog, i) => (
                                        <BlogTableRow
                                            key={blog._id} blog={blog} index={i}
                                            onDelete={handleDelete}
                                            isOwner={blog.authorId === currentUser?.id || blog.author === currentUser?.name}
                                            isAdmin={isAdmin}
                                            onApprove={handleApprove}
                                            onReject={handleReject}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {!loading && filtered.length > 0 && (
                        <div className="px-4 py-3 border-t border-base-300 bg-base-200/30 flex items-center justify-between">
                            <p className="text-[12px] text-base-content/40 m-0">
                                Showing <span className="font-semibold text-base-content/60">{filtered.length}</span> of <span className="font-semibold text-base-content/60">{blogs.length}</span> blogs
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Delete Modal ── */}
            <dialog id="delete_blog_modal" className="modal">
                <div className="modal-box p-0 overflow-hidden rounded-2xl border border-red-500/20">
                    <div className="h-1.5 w-full bg-gradient-to-r from-red-600 to-rose-500" />
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl flex-shrink-0">🗑️</div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">Delete Blog?</h3>
                                <p className="text-sm text-base-content/50 mt-0.5">এই কাজটি undo করা যাবে না।</p>
                            </div>
                        </div>
                        {deleteItem && (
                            <div className="rounded-xl p-4 mb-4 bg-red-50 border border-red-200">
                                <p className="text-sm font-bold text-red-600 line-clamp-2 m-0">{deleteItem.title}</p>
                                <p className="text-xs text-red-400 mt-1 m-0">📝 {deleteItem.category} • {deleteItem.author}</p>
                            </div>
                        )}
                        <div className="flex justify-end gap-3">
                            <form method="dialog">
                                <button className="btn btn-ghost cursor-pointer" onClick={() => setDeleteItem(null)}>বাতিল</button>
                            </form>
                            <button className="btn bg-gradient-to-r from-red-600 to-rose-500 text-white border-0 cursor-pointer gap-2"
                                onClick={handleDeleteConfirm} disabled={deleting}>
                                {deleting
                                    ? <><span className="loading loading-spinner loading-sm" />Deleting...</>
                                    : <><Trash2 size={16} />Delete করুন</>}
                            </button>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setDeleteItem(null)}>close</button>


                
                </form>


            </dialog>
        
        </div>
    );
}