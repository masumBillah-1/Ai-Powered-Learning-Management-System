"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
    ArrowLeft, Save, Eye, EyeOff, Tag, X, ImagePlus,
    Bold, Italic, List, Quote, Code, Link2, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, ListOrdered, Minus,
} from "lucide-react";

const CATEGORIES = ["Technology", "Education", "Science", "Design", "Career", "General"];

const FONTS = [
    { label: "Default", value: "inherit" },
    { label: "Inter", value: "Inter" },
    { label: "Playfair", value: "Playfair Display" },
    { label: "Merriweather", value: "Merriweather" },
    { label: "Fira Code", value: "Fira Code" },
    { label: "Hind Siliguri", value: "Hind Siliguri" },
    { label: "Tiro Bangla", value: "Tiro Bangla" },
    { label: "Baloo Da 2", value: "Baloo Da 2" },
    { label: "Noto Sans Bangla", value: "Noto Sans Bengali" },
];

const FONT_SIZES = ["12", "14", "16", "18", "20", "24", "28", "32", "36", "48"];

interface BlogForm {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    coverImage: string;
    published: boolean;
}

function ToolBtn({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick: () => void }) {
    return (
        <button type="button" title={title}
            onMouseDown={e => { e.preventDefault(); onClick(); }}
            className="w-8 h-8 rounded-md flex items-center justify-center text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors border-0 cursor-pointer bg-transparent">
            {icon}
        </button>
    );
}

