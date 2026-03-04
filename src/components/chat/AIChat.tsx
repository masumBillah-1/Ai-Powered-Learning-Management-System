"use client";

import { useState, useCallback } from "react";
import AIChatMessages from "./AIChatMessages";

type Message = {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

type Props = {
  userId: string;
  userName?: string;
  userAvatar?: string;
};

export default function AIChat({ userId, userName = "আপনি", userAvatar }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(async (msg?: string) => {
    const text = msg || input.trim();
    if (!text || isLoading) return;

    setInput("");

    const newMsg: Message = {
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    // UI তে সাথে সাথে দেখাও
    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    try {
      // history শুধু browser memory তে — MongoDB নেই
      const history = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "দুঃখিত, সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleClear = () => setMessages([]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2">
        <AIChatMessages
          messages={messages}
          userName={userName}
          userAvatar={userAvatar}
        />
      </div>

      {/* Typing indicator */}
      {isLoading && (
        <div className="px-4 pb-1">
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-neutral py-2 px-3">
              <span className="loading loading-dots loading-xs" />
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-base-300 bg-base-100 px-3 py-2">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="প্রশ্ন করুন, MCQ চান, বা code লিখতে বলুন..."
            rows={1}
            disabled={isLoading}
            className="textarea textarea-bordered textarea-sm flex-1 resize-none text-sm min-h-[36px] max-h-24 focus:textarea-primary"
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 96) + "px";
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="btn btn-primary btn-sm btn-square"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Clear + info */}
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-[10px] text-base-content/30">
            Gemini AI • MCQ • Code • যেকোনো প্রশ্ন
          </p>
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="text-[10px] text-base-content/30 hover:text-error transition-colors"
            >
              মুছুন
            </button>
          )}
        </div>
      </div>
    </div>
  );
}