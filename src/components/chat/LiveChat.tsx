"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { HiSparkles } from "react-icons/hi2";

type LiveMsg = {
  _id?: string;
  senderId: string | { _id: string; name: string };
  senderName?: string;
  senderRole?: string;
  content: string;
  createdAt?: string;
  messageType?: string; // "text" | "bot" | "system" | "image" | "file"
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  _optimistic?: boolean;
};

type OnlineUser = {
  userId: string;
  role: string;
  name: string;
  photoURL?: string;
};

type Props = {
  userId: string;
  userName: string;
  userRole: string;
};

// ─────────────────────────────────────────────────────
// Bot config — user এই নাম ও avatar দেখবে
// ─────────────────────────────────────────────────────
const BOT_SENDER_ID = "careercanvas_bot";

const BOT_USER: OnlineUser = {
  userId: "support",
  name: "CareerCanvas Assistant",
  role: "bot",
  photoURL: "",
};

function BotAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-7 h-7 text-sm",
    md: "w-8 h-8 text-base",
    lg: "w-14 h-14 text-3xl"
  }[size];

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 32
  }[size];

  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0 select-none`}>
      <HiSparkles className="text-white" size={iconSizes} />
    </div>
  );
}

// ─────────────────────────────────────────────────────
// User Avatar Component - Fetches photoURL from database
// ─────────────────────────────────────────────────────
function UserAvatar({ userId, userName }: { userId: string; userName?: string }) {
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        const res = await fetch(`/api/profile?userId=${userId}`);
        const data = await res.json();
        if (data.success && data.user?.photoURL) {
          setPhotoURL(data.user.photoURL);
        }
      } catch (err) {
        console.error("Failed to fetch user photo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPhoto();
  }, [userId]);

  if (loading) {
    return (
      <div className="w-7 h-7 rounded-full bg-base-300 animate-pulse" />
    );
  }

  if (photoURL) {
    return (
      <div className="w-7 h-7 rounded-full overflow-hidden bg-base-300">
        <img src={photoURL} alt={userName || "User"} className="w-full h-full object-cover" />
      </div>
    );
  }

  // Fallback to initial letter
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
      {(userName ?? "?")?.[0]?.toUpperCase()}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────
export default function LiveChat({ userId, userName, userRole }: Props) {
  const [connected, setConnected] = useState(true);
  const [allUsers, setAllUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [messages, setMessages] = useState<LiveMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [adminTakenOver, setAdminTakenOver] = useState(false);
  const [takingOver, setTakingOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageModal, setImageModal] = useState<string | null>(null); // ✅ Image modal
  const [isUserScrolling, setIsUserScrolling] = useState(false); // ✅ Track if user is scrolling up
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Download handler with proper filename
  const handleDownload = async (url: string, filename?: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  const isStudent = userRole === "student";
  const isInstructor = userRole === "instructor";
  const isAdmin = userRole === "admin";
  const isNonAdmin = isStudent || isInstructor;

  // ✅ Cleanup old chat caches on mount (keep only last 10 conversations)
  useEffect(() => {
    try {
      const keys = Object.keys(localStorage);
      const chatKeys = keys.filter(k => k.startsWith('chat_'));

      if (chatKeys.length > 10) {
        // Sort by timestamp and remove oldest
        const cacheData = chatKeys.map(key => {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            return { key, timestamp: data.timestamp || 0 };
          } catch {
            return { key, timestamp: 0 };
          }
        }).sort((a, b) => b.timestamp - a.timestamp);

        // Remove oldest caches (keep only 10 most recent)
        cacheData.slice(10).forEach(item => {
          localStorage.removeItem(item.key);
        });
      }
    } catch (err) {
      console.error("Failed to cleanup old caches:", err);
    }
  }, []);

  // roomId calculation
  const roomId = selectedUser
    ? selectedUser.userId === "support"
      ? `support_${userId}`                          // student/instructor নিজের room
      : isAdmin
        ? `support_${selectedUser.userId}`           // admin অন্যের room দেখছে
        : [userId, selectedUser.userId].sort().join("_")
    : null;

  // ── Fetch user list ──────────────────────────────────
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // ✅ No need for Authorization header - httpOnly cookie is sent automatically
        const [usersRes, convsRes] = await Promise.all([
          fetch("/api/messages/users"),
          fetch("/api/messages"),
        ]);

        const usersData = await usersRes.json();
        const convsData = await convsRes.json();

        if (!usersData.success) return;

        let filteredUsers: OnlineUser[] = [];

        if (isNonAdmin) {
          // Student & Instructor → শুধু Bot দেখবে
          filteredUsers = [BOT_USER];
        } else if (isAdmin) {
          // Admin → support_ room এ যারা message করেছে তাদের দেখাবে
          // কিন্তু real name এর বদলে "User from Support" + index দেখাবে
          const convUserIds = new Set<string>();
          (convsData.conversations || []).forEach((conv: any) => {
            if (conv.roomId?.startsWith("support_")) {
              const sid = conv.roomId.replace("support_", "");
              if (sid && sid !== userId) convUserIds.add(sid);
            }
            conv.participants?.forEach((p: any) => {
              if (p._id !== userId) convUserIds.add(p._id);
            });
          });

          filteredUsers = (usersData.users || [])
            .filter((u: any) => convUserIds.has(u._id))
            .map((u: any, idx: number) => ({
              userId: u._id,
              // ✅ Admin দেখবে "User from Support" — real name না
              name: `User from Support`,
              role: u.role,
              photoURL: "", // photo ও দেখাবে না
            }));
        }

        setAllUsers(filteredUsers);
        setConnected(true);
      } catch (err) {
        console.error("Fetch users failed:", err);
        setConnected(false);
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, [userId, userRole]);

  // ── Load & Poll messages with localStorage cache ────────────────────────────
  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      lastMessageIdRef.current = null;
      return;
    }

    // ✅ 1. Load from localStorage first (instant display)
    const cacheKey = `chat_${roomId}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (parsed.messages && Array.isArray(parsed.messages)) {
          setMessages(parsed.messages);
          if (parsed.messages.length > 0) {
            const latest = parsed.messages[parsed.messages.length - 1];
            lastMessageIdRef.current = latest._id ?? null;
          }
        }
      } catch (err) {
        console.error("Failed to parse cached messages:", err);
      }
    }

    // ✅ 2. Fetch from server and update cache
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${roomId}`);
        const data = await res.json();

        if (data.success) {
          const newMsgs: LiveMsg[] = data.messages || [];

          // Update state
          setMessages(newMsgs);

          // ✅ Save to localStorage
          try {
            localStorage.setItem(cacheKey, JSON.stringify({
              messages: newMsgs,
              timestamp: Date.now()
            }));
          } catch (err) {
            console.error("Failed to cache messages:", err);
            // If localStorage is full, clear old chat caches
            try {
              const keys = Object.keys(localStorage);
              const chatKeys = keys.filter(k => k.startsWith('chat_'));
              // Keep only last 5 conversations
              if (chatKeys.length > 5) {
                chatKeys.slice(0, -5).forEach(k => localStorage.removeItem(k));
              }
              // Retry save
              localStorage.setItem(cacheKey, JSON.stringify({
                messages: newMsgs,
                timestamp: Date.now()
              }));
            } catch { }
          }

          // Notification sound for new messages
          if (newMsgs.length > 0) {
            const latest = newMsgs[newMsgs.length - 1];
            const senderId = typeof latest.senderId === "object" ? latest.senderId._id : latest.senderId;

            if (
              lastMessageIdRef.current &&
              latest._id !== lastMessageIdRef.current &&
              senderId !== userId &&
              senderId !== BOT_SENDER_ID
            ) {
              try {
                new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3")
                  .play().catch(() => { });
              } catch { }
            }
            lastMessageIdRef.current = latest._id ?? null;
          }
        }
      } catch (err) {
        console.error("Fetch messages failed:", err);
      }
    };

    // Initial fetch
    fetchMessages();

    // Poll every 2s
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [roomId, userId]);

  // ── Check admin takeover status ──────────────────────
  useEffect(() => {
    if (!roomId || !isAdmin) return;

    const checkTakeover = async () => {
      try {
        // ✅ No need for Authorization header - httpOnly cookie is sent automatically
        const res = await fetch(`/api/messages/${roomId}`);
        const data = await res.json();
        // Conversation data থেকে takeover status দেখো
        if (data.conversation?.adminTakenOver !== undefined) {
          setAdminTakenOver(data.conversation.adminTakenOver);
        }
      } catch { }
    };
    checkTakeover();
  }, [roomId, isAdmin]);

  // Auto scroll - only if user is at bottom
  useEffect(() => {
    if (!isUserScrolling) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isUserScrolling]);

  // ✅ Detect user scrolling
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold

      setIsUserScrolling(!isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Close image modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && imageModal) {
        setImageModal(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [imageModal]);

  // ── Admin Take Over / Give Back ──────────────────────
  const handleTakeover = useCallback(async (takeover: boolean) => {
    if (!roomId) return;
    setTakingOver(true);
    try {
      // ✅ No need for Authorization header - httpOnly cookie is sent automatically
      const res = await fetch("/api/messages/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, takeover }),
      });
      const data = await res.json();
      if (data.success) setAdminTakenOver(takeover);
    } catch (err) {
      console.error("Takeover failed:", err);
    } finally {
      setTakingOver(false);
    }
  }, [roomId]);

  // ── Upload file to Cloudinary via API ────────────────
  const uploadToCloudinary = async (file: File): Promise<{ url: string; type: string } | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      return { url: data.url, type: data.type };
    } catch (err: any) {
      console.error("Upload failed:", err);
      throw err;
    }
  };

  // ── Handle file selection ─────────────────────────────
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !roomId || !selectedUser || uploading) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setSendError("ফাইল সাইজ ১০MB এর বেশি হতে পারবে না");
      return;
    }

    setUploading(true);
    setSendError(null);

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(file);
      if (!uploadResult) {
        throw new Error("ফাইল আপলোড ফেইল হয়েছে");
      }

      const { url, type } = uploadResult;
      const messageType = type === "image" ? "image" : "file";

      // Optimistic update
      const optimisticId = `opt_${Date.now()}`;
      const optimisticMsg: LiveMsg = {
        _id: optimisticId,
        senderId: userId,
        senderName: userName,
        senderRole: userRole,
        content: type === "image" ? "📷 Image" : `📎 ${file.name}`,
        createdAt: new Date().toISOString(),
        messageType,
        _optimistic: true,
      };

      setMessages((prev) => {
        const updated = [...prev, optimisticMsg];

        // ✅ Update localStorage immediately
        const cacheKey = `chat_${roomId}`;
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            messages: updated,
            timestamp: Date.now()
          }));
        } catch (err) {
          console.error("Failed to cache file message:", err);
        }

        return updated;
      });

      const receiverId = selectedUser.userId === "support" ? null : selectedUser.userId;

      // Send message with file
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          content: type === "image" ? "📷 Image" : file.name,
          receiverId,
          messageType,
          fileUrl: url,
          fileName: file.name,
          fileSize: file.size,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m._id !== optimisticId);

          // ✅ Update localStorage after removing failed message
          const cacheKey = `chat_${roomId}`;
          try {
            localStorage.setItem(cacheKey, JSON.stringify({
              messages: filtered,
              timestamp: Date.now()
            }));
          } catch { }

          return filtered;
        });
        setSendError(data.error || "মেসেজ পাঠানো যায়নি।");
      }
    } catch (err: any) {
      console.error("File send failed:", err);
      setSendError(err.message || "ফাইল পাঠাতে সমস্যা হয়েছে");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [roomId, selectedUser, uploading, userId, userName, userRole]);

  // ── Send message ─────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!input.trim() || !roomId || !selectedUser || sending) return;

    const msgContent = input.trim();
    setSendError(null);
    setSending(true);
    setInput("");

    // ✅ Reset scroll state when sending message
    setIsUserScrolling(false);

    // Optimistic update
    const optimisticId = `opt_${Date.now()}`;
    const optimisticMsg: LiveMsg = {
      _id: optimisticId,
      senderId: userId,
      senderName: userName,
      senderRole: userRole,
      content: msgContent,
      createdAt: new Date().toISOString(),
      messageType: "text",
      _optimistic: true,
    };

    setMessages((prev) => {
      const updated = [...prev, optimisticMsg];

      // ✅ Update localStorage immediately
      const cacheKey = `chat_${roomId}`;
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          messages: updated,
          timestamp: Date.now()
        }));
      } catch (err) {
        console.error("Failed to cache optimistic message:", err);
      }

      return updated;
    });

    try {
      // ✅ Bot এর জন্য receiverId null পাঠাও, অন্যথায় actual user ID
      const receiverId = selectedUser.userId === "support" ? null : selectedUser.userId;

      console.log("📤 Sending message:", { roomId, receiverId, contentLength: msgContent.length });

      // 1. Message পাঠাও
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, content: msgContent, receiverId, messageType: "text" }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("❌ Message send failed:", data.error);
        setMessages((prev) => {
          const filtered = prev.filter((m) => m._id !== optimisticId);

          // ✅ Update localStorage after removing failed message
          const cacheKey = `chat_${roomId}`;
          try {
            localStorage.setItem(cacheKey, JSON.stringify({
              messages: filtered,
              timestamp: Date.now()
            }));
          } catch { }

          return filtered;
        });
        setInput(msgContent);
        setSendError(data.error || "মেসেজ পাঠানো যায়নি।");
        return;
      }

      console.log("✅ Message sent successfully");

      // 2. Student/Instructor হলে AI auto-reply trigger করো
      if (isNonAdmin) {
        // Current conversation history পাঠাও context এর জন্য
        const historyForAI = messages
          .filter((m) => !m._optimistic)
          .slice(-6)
          .map((m) => ({
            content: m.content,
            isBot: (typeof m.senderId === "string" ? m.senderId : m.senderId._id) === BOT_SENDER_ID,
          }));

        fetch("/api/messages/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId,
            userMessage: msgContent,
            conversationHistory: historyForAI,
          }),
        }).catch(console.error); // fire-and-forget, poll এ reply আসবে
      }
    } catch (err) {
      console.error("Send failed:", err);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m._id !== optimisticId);

        // ✅ Update localStorage after removing failed message
        const cacheKey = `chat_${roomId}`;
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            messages: filtered,
            timestamp: Date.now()
          }));
        } catch { }

        return filtered;
      });
      setInput(msgContent);
      setSendError("নেটওয়ার্ক সমস্যা।");
    } finally {
      setSending(false);
    }
  }, [input, roomId, selectedUser, sending, userId, userName, userRole, isNonAdmin, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const fmt = (d?: string) =>
    new Date(d ?? Date.now()).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return { cls: "badge-error", label: "Admin" };
      case "instructor": return { cls: "badge-warning", label: "Instructor" };
      case "student": return { cls: "badge-info", label: "Student" };
      case "bot": return { cls: "badge-secondary", label: "AI Support" };
      default: return { cls: "badge-ghost", label: role };
    }
  };

  // ─────────────────────────────────────────────────────
  // USER LIST VIEW
  // ─────────────────────────────────────────────────────
  if (!selectedUser) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-base-300 bg-base-100">
          <p className="text-sm font-semibold text-base-content">
            {isNonAdmin ? "💬 Live Support" : "Support Inbox"}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-success animate-pulse" : "bg-error"}`} />
            <span className="text-[11px] text-base-content/50">{connected ? "সংযুক্ত" : "সংযুক্ত হচ্ছে..."}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {/* ✅ Student & Instructor → Bot button */}
          {isNonAdmin && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelectedUser(BOT_USER)}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 dark:from-slate-800 dark:to-slate-900 dark:hover:from-slate-700 dark:hover:to-slate-800 border-2 border-slate-600/30 dark:border-slate-700/30 transition-all text-left shadow-lg"
              >
                <div className="relative">
                  <BotAvatar size="lg" />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-slate-800 rounded-full animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-white">CareerCanvas Assistant</p>
                  <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5">AI-powered • সবসময় প্রস্তুত</p>
                </div>
                <svg className="w-5 h-5 text-slate-300 dark:text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="rounded-lg bg-base-200/60 border border-base-300 p-3">
                <p className="text-xs font-bold text-base-content/70 mb-1.5">💡 সাহায্য পাবেন:</p>
                <ul className="text-xs text-base-content/55 space-y-1">
                  <li>• Course সম্পর্কে যেকোনো প্রশ্ন</li>
                  <li>• Technical সমস্যা</li>
                  <li>• Payment ও enrollment</li>
                </ul>
              </div>
            </div>
          )}

          {/* ✅ Admin → User list ("User from Support") */}
          {isAdmin && (
            allUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
                <div className="text-5xl">📭</div>
                <p className="text-sm font-bold text-base-content">কোনো support request নেই</p>
                <p className="text-xs text-base-content/55">Users message করলে এখানে আসবে</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-base-content/40 mb-1">Support Requests:</p>
                {allUsers.map((u, idx) => (
                  <button
                    key={u.userId}
                    onClick={() => setSelectedUser(u)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-base-100 hover:bg-base-200 border border-base-300 transition-all text-left"
                  >
                    {/* Anonymous avatar with user icon */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white shadow">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-base-content">{u.name}</p>
                      <span className={`badge badge-xs ${getRoleBadge(u.role).cls}`}>
                        {getRoleBadge(u.role).label}
                      </span>
                    </div>
                    <svg className="ml-auto w-4 h-4 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────
  // CHAT VIEW
  // ─────────────────────────────────────────────────────
  const isBot = selectedUser.userId === "support";

  return (
    <>
      {/* ✅ Image Modal/Lightbox */}
      {imageModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setImageModal(null)}
        >
          {/* Close button - Smaller with pointer cursor */}
          <button
            onClick={() => setImageModal(null)}
            className="absolute top-4 right-4 z-[10000] w-8 h-8 flex items-center justify-center rounded-full bg-black/80 hover:bg-black text-white transition-all hover:scale-110 shadow-lg border border-white/20 cursor-pointer"
            title="Close (ESC)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Download button - Smaller with pointer cursor */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const filename = imageModal.split('/').pop()?.split('?')[0] || 'image.jpg';
              handleDownload(imageModal, filename);
            }}
            className="absolute top-4 right-14 z-[10000] w-8 h-8 flex items-center justify-center rounded-full bg-black/80 hover:bg-black text-white transition-all hover:scale-110 shadow-lg border border-white/20 cursor-pointer"
            title="Download"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          {/* Image container */}
          <div className="relative max-w-[85vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={imageModal}
              alt="Full size"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Help text */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-5 py-2 rounded-full backdrop-blur-sm border border-white/10">
            Click outside or press ESC to close
          </div>
        </div>
      )}

      <div className="flex flex-col h-full relative">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-base-100 border-b border-base-300">
          <button
            onClick={() => { setSelectedUser(null); setSendError(null); }}
            className="btn btn-ghost btn-xs btn-circle"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="relative">
            {/* ✅ Student/Instructor → Bot avatar | Admin → anonymous avatar */}
            {isBot ? (
              <BotAvatar size="md" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success border-2 border-base-100 rounded-full" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-base-content leading-tight">
              {isBot ? "CareerCanvas Assistant" : selectedUser.name}
            </p>
            <span className={`badge badge-xs ${isBot ? "badge-secondary" : getRoleBadge(selectedUser.role).cls}`}>
              {isBot ? "AI Support" : getRoleBadge(selectedUser.role).label}
            </span>
          </div>

          {/* ✅ Admin এর জন্য Take Over / Give Back button */}
          {isAdmin && !isBot && (
            <button
              onClick={() => handleTakeover(!adminTakenOver)}
              disabled={takingOver}
              className={`btn btn-xs ${adminTakenOver ? "btn-ghost" : "btn-warning"}`}
            >
              {takingOver
                ? <span className="loading loading-spinner loading-xs" />
                : adminTakenOver
                  ? "🤖 AI দাও"
                  : "✋ Take Over"}
            </button>
          )}
        </div>

        {/* Admin takeover status bar */}
        {isAdmin && !isBot && (
          <div className={`px-3 py-1.5 text-xs flex items-center gap-2 ${adminTakenOver
            ? "bg-success/10 text-success border-b border-success/20"
            : "bg-warning/10 text-warning border-b border-warning/20"
            }`}>
            <span>{adminTakenOver ? "✅ আপনি এই conversation handle করছেন" : "🤖 AI auto-reply চালু আছে"}</span>
          </div>
        )}

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-2 py-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
              {isBot && <BotAvatar size="lg" />}
              <div>
                <p className="text-sm font-semibold text-base-content">
                  {isBot ? "CareerCanvas Assistant" : selectedUser.name}
                </p>
                <p className="text-xs text-base-content/50 mt-1">
                  {isBot
                    ? "আপনার যেকোনো প্রশ্ন করুন 😊"
                    : "এই user এর সাথে conversation শুরু হয়নি"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {messages.map((msg, i) => {
                const senderId = typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
                const senderName = typeof msg.senderId === "object" ? msg.senderId.name : msg.senderName;
                const isFromBot = senderId === BOT_SENDER_ID;
                const isSystem = msg.messageType === "system";
                const isMe = senderId === userId;

                // ── System message (centered) ──
                if (isSystem) {
                  return (
                    <div key={msg._id || i} className="flex justify-center my-2">
                      <span className="text-xs text-base-content/50 bg-base-200 rounded-full px-3 py-1">
                        {msg.content}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={msg._id || i} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                    <div className="chat-image avatar">
                      {isMe ? (
                        // ✅ Current user avatar - fetch from User model
                        <UserAvatar userId={userId} userName={userName} />
                      ) : isFromBot ? (
                        // ✅ Bot message → bot avatar
                        <BotAvatar size="sm" />
                      ) : isAdmin ? (
                        // Admin chat এ অন্য side → anonymous avatar
                        <div className="w-7 h-7 rounded-full bg-slate-500 flex items-center justify-center text-white text-xs">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        // Other user avatar - fetch from User model
                        <UserAvatar userId={senderId} userName={senderName} />
                      )}
                    </div>

                    <div className="chat-header text-[10px] opacity-50 mb-0.5">
                      {isMe
                        ? "আপনি"
                        : isFromBot
                          ? "CareerCanvas Assistant"
                          : isAdmin
                            ? "User"
                            : senderName}
                      <time className="ml-1">{fmt(msg.createdAt)}</time>
                      {isFromBot && <span className="ml-1 text-violet-400">🤖</span>}
                    </div>

                    <div className={`chat-bubble text-sm py-2 px-3 max-w-[240px] ${isMe
                      ? "chat-bubble-primary"
                      : isFromBot
                        ? "bg-violet-100 text-violet-900 dark:bg-violet-900/30 dark:text-violet-100"
                        : "chat-bubble-neutral"
                      } ${msg._optimistic ? "opacity-60" : ""}`}>

                      {/* ✅ Image message */}
                      {msg.messageType === "image" && msg.fileUrl && (
                        <div className="space-y-1">
                          <img
                            src={msg.fileUrl}
                            alt="Shared image"
                            className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition"
                            onClick={() => setImageModal(msg.fileUrl!)}
                          />
                          <p className="text-xs opacity-70">📷 Image • Click to view</p>
                        </div>
                      )}

                      {/* ✅ File message */}
                      {msg.messageType === "file" && (
                        <button
                          onClick={() => handleDownload(msg.fileUrl || msg.content, msg.fileName || msg.content)}
                          className="flex items-center gap-2 hover:underline cursor-pointer bg-transparent border-none p-0"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs">📎 {msg.fileName || msg.content} • Click to download</span>
                        </button>
                      )}

                      {/* ✅ Text message */}
                      {msg.messageType === "text" && msg.content}

                      {msg._optimistic && <span className="ml-1 text-[10px] opacity-60">⏳</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ✅ Scroll to bottom button - shows when user scrolls up */}
        {isUserScrolling && (
          <div className="absolute bottom-20 right-4 z-10">
            <button
              onClick={() => {
                setIsUserScrolling(false);
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn btn-circle btn-primary btn-sm shadow-lg hover:scale-110 transition-transform"
              title="নিচে যান"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}

        {/* Error banner */}
        {sendError && (
          <div className="px-3 py-1.5 bg-error/10 border-t border-error/20 flex items-center justify-between">
            <p className="text-xs text-error">{sendError}</p>
            <button onClick={() => setSendError(null)} className="text-error/60 hover:text-error text-xs ml-2">✕</button>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-base-300 bg-base-100 px-3 py-2">
          <div className="flex gap-2 items-end">
            {/* ✅ File upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt,.zip"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading || sending}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || sending || !connected}
              className="btn btn-ghost btn-sm btn-square"
              title="ফাইল বা ছবি পাঠান"
            >
              {uploading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              )}
            </button>

            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); if (sendError) setSendError(null); }}
              onKeyDown={handleKeyDown}
              placeholder={isBot ? "CareerCanvas Assistant কে জিজ্ঞেস করুন..." : "মেসেজ লিখুন..."}
              rows={1}
              disabled={sending || uploading}
              className="textarea textarea-bordered textarea-sm flex-1 resize-none text-sm min-h-[36px] max-h-24 focus:textarea-primary disabled:opacity-60"
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 96) + "px";
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !connected || sending || uploading}
              className="btn btn-primary btn-sm btn-square"
            >
              {sending
                ? <span className="loading loading-spinner loading-xs" />
                : (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}