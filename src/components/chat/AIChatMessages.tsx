"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

type MCQData = {
  question: string;
  options: { label: string; text: string }[];
  correct: string;
  explanation: string;
};

function parseMCQ(content: string): MCQData | null {
  if (!content.includes("MCQ_START")) return null;
  try {
    const block = content.match(/MCQ_START([\s\S]*?)MCQ_END/)?.[1] ?? "";
    const question = block.match(/প্রশ্ন:\s*(.+)/)?.[1]?.trim() ?? "";
    const options = ["ক", "খ", "গ", "ঘ"].map((label) => ({
      label,
      text: block.match(new RegExp(`${label}\\)\\s*(.+)`))?.[1]?.trim() ?? "",
    })).filter((o) => o.text);
    const correct = block.match(/সঠিক উত্তর:\s*(.+)/)?.[1]?.trim() ?? "";
    const explanation = block.match(/ব্যাখ্যা:\s*(.+)/)?.[1]?.trim() ?? "";
    if (!question || options.length === 0) return null;
    return { question, options, correct, explanation };
  } catch {
    return null;
  }
}

function MCQCard({ data }: { data: MCQData }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="bg-base-100 rounded-xl border border-base-300 p-4 w-full max-w-sm shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="badge badge-primary badge-sm">MCQ</span>
        <span className="text-xs text-base-content/50">বেছে নিন</span>
      </div>
      <p className="text-sm font-medium text-base-content mb-3">{data.question}</p>
      <div className="flex flex-col gap-2">
        {data.options.map((opt) => {
          const isCorrect = opt.label === data.correct;
          const isSelected = selected === opt.label;
          let btnClass = "btn btn-sm btn-outline justify-start text-left font-normal normal-case w-full";
          if (revealed) {
            if (isCorrect) btnClass += " btn-success";
            else if (isSelected && !isCorrect) btnClass += " btn-error";
          } else if (isSelected) {
            btnClass += " btn-primary";
          }
          return (
            <button
              key={opt.label}
              className={btnClass}
              onClick={() => { if (!revealed) setSelected(opt.label); }}
              disabled={revealed}
            >
              <span className="font-semibold mr-2">{opt.label})</span>
              {opt.text}
            </button>
          );
        })}
      </div>
      {selected && !revealed && (
        <button
          className="btn btn-primary btn-sm w-full mt-3"
          onClick={() => setRevealed(true)}
        >
          উত্তর দেখুন
        </button>
      )}
      {revealed && (
        <div className="mt-3 p-3 bg-success/10 rounded-lg border border-success/30">
          <p className="text-xs font-semibold text-success mb-1">
            ✓ সঠিক উত্তর: {data.correct})
          </p>
          <p className="text-xs text-base-content/70">{data.explanation}</p>
        </div>
      )}
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const mcq = parseMCQ(content);
  if (mcq) return <MCQCard data={mcq} />;

  // Code block render
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="text-sm leading-relaxed space-y-2">
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          const lang = part.match(/```(\w*)/)?.[1] ?? "";
          const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
          return (
            <div key={i} className="mockup-code text-xs rounded-lg">
              {lang && <div className="px-4 pb-1 text-xs opacity-50">{lang}</div>}
              <pre><code>{code.trim()}</code></pre>
            </div>
          );
        }
        return <p key={i} className="whitespace-pre-wrap">{part}</p>;
      })}
    </div>
  );
}

export default function AIChatMessages({
  messages,
  userName = "আপনি",
  userAvatar,
}: {
  messages: Message[];
  userName?: string;
  userAvatar?: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fmt = (d?: string) =>
    new Date(d ?? Date.now()).toLocaleTimeString("bn-BD", {
      hour: "2-digit", minute: "2-digit",
    });

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
          </svg>
        </div>
        <div>
          <p className="font-semibold text-base-content text-sm">AI Assistant</p>
          <p className="text-xs text-base-content/50 mt-1">MCQ, Code, বা যেকোনো প্রশ্ন করুন!</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {["৫টা MCQ বানাও JavaScript নিয়ে", "React hooks বুঝিয়ে দাও", "Python code লিখো"].map((s) => (
            <span key={s} className="badge badge-outline badge-sm cursor-default">{s}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-2">
      {messages.map((msg, i) => (
        <div key={i} className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}>
          <div className="chat-image avatar">
            <div className="w-8 rounded-full">
              {msg.role === "assistant" ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                  </svg>
                </div>
              ) : userAvatar ? (
                <img src={userAvatar} alt={userName} />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content text-xs font-bold">
                  {userName[0]}
                </div>
              )}
            </div>
          </div>
          <div className="chat-header text-[10px] opacity-60 mb-0.5">
            {msg.role === "assistant" ? "AI Assistant" : userName}
            <time className="ml-1">{fmt(msg.createdAt)}</time>
          </div>
          <div className={`chat-bubble max-w-[280px] p-0 overflow-hidden ${
            msg.role === "user"
              ? "chat-bubble-primary px-3 py-2"
              : "chat-bubble-neutral bg-base-200 text-base-content px-3 py-2"
          }`}>
            <MessageContent content={msg.content} />
          </div>
          <div className="chat-footer text-[10px] opacity-40 mt-0.5">
            {msg.role === "user" ? "Sent" : "Gemini AI"}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}