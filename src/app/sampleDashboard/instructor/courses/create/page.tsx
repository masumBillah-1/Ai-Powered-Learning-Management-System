"use client";

import { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FAQ { id: number; question: string; answer: string }
interface Lesson { id: number; title: string; type: string; duration: string }
interface Module { id: number; title: string; lessons: Lesson[] }

// ─── STEP 1 ───────────────────────────────────────────────────────────────────
function Step1({ data, setData }: { data: any; setData: (d: any) => void }) {
  const coverRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const addFAQ = () =>
    setData({ ...data, faqs: [...data.faqs, { id: Date.now(), question: "", answer: "" }] });
  const removeFAQ = (id: number) =>
    setData({ ...data, faqs: data.faqs.filter((f: FAQ) => f.id !== id) });
  const updateFAQ = (id: number, field: string, value: string) =>
    setData({ ...data, faqs: data.faqs.map((f: FAQ) => f.id === id ? { ...f, [field]: value } : f) });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT */}
      <div className="space-y-5">

        {/* Title */}
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text font-semibold">Title <span className="text-error">*</span></span>
          </label>
          <input
            type="text"
            placeholder="e.g. Introduction to Data Analysis"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="input input-bordered w-full bg-base-200 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category + Level */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label pb-1"><span className="label-text font-semibold">Category</span></label>
            <select value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })}
              className="select select-bordered bg-base-200 w-full focus:outline-none">
              <option>Data Management</option>
              <option>Web Development</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Business</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label pb-1"><span className="label-text font-semibold">Level</span></label>
            <select value={data.level} onChange={(e) => setData({ ...data, level: e.target.value })}
              className="select select-bordered bg-base-200 w-full focus:outline-none">
              <option>Basic</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label pb-1"><span className="label-text font-semibold">Description</span></label>
          <textarea rows={5} maxLength={2000}
            placeholder="Write a short description about your course..."
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="textarea textarea-bordered bg-base-200 w-full resize-none focus:outline-none"
          />
          <label className="label pt-1">
            <span className="label-text-alt opacity-50">{data.description.length}/2000 characters</span>
          </label>
        </div>

        {/* FAQs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="label-text font-semibold">Frequently Asked Questions</span>
            <button onClick={addFAQ} className="btn btn-xs btn-ghost" style={{ color: "#832388" }}>+ Add FAQ</button>
          </div>
          <div className="space-y-3">
            {data.faqs.map((faq: FAQ) => (
              <div key={faq.id} className="card card-compact bg-base-200 border border-base-300 relative">
                <div className="card-body p-3">
                  <button onClick={() => removeFAQ(faq.id)}
                    className="btn btn-xs btn-ghost btn-circle absolute top-2 right-2 opacity-40 hover:opacity-100 hover:text-error">✕</button>
                  <input type="text" placeholder="e.g. Do you offer 1 on 1 calls?" value={faq.question}
                    onChange={(e) => updateFAQ(faq.id, "question", e.target.value)}
                    className="input input-sm input-ghost w-full bg-transparent border-b border-base-300 rounded-none pr-8 focus:outline-none" />
                  <textarea rows={2} placeholder="e.g. Yes, at a fixed cost per call" value={faq.answer}
                    onChange={(e) => updateFAQ(faq.id, "answer", e.target.value)}
                    className="textarea textarea-ghost bg-transparent w-full resize-none text-sm focus:outline-none" />
                </div>
              </div>
            ))}
            {data.faqs.length === 0 && (
              <div onClick={addFAQ}
                className="border-2 border-dashed border-base-300 rounded-xl p-4 text-center text-sm opacity-50 cursor-pointer hover:border-purple-400 hover:opacity-80 transition-all">
                Click "+ Add FAQ" to add questions
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
            <label className="label-text font-semibold">Cover Image</label>
            <div className="tabs tabs-boxed tabs-xs bg-base-200">
              <button onClick={() => setData({ ...data, coverMode: "upload", coverImage: null, coverUrl: "" })}
                className={`tab transition-all ${(data.coverMode || "upload") === "upload" ? "tab-active text-white" : ""}`}
                style={(data.coverMode || "upload") === "upload" ? { backgroundColor: "#832388" } : {}}>
                Upload
              </button>
              <button onClick={() => setData({ ...data, coverMode: "url", coverImage: null, coverUrl: "" })}
                className={`tab transition-all ${data.coverMode === "url" ? "tab-active text-white" : ""}`}
                style={data.coverMode === "url" ? { backgroundColor: "#832388" } : {}}>
                URL
              </button>
            </div>
          </div>

          {data.coverMode === "url" ? (
            <div className="space-y-2">
              <div className="border-2 border-dashed border-base-300 rounded-xl h-44 overflow-hidden flex items-center justify-center bg-base-200">
                {data.coverUrl
                  ? <img src={data.coverUrl} alt="preview" className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : <p className="text-sm opacity-40">Image preview will appear here</p>}
              </div>
              <input type="url" placeholder="https://example.com/image.jpg"
                value={data.coverUrl || ""}
                onChange={(e) => setData({ ...data, coverUrl: e.target.value })}
                className="input input-bordered bg-base-200 w-full focus:outline-none" />
            </div>
          ) : (
            <>
              <div onClick={() => coverRef.current?.click()}
                className="border-2 border-dashed border-base-300 rounded-xl h-52 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-base-200 transition-all overflow-hidden">
                {data.coverImage
                  ? <img src={URL.createObjectURL(data.coverImage)} alt="cover" className="h-full w-full object-cover" />
                  : <>
                      <div className="w-12 h-12 bg-base-300 rounded-xl flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm opacity-60">Click to upload cover image</p>
                      <p className="text-xs opacity-40 mt-1">PNG, JPG up to 5MB</p>
                    </>}
              </div>
              <input ref={coverRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => setData({ ...data, coverImage: e.target.files?.[0] || null })} />
            </>
          )}
        </div>

        {/* Sales Video */}
        <div className="form-control">
          <div className="flex items-center justify-between mb-2">
            <label className="label-text font-semibold">Sales Video</label>
            <div className="tabs tabs-boxed tabs-xs bg-base-200">
              <button onClick={() => setData({ ...data, videoMode: "upload", salesVideo: null, videoUrl: "" })}
                className={`tab transition-all ${(data.videoMode || "upload") === "upload" ? "tab-active text-white" : ""}`}
                style={(data.videoMode || "upload") === "upload" ? { backgroundColor: "#832388" } : {}}>
                Upload
              </button>
              <button onClick={() => setData({ ...data, videoMode: "url", salesVideo: null, videoUrl: "" })}
                className={`tab transition-all ${data.videoMode === "url" ? "tab-active text-white" : ""}`}
                style={data.videoMode === "url" ? { backgroundColor: "#832388" } : {}}>
                Link
              </button>
            </div>
          </div>

          {data.videoMode === "url" ? (
            <div className="space-y-2">
              <div className="border-2 border-dashed border-base-300 rounded-xl h-44 overflow-hidden flex items-center justify-center bg-base-200">
                {data.videoUrl ? (
                  (() => {
                    const yt = data.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
                    if (yt) return <iframe src={`https://www.youtube.com/embed/${yt[1]}`} className="w-full h-full" allowFullScreen title="preview" />;
                    return (
                      <div className="text-center px-4">
                        <div className="badge badge-success gap-1 mb-2">✓ Link added</div>
                        <p className="text-xs opacity-60 break-all">{data.videoUrl}</p>
                      </div>
                    );
                  })()
                ) : <p className="text-sm opacity-40">Video preview will appear here</p>}
              </div>
              <input type="url" placeholder="YouTube, Vimeo or direct video link..."
                value={data.videoUrl || ""}
                onChange={(e) => setData({ ...data, videoUrl: e.target.value })}
                className="input input-bordered bg-base-200 w-full focus:outline-none" />
            </div>
          ) : (
            <>
              <div onClick={() => videoRef.current?.click()}
                className="border-2 border-dashed border-base-300 rounded-xl h-52 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-base-200 transition-all">
                {data.salesVideo ? (
                  <div className="text-center">
                    <div className="badge badge-success gap-1 mb-2">✓ Uploaded</div>
                    <p className="text-sm font-medium">{data.salesVideo.name}</p>
                  </div>
                ) : <>
                    <div className="w-12 h-12 bg-base-300 rounded-xl flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm opacity-60">Click to upload sales video</p>
                    <p className="text-xs opacity-40 mt-1">MP4, MOV up to 500MB</p>
                  </>}
              </div>
              <input ref={videoRef} type="file" accept="video/*" className="hidden"
                onChange={(e) => setData({ ...data, salesVideo: e.target.files?.[0] || null })} />
            </>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── STEP 2 ───────────────────────────────────────────────────────────────────
function Step2({ data, setData }: { data: any; setData: (d: any) => void }) {
  const addModule = () =>
    setData({ ...data, modules: [...data.modules, { id: Date.now(), title: `Module ${data.modules.length + 1}`, lessons: [] }] });
  const addLesson = (moduleId: number) =>
    setData({ ...data, modules: data.modules.map((m: Module) => m.id === moduleId ? { ...m, lessons: [...m.lessons, { id: Date.now(), title: "", type: "video", duration: "" }] } : m) });
  const removeModule = (id: number) =>
    setData({ ...data, modules: data.modules.filter((m: Module) => m.id !== id) });
  const removeLesson = (moduleId: number, lessonId: number) =>
    setData({ ...data, modules: data.modules.map((m: Module) => m.id === moduleId ? { ...m, lessons: m.lessons.filter((l: Lesson) => l.id !== lessonId) } : m) });
  const updateModule = (id: number, title: string) =>
    setData({ ...data, modules: data.modules.map((m: Module) => m.id === id ? { ...m, title } : m) });
  const updateLesson = (moduleId: number, lessonId: number, field: string, value: string) =>
    setData({ ...data, modules: data.modules.map((m: Module) => m.id === moduleId ? { ...m, lessons: m.lessons.map((l: Lesson) => l.id === lessonId ? { ...l, [field]: value } : l) } : m) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-50">Add modules and lessons for your course</p>
        <button onClick={addModule} className="btn btn-sm text-white border-0"
          style={{ backgroundColor: "#832388" }}>
          + Add Module
        </button>
      </div>

      {data.modules.length === 0 && (
        <div onClick={addModule}
          className="border-2 border-dashed border-base-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-base-200 transition-all">
          <div className="w-14 h-14 bg-base-300 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="font-medium opacity-50">No modules yet</p>
          <p className="text-sm opacity-40 mt-1">Click to add your first module</p>
        </div>
      )}

      {data.modules.map((mod: Module, mi: number) => (
        <div key={mod.id} className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 bg-base-200 px-4 py-3 border-b border-base-300">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ backgroundColor: "#832388" }}>{mi + 1}</div>
            <input type="text" value={mod.title} onChange={(e) => updateModule(mod.id, e.target.value)}
              className="flex-1 bg-transparent text-sm font-semibold focus:outline-none min-w-0" placeholder="Module title..." />
            <button onClick={() => addLesson(mod.id)} className="btn btn-xs btn-ghost flex-shrink-0" style={{ color: "#832388" }}>+ Lesson</button>
            <button onClick={() => removeModule(mod.id)} className="btn btn-xs btn-ghost btn-circle opacity-40 hover:opacity-100 hover:text-error flex-shrink-0">✕</button>
          </div>
          <div className="divide-y divide-base-200">
            {mod.lessons.map((lesson: Lesson, li: number) => (
              <div key={lesson.id} className="flex items-center gap-2 px-4 py-3">
                <span className="text-xs opacity-30 w-5 text-center flex-shrink-0">{li + 1}</span>
                <input type="text" placeholder="Lesson title..." value={lesson.title}
                  onChange={(e) => updateLesson(mod.id, lesson.id, "title", e.target.value)}
                  className="input input-sm input-bordered bg-base-200 flex-1 focus:outline-none min-w-0" />
                <select value={lesson.type} onChange={(e) => updateLesson(mod.id, lesson.id, "type", e.target.value)}
                  className="select select-sm select-bordered bg-base-200 focus:outline-none flex-shrink-0">
                  <option value="video">📹 Video</option>
                  <option value="quiz">📝 Quiz</option>
                  <option value="assignment">📋 Assignment</option>
                  <option value="text">📄 Text</option>
                </select>
                <input type="text" placeholder="0:00" value={lesson.duration}
                  onChange={(e) => updateLesson(mod.id, lesson.id, "duration", e.target.value)}
                  className="input input-sm input-bordered bg-base-200 w-16 text-center focus:outline-none flex-shrink-0" />
                <button onClick={() => removeLesson(mod.id, lesson.id)}
                  className="btn btn-xs btn-ghost btn-circle opacity-30 hover:opacity-100 hover:text-error flex-shrink-0">✕</button>
              </div>
            ))}
            {mod.lessons.length === 0 && (
              <div className="px-4 py-4 text-center text-sm opacity-40">
                No lessons yet —{" "}
                <span onClick={() => addLesson(mod.id)} className="cursor-pointer hover:underline" style={{ color: "#832388", opacity: 1 }}>add a lesson</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── STEP 3 ───────────────────────────────────────────────────────────────────
function Step3({ data, setData }: { data: any; setData: (d: any) => void }) {
  return (
    <div className="max-w-lg mx-auto space-y-5">

      {/* Paid/Free */}
      <div className="grid grid-cols-2 gap-3">
        {["paid", "free"].map((type) => (
          <button key={type} onClick={() => setData({ ...data, priceType: type })}
            className={`btn gap-2 ${data.priceType === type ? "text-white border-0" : "btn-outline"}`}
            style={data.priceType === type ? { backgroundColor: "#832388" } : {}}>
            {type === "paid" ? "💰 Paid Course" : "🎁 Free Course"}
          </button>
        ))}
      </div>

      {data.priceType === "paid" && (
        <>
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-semibold">Regular Price (৳) <span className="text-error">*</span></span>
            </label>
            <label className="input input-bordered bg-base-200 flex items-center gap-2 focus-within:border-purple-500">
              <span className="opacity-40 font-medium">৳</span>
              <input type="number" placeholder="0" value={data.price}
                onChange={(e) => setData({ ...data, price: e.target.value })}
                className="grow bg-transparent focus:outline-none" />
            </label>
          </div>

          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-semibold">Discount Price (৳)</span>
              <span className="label-text-alt opacity-40">optional</span>
            </label>
            <label className="input input-bordered bg-base-200 flex items-center gap-2 focus-within:border-purple-500">
              <span className="opacity-40 font-medium">৳</span>
              <input type="number" placeholder="0" value={data.discountPrice}
                onChange={(e) => setData({ ...data, discountPrice: e.target.value })}
                className="grow bg-transparent focus:outline-none" />
            </label>
            {data.price && data.discountPrice && Number(data.discountPrice) < Number(data.price) && (
              <label className="label pt-1">
                <span className="label-text-alt text-success font-semibold">
                  🎉 {Math.round((1 - Number(data.discountPrice) / Number(data.price)) * 100)}% discount applied
                </span>
              </label>
            )}
          </div>
        </>
      )}

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text font-semibold">Enrollment Limit</span>
          <span className="label-text-alt opacity-40">optional</span>
        </label>
        <input type="number" placeholder="Unlimited" value={data.enrollmentLimit}
          onChange={(e) => setData({ ...data, enrollmentLimit: e.target.value })}
          className="input input-bordered bg-base-200 w-full focus:outline-none" />
      </div>

      <div className="form-control">
        <label className="label pb-1"><span className="label-text font-semibold">Access Duration</span></label>
        <select value={data.accessDuration} onChange={(e) => setData({ ...data, accessDuration: e.target.value })}
          className="select select-bordered bg-base-200 w-full focus:outline-none">
          <option value="lifetime">Lifetime Access</option>
          <option value="1year">1 Year</option>
          <option value="6months">6 Months</option>
          <option value="3months">3 Months</option>
        </select>
      </div>

      {(data.price || data.priceType === "free") && (
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest opacity-40">Pricing Summary</p>
            <div className="flex justify-between text-sm"><span className="opacity-60">Type</span><span className="font-semibold capitalize">{data.priceType}</span></div>
            {data.priceType === "paid" && (
              <>
                <div className="flex justify-between text-sm"><span className="opacity-60">Regular Price</span><span className="font-semibold">৳{data.price || 0}</span></div>
                {data.discountPrice && (
                  <div className="flex justify-between text-sm"><span className="opacity-60">After Discount</span><span className="font-bold text-success">৳{data.discountPrice}</span></div>
                )}
              </>
            )}
            <div className="flex justify-between text-sm">
              <span className="opacity-60">Access</span>
              <span className="font-semibold">{data.accessDuration === "lifetime" ? "Lifetime" : data.accessDuration}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STEP 4 ───────────────────────────────────────────────────────────────────
function Step4({ data, setData }: { data: any; setData: (d: any) => void }) {
  const totalLessons = data.modules.reduce((acc: number, m: Module) => acc + m.lessons.length, 0);
  const coverSrc = data.coverImage ? URL.createObjectURL(data.coverImage) : (data.coverUrl || null);

  return (
    <div className="max-w-lg mx-auto space-y-5">

      {/* Preview Card */}
      <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
        {coverSrc && <img src={coverSrc} alt="cover" className="w-full h-40 object-cover" />}
        <div className="card-body p-4 space-y-3">
          <h3 className="card-title text-base">{data.title || "Untitled Course"}</h3>
          <div className="flex flex-wrap gap-2">
            <div className="badge badge-outline" style={{ borderColor: "#832388", color: "#832388" }}>{data.category}</div>
            <div className="badge badge-outline">{data.level}</div>
            {data.priceType === "free"
              ? <div className="badge badge-success badge-outline">Free</div>
              : <div className="badge badge-error badge-outline">৳{data.discountPrice || data.price || "0"}</div>}
          </div>
          <div className="stats bg-base-200 border border-base-300 rounded-xl w-full shadow-none">
            {[
              { label: "Modules", val: data.modules.length },
              { label: "Lessons", val: totalLessons },
              { label: "FAQs", val: data.faqs.length },
            ].map((s) => (
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
        <div className="grid grid-cols-2 gap-3">
          {["public", "private"].map((v) => (
            <button key={v} onClick={() => setData({ ...data, visibility: v })}
              className={`btn gap-2 ${data.visibility === v ? "text-white border-0" : "btn-outline"}`}
              style={data.visibility === v ? { backgroundColor: "#832388" } : {}}>
              {v === "public" ? "🌐 Public" : "🔒 Private"}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="card bg-base-200 border border-base-300">
        <div className="card-body p-4">
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Pre-publish Checklist</p>
          <div className="space-y-2">
            {[
              { label: "Course title added", done: !!data.title },
              { label: "Description written", done: data.description.length > 20 },
              { label: "Cover image uploaded", done: !!(data.coverImage || data.coverUrl) },
              { label: "At least 1 module added", done: data.modules.length > 0 },
              { label: "Pricing configured", done: !!data.priceType },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${item.done ? "bg-success text-white" : "bg-base-300 opacity-40"}`}>
                  {item.done ? "✓" : "○"}
                </div>
                <span className={`text-sm ${!item.done ? "opacity-40" : ""}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STEPS CONFIG ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Course Information & FAQ" },
  { id: 2, label: "Upload Course Materials" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Publish" },
];

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function CreateCoursePage() {
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    const interval = setInterval(() => {
      const cur = localStorage.getItem("theme") || "light";
      if (cur !== theme) setTheme(cur);
    }, 100);
    return () => clearInterval(interval);
  }, [theme]);

  const [formData, setFormData] = useState({
    title: "",
    category: "Data Management",
    level: "Basic",
    description: "",
    coverImage: null as File | null,
    coverUrl: "",
    coverMode: "upload",
    salesVideo: null as File | null,
    videoUrl: "",
    videoMode: "upload",
    faqs: [] as FAQ[],
    modules: [] as Module[],
    priceType: "paid",
    price: "",
    discountPrice: "",
    enrollmentLimit: "",
    accessDuration: "lifetime",
    visibility: "public",
  });

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="flex flex-col bg-base-100 min-h-screen" data-theme={theme}>

      {/* Top Bar */}
      <div className="bg-base-100 border-b border-base-300 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold cursor-pointer hover:underline" style={{ color: "#832388" }}>
            My Courses
          </span>
          <span className="opacity-30">/</span>
          <span className="font-medium opacity-60">Create new course</span>
        </div>
        <button className="btn btn-sm btn-outline">Preview</button>
      </div>

      {/* Stepper */}
      <div className="bg-base-100 border-b border-base-300 px-6 py-4">
        <ul className="steps steps-horizontal w-full text-xs">
          {STEPS.map((s) => (
            <li
              key={s.id}
              onClick={() => setStep(s.id)}
              data-content={step > s.id ? "✓" : String(s.id)}
              className={`step cursor-pointer font-medium transition-all ${step >= s.id ? "step-primary" : ""}`}
            >
              <span className="hidden sm:inline">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-lg font-bold mb-6">{STEPS[step - 1].label}</h2>
          {step === 1 && <Step1 data={formData} setData={setFormData} />}
          {step === 2 && <Step2 data={formData} setData={setFormData} />}
          {step === 3 && <Step3 data={formData} setData={setFormData} />}
          {step === 4 && <Step4 data={formData} setData={setFormData} />}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="sticky bottom-0 bg-base-100 border-t border-base-300 px-6 py-4 flex items-center justify-between z-10 shadow-md">
        <button onClick={back} disabled={step === 1} className="btn btn-sm btn-outline gap-2 disabled:opacity-30">
          ← Back
        </button>
        <div className="flex gap-3">
          <button className="btn btn-sm btn-ghost border border-base-300">
            Save as draft
          </button>
          {step < 4 ? (
            <button onClick={next} className="btn btn-sm text-white border-0"
              style={{ background: "linear-gradient(135deg, #832388, #FF0F7B)" }}>
              Save & Continue →
            </button>
          ) : (
            <button className="btn btn-sm text-white border-0"
              style={{ background: "linear-gradient(135deg, #00C48C, #0EA5E9)" }}>
              🚀 Publish Course
            </button>
          )}
        </div>
      </div>

    </div>
  );
}