export default function BlogEditorPage() {
    const router = useRouter();
    const paramsData = useParams();
    const blogId = paramsData?.id as string;
    const isEdit = blogId && blogId !== "create";

    const editorRef = useRef<HTMLDivElement>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!!isEdit);
    const [tagInput, setTagInput] = useState("");
    const [preview, setPreview] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [selectedFont, setSelectedFont] = useState("inherit");
    const [selectedSize, setSelectedSize] = useState("16");
    const [isAdmin, setIsAdmin] = useState(false);

    const [form, setForm] = useState<BlogForm>({
        title: "", excerpt: "", content: "",
        category: "General", tags: [], coverImage: "", published: false,
    });

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Playfair+Display:wght@400;700;900&family=Merriweather:wght@400;700&family=Fira+Code&family=Hind+Siliguri:wght@400;600;700&family=Tiro+Bangla&family=Baloo+Da+2:wght@400;600;700;800&family=Noto+Sans+Bengali:wght@400;600;700&display=swap";
        document.head.appendChild(link);

        // Check admin
        try {
            const u = JSON.parse(localStorage.getItem("user") || "{}");
            setIsAdmin(u.role === "admin");
        } catch { }
    }, []);

    useEffect(() => {
        if (!isEdit) return;
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const user = JSON.parse(localStorage.getItem("user") || "{}");

                const res = await fetch(`/api/blogs?action=single&id=${blogId}&edit=1`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (data.success && data.blog) {
                    // ✅ Owner check
                    const isOwner =
                        user.role === "admin" ||
                        data.blog.authorId === user.id ||
                        data.blog.author === user.name;

                    if (!isOwner) {
                        toast.error("আপনার এই blog edit করার permission নেই!");
                        router.push("/dashboard/blog");
                        return;
                    }

                    setForm({
                        title: data.blog.title || "",
                        excerpt: data.blog.excerpt || "",
                        content: data.blog.content || "",
                        category: data.blog.category || "General",
                        tags: data.blog.tags || [],
                        coverImage: data.blog.coverImage || "",
                        published: data.blog.published || false,
                    });
                    setCharCount(data.blog.content?.length || 0);
                    if (editorRef.current) {
                        editorRef.current.innerHTML = data.blog.content || "";
                    }
                } else {
                    toast.error("Blog খুঁজে পাওয়া যায়নি");
                    router.push("/dashboard/blog");
                }
            } catch {
                toast.error("Blog load করতে সমস্যা হয়েছে");
            }
            setLoading(false);
        };
        fetchBlog();
    }, [isEdit, paramsData?.id]);

    const set = (key: keyof BlogForm, value: any) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const addTag = () => {
        const t = tagInput.trim().toLowerCase();
        if (t && !form.tags.includes(t) && form.tags.length < 8) {
            set("tags", [...form.tags, t]);
            setTagInput("");
        }
    };
    const removeTag = (tag: string) => set("tags", form.tags.filter(t => t !== tag));

    const exec = (cmd: string, val?: string) => {
        editorRef.current?.focus();
        document.execCommand(cmd, false, val);
        handleEditorChange();
    };

    const handleEditorChange = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            set("content", html);
            setCharCount(html.length);
        }
    };

    const insertLink = () => {
        const selection = window.getSelection();
        const selectedText = selection?.toString();
        const url = prompt("URL দিন:", "https://");
        if (!url) return;
        if (selectedText) {
            exec("createLink", url);
        } else {
            const linkText = prompt("Link text:", "Click here") || "Click here";
            document.execCommand("insertHTML", false,
                `<a href="${url}" target="_blank" style="color:#832388;text-decoration:underline">${linkText}</a>`
            );
            handleEditorChange();
        }
    };

    const setFontFamily = (font: string) => {
        setSelectedFont(font);
        editorRef.current?.focus();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const span = document.createElement("span");
            span.style.fontFamily = font === "inherit" ? "" : font;
            try { range.surroundContents(span); } catch { exec("fontName", font); }
            handleEditorChange();
        } else {
            exec("fontName", font);
        }
    };

    const setFontSize = (size: string) => {
        setSelectedSize(size);
        editorRef.current?.focus();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const span = document.createElement("span");
            span.style.fontSize = size + "px";
            try { range.surroundContents(span); } catch { }
            handleEditorChange();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === "b") { e.preventDefault(); exec("bold"); }
            if (e.key === "i") { e.preventDefault(); exec("italic"); }
            if (e.key === "u") { e.preventDefault(); exec("underline"); }
        }
        if (e.key === "Tab") {
            e.preventDefault();
            exec("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;");
        }
    };

    const handleSave = async (publishIntent?: boolean) => {
        if (!form.title.trim()) { toast.error("Title লেখা দরকার!"); return; }
        if (!form.content.trim()) { toast.error("Content লেখা দরকার!"); return; }

        setSaving(true);
        const toastId = toast.loading(isEdit ? "Updating..." : "Saving...");

        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user") || "{}");

            const payload = {
                ...form,
                // Admin হলে publish intent কাজ করে, নয়তো always pending
                published: user.role === "admin" ? (publishIntent ?? form.published) : false,
                author: user.name,
                authorId: user.id,
                authorRole: user.role,
            };

            const url = isEdit ? `/api/blogs?action=update&id=${blogId}` : `/api/blogs`;

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                // Message — admin vs user
                let msg = "";
                if (user.role === "admin") {
                    msg = publishIntent ? (isEdit ? "✅ Blog updated!" : "🎉 Blog published!") : "💾 Draft saved!";
                } else {
                    msg = isEdit
                        ? "✅ Blog updated! Admin approval এর জন্য pending।"
                        : "📤 Blog submitted! Admin approval এর জন্য অপেক্ষা করুন।";
                }
                toast.success(msg, { id: toastId, duration: 4000 });
                setTimeout(() => router.push("/dashboard/blog"), 1500);
            } else {
                toast.error(data.message || "Save করতে সমস্যা!", { id: toastId });
            }
        } catch {
            toast.error("Server error! আবার চেষ্টা করুন", { id: toastId });
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg text-[#832388]" />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-5">
            <Toaster position="top-right" containerClassName="toast-container"
                toastOptions={{
                    style: { borderRadius: "12px", fontSize: "13px" },
                    success: { style: { background: "#0f2a1a", color: "#4ade80", border: "1px solid #166534" } },
                    error: { style: { background: "#2a0f0f", color: "#f87171", border: "1px solid #991b1b" } },
                    loading: { style: { background: "#1a1a2e", color: "#c084fc", border: "1px solid #832388" } },
                }} />

            {/* Top Bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/blog"
                        className="w-9 h-9 rounded-xl border border-base-300 bg-base-100 flex items-center justify-center text-base-content/50 hover:text-base-content hover:border-[#832388]/40 transition-colors no-underline">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-[18px] font-black text-base-content m-0 leading-tight">
                            {isEdit ? "Edit Blog" : "Create Blog"}
                        </h1>
                        <p className="text-[11px] text-base-content/40 m-0">
                            {isAdmin
                                ? (isEdit ? "Update your blog post" : "Write something amazing")
                                : "Submit করলে admin review করবে"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setPreview(v => !v)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold border transition-all cursor-pointer
                            ${preview ? "bg-[#832388]/10 text-[#832388] border-[#832388]/30" : "bg-base-100 text-base-content/50 border-base-300 hover:border-[#832388]/40"}`}>
                        {preview ? <EyeOff size={14} /> : <Eye size={14} />}
                        {preview ? "Edit" : "Preview"}
                    </button>
                    {/* Draft — admin only */}
                    {isAdmin && (
                        <button type="button" onClick={() => handleSave(false)} disabled={saving}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold border border-base-300 bg-base-100 text-base-content/60 hover:border-[#832388]/40 transition-all cursor-pointer disabled:opacity-50">
                            <Save size={14} /> Save Draft
                        </button>
                    )}
                    <button type="button" onClick={() => handleSave(true)} disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-bold text-white bg-gradient-to-r from-[#832388] to-[#FF0F7B] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shadow-md shadow-[#832388]/20">
                        {saving ? <span className="loading loading-spinner loading-xs" /> : <Eye size={14} />}
                        {isAdmin ? "Publish" : "Submit for Review"}
                    </button>
                </div>
            </div>

            {/* Non-admin info banner */}
            {!isAdmin && (
                <div className="rounded-xl p-3.5 border border-amber-500/20 bg-amber-500/5 flex items-center gap-3">
                    <span className="text-lg">⏳</span>
                    <p className="text-[13px] text-amber-400/80 m-0">
                        আপনার blog submit করার পর <strong>admin review</strong> করবে। Approve হলে publicly publish হবে।
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
                {/* Left */}
                <div className="space-y-4">
                    <div className="bg-base-100 rounded-2xl border border-base-300 p-5">
                        <input type="text" placeholder="Blog title লিখুন..."
                            value={form.title} onChange={e => set("title", e.target.value)}
                            className="w-full text-[22px] font-black text-base-content bg-transparent border-none outline-none placeholder:text-base-content/20 leading-tight" />
                        <div className="h-px bg-base-300 my-3" />
                        <textarea rows={2} placeholder="Short excerpt / description..."
                            value={form.excerpt} onChange={e => set("excerpt", e.target.value)}
                            className="w-full text-[13.5px] text-base-content/70 bg-transparent border-none outline-none resize-none placeholder:text-base-content/25 leading-relaxed" />
                    </div>

                    <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
                        {/* Toolbar Row 1 */}
                        <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-base-300 bg-base-200/40">
                            <select value={selectedFont} onChange={e => setFontFamily(e.target.value)}
                                className="h-7 px-2 rounded-md text-[11px] bg-base-200 border border-base-300 text-base-content/70 cursor-pointer outline-none hover:border-[#832388]/40 transition-colors"
                                style={{ maxWidth: 120 }}>
                                {FONTS.map(f => <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>)}
                            </select>
                            <select value={selectedSize} onChange={e => setFontSize(e.target.value)}
                                className="h-7 px-2 rounded-md text-[11px] bg-base-200 border border-base-300 text-base-content/70 cursor-pointer outline-none hover:border-[#832388]/40 transition-colors w-[62px]">
                                {FONT_SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
                            </select>
                            <label className="relative flex items-center cursor-pointer" title="Text Color">
                                <span className="text-[10px] text-base-content/40 mr-1">A</span>
                                <input type="color" defaultValue="#ffffff"
                                    onInput={e => exec("foreColor", (e.target as HTMLInputElement).value)}
                                    className="w-6 h-6 rounded cursor-pointer border border-base-300 p-0" />
                            </label>
                            <label className="relative flex items-center cursor-pointer" title="Highlight Color">
                                <span className="text-[10px] text-base-content/40 mr-1">H</span>
                                <input type="color" defaultValue="#832388"
                                    onInput={e => exec("hiliteColor", (e.target as HTMLInputElement).value)}
                                    className="w-6 h-6 rounded cursor-pointer border border-base-300 p-0" />
                            </label>
                            <div className="flex-1" />
                            <span className="text-[11px] text-base-content/30 pr-1">{charCount} chars</span>
                        </div>

                        {/* Toolbar Row 2 */}
                        <div className="flex flex-wrap items-center gap-0.5 px-3 py-1.5 border-b border-base-300 bg-base-200/20">
                            <ToolBtn icon={<span className="text-[10px] font-black">H1</span>} title="Heading 1" onClick={() => exec("formatBlock", "<h1>")} />
                            <ToolBtn icon={<span className="text-[10px] font-black">H2</span>} title="Heading 2" onClick={() => exec("formatBlock", "<h2>")} />
                            <ToolBtn icon={<span className="text-[10px] font-black">H3</span>} title="Heading 3" onClick={() => exec("formatBlock", "<h3>")} />
                            <ToolBtn icon={<span className="text-[10px] font-black">H4</span>} title="Heading 4" onClick={() => exec("formatBlock", "<h4>")} />
                            <ToolBtn icon={<span className="text-[10px] font-black">H5</span>} title="Heading 5" onClick={() => exec("formatBlock", "<h5>")} />
                            <div className="w-px h-5 bg-base-300 mx-1" />
                            <ToolBtn icon={<Bold size={13} />} title="Bold (Ctrl+B)" onClick={() => exec("bold")} />
                            <ToolBtn icon={<Italic size={13} />} title="Italic (Ctrl+I)" onClick={() => exec("italic")} />
                            <ToolBtn icon={<span className="text-[12px] font-bold underline">U</span>} title="Underline (Ctrl+U)" onClick={() => exec("underline")} />
                            <ToolBtn icon={<Strikethrough size={13} />} title="Strikethrough" onClick={() => exec("strikeThrough")} />
                            <div className="w-px h-5 bg-base-300 mx-1" />
                            <ToolBtn icon={<AlignLeft size={13} />} title="Align Left" onClick={() => exec("justifyLeft")} />
                            <ToolBtn icon={<AlignCenter size={13} />} title="Align Center" onClick={() => exec("justifyCenter")} />
                            <ToolBtn icon={<AlignRight size={13} />} title="Align Right" onClick={() => exec("justifyRight")} />
                            <div className="w-px h-5 bg-base-300 mx-1" />
                            <ToolBtn icon={<List size={13} />} title="Bullet List" onClick={() => exec("insertUnorderedList")} />
                            <ToolBtn icon={<ListOrdered size={13} />} title="Numbered List" onClick={() => exec("insertOrderedList")} />
                            <div className="w-px h-5 bg-base-300 mx-1" />
                            <ToolBtn icon={<Quote size={13} />} title="Blockquote" onClick={() => exec("formatBlock", "<blockquote>")} />
                            <ToolBtn icon={<Code size={13} />} title="Code Block" onClick={() => exec("formatBlock", "<pre>")} />
                            <ToolBtn icon={<Link2 size={13} />} title="Insert Link" onClick={insertLink} />
                            <ToolBtn icon={<Minus size={13} />} title="Horizontal Line" onClick={() => {
                                document.execCommand("insertHTML", false, "<hr style='border:none;border-top:1px solid rgba(128,128,128,0.3);margin:16px 0'/><p><br></p>");
                                handleEditorChange();
                            }} />
                        </div>

                        {/* Editor / Preview */}
                        {preview ? (
                            <div className="min-h-[360px] p-6 text-[14px] leading-relaxed text-base-content/80 rich-preview"
                                dangerouslySetInnerHTML={{ __html: form.content || "<p style='opacity:0.3'>Nothing to preview yet...</p>" }} />
                        ) : (
                            <div ref={editorRef} contentEditable suppressContentEditableWarning
                                data-placeholder="এখানে লেখা শুরু করুন... (Ctrl+B = Bold, Ctrl+I = Italic, Ctrl+U = Underline)"
                                onInput={handleEditorChange} onKeyDown={handleKeyDown}
                                className="min-h-[360px] p-5 text-[14px] text-base-content/85 outline-none leading-relaxed rich-editor" />
                        )}
                    </div>

                    <style>{`
                        .toast-container { top: 80px !important; right: 16px !important; z-index: 9999 !important; }
                        @media (max-width: 768px) {
                            .toast-container { top: 70px !important; right: 12px !important; left: 12px !important; width: auto !important; }
                        }
                        .rich-editor:empty:before { content: attr(data-placeholder); color: rgba(150,150,150,0.35); pointer-events: none; }
                        .rich-editor h1, .rich-preview h1 { font-size: 2rem; font-weight: 900; margin: 16px 0 8px; line-height: 1.2; }
                        .rich-editor h2, .rich-preview h2 { font-size: 1.5rem; font-weight: 800; margin: 14px 0 6px; }
                        .rich-editor h3, .rich-preview h3 { font-size: 1.25rem; font-weight: 700; margin: 12px 0 5px; }
                        .rich-editor h4, .rich-preview h4 { font-size: 1.1rem; font-weight: 700; margin: 10px 0 4px; }
                        .rich-editor h5, .rich-preview h5 { font-size: 1rem; font-weight: 600; margin: 8px 0 4px; }
                        .rich-editor p, .rich-preview p { margin: 6px 0; }
                        .rich-editor ul, .rich-preview ul { list-style: disc; padding-left: 24px; margin: 8px 0; }
                        .rich-editor ol, .rich-preview ol { list-style: decimal; padding-left: 24px; margin: 8px 0; }
                        .rich-editor li, .rich-preview li { margin: 3px 0; line-height: 1.7; }
                        .rich-editor blockquote, .rich-preview blockquote { border-left: 4px solid #832388; padding: 8px 16px; margin: 12px 0; font-style: italic; opacity: 0.75; background: rgba(131,35,136,0.05); border-radius: 0 8px 8px 0; }
                        .rich-editor pre, .rich-preview pre { background: #1a1a2e; color: #FF0F7B; padding: 14px 16px; border-radius: 10px; font-family: 'Fira Code', monospace; font-size: 13px; margin: 10px 0; overflow-x: auto; border: 1px solid rgba(255,255,255,0.08); }
                        .rich-editor a, .rich-preview a { color: #832388; text-decoration: underline; }
                        .rich-editor hr, .rich-preview hr { border: none; border-top: 1px solid rgba(128,128,128,0.3); margin: 16px 0; }
                    `}</style>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-4 lg:sticky lg:top-[76px] mb-30">
                    {/* Cover Image */}
                    <div className="bg-base-100 rounded-2xl border border-base-300 p-4 space-y-3">
                        <p className="text-[12px] font-bold text-base-content/50 uppercase tracking-wider m-0">Cover Image</p>
                        {form.coverImage ? (
                            <div className="relative rounded-xl overflow-hidden">
                                <img src={form.coverImage} alt="" className="w-full h-32 object-cover" />
                                <button onClick={() => set("coverImage", "")}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white border-0 cursor-pointer hover:bg-black/80 transition-colors">
                                    <X size={12} />
                                </button>
                            </div>
                        ) : (
                            <div className="h-28 rounded-xl border-2 border-dashed border-base-300 flex flex-col items-center justify-center gap-2 text-base-content/30 bg-base-200/30">
                                <ImagePlus size={22} />
                                <p className="text-[11px] m-0">No image</p>
                            </div>
                        )}
                        <input type="url" placeholder="Image URL paste করুন..."
                            value={form.coverImage} onChange={e => set("coverImage", e.target.value)}
                            className="input input-bordered input-sm w-full text-[12px] bg-base-100" />
                    </div>

                    {/* Category */}
                    <div className="bg-base-100 rounded-2xl border border-base-300 p-4 space-y-3">
                        <p className="text-[12px] font-bold text-base-content/50 uppercase tracking-wider m-0">Category</p>
                        <div className="grid grid-cols-2 gap-2">
                            {CATEGORIES.map(cat => (
                                <button key={cat} type="button" onClick={() => set("category", cat)}
                                    className={`py-2 px-3 rounded-lg text-[12px] font-semibold border transition-all cursor-pointer
                                        ${form.category === cat
                                            ? "bg-gradient-to-r from-[#832388] to-[#FF0F7B] text-white border-transparent"
                                            : "bg-base-200/50 text-base-content/50 border-base-300 hover:border-[#832388]/40 hover:text-[#832388]"}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-base-100 rounded-2xl border border-base-300 p-4 space-y-3">
                        <p className="text-[12px] font-bold text-base-content/50 uppercase tracking-wider m-0">
                            Tags <span className="text-base-content/30 font-normal">({form.tags.length}/8)</span>
                        </p>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Add tag..."
                                value={tagInput} onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                                className="input input-bordered input-sm flex-1 text-[12px] bg-base-100" />
                            <button type="button" onClick={addTag}
                                className="btn btn-sm bg-[#832388]/10 border-[#832388]/30 text-[#832388] hover:bg-[#832388]/20 cursor-pointer">
                                <Tag size={13} />
                            </button>
                        </div>
                        {form.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {form.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-lg text-[11px] font-semibold bg-[#832388]/10 text-[#832388] border border-[#832388]/20">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)}
                                            className="w-4 h-4 rounded-full hover:bg-[#832388]/20 flex items-center justify-center border-0 cursor-pointer bg-transparent text-[#832388]">
                                            <X size={9} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Visibility — admin only */}
                    {isAdmin && (
                        <div className="bg-base-100 rounded-2xl border border-base-300 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[13px] font-bold text-base-content m-0">Visibility</p>
                                    <p className="text-[11px] text-base-content/40 m-0 mt-0.5">
                                        {form.published ? "Published — everyone can see" : "Draft — only you can see"}
                                    </p>
                                </div>
                                <input type="checkbox" checked={form.published}
                                    onChange={e => set("published", e.target.checked)}
                                    className="toggle toggle-sm"
                                    style={{ "--tglbg": form.published ? "#832388" : undefined } as any} />
                            </div>
                        </div>
                    )}

                    {/* Save buttons */}
                    <div className="flex flex-col gap-2">
                        <button type="button" onClick={() => handleSave(true)} disabled={saving}
                            className="w-full py-2.5 rounded-xl text-[13.5px] font-bold text-white bg-gradient-to-r from-[#832388] to-[#FF0F7B] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 border-0 shadow-md shadow-[#832388]/20">
                            {saving
                                ? <span className="loading loading-spinner loading-xs" />
                                : isAdmin
                                    ? (isEdit ? "✓ Update & Publish" : "✓ Publish Now")
                                    : (isEdit ? "✓ Update & Re-submit" : "✓ Submit for Review")}
                        </button>
                        {isAdmin && (
                            <button type="button" onClick={() => handleSave(false)} disabled={saving}
                                className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-base-content/60 bg-base-200 hover:bg-base-300 transition-colors cursor-pointer disabled:opacity-50 border-0">
                                Save as Draft
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}