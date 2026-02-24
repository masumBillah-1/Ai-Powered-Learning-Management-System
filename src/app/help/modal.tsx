"use client";

import React, { useState, useRef } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { FiX, FiChevronDown } from "react-icons/fi";


type PostType = "Courses Topics" | "Bugs" | "Feature Requests" | "Announcements" | "Others";
type BatchType = "Batch-10" | "Batch-11" | "Batch-12" | "Batch-13";

interface CreatePostModalProps {
  onClose: () => void;
}


const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [postType, setPostType] = useState<PostType>("Courses Topics");
  const [batch, setBatch] = useState<BatchType>("Batch-12");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState<boolean>(false);
  const [showBatchDropdown, setShowBatchDropdown] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const postTypes: PostType[] = ["Courses Topics", "Bugs", "Feature Requests", "Announcements", "Others"];
  const batches: BatchType[] = ["Batch-10", "Batch-11", "Batch-12", "Batch-13"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files ?? []);
    setMediaFiles((prev) => [...prev, ...files]);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>): void => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) setMediaFiles((prev) => [...prev, file]);
      }
    }
  };

const handleSubmit = (): void => {
  if (!content.trim()) {
    console.log("Post not submitted: Content is empty");
    return;
  }

  const postData = {
    title,
    content,
    postType,
    batch,
    mediaFiles,
  };

  console.log("Submitting Post Data:");
  console.log(postData);

  setSubmitted(true);

  setTimeout(() => {
    setSubmitted(false);
    onClose();
  }, 1500);
};

  const removeMedia = (idx: number): void => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[740px] bg-[#0f0b1e] border border-white/10 rounded-2xl shadow-2xl shadow-purple-950/40 overflow-hidden"
        style={{ animation: "modalIn 0.2s ease-out forwards" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-bold text-base tracking-tight">Create Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition p-1 rounded-lg hover:bg-white/5"
            aria-label="Close modal"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Title */}
          <div>
            <label className="text-[11px] text-gray-400 font-bold mb-1.5 block">Title</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className="w-full bg-[#1a1530] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/50 transition"
            />
          </div>

          {/* Post Type + Batch */}
          <div className="grid grid-cols-2 gap-4">

            {/* Post Type Dropdown */}
            <div>
              <label className="text-[11px] text-gray-400 font-bold mb-1.5 block">Post Type</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowTypeDropdown((p) => !p);
                    setShowBatchDropdown(false);
                  }}
                  className="w-full bg-[#1a1530] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white flex justify-between items-center hover:border-purple-500/30 transition"
                >
                  {postType}
                  <FiChevronDown
                    className={`text-gray-500 transition-transform ${showTypeDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showTypeDropdown && (
                  <div className="absolute top-full mt-1 w-full bg-[#1a1530] border border-white/10 rounded-xl overflow-hidden z-10 shadow-lg">
                    {postTypes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setPostType(t);
                          setShowTypeDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-purple-600/20 transition ${
                          postType === t ? "text-purple-400" : "text-gray-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Batch Dropdown */}
            <div>
              <label className="text-[11px] text-gray-400 font-bold mb-1.5 block">Batch</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowBatchDropdown((p) => !p);
                    setShowTypeDropdown(false);
                  }}
                  className="w-full bg-[#1a1530] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white flex justify-between items-center hover:border-purple-500/30 transition"
                >
                  {batch}
                  <FiChevronDown
                    className={`text-gray-500 transition-transform ${showBatchDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showBatchDropdown && (
                  <div className="absolute top-full mt-1 w-full bg-[#1a1530] border border-white/10 rounded-xl overflow-hidden z-10 shadow-lg">
                    {batches.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setBatch(b);
                          setShowBatchDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-purple-600/20 transition ${
                          batch === b ? "text-purple-400" : "text-gray-400"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-[11px] text-gray-400 font-bold mb-1.5 block">Content</label>
            <textarea
              placeholder="Write your post here..."
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              onPaste={handlePaste}
              rows={6}
              className="w-full bg-[#1a1530] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/50 transition resize-none"
            />
          </div>

          {/* Validation message */}
          {!content.trim() && (
            <p className="text-red-500 text-[11px] font-semibold -mt-2">
              You haven&apos;t written anything yet! Please describe your issue.
            </p>
          )}

          {/* Paste hint */}
          <p className="text-green-400 text-[11px] leading-relaxed -mt-2">
            You can now paste images directly from your clipboard.
            <br />
            Click on any input field and press Ctrl+V (Windows) or Cmd+V (Mac) to paste.
          </p>

          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mediaFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="relative group w-20 h-20 rounded-xl overflow-hidden border border-white/10"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(idx)}
                    aria-label="Remove media"
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiX size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-pink-500 text-sm font-semibold hover:opacity-80 transition"
            >
              <HiOutlinePhotograph size={22} /> Photo/Video
            </button>
            <p className="text-[9px] text-gray-600 mt-0.5">
              Image uploads limited to 5MB. Videos up to 30MB.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!content.trim()}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              submitted
                ? "bg-green-600 text-white scale-95"
                : content.trim()
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-purple-600/30 text-purple-400/50 cursor-not-allowed"
            }`}
          >
            {submitted ? "✓ Posted!" : "Submit Post"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CreatePostModal;