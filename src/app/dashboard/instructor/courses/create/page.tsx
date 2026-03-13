"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useForm,
  Controller,
  useFieldArray,
} from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FAQItem { question: string; answer: string }
interface LessonItem {
  id: number;
  title: string;
  type: string;
  duration: string;
  videoUrl: string;       // for video type
  textContent: string;    // for text type
  assignmentDesc: string; // for assignment type
}
interface ModuleItem { id: number; title: string; lessons: LessonItem[] }

interface FormValues {
  title: string;
  category: string;
  level: string;
  description: string;
  coverMode: "upload" | "url";
  coverUrl: string;
  videoMode: "upload" | "url";
  videoUrl: string;
  faqs: FAQItem[];
  priceType: "paid" | "free";
  price: string;
  discountPrice: string;
  enrollmentLimit: string;
  accessDuration: string;
  visibility: "public" | "private";
}

// ─── Toast styles ─────────────────────────────────────────────────────────────
const tErr = {
  position: "top-right" as const,
  duration: 3500,
  style: {
    borderRadius: "12px",
    background: "#dc2626",
    color: "#fff",
    fontWeight: "600",
    minWidth: "260px",
    boxShadow: "0 8px 24px rgba(220,38,38,0.35)",
  },
};
const tOk = {
  position: "top-right" as const,
  duration: 4000,
  style: {
    borderRadius: "12px",
    background: "#1e1e2e",
    color: "#fff",
    fontWeight: "600",
    minWidth: "260px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

const ErrMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-error text-xs mt-1 flex items-center gap-1 animate-pulse">
      <span>⚠️</span> {msg}
    </p>
  ) : null;

const STEPS = [
  { id: 1, label: "Course Info & FAQ" },
  { id: 2, label: "Course Materials" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Publish" },
];

// ═══════════════════════════════════════════════════════════════════════════════
export default function CreateCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [theme, setTheme] = useState("light");
  const [instructorId, setInstructorId] = useState<string>("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [moduleErr, setModuleErr] = useState("");

  // ── Dark mode + user sync ───────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?._id) setInstructorId(user._id);
        else if (user?.id) setInstructorId(user.id);
      }
    } catch (_) { }
    const iv = setInterval(() => {
      const cur = localStorage.getItem("theme") || "light";
      if (cur !== theme) setTheme(cur);
    }, 100);
    return () => clearInterval(iv);
  }, [theme]);

  // ── React Hook Form ─────────────────────────────────────────────────────────
  const {
    register, control, watch, trigger, getValues, setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      title: "", category: "", level: "", description: "",
      coverMode: "upload", coverUrl: "",
      videoMode: "upload", videoUrl: "",
      faqs: [],
      priceType: "paid", price: "", discountPrice: "",
      enrollmentLimit: "", accessDuration: "lifetime",
      visibility: "public",
    },
  });

  const { fields: faqFields, append: addFaq, remove: removeFaq, replace: replaceFaqs } = useFieldArray({ control, name: "faqs" });

  // ── Edit mode ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!editId) return;
    const loadCourse = async () => {
      setLoadingEdit(true);
      try {
        const res = await fetch(`/api/courses/${editId}`);
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) throw new Error(`Server error (${res.status})`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load course");
        const c = data.course || data;

        setValue("title", c.title || "");
        setValue("category", c.category || "");
        setValue("level", c.level || "");
        setValue("description", c.description || "");
        setValue("priceType", c.pricing?.type || "paid");
        setValue("price", String(c.pricing?.price || ""));
        setValue("discountPrice", String(c.pricing?.discountPrice || ""));
        setValue("enrollmentLimit", String(c.pricing?.enrollmentLimit || ""));
        setValue("accessDuration", c.pricing?.accessDuration || "lifetime");
        setValue("visibility", c.visibility || "public");

        if (c.faqs?.length > 0) replaceFaqs(c.faqs);
        if (c.coverImage?.url) { setValue("coverMode", "url"); setValue("coverUrl", c.coverImage.url); }
        if (c.salesVideo?.url) { setValue("videoMode", "url"); setValue("videoUrl", c.salesVideo.url); }

        if (c.modules?.length > 0) {
          setModules(c.modules.map((m: any, i: number) => ({
            id: Date.now() + i,
            title: m.title || `Module ${i + 1}`,
            lessons: (m.lessons || []).map((l: any, j: number) => ({
              id: Date.now() + i * 1000 + j,
              title: l.title || "",
              type: l.type || "video",
              duration: l.duration || "",
              videoUrl: l.url || "",
              textContent: l.textContent || "",
              assignmentDesc: l.assignmentDesc || "",
            })),
          })));
        }
        toast.success("✅ Course data loaded!", { ...tOk, duration: 2000 });
      } catch (err: any) {
        toast.error(`❌ ${err.message}`, tErr);
      } finally {
        setLoadingEdit(false);
      }
    };
    loadCourse();
  }, [editId]);

  const coverMode = watch("coverMode");
  const videoMode = watch("videoMode");
  const coverUrl = watch("coverUrl");
  const videoUrl = watch("videoUrl");
  const priceType = watch("priceType");
  const price = watch("price");
  const discountP = watch("discountPrice");
  const accessDur = watch("accessDuration");
  const title = watch("title");
  const category = watch("category");
  const level = watch("level");
  const desc = watch("description");

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateCurrentStep = async (): Promise<boolean> => {
    if (step === 1) {
      const ok = await trigger(["title", "category", "level", "description"]);
      if (!ok) {
        const vals = getValues();
        if (!vals.title?.trim()) { toast.error("⚠️ Course title is required", tErr); return false; }
        if (!vals.category) { toast.error("⚠️ Please select a category", tErr); return false; }
        if (!vals.level) { toast.error("⚠️ Please select a level", tErr); return false; }
        if (!vals.description?.trim()) { toast.error("⚠️ Description is required", tErr); return false; }
        return false;
      }
      if (coverMode === "upload" && !coverFile) { toast.error("⚠️ Please upload a Cover Image", tErr); return false; }
      if (coverMode === "url" && !getValues("coverUrl")?.trim()) { toast.error("⚠️ Please enter a Cover Image URL", tErr); return false; }
      if (videoMode === "upload" && !videoFile) { toast.error("⚠️ Please upload a Sales Video", tErr); return false; }
      if (videoMode === "url" && !getValues("videoUrl")?.trim()) { toast.error("⚠️ Please enter a Sales Video URL", tErr); return false; }
      return true;
    }
    if (step === 2) {
      if (modules.length === 0) { setModuleErr("Add at least 1 module"); toast.error("⚠️ Add at least 1 module", tErr); return false; }
      if (!modules.some(m => m.lessons.length > 0)) { setModuleErr("Add at least 1 lesson"); toast.error("⚠️ Add at least 1 lesson", tErr); return false; }
      setModuleErr(""); return true;
    }
    if (step === 3) {
      const vals = getValues();
      if (vals.priceType === "paid") {
        if (!vals.price || Number(vals.price) <= 0) { toast.error("⚠️ Enter a valid price", tErr); return false; }
        if (vals.discountPrice && Number(vals.discountPrice) >= Number(vals.price)) { toast.error("⚠️ Discount must be less than price", tErr); return false; }
      }
      return true;
    }
    return true;
  };

  const handleNext = async () => { const ok = await validateCurrentStep(); if (ok) setStep(s => Math.min(s + 1, 4)); };
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  // ── Module helpers ──────────────────────────────────────────────────────────
  const addModule = () => { setModules(prev => [...prev, { id: Date.now(), title: `Module ${prev.length + 1}`, lessons: [] }]); setModuleErr(""); };
  const removeModule = (id: number) => setModules(prev => prev.filter(m => m.id !== id));
  const updateModTitle = (id: number, t: string) => setModules(prev => prev.map(m => m.id === id ? { ...m, title: t } : m));
  const addLesson = (mid: number) => setModules(prev => prev.map(m =>
    m.id === mid ? { ...m, lessons: [...m.lessons, { id: Date.now(), title: "", type: "video", duration: "", videoUrl: "", textContent: "", assignmentDesc: "" }] } : m
  ));
  const removeLesson = (mid: number, lid: number) => setModules(prev => prev.map(m => m.id === mid ? { ...m, lessons: m.lessons.filter(l => l.id !== lid) } : m));
  const updateLesson = (mid: number, lid: number, field: string, value: string) =>
    setModules(prev => prev.map(m => m.id === mid ? { ...m, lessons: m.lessons.map(l => l.id === lid ? { ...l, [field]: value } : l) } : m));

  // ── Submit ──────────────────────────────────────────────────────────────────
  const submitCourse = async (status: "draft" | "published") => {
    const vals = getValues();
    if (!instructorId) { toast.error("⚠️ User not found. Please login again.", tErr); return; }
    if (status === "draft" && !vals.title.trim()) { toast.error("⚠️ Add a course title before saving draft!", tErr); return; }

    if (status === "published") {
      const ok = await trigger(["title", "category", "level", "description"]);
      if (!ok) { setStep(1); return; }
      if (coverMode === "upload" && !coverFile && !vals.coverUrl?.trim()) { toast.error("⚠️ Please upload a Cover Image", tErr); setStep(1); return; }
      if (coverMode === "url" && !vals.coverUrl?.trim()) { toast.error("⚠️ Please enter a Cover Image URL", tErr); setStep(1); return; }
      if (videoMode === "upload" && !videoFile && !vals.videoUrl?.trim()) { toast.error("⚠️ Please upload a Sales Video", tErr); setStep(1); return; }
      if (videoMode === "url" && !vals.videoUrl?.trim()) { toast.error("⚠️ Please enter a Sales Video URL", tErr); setStep(1); return; }
      if (modules.length === 0 || !modules.some(m => m.lessons.length > 0)) { toast.error("⚠️ Add at least 1 module with a lesson", tErr); setStep(2); return; }
    }

    setLoading(true);
    const isEdit = !!editId;
    const tid = toast.loading(
      status === "draft" ? (isEdit ? "💾 Updating draft..." : "💾 Saving draft...") : (isEdit ? "🚀 Updating course..." : "🚀 Publishing course..."),
      { position: "top-right", style: { borderRadius: "12px", background: "#1e1e2e", color: "#fff", fontWeight: "600" } }
    );

    try {
      let coverPayload: any = { type: "url", url: vals.coverUrl };
      if (vals.coverMode === "upload" && coverFile) { coverPayload = { type: "upload", base64: await fileToBase64(coverFile) }; }
      let videoPayload: any = { type: "url", url: vals.videoUrl };
      if (vals.videoMode === "upload" && videoFile) { videoPayload = { type: "upload", base64: await fileToBase64(videoFile) }; }

      // Map modules → include url, textContent, assignmentDesc in each lesson
      const mappedModules = modules.map(m => ({
        title: m.title,
        lessons: m.lessons.map(l => ({
          title: l.title,
          type: l.type,
          duration: l.duration,
          url: l.videoUrl || "",
          textContent: l.textContent || "",
          assignmentDesc: l.assignmentDesc || "",
        })),
      }));

      const payload = {
        instructorId,
        title: vals.title, category: vals.category, level: vals.level, description: vals.description,
        coverImage: coverPayload, salesVideo: videoPayload,
        faqs: vals.faqs,
        modules: mappedModules,
        pricing: {
          type: vals.priceType,
          price: Number(vals.price) || 0,
          discountPrice: vals.discountPrice ? Number(vals.discountPrice) : null,
          enrollmentLimit: vals.enrollmentLimit ? Number(vals.enrollmentLimit) : null,
          accessDuration: vals.accessDuration,
        },
        visibility: vals.visibility, status,
      };

      const res = await fetch(isEdit ? `/api/courses/${editId}` : "/api/courses", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) throw new Error(`Server error (${res.status})`);
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Something went wrong");

      toast.success(
        isEdit ? (status === "draft" ? "Draft updated! 📝" : "Course updated! ✅") : (status === "draft" ? "Draft saved! 📝" : "Course published! 🎉"),
        { id: tid, ...tOk, style: { ...tOk.style, background: status === "published" ? "linear-gradient(135deg,#832388,#FF0F7B)" : "#1e1e2e" } }
      );
      setTimeout(() => router.push("/dashboard/instructor/courses"), 1500);
    } catch (err: any) {
      toast.error(`❌ ${err.message || "Failed. Try again!"}`, { id: tid, ...tErr, duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  // ── Preview ─────────────────────────────────────────────────────────────────
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  const coverSrc = coverFile ? URL.createObjectURL(coverFile) : coverUrl || null;
  const checks = [
    { label: "Course title added", done: !!title },
    { label: "Description written", done: desc.length >= 20 },
    { label: "Cover image provided", done: !!(coverFile || coverUrl) },
    { label: "Sales video provided", done: !!(videoFile || videoUrl) },
    { label: "At least 1 module added", done: modules.length > 0 },
    { label: "Pricing configured", done: priceType === "free" || (priceType === "paid" && Number(price) > 0) },
  ];
  const allDone = checks.every(c => c.done);

  if (loadingEdit) {
    return (
      <div className="flex flex-col bg-base-100 min-h-screen items-center justify-center gap-4" data-theme={theme}>
        <span className="loading loading-spinner loading-lg" style={{ color: "#832388" }} />
        <p className="text-sm opacity-50 font-medium">Loading course data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-base-100 min-h-screen" data-theme={theme}>
      <Toaster position="top-right" containerStyle={{ top: 80, right: 24 }} toastOptions={{ style: { maxWidth: 360 } }} />

      {/* Top Bar */}
      <div className="bg-base-100 border-b border-base-300 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold cursor-pointer hover:underline" style={{ color: "#832388" }}
            onClick={() => router.push("/dashboard/instructor/courses")}>My Courses</span>
          <span className="opacity-30">/</span>
          <span className="font-medium opacity-60">{editId ? "Edit course" : "Create new course"}</span>
          {editId && <span className="badge badge-sm ml-1" style={{ backgroundColor: "#832388", color: "#fff" }}>Edit Mode</span>}
        </div>
        <button className="btn btn-sm btn-outline cursor-pointer">Preview</button>
      </div>

      {/* Stepper */}
      <div className="bg-base-100 border-b border-base-300 px-6 py-4">
        <ul className="steps steps-horizontal w-full text-xs">
          {STEPS.map(s => (
            <li key={s.id} data-content={step > s.id ? "✓" : String(s.id)}
              className={`step font-medium transition-all ${step >= s.id ? "step-primary" : ""}`}>
              <span className="hidden sm:inline">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-lg font-bold mb-6">{STEPS[step - 1].label}</h2>

          {/* ════ STEP 1 ════ */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div className="form-control">
                  <label className="label pb-1"><span className="label-text font-semibold">Course Title <span className="text-error">*</span></span></label>
                  <input {...register("title", { required: "Course title is required" })} type="text"
                    placeholder="e.g. Introduction to Data Analysis"
                    className={`input input-bordered w-full bg-base-200 focus:outline-none transition-colors ${errors.title ? "border-error" : "focus:border-purple-500"}`} />
                  <ErrMsg msg={errors.title?.message} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label pb-1"><span className="label-text font-semibold">Category <span className="text-error">*</span></span></label>
                    <select {...register("category", { required: "Please select a category" })}
                      className={`select select-bordered bg-base-200 w-full focus:outline-none cursor-pointer ${errors.category ? "border-error" : ""}`}>
                      <option value="">— Select —</option>
                      <option>Data Management</option><option>Web Development</option>
                      <option>Design</option><option>Marketing</option><option>Business</option>
                    </select>
                    <ErrMsg msg={errors.category?.message} />
                  </div>
                  <div className="form-control">
                    <label className="label pb-1"><span className="label-text font-semibold">Level <span className="text-error">*</span></span></label>
                    <select {...register("level", { required: "Please select a level" })}
                      className={`select select-bordered bg-base-200 w-full focus:outline-none cursor-pointer ${errors.level ? "border-error" : ""}`}>
                      <option value="">— Select —</option>
                      <option>Basic</option><option>Intermediate</option><option>Advanced</option>
                    </select>
                    <ErrMsg msg={errors.level?.message} />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label pb-1"><span className="label-text font-semibold">Description <span className="text-error">*</span></span></label>
                  <textarea {...register("description", { required: "Description is required", minLength: { value: 20, message: "Min 20 characters" } })}
                    rows={5} maxLength={2000} placeholder="Write a short description (min 20 characters)..."
                    className={`textarea textarea-bordered bg-base-200 w-full resize-none focus:outline-none transition-colors ${errors.description ? "border-error" : "focus:border-purple-500"}`} />
                  <label className="label pt-1">
                    <span className={`label-text-alt ${errors.description ? "text-error" : "opacity-50"}`}>
                      {errors.description?.message || `${desc.length}/2000`}
                    </span>
                  </label>
                </div>

                {/* FAQs */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="label-text font-semibold">FAQs <span className="text-xs opacity-50 font-normal">(optional)</span></span>
                    <button type="button" onClick={() => addFaq({ question: "", answer: "" })}
                      className="btn btn-xs btn-ghost cursor-pointer" style={{ color: "#832388" }}>+ Add FAQ</button>
                  </div>
                  <div className="space-y-3">
                    {faqFields.map((field, i) => (
                      <div key={field.id} className="card card-compact bg-base-200 border border-base-300 relative group hover:border-purple-400/50 transition-all py-5 text-green">
                        <div className="card-body p-4">
                          <button type="button" onClick={() => removeFaq(i)}
                            className="btn btn-xs btn-circle absolute top-3 right-3 bg-base-300/50 border-0 opacity-0 group-hover:opacity-100 hover:bg-error hover:text-white transition-all cursor-pointer">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="mb-2">
                            <label className="text-xs font-semibold opacity-50 mb-1 block">Question {i + 1}</label>
                            <input {...register(`faqs.${i}.question`)} type="text" placeholder="Enter your question here..."
                              className="input input-sm input-bordered w-full bg-base-100 border-base-300 focus:border-purple-500 focus:outline-none pr-10 transition-colors" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold opacity-50 mb-1 block">Answer</label>
                            <textarea {...register(`faqs.${i}.answer`)} rows={3} placeholder="Provide a clear and concise answer..."
                              className="textarea textarea-bordered bg-base-100 border-base-300 w-full resize-none text-sm focus:border-purple-500 focus:outline-none transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {faqFields.length === 0 && (
                      <div onClick={() => addFaq({ question: "", answer: "" })}
                        className="border-2 border-dashed border-base-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-base-200/50 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-500/20 transition-all">
                          <svg className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-all" style={{ color: "#832388" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="font-medium opacity-60 group-hover:opacity-100 transition-all">No FAQs added yet</p>
                        <p className="text-sm opacity-40 mt-1 group-hover:opacity-60 transition-all">Click here or use "+ Add FAQ" button above</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-5">
                {/* Cover Image */}
                <div className="form-control">
                  <div className="flex items-center justify-between mb-2">
                    <label className="label-text font-semibold">Cover Image <span className="text-error">*</span></label>
                    <div className="tabs tabs-boxed tabs-xs bg-base-200">
                      {(["upload", "url"] as const).map(m => (
                        <button key={m} type="button"
                          onClick={() => { setValue("coverMode", m); setCoverFile(null); setValue("coverUrl", ""); }}
                          className={`tab transition-all cursor-pointer ${coverMode === m ? "tab-active text-white" : ""}`}
                          style={coverMode === m ? { backgroundColor: "#832388" } : {}}>
                          {m === "upload" ? "Upload" : "URL"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {coverMode === "url" ? (
                    <div className="space-y-2">
                      <div className="border-2 border-dashed rounded-xl h-40 overflow-hidden flex items-center justify-center bg-base-200 border-base-300">
                        {coverUrl ? <img src={coverUrl} alt="preview" className="h-full w-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          : <p className="text-sm opacity-40">Image preview will appear here</p>}
                      </div>
                      <input {...register("coverUrl")} type="url" placeholder="https://example.com/image.jpg"
                        className="input input-bordered bg-base-200 w-full focus:outline-none focus:border-purple-500 transition-colors" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {coverFile && (
                        <div className="rounded-xl overflow-hidden h-40 border border-base-300">
                          <img src={URL.createObjectURL(coverFile)} alt="cover" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div onClick={() => coverRef.current?.click()}
                        className="border-2 border-dashed rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-base-200 transition-all border-base-300">
                        {coverFile ? (
                          <div className="text-center">
                            <div className="badge badge-success gap-1 mb-1">✓ Selected</div>
                            <p className="text-xs opacity-60">{coverFile.name}</p>
                            <p className="text-xs opacity-40 mt-1">Click to change</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-base-300 flex items-center justify-center mb-2">
                              <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-sm opacity-60">Click to upload cover image</p>
                            <p className="text-xs opacity-40 mt-1">PNG, JPG up to 5MB</p>
                          </>
                        )}
                      </div>
                      <input ref={coverRef} type="file" accept="image/*" className="hidden"
                        onChange={e => { setCoverFile(e.target.files?.[0] || null); e.target.value = ""; }} />
                    </div>
                  )}
                </div>

                {/* Sales Video */}
                <div className="form-control">
                  <div className="flex items-center justify-between mb-2">
                    <label className="label-text font-semibold">Sales Video <span className="text-error">*</span></label>
                    <div className="tabs tabs-boxed tabs-xs bg-base-200">
                      {(["upload", "url"] as const).map(m => (
                        <button key={m} type="button"
                          onClick={() => { setValue("videoMode", m); setVideoFile(null); setValue("videoUrl", ""); }}
                          className={`tab transition-all cursor-pointer ${videoMode === m ? "tab-active text-white" : ""}`}
                          style={videoMode === m ? { backgroundColor: "#832388" } : {}}>
                          {m === "upload" ? "Upload" : "Link"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {videoMode === "url" ? (
                    <div className="space-y-2">
                      <div className="border-2 border-dashed rounded-xl h-40 overflow-hidden flex items-center justify-center bg-base-200 border-base-300">
                        {videoUrl ? (
                          (() => {
                            const yt = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
                            if (yt) return <iframe src={`https://www.youtube.com/embed/${yt[1]}`} className="w-full h-full" allowFullScreen title="preview" />;
                            return <div className="text-center px-4"><div className="badge badge-success gap-1 mb-2">✓ Link added</div><p className="text-xs opacity-60 break-all">{videoUrl}</p></div>;
                          })()
                        ) : <p className="text-sm opacity-40">Video preview will appear here</p>}
                      </div>
                      <input {...register("videoUrl")} type="url" placeholder="YouTube, Vimeo or direct video link..."
                        className="input input-bordered bg-base-200 w-full focus:outline-none focus:border-purple-500 transition-colors" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {videoFile && (
                        <div className="rounded-xl border border-base-300 bg-base-200 p-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{videoFile.name}</p>
                            <p className="text-xs opacity-50">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                          </div>
                          <button type="button" onClick={() => setVideoFile(null)}
                            className="btn btn-xs btn-ghost btn-circle opacity-50 hover:opacity-100 hover:text-error ml-auto cursor-pointer">✕</button>
                        </div>
                      )}
                      <div onClick={() => videoRef.current?.click()}
                        className="border-2 border-dashed rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-base-200 transition-all border-base-300">
                        {!videoFile ? (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-base-300 flex items-center justify-center mb-2">
                              <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-sm opacity-60">Click to upload sales video</p>
                            <p className="text-xs opacity-40 mt-1">MP4, MOV up to 500MB</p>
                          </>
                        ) : <p className="text-sm opacity-50">Click to change video</p>}
                      </div>
                      <input ref={videoRef} type="file" accept="video/*" className="hidden"
                        onChange={e => { setVideoFile(e.target.files?.[0] || null); e.target.value = ""; }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════ STEP 2 ════ */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-50">Add modules and lessons for your course</p>
                  {moduleErr && <p className="text-error text-xs mt-1">⚠️ {moduleErr}</p>}
                </div>
                <button type="button" onClick={addModule} className="btn btn-sm text-white border-0 cursor-pointer" style={{ backgroundColor: "#832388" }}>
                  + Add Module
                </button>
              </div>

              {modules.length === 0 && (
                <div onClick={addModule}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-base-200 transition-all ${moduleErr ? "border-error" : "border-base-300"}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${moduleErr ? "bg-error/20" : "bg-base-300"}`}>
                    <svg className="w-7 h-7 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="font-medium opacity-50">No modules yet</p>
                  <p className="text-sm opacity-40 mt-1">Click to add your first module</p>
                </div>
              )}

              {modules.map((mod, mi) => (
                <div key={mod.id} className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
                  {/* Module header */}
                  <div className="flex items-center gap-3 bg-base-200 px-4 py-3 border-b border-base-300">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "#832388" }}>{mi + 1}</div>
                    <input type="text" value={mod.title} onChange={e => updateModTitle(mod.id, e.target.value)}
                      className="flex-1 bg-transparent text-sm font-semibold focus:outline-none min-w-0" placeholder="Module title..." />
                    <button type="button" onClick={() => addLesson(mod.id)} className="btn btn-xs btn-ghost flex-shrink-0 cursor-pointer" style={{ color: "#832388" }}>+ Lesson</button>
                    <button type="button" onClick={() => removeModule(mod.id)} className="btn btn-xs btn-ghost btn-circle opacity-40 hover:opacity-100 hover:text-error flex-shrink-0 cursor-pointer">✕</button>
                  </div>

                  {/* Lessons */}
                  <div className="divide-y divide-base-200">
                    {mod.lessons.map((les, li) => (
                      <div key={les.id} className="px-4 py-4 space-y-3">

                        {/* ── Row 1: number / title / type / duration / remove ── */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs opacity-30 w-5 text-center flex-shrink-0">{li + 1}</span>
                          <input type="text" placeholder="Lesson title..." value={les.title}
                            onChange={e => updateLesson(mod.id, les.id, "title", e.target.value)}
                            className="input input-sm input-bordered bg-base-200 flex-1 focus:outline-none min-w-0 focus:border-purple-500" />
                          <select value={les.type} onChange={e => updateLesson(mod.id, les.id, "type", e.target.value)}
                            className="select select-sm select-bordered bg-base-200 focus:outline-none flex-shrink-0 cursor-pointer">
                            <option value="video">📹 Video</option>
                            <option value="text">📄 Text</option>
                            <option value="quiz">📝 Quiz</option>
                            <option value="assignment">📋 Assignment</option>
                          </select>
                          <input type="text" placeholder="0:00" value={les.duration}
                            onChange={e => updateLesson(mod.id, les.id, "duration", e.target.value)}
                            className="input input-sm input-bordered bg-base-200 w-16 text-center focus:outline-none flex-shrink-0" />
                          <button type="button" onClick={() => removeLesson(mod.id, les.id)}
                            className="btn btn-xs btn-ghost btn-circle opacity-30 hover:opacity-100 hover:text-error flex-shrink-0 cursor-pointer">✕</button>
                        </div>

                        {/* ── VIDEO: URL input + YouTube preview ── */}
                        {les.type === "video" && (
                          <div className="ml-7 space-y-2">
                            <label className="text-xs font-semibold opacity-40 block">📹 Video URL — YouTube, Vimeo বা direct link</label>
                            <div className="input input-sm input-bordered bg-base-200 flex items-center gap-2 focus-within:border-purple-500 w-full">
                              <svg className="w-4 h-4 opacity-40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                              <input type="url" placeholder="https://youtube.com/watch?v=... বা direct .mp4 link"
                                value={les.videoUrl || ""}
                                onChange={e => updateLesson(mod.id, les.id, "videoUrl", e.target.value)}
                                className="grow bg-transparent focus:outline-none text-sm" />
                              {les.videoUrl && (
                                <a href={les.videoUrl} target="_blank" rel="noreferrer"
                                  className="text-xs font-semibold flex-shrink-0 hover:underline transition-opacity"
                                  style={{ color: "#832388" }}>Preview ↗</a>
                              )}
                            </div>
                            {/* YouTube embed preview */}
                            {les.videoUrl && (() => {
                              const yt = les.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
                              if (!yt) return null;
                              return (
                                <div className="rounded-xl overflow-hidden border border-base-300" style={{ height: 160 }}>
                                  <iframe src={`https://www.youtube.com/embed/${yt[1]}`} className="w-full h-full" allowFullScreen title="lesson preview" />
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* ── TEXT: content textarea ── */}
                        {les.type === "text" && (
                          <div className="ml-7 space-y-1">
                            <label className="text-xs font-semibold opacity-40 block">📄 Lesson Content (Text / HTML)</label>
                            <textarea rows={5}
                              placeholder="এখানে lesson এর text content লিখুন... HTML tag ও ব্যবহার করতে পারবেন।"
                              value={les.textContent || ""}
                              onChange={e => updateLesson(mod.id, les.id, "textContent", e.target.value)}
                              className="textarea textarea-bordered bg-base-200 w-full resize-y focus:outline-none focus:border-purple-500 text-sm transition-colors" />
                            <p className="text-xs opacity-30">{(les.textContent || "").length} characters</p>
                          </div>
                        )}

                        {/* ── QUIZ: info notice ── */}
                        {les.type === "quiz" && (
                          <div className="ml-7">
                            <div className="flex items-start gap-3 bg-base-200 border border-base-300 rounded-xl px-4 py-3">
                              <span className="text-xl mt-0.5">📝</span>
                              <div>
                                <p className="text-sm font-semibold">Quiz Lesson</p>
                                <p className="text-xs opacity-50 mt-0.5">Quiz এর questions ও options course publish করার পরে <span className="font-semibold" style={{ color: "#832388" }}>Quiz Manager</span> থেকে configure করতে পারবেন।</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── ASSIGNMENT: instructions textarea ── */}
                        {les.type === "assignment" && (
                          <div className="ml-7 space-y-1">
                            <label className="text-xs font-semibold opacity-40 block">📋 Assignment Instructions</label>
                            <textarea rows={4}
                              placeholder="Students কে কী করতে হবে তা বিস্তারিত লিখুন... deadline, submission format ইত্যাদি।"
                              value={les.assignmentDesc || ""}
                              onChange={e => updateLesson(mod.id, les.id, "assignmentDesc", e.target.value)}
                              className="textarea textarea-bordered bg-base-200 w-full resize-y focus:outline-none focus:border-purple-500 text-sm transition-colors" />
                            <p className="text-xs opacity-30">{(les.assignmentDesc || "").length} characters</p>
                          </div>
                        )}

                      </div>
                    ))}

                    {mod.lessons.length === 0 && (
                      <div className="px-4 py-4 text-center text-sm opacity-40">
                        No lessons yet —{" "}
                        <span onClick={() => addLesson(mod.id)} className="cursor-pointer hover:underline" style={{ color: "#832388", opacity: 1 }}>
                          add a lesson
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ════ STEP 3 ════ */}
          {step === 3 && (
            <div className="max-w-lg mx-auto space-y-5">
              <div>
                <p className="label-text font-semibold mb-2">Course Type <span className="text-error">*</span></p>
                <Controller control={control} name="priceType" render={({ field }) => (
                  <div className="grid grid-cols-2 gap-3">
                    {(["paid", "free"] as const).map(t => (
                      <button key={t} type="button" onClick={() => field.onChange(t)}
                        className={`btn gap-2 cursor-pointer ${field.value === t ? "text-white border-0" : "btn-outline"}`}
                        style={field.value === t ? { backgroundColor: "#832388" } : {}}>
                        {t === "paid" ? "💰 Paid Course" : "🎁 Free Course"}
                      </button>
                    ))}
                  </div>
                )} />
              </div>
              {priceType === "paid" && (
                <>
                  <div className="form-control">
                    <label className="label pb-1"><span className="label-text font-semibold">Regular Price (৳) <span className="text-error">*</span></span></label>
                    <label className={`input input-bordered bg-base-200 flex items-center gap-2 focus-within:border-purple-500 ${errors.price ? "border-error" : ""}`}>
                      <span className="opacity-40 font-medium">৳</span>
                      <input {...register("price", { validate: v => priceType !== "paid" || Number(v) > 0 || "Enter a valid price greater than 0" })}
                        type="number" placeholder="0" className="grow bg-transparent focus:outline-none" />
                    </label>
                    <ErrMsg msg={errors.price?.message} />
                  </div>
                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-semibold">Discount Price (৳)</span>
                      <span className="label-text-alt opacity-40">optional</span>
                    </label>
                    <label className={`input input-bordered bg-base-200 flex items-center gap-2 focus-within:border-purple-500 ${errors.discountPrice ? "border-error" : ""}`}>
                      <span className="opacity-40 font-medium">৳</span>
                      <input {...register("discountPrice", { validate: v => !v || Number(v) < Number(price) || "Discount must be less than regular price" })}
                        type="number" placeholder="0" className="grow bg-transparent focus:outline-none" />
                    </label>
                    {errors.discountPrice ? <ErrMsg msg={errors.discountPrice.message} />
                      : price && discountP && Number(discountP) < Number(price)
                        ? <p className="text-success text-xs mt-1 font-semibold">🎉 {Math.round((1 - Number(discountP) / Number(price)) * 100)}% discount applied</p>
                        : null}
                  </div>
                </>
              )}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-semibold">Enrollment Limit</span>
                  <span className="label-text-alt opacity-40">optional</span>
                </label>
                <input {...register("enrollmentLimit")} type="number" placeholder="Unlimited" className="input input-bordered bg-base-200 w-full focus:outline-none" />
              </div>
              <div className="form-control">
                <label className="label pb-1"><span className="label-text font-semibold">Access Duration</span></label>
                <select {...register("accessDuration")} className="select select-bordered bg-base-200 w-full focus:outline-none cursor-pointer">
                  <option value="lifetime">Lifetime Access</option>
                  <option value="1year">1 Year</option>
                  <option value="6months">6 Months</option>
                  <option value="3months">3 Months</option>
                </select>
              </div>
              {(price || priceType === "free") && (
                <div className="card bg-base-200 border border-base-300">
                  <div className="card-body p-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40">Pricing Summary</p>
                    <div className="flex justify-between text-sm"><span className="opacity-60">Type</span><span className="font-semibold capitalize">{priceType}</span></div>
                    {priceType === "paid" && (
                      <>
                        <div className="flex justify-between text-sm"><span className="opacity-60">Regular Price</span><span className="font-semibold">৳{price || 0}</span></div>
                        {discountP && Number(discountP) < Number(price) && (
                          <div className="flex justify-between text-sm"><span className="opacity-60">After Discount</span><span className="font-bold text-success">৳{discountP}</span></div>
                        )}
                      </>
                    )}
                    <div className="flex justify-between text-sm"><span className="opacity-60">Access</span><span className="font-semibold">{accessDur === "lifetime" ? "Lifetime" : accessDur}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ STEP 4 ════ */}
          {step === 4 && (
            <div className="max-w-lg mx-auto space-y-5">
              <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
                {coverSrc && <img src={coverSrc} alt="cover" className="w-full h-40 object-cover" />}
                <div className="card-body p-4 space-y-3">
                  <h3 className="card-title text-base">{title || "Untitled Course"}</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="badge badge-outline" style={{ borderColor: "#832388", color: "#832388" }}>{category}</div>
                    <div className="badge badge-outline">{level}</div>
                    {priceType === "free" ? <div className="badge badge-success badge-outline">Free</div>
                      : <div className="badge badge-error badge-outline">৳{discountP || price || "0"}</div>}
                  </div>
                  <div className="stats bg-base-200 border border-base-300 rounded-xl w-full shadow-none">
                    {[{ label: "Modules", val: modules.length }, { label: "Lessons", val: totalLessons }, { label: "FAQs", val: faqFields.length }].map(s => (
                      <div key={s.label} className="stat py-3 px-4 place-items-center">
                        <div className="stat-value text-lg font-bold">{s.val}</div>
                        <div className="stat-desc">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="label-text font-semibold mb-2">Visibility</p>
                <Controller control={control} name="visibility" render={({ field }) => (
                  <div className="grid grid-cols-2 gap-3">
                    {(["public", "private"] as const).map(v => (
                      <button key={v} type="button" onClick={() => field.onChange(v)}
                        className={`btn gap-2 cursor-pointer ${field.value === v ? "text-white border-0" : "btn-outline"}`}
                        style={field.value === v ? { backgroundColor: "#832388" } : {}}>
                        {v === "public" ? "🌐 Public" : "🔒 Private"}
                      </button>
                    ))}
                  </div>
                )} />
              </div>
              <div className={`card border ${allDone ? "bg-success/5 border-success/30" : "bg-base-200 border-base-300"}`}>
                <div className="card-body p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40">Pre-publish Checklist</p>
                    {allDone && <div className="badge badge-success badge-sm gap-1">✓ Ready to {editId ? "update" : "publish"}</div>}
                  </div>
                  <div className="space-y-2">
                    {checks.map(item => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${item.done ? "bg-success text-white" : "bg-base-300 opacity-40"}`}>
                          {item.done ? "✓" : "○"}
                        </div>
                        <span className={`text-sm transition-all ${!item.done ? "opacity-40" : ""}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="sticky bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 px-6 py-4 flex items-center justify-between shadow-lg pr-30">
        <button type="button" onClick={handleBack} disabled={step === 1 || loading}
          className="btn btn-sm btn-outline gap-2 disabled:opacity-30"
          style={{ cursor: (step === 1 || loading) ? "not-allowed" : "pointer" }}>← Back</button>

        <div className="flex gap-3 items-center">
          <button type="button" onClick={() => submitCourse("draft")} disabled={loading}
            className="btn btn-sm btn-ghost border border-base-300 disabled:opacity-50"
            style={{ cursor: loading ? "not-allowed" : "pointer" }}>
            {loading && <span className="loading loading-spinner loading-xs mr-1" />}
            {editId ? "Save changes" : "Save as draft"}
          </button>
          {step < 4 ? (
            <button type="button" onClick={handleNext} disabled={loading}
              className="btn btn-sm text-white border-0 select-none"
              style={{ background: "linear-gradient(135deg, #832388, #FF0F7B)", cursor: loading ? "not-allowed" : "pointer" }}>
              Save &amp; Continue →
            </button>
          ) : (
            <button type="button" onClick={() => submitCourse("published")} disabled={loading}
              className="btn btn-sm text-white border-0"
              style={{ background: "linear-gradient(135deg, #00C48C, #0EA5E9)", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? (
                <><span className="loading loading-spinner loading-xs mr-1" />{editId ? "Updating..." : "Publishing..."}</>
              ) : (editId ? "✅ Update Course" : "🚀 Publish Course")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}