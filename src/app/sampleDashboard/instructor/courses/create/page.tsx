"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  Controller,
  useFieldArray,
  type SubmitHandler,
} from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FAQItem    { question: string; answer: string }
interface LessonItem { id: number; title: string; type: string; duration: string }
interface ModuleItem { id: number; title: string; lessons: LessonItem[] }

interface FormValues {
  title:           string;
  category:        string;
  level:           string;
  description:     string;
  coverMode:       "upload" | "url";
  coverUrl:        string;
  videoMode:       "upload" | "url";
  videoUrl:        string;
  faqs:            FAQItem[];
  priceType:       "paid" | "free";
  price:           string;
  discountPrice:   string;
  enrollmentLimit: string;
  accessDuration:  string;
  visibility:      "public" | "private";
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

// ─── Helper: File → base64 ────────────────────────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ─── Shared error message component ──────────────────────────────────────────
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
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function CreateCoursePage() {
  const router = useRouter();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme]     = useState("light");

  // File state (outside RHF — File objects aren't serialisable)
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  // Modules state (complex nested, managed manually)
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [moduleErr, setModuleErr] = useState("");

  // ── Dark mode sync ──────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    const iv = setInterval(() => {
      const cur = localStorage.getItem("theme") || "light";
      if (cur !== theme) setTheme(cur);
    }, 100);
    return () => clearInterval(iv);
  }, [theme]);

  // ── React Hook Form ─────────────────────────────────────────────────────────
  const {
    register,
    control,
    watch,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange", // ← validate & clear errors as user types
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

  const { fields: faqFields, append: addFaq, remove: removeFaq } = useFieldArray({
    control,
    name: "faqs",
  });

  const coverMode  = watch("coverMode");
  const videoMode  = watch("videoMode");
  const coverUrl   = watch("coverUrl");
  const videoUrl   = watch("videoUrl");
  const priceType  = watch("priceType");
  const price      = watch("price");
  const discountP  = watch("discountPrice");
  const accessDur  = watch("accessDuration");
  const visibility = watch("visibility");
  const title      = watch("title");
  const category   = watch("category");
  const level      = watch("level");
  const desc       = watch("description");

  // ── Step 1 validation fields ────────────────────────────────────────────────
  const step1Fields: (keyof FormValues)[] = [
    "title", "category", "level", "description",
    "coverUrl", "videoUrl",
  ];

  // ── Step validation ─────────────────────────────────────────────────────────
  const validateCurrentStep = async (): Promise<boolean> => {
    if (step === 1) {
      const ok = await trigger(step1Fields);
      // Extra: file checks
      if (coverMode === "upload" && !coverFile) {
        toast.error("⚠️ Please upload a Cover Image", tErr);
        return false;
      }
      if (videoMode === "upload" && !videoFile) {
        toast.error("⚠️ Please upload a Sales Video", tErr);
        return false;
      }
      if (!ok) {
        const first = Object.values(errors).find(Boolean);
        if (first?.message) toast.error(`⚠️ ${first.message}`, tErr);
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (modules.length === 0) {
        setModuleErr("Add at least 1 module before continuing");
        toast.error("⚠️ Add at least 1 module", tErr);
        return false;
      }
      const hasLesson = modules.some(m => m.lessons.length > 0);
      if (!hasLesson) {
        setModuleErr("Add at least 1 lesson inside a module");
        toast.error("⚠️ Add at least 1 lesson inside a module", tErr);
        return false;
      }
      setModuleErr("");
      return true;
    }
    if (step === 3) {
      const ok = await trigger(["price", "discountPrice"]);
      if (!ok) {
        const msg = errors.price?.message || errors.discountPrice?.message;
        if (msg) toast.error(`⚠️ ${msg}`, tErr);
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = async () => {
    const ok = await validateCurrentStep();
    if (ok) setStep(s => Math.min(s + 1, 4));
  };
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  // ── Module helpers ──────────────────────────────────────────────────────────
  const addModule = () => {
    setModules(prev => [...prev, { id: Date.now(), title: `Module ${prev.length + 1}`, lessons: [] }]);
    setModuleErr("");
  };
  const removeModule   = (id: number) => setModules(prev => prev.filter(m => m.id !== id));
  const updateModTitle = (id: number, t: string) => setModules(prev => prev.map(m => m.id === id ? { ...m, title: t } : m));
  const addLesson      = (mid: number) => setModules(prev => prev.map(m => m.id === mid ? { ...m, lessons: [...m.lessons, { id: Date.now(), title: "", type: "video", duration: "" }] } : m));
  const removeLesson   = (mid: number, lid: number) => setModules(prev => prev.map(m => m.id === mid ? { ...m, lessons: m.lessons.filter(l => l.id !== lid) } : m));
  const updateLesson   = (mid: number, lid: number, field: string, value: string) =>
    setModules(prev => prev.map(m => m.id === mid ? { ...m, lessons: m.lessons.map(l => l.id === lid ? { ...l, [field]: value } : l) } : m));

  // ── Submit ──────────────────────────────────────────────────────────────────
  const submitCourse = async (status: "draft" | "published") => {
    const vals = getValues();

    if (status === "draft" && !vals.title.trim()) {
      toast.error("⚠️ Add a course title before saving draft!", tErr);
      return;
    }
    if (status === "published") {
      for (let s = 1; s <= 3; s++) {
        const orig = step;
        setStep(s);
        // quick re-validate
        if (s === 1) {
          const ok = await trigger(step1Fields);
          if (!ok || (coverMode === "upload" && !coverFile) || (videoMode === "upload" && !videoFile)) {
            setStep(s); return;
          }
        }
        if (s === 2) {
          if (modules.length === 0 || !modules.some(m => m.lessons.length > 0)) {
            setStep(s); return;
          }
        }
        setStep(orig);
      }
    }

    setLoading(true);
    const tid = toast.loading(
      status === "draft" ? "💾 Saving draft..." : "🚀 Publishing course...",
      { position: "top-right", style: { borderRadius: "12px", background: "#1e1e2e", color: "#fff", fontWeight: "600" } }
    );

    try {
      let coverPayload: any = { type: "url", url: vals.coverUrl };
      if (vals.coverMode === "upload" && coverFile) {
        const base64 = await fileToBase64(coverFile);
        coverPayload  = { type: "upload", base64 };
      }
      let videoPayload: any = { type: "url", url: vals.videoUrl };
      if (vals.videoMode === "upload" && videoFile) {
        const base64 = await fileToBase64(videoFile);
        videoPayload  = { type: "upload", base64 };
      }

      const payload = {
        instructorId: "REPLACE_WITH_SESSION_USER_ID",
        title:        vals.title,
        category:     vals.category,
        level:        vals.level,
        description:  vals.description,
        coverImage:   coverPayload,
        salesVideo:   videoPayload,
        faqs:         vals.faqs,
        modules,
        pricing: {
          type:            vals.priceType,
          price:           Number(vals.price) || 0,
          discountPrice:   vals.discountPrice ? Number(vals.discountPrice) : null,
          enrollmentLimit: vals.enrollmentLimit ? Number(vals.enrollmentLimit) : null,
          accessDuration:  vals.accessDuration,
        },
        visibility: vals.visibility,
        status,
      };

      const res     = await fetch("/api/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Something went wrong");

      toast.success(
        status === "draft" ? "Draft saved! 📝" : "Course published! 🎉",
        {
          id: tid, ...tOk,
          style: {
            ...tOk.style,
            background: status === "published" ? "linear-gradient(135deg,#832388,#FF0F7B)" : "#1e1e2e",
          },
        }
      );
      setTimeout(() => router.push("/sampleDashboard/instructor/courses"), 1500);
    } catch (err: any) {
      toast.error(`❌ ${err.message || "Failed. Try again!"}`, { id: tid, ...tErr, duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  // ── Preview data for step 4 ─────────────────────────────────────────────────
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  const coverSrc     = coverFile ? URL.createObjectURL(coverFile) : coverUrl || null;
  const checks = [
    { label: "Course title added",      done: !!title },
    { label: "Description written",     done: desc.length >= 20 },
    { label: "Cover image provided",    done: !!(coverFile || coverUrl) },
    { label: "Sales video provided",    done: !!(videoFile || videoUrl) },
    { label: "At least 1 module added", done: modules.length > 0 },
    { label: "Pricing configured",      done: priceType === "free" || (priceType === "paid" && Number(price) > 0) },
  ];
  const allDone = checks.every(c => c.done);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col bg-base-100 min-h-screen" data-theme={theme}>

      {/* Toast — top right */}
      <Toaster
        position="top-right"
        containerStyle={{ top: 24, right: 24 }}
        toastOptions={{ style: { maxWidth: 360 } }}
      />

      {/* ── Top Bar ── */}
      <div className="bg-base-100 border-b border-base-300 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold cursor-pointer hover:underline" style={{ color: "#832388" }}
            onClick={() => router.push("/sampleDashboard/instructor/courses")}>
            My Courses
          </span>
          <span className="opacity-30">/</span>
          <span className="font-medium opacity-60">Create new course</span>
        </div>
        <button className="btn btn-sm btn-outline cursor-pointer">Preview</button>
      </div>

      {/* ── Stepper ── */}
      <div className="bg-base-100 border-b border-base-300 px-6 py-4">
        <ul className="steps steps-horizontal w-full text-xs">
          {STEPS.map(s => (
            <li key={s.id}
              data-content={step > s.id ? "✓" : String(s.id)}
              className={`step font-medium transition-all ${step >= s.id ? "step-primary" : ""}`}>
              <span className="hidden sm:inline">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 pb-32">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-lg font-bold mb-6">{STEPS[step - 1].label}</h2>

          {/* ════ STEP 1 ════ */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* LEFT */}
              <div className="space-y-5">

                {/* Title */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-semibold">Course Title <span className="text-error">*</span></span>
                  </label>
                  <input
                    {...register("title", { required: "Course title is required" })}
                    type="text"
                    placeholder="e.g. Introduction to Data Analysis"
                    className={`input input-bordered w-full bg-base-200 focus:outline-none transition-colors ${errors.title ? "border-error" : "focus:border-purple-500"}`}
                  />
                  <ErrMsg msg={errors.title?.message} />
                </div>

                {/* Category + Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-semibold">Category <span className="text-error">*</span></span>
                    </label>
                    <select
                      {...register("category", { required: "Please select a category" })}
                      className={`select select-bordered bg-base-200 w-full focus:outline-none cursor-pointer ${errors.category ? "border-error" : ""}`}>
                      <option value="">— Select —</option>
                      <option>Data Management</option>
                      <option>Web Development</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>Business</option>
                    </select>
                    <ErrMsg msg={errors.category?.message} />
                  </div>

                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-semibold">Level <span className="text-error">*</span></span>
                    </label>
                    <select
                      {...register("level", { required: "Please select a level" })}
                      className={`select select-bordered bg-base-200 w-full focus:outline-none cursor-pointer ${errors.level ? "border-error" : ""}`}>
                      <option value="">— Select —</option>
                      <option>Basic</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                    <ErrMsg msg={errors.level?.message} />
                  </div>
                </div>

                {/* Description */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-semibold">Description <span className="text-error">*</span></span>
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                      minLength: { value: 20, message: "Description must be at least 20 characters" },
                    })}
                    rows={5}
                    maxLength={2000}
                    placeholder="Write a short description (min 20 characters)..."
                    className={`textarea textarea-bordered bg-base-200 w-full resize-none focus:outline-none transition-colors ${errors.description ? "border-error" : "focus:border-purple-500"}`}
                  />
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
                      className="btn btn-xs btn-ghost cursor-pointer" style={{ color: "#832388" }}>
                      + Add FAQ
                    </button>
                  </div>
                  <div className="space-y-3">
                    {faqFields.map((field, i) => (
                      <div key={field.id} className="card card-compact bg-base-200 border border-base-300 relative">
                        <div className="card-body p-3">
                          <button type="button" onClick={() => removeFaq(i)}
                            className="btn btn-xs btn-ghost btn-circle absolute top-2 right-2 opacity-40 hover:opacity-100 hover:text-error cursor-pointer">✕</button>
                          <input
                            {...register(`faqs.${i}.question`)}
                            type="text"
                            placeholder="Question..."
                            className="input input-sm input-ghost w-full bg-transparent border-b border-base-300 rounded-none pr-8 focus:outline-none"
                          />
                          <textarea
                            {...register(`faqs.${i}.answer`)}
                            rows={2}
                            placeholder="Answer..."
                            className="textarea textarea-ghost bg-transparent w-full resize-none text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                    {faqFields.length === 0 && (
                      <div onClick={() => addFaq({ question: "", answer: "" })}
                        className="border-2 border-dashed border-base-300 rounded-xl p-4 text-center text-sm opacity-50 cursor-pointer hover:border-purple-400 hover:opacity-80 transition-all">
                        Click "+ Add FAQ" to add questions
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-5">

                {/* ── Cover Image ── */}
                <div className="form-control">
                  <div className="flex items-center justify-between mb-2">
                    <label className="label-text font-semibold">
                      Cover Image <span className="text-error">*</span>
                    </label>
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
                      {/* Preview above input */}
                      <div className="border-2 border-dashed rounded-xl h-40 overflow-hidden flex items-center justify-center bg-base-200 border-base-300">
                        {coverUrl
                          ? <img src={coverUrl} alt="preview" className="h-full w-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          : <p className="text-sm opacity-40">Image preview will appear here</p>}
                      </div>
                      <input
                        {...register("coverUrl", {
                          validate: v => coverMode !== "url" || v.trim() !== "" || "Please enter a cover image URL",
                        })}
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className={`input input-bordered bg-base-200 w-full focus:outline-none transition-colors ${errors.coverUrl ? "border-error" : "focus:border-purple-500"}`}
                      />
                      <ErrMsg msg={errors.coverUrl?.message} />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Preview above dropzone */}
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

                {/* ── Sales Video ── */}
                <div className="form-control">
                  <div className="flex items-center justify-between mb-2">
                    <label className="label-text font-semibold">
                      Sales Video <span className="text-error">*</span>
                    </label>
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
                      {/* Preview above input */}
                      <div className="border-2 border-dashed rounded-xl h-40 overflow-hidden flex items-center justify-center bg-base-200 border-base-300">
                        {videoUrl ? (
                          (() => {
                            const yt = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
                            if (yt) return <iframe src={`https://www.youtube.com/embed/${yt[1]}`} className="w-full h-full" allowFullScreen title="preview" />;
                            return (
                              <div className="text-center px-4">
                                <div className="badge badge-success gap-1 mb-2">✓ Link added</div>
                                <p className="text-xs opacity-60 break-all">{videoUrl}</p>
                              </div>
                            );
                          })()
                        ) : <p className="text-sm opacity-40">Video preview will appear here</p>}
                      </div>
                      <input
                        {...register("videoUrl", {
                          validate: v => videoMode !== "url" || v.trim() !== "" || "Please enter a video link",
                        })}
                        type="url"
                        placeholder="YouTube, Vimeo or direct video link..."
                        className={`input input-bordered bg-base-200 w-full focus:outline-none transition-colors ${errors.videoUrl ? "border-error" : "focus:border-purple-500"}`}
                      />
                      <ErrMsg msg={errors.videoUrl?.message} />
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
                        ) : (
                          <p className="text-sm opacity-50">Click to change video</p>
                        )}
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
                <button type="button" onClick={addModule}
                  className="btn btn-sm text-white border-0 cursor-pointer"
                  style={{ backgroundColor: "#832388" }}>
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
                  <div className="flex items-center gap-3 bg-base-200 px-4 py-3 border-b border-base-300">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: "#832388" }}>{mi + 1}</div>
                    <input type="text" value={mod.title} onChange={e => updateModTitle(mod.id, e.target.value)}
                      className="flex-1 bg-transparent text-sm font-semibold focus:outline-none min-w-0" placeholder="Module title..." />
                    <button type="button" onClick={() => addLesson(mod.id)}
                      className="btn btn-xs btn-ghost flex-shrink-0 cursor-pointer" style={{ color: "#832388" }}>
                      + Lesson
                    </button>
                    <button type="button" onClick={() => removeModule(mod.id)}
                      className="btn btn-xs btn-ghost btn-circle opacity-40 hover:opacity-100 hover:text-error flex-shrink-0 cursor-pointer">✕</button>
                  </div>
                  <div className="divide-y divide-base-200">
                    {mod.lessons.map((les, li) => (
                      <div key={les.id} className="flex items-center gap-2 px-4 py-3">
                        <span className="text-xs opacity-30 w-5 text-center flex-shrink-0">{li + 1}</span>
                        <input type="text" placeholder="Lesson title..." value={les.title}
                          onChange={e => updateLesson(mod.id, les.id, "title", e.target.value)}
                          className="input input-sm input-bordered bg-base-200 flex-1 focus:outline-none min-w-0" />
                        <select value={les.type} onChange={e => updateLesson(mod.id, les.id, "type", e.target.value)}
                          className="select select-sm select-bordered bg-base-200 focus:outline-none flex-shrink-0 cursor-pointer">
                          <option value="video">📹 Video</option>
                          <option value="quiz">📝 Quiz</option>
                          <option value="assignment">📋 Assignment</option>
                          <option value="text">📄 Text</option>
                        </select>
                        <input type="text" placeholder="0:00" value={les.duration}
                          onChange={e => updateLesson(mod.id, les.id, "duration", e.target.value)}
                          className="input input-sm input-bordered bg-base-200 w-16 text-center focus:outline-none flex-shrink-0" />
                        <button type="button" onClick={() => removeLesson(mod.id, les.id)}
                          className="btn btn-xs btn-ghost btn-circle opacity-30 hover:opacity-100 hover:text-error flex-shrink-0 cursor-pointer">✕</button>
                      </div>
                    ))}
                    {mod.lessons.length === 0 && (
                      <div className="px-4 py-4 text-center text-sm opacity-40">
                        No lessons yet —{" "}
                        <span onClick={() => addLesson(mod.id)}
                          className="cursor-pointer hover:underline" style={{ color: "#832388", opacity: 1 }}>
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

              {/* Paid / Free toggle */}
              <div>
                <p className="label-text font-semibold mb-2">Course Type <span className="text-error">*</span></p>
                <Controller
                  control={control}
                  name="priceType"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-3">
                      {(["paid", "free"] as const).map(t => (
                        <button key={t} type="button"
                          onClick={() => field.onChange(t)}
                          className={`btn gap-2 cursor-pointer ${field.value === t ? "text-white border-0" : "btn-outline"}`}
                          style={field.value === t ? { backgroundColor: "#832388" } : {}}>
                          {t === "paid" ? "💰 Paid Course" : "🎁 Free Course"}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              {priceType === "paid" && (
                <>
                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-semibold">Regular Price (৳) <span className="text-error">*</span></span>
                    </label>
                    <label className={`input input-bordered bg-base-200 flex items-center gap-2 focus-within:border-purple-500 ${errors.price ? "border-error" : ""}`}>
                      <span className="opacity-40 font-medium">৳</span>
                      <input
                        {...register("price", {
                          validate: v => priceType !== "paid" || Number(v) > 0 || "Enter a valid price greater than 0",
                        })}
                        type="number"
                        placeholder="0"
                        className="grow bg-transparent focus:outline-none"
                      />
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
                      <input
                        {...register("discountPrice", {
                          validate: v => !v || Number(v) < Number(price) || "Discount must be less than regular price",
                        })}
                        type="number"
                        placeholder="0"
                        className="grow bg-transparent focus:outline-none"
                      />
                    </label>
                    {errors.discountPrice
                      ? <ErrMsg msg={errors.discountPrice.message} />
                      : price && discountP && Number(discountP) < Number(price)
                        ? <p className="text-success text-xs mt-1 font-semibold">
                            🎉 {Math.round((1 - Number(discountP) / Number(price)) * 100)}% discount applied
                          </p>
                        : null}
                  </div>
                </>
              )}

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-semibold">Enrollment Limit</span>
                  <span className="label-text-alt opacity-40">optional</span>
                </label>
                <input {...register("enrollmentLimit")} type="number" placeholder="Unlimited"
                  className="input input-bordered bg-base-200 w-full focus:outline-none" />
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-semibold">Access Duration</span>
                </label>
                <select {...register("accessDuration")}
                  className="select select-bordered bg-base-200 w-full focus:outline-none cursor-pointer">
                  <option value="lifetime">Lifetime Access</option>
                  <option value="1year">1 Year</option>
                  <option value="6months">6 Months</option>
                  <option value="3months">3 Months</option>
                </select>
              </div>

              {/* Summary */}
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
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Access</span>
                      <span className="font-semibold">{accessDur === "lifetime" ? "Lifetime" : accessDur}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ STEP 4 ════ */}
          {step === 4 && (
            <div className="max-w-lg mx-auto space-y-5">

              {/* Preview card */}
              <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
                {coverSrc && <img src={coverSrc} alt="cover" className="w-full h-40 object-cover" />}
                <div className="card-body p-4 space-y-3">
                  <h3 className="card-title text-base">{title || "Untitled Course"}</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="badge badge-outline" style={{ borderColor: "#832388", color: "#832388" }}>{category}</div>
                    <div className="badge badge-outline">{level}</div>
                    {priceType === "free"
                      ? <div className="badge badge-success badge-outline">Free</div>
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

              {/* Visibility */}
              <div>
                <p className="label-text font-semibold mb-2">Visibility</p>
                <Controller control={control} name="visibility"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-3">
                      {(["public", "private"] as const).map(v => (
                        <button key={v} type="button" onClick={() => field.onChange(v)}
                          className={`btn gap-2 cursor-pointer ${field.value === v ? "text-white border-0" : "btn-outline"}`}
                          style={field.value === v ? { backgroundColor: "#832388" } : {}}>
                          {v === "public" ? "🌐 Public" : "🔒 Private"}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* Checklist */}
              <div className={`card border ${allDone ? "bg-success/5 border-success/30" : "bg-base-200 border-base-300"}`}>
                <div className="card-body p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40">Pre-publish Checklist</p>
                    {allDone && <div className="badge badge-success badge-sm gap-1">✓ Ready to publish</div>}
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

      {/* ── Bottom Bar ── */}
      <div className="fixed bottom-0 left-54 right-0 bg-base-100 border-t border-base-300 px-6 py-4 flex items-center justify-between z-20 shadow-lg">
        <button type="button" onClick={handleBack} disabled={step === 1 || loading}
          className="btn btn-sm btn-outline gap-2 disabled:opacity-30 cursor-pointer">
          ← Back
        </button>
        <div className="flex gap-3">
          <button type="button" onClick={() => submitCourse("draft")} disabled={loading}
            className="btn btn-sm btn-ghost border border-base-300 disabled:opacity-50 cursor-pointer">
            {loading && <span className="loading loading-spinner loading-xs mr-1" />}
            Save as draft
          </button>
          {step < 4 ? (
            <button type="button" onClick={handleNext} disabled={loading}
              className="btn btn-sm text-white border-0 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #832388, #FF0F7B)" }}>
              Save & Continue →
            </button>
          ) : (
            <button type="button" onClick={() => submitCourse("published")} disabled={loading}
              className="btn btn-sm text-white border-0 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #00C48C, #0EA5E9)" }}>
              {loading
                ? <><span className="loading loading-spinner loading-xs mr-1" />Publishing...</>
                : "🚀 Publish Course"}
            </button>
          )}
        </div>
      </div>

    </div>
  );
}