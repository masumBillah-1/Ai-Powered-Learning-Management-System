"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

type LiveMsg = {
  _id?: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  createdAt?: string;
};

type OnlineUser = {
  userId: string;
  socketId: string;
  role: string;
  name: string;
};

type Props = {
  userId: string;
  userName: string;
  userRole: string;
};

export default function LiveChat({ userId, userName, userRole }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [onlineStaff, setOnlineStaff] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [messages, setMessages] = useState<LiveMsg[]>([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  const roomId = selectedUser
    ? [userId, selectedUser.userId].sort().join("_")
    : null;

  // Socket connect
  useEffect(() => {
    const s = io(SOCKET_URL, { withCredentials: true });
    setSocket(s);

    s.on("connect", () => {
      setConnected(true);
      s.emit("user:join", { userId, userName, userRole });
    });

    s.on("disconnect", () => setConnected(false));

    s.on("users:online", (users: OnlineUser[]) => {
      // Admin/Instructor ছাড়া student নিজেদের দেখাবো না
      const staff = users.filter(
        (u) => u.userId !== userId && (u.role === "admin" || u.role === "instructor")
      );
      setOnlineStaff(staff);
    });

    s.on("message:receive", (msg: LiveMsg) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on("typing:show", ({ userName: name }: { userName: string }) => {
      setTypingUser(name);
    });

    s.on("typing:hide", () => setTypingUser(""));

    return () => { 
      s.disconnect(); 
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
    };
  }, [userId, userName, userRole]);

  // Room join when user selected
  useEffect(() => {
    if (!socket || !roomId) return;
    setMessages([]);
    socket.emit("room:join", { roomId, userId });

    socket.on("room:history", (history: LiveMsg[]) => {
      setMessages(history);
    });

    return () => {
      socket.off("room:history");
    };
  }, [socket, roomId, userId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim() || !socket || !roomId || !selectedUser) return;
    socket.emit("message:send", {
      roomId,
      senderId: userId,
      senderName: userName,
      senderRole: userRole,
      content: input.trim(),
    });
    setInput("");
    socket.emit("typing:stop", { roomId });
  }, [input, socket, roomId, userId, userName, userRole, selectedUser]);

  const handleTyping = (val: string) => {
    setInput(val);
    if (!socket || !roomId) return;
    socket.emit("typing:start", { roomId, userName });
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }
    typingTimer.current = setTimeout(() => {
      socket.emit("typing:stop", { roomId });
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const fmt = (d?: string) =>
    new Date(d ?? Date.now()).toLocaleTimeString("bn-BD", {
      hour: "2-digit", minute: "2-digit",
    });

  // ── Staff list view ─────────────────────────────────
  if (!selectedUser) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-base-300 bg-base-100">
          <p className="text-sm font-semibold text-base-content">Support Team</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-success animate-pulse" : "bg-error"}`} />
            <span className="text-[11px] text-base-content/50">
              {connected ? "সংযুক্ত" : "সংযুক্ত হচ্ছে..."}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {onlineStaff.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
              <div className="text-4xl">😴</div>
              <p className="text-sm font-medium text-base-content/60">
                এখন কোনো Admin বা Instructor অনলাইন নেই
              </p>
              <p className="text-xs text-base-content/40">
                অফলাইন সময়ে AI Assistant ব্যবহার করুন
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-base-content/40 mb-1">অনলাইনে আছেন:</p>
              {onlineStaff.map((u) => (
                <button
                  key={u.userId}
                  onClick={() => setSelectedUser(u)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-base-100 hover:bg-base-200 border border-base-300 transition-all text-left"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow">
                      {u.name[0]}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-base-100 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-base-content">{u.name}</p>
                    <span className={`badge badge-xs ${u.role === "admin" ? "badge-error" : "badge-warning"}`}>
                      {u.role === "admin" ? "Admin" : "Instructor"}
                    </span>
                  </div>
                  <svg className="ml-auto w-4 h-4 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Chat view ────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-base-100 border-b border-base-300">
        <button
          onClick={() => setSelectedUser(null)}
          className="btn btn-ghost btn-xs btn-circle"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
            {selectedUser.name[0]}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success border-2 border-base-100 rounded-full" />
        </div>
        <div>
          <p className="text-sm font-semibold text-base-content leading-tight">{selectedUser.name}</p>
          <span className={`badge badge-xs ${selectedUser.role === "admin" ? "badge-error" : "badge-warning"}`}>
            {selectedUser.role === "admin" ? "Admin" : "Instructor"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <div className="text-3xl">👋</div>
            <p className="text-xs text-base-content/50">{selectedUser.name} এর সাথে কথা শুরু করুন</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((msg, i) => (
              <div key={i} className={`chat ${msg.senderId === userId ? "chat-end" : "chat-start"}`}>
                <div className="chat-image avatar">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold
                    ${msg.senderId === userId
                      ? "bg-primary"
                      : "bg-gradient-to-br from-emerald-400 to-teal-600"}`}>
                    {msg.senderName[0]}
                  </div>
                </div>
                <div className="chat-header text-[10px] opacity-50 mb-0.5">
                  {msg.senderId === userId ? "আপনি" : msg.senderName}
                  <time className="ml-1">{fmt(msg.createdAt)}</time>
                </div>
                <div className={`chat-bubble text-sm py-2 px-3 max-w-[240px] ${
                  msg.senderId === userId ? "chat-bubble-primary" : "chat-bubble-neutral"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {typingUser && (
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-neutral py-2 px-3">
                  <span className="loading loading-dots loading-xs" />
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-base-300 bg-base-100 px-3 py-2">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="মেসেজ লিখুন..."
            rows={1}
            className="textarea textarea-bordered textarea-sm flex-1 resize-none text-sm min-h-[36px] max-h-24 focus:textarea-primary"
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 96) + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !connected}
            className="btn btn-primary btn-sm btn-square"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}