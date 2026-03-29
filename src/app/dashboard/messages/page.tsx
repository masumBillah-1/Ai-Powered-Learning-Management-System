"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { Send } from "lucide-react";

// ✅ Configure axios defaults for all requests
axios.defaults.withCredentials = true;
axios.defaults.timeout = 15000;

// --- Emojis ---
const EMOJIS = ["😀", "😂", "😍", "🥰", "😎", "🤩", "😭", "😤", "🥺", "😏", "👍", "👎", "❤️", "🔥", "🎉", "✅", "💯", "🙏", "💪", "👏", "😊", "🤔", "😴", "🤣", "😇", "🤗", "😈", "👀", "💀", "🫡", "🌟", "💫", "⚡", "🎯", "🚀", "💥", "🌈", "🎊", "🏆", "🎁"];

// --- Interfaces ---
interface Message {
  _id: string;
  senderId: { _id: string; name: string; photoURL: string; role: string } | string;
  receiverId: string;
  content: string;
  messageType: "text" | "image" | "file" | "link";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  roomId: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  roomId: string;
  lastMessage: string;
  participants: any[];
  unreadCount: Record<string, number>;
  updatedAt: string;
}

// --- Link Clickable Helper Function ---
const formatMessageWithLinks = (text: string, isMyMessage: boolean = false) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline decoration-2 underline-offset-2 break-all font-semibold transition-colors ${isMyMessage
            ? 'text-white/95 hover:text-white decoration-white/60 hover:decoration-white'
            : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 decoration-blue-600/50 dark:decoration-blue-400/50'
            }`}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

// ✅ Messaging Module: Real-time Polling, Notification Sounds, and UI Refinements
function SupportChatContent() {
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<{ id: string, role: string, photoURL?: string } | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [enrolledInstructors, setEnrolledInstructors] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [imageModal, setImageModal] = useState<string | null>(null); // ✅ Image modal state
  const scrollRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

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

  // --- Functions (Defined before Use) ---
  const fetchAllUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await axios.get('/api/messages/users', {
        timeout: 15000,
        withCredentials: true
      });
      if (res.data.success) setAllUsers(res.data.users);
    } catch (err: any) {
      console.error("❌ fetchAllUsers error:", err.response?.data?.error || err.message);
    }
    finally { setUsersLoading(false); }
  };

  const fetchEnrolledData = async () => {
    setUsersLoading(true);
    try {
      const res = await axios.get('/api/enrollments', {
        timeout: 15000,
        withCredentials: true
      });
      if (res.data.success) {
        const instructors = res.data.enrollments
          .map((e: any) => e.courseId?.instructorId)
          .filter((inst: any) => inst && inst._id);
        const unique = Array.from(new Map(instructors.map((i: any) => [i._id, i])).values());
        setEnrolledInstructors(unique);
      }
    } catch (err: any) {
      console.error("❌ fetchEnrolledData error:", err.response?.data?.error || err.message);
    }
    finally { setUsersLoading(false); }
  };

  const fetchConversations = async () => {
    // ✅ Stop fetching if tab is hidden to save excessive API requests
    if (typeof document !== 'undefined' && document.hidden) return;
    
    try {
      const res = await axios.get('/api/messages', {
        timeout: 10000,
        withCredentials: true
      });
      if (res.data.success) {
        setConversations(res.data.conversations);
        // ✅ CACHE: Store conversations for instant next-load
        localStorage.setItem(`convs_${currentUser?.id}`, JSON.stringify(res.data.conversations));
      }
    } catch (err: any) {
      console.error("❌ fetchConversations error:", err.response?.data?.error || err.message);
      if (!conversations.length) {
        const cached = localStorage.getItem(`convs_${currentUser?.id}`);
        if (cached) setConversations(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  const sidebarList = useMemo(() => {
    if (!currentUser) return [] as Conversation[];

    const existingConversations = conversations.filter(conv => {
      const other = conv.participants.find(p => p._id !== currentUser.id);
      if (!other) return false;

      if (currentUser.role === 'student') {
        const isMyInstructor = enrolledInstructors.some(inst => inst._id === other._id);
        return other.role === 'admin' || isMyInstructor;
      }

      if (currentUser.role === 'instructor') {
        return other.role === 'admin' || (other.role === 'student' && conv.lastMessage);
      }

      if (currentUser.role === 'admin') {
        return true;
      }
      return true;
    });

    let enrichedList = [...existingConversations];

    if (currentUser.role === 'student' || currentUser.role === 'admin') {
      const candidateUsers = currentUser.role === 'student'
        ? enrolledInstructors
        : allUsers; // ✅ Admin can see ALL users (students + instructors)

      const extraChats = candidateUsers
        .filter(u => !existingConversations.some(conv =>
          conv.participants.some(p => p._id === u._id)
        ))
        .map(u => ({
          _id: `temp_${u._id}`,
          roomId: [currentUser.id, u._id].sort().join('_'),
          lastMessage: "No conversations. Start now...",
          participants: [
            { _id: currentUser.id, name: "Me", role: currentUser.role },
            { ...u }
          ],
          unreadCount: {},
          updatedAt: new Date().toISOString()
        })) as unknown as Conversation[];

      enrichedList = [...existingConversations, ...extraChats];
    }

    if (!searchTerm.trim()) return enrichedList;

    return enrichedList.filter(conv => {
      const user = conv.participants.find(p => p._id !== currentUser.id);
      return user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [conversations, currentUser, enrolledInstructors, allUsers, searchTerm]);

  // --- Effects ---
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      const userObj = { id: parsed._id || parsed.id, role: parsed.role, photoURL: parsed.photoURL };
      setCurrentUser(userObj);

      // ✅ INSTANT LOAD: sidebar from cache
      const cachedConvs = localStorage.getItem(`convs_${userObj.id}`);
      if (cachedConvs) {
        setConversations(JSON.parse(cachedConvs));
        setLoading(false);
      }

      fetchConversations();

      setTimeout(() => {
        if (userObj.role === 'student') fetchEnrolledData();
        if (userObj.role === 'admin' || userObj.role === 'instructor') fetchAllUsers();
      }, 500);
    }

    const interval = setInterval(fetchConversations, 20000); // ✅ Increased to 20s
    
    // ✅ Re-fetch immediately when returning to tab
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchConversations();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const lastProcessedUserIdRef = useRef<string | null>(null);

  // ✅ Auto-select user from URL parameter (?userId=...)
  useEffect(() => {
    const targetUserId = searchParams.get('userId');
    if (targetUserId && sidebarList.length > 0 && currentUser && targetUserId !== lastProcessedUserIdRef.current) {
      const foundConv = sidebarList.find(c =>
        c.participants.some(p => p._id === targetUserId)
      );
      if (foundConv) {
        const otherUser = foundConv.participants.find(p => p._id === targetUserId);
        setActiveRoomId(foundConv.roomId);
        setActiveUser(otherUser);
        lastProcessedUserIdRef.current = targetUserId; // Mark as processed
      }
    }
  }, [searchParams, sidebarList, currentUser]);

  const lastMessageIdRef = useRef<string | null>(null);
  const isInitialFetchRef = useRef<boolean>(true); // Track if it's the first fetch

  useEffect(() => {
    if (activeRoomId) {
      isInitialFetchRef.current = true;

      // ✅ INSTANT LOAD: Load messages from cache FIRST
      const cachedMsgs = localStorage.getItem(`msgs_${activeRoomId}`);
      if (cachedMsgs) {
        setMessages(JSON.parse(cachedMsgs));
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      } else {
        setMessages([]); // Clear if no cache
      }

      const markAsRead = async () => {
        try {
          await axios.put(`/api/messages/${activeRoomId}`, {}, { timeout: 10000, withCredentials: true });
          fetchConversations();
        } catch (err: any) { console.error("❌ markAsRead error:", err.message); }
      };
      markAsRead();

      const fetchMsgs = async () => {
        // ✅ Stop polling if the browser tab is hidden to save requests!
        if (document.hidden) return;

        try {
          const res = await axios.get(`/api/messages/${activeRoomId}`, { timeout: 10000, withCredentials: true });
          if (res.data.success) {
            const newMsgs = res.data.messages;

            // ✅ CACHE: Store messages for next time
            localStorage.setItem(`msgs_${activeRoomId}`, JSON.stringify(newMsgs));
            setMessages(newMsgs);

            if (newMsgs.length > 0) {
              const latest = newMsgs[newMsgs.length - 1];
              const senderId = typeof latest.senderId === 'object' ? latest.senderId._id : latest.senderId;

              const isNewMessage = lastMessageIdRef.current && latest._id !== lastMessageIdRef.current;
              const isFromOtherUser = senderId !== currentUser?.id;
              const isNotInitialLoad = !isInitialFetchRef.current;

              if (isNewMessage && isFromOtherUser && isNotInitialLoad) {
                const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
                audio.volume = 0.5;
                audio.play().catch(e => console.warn("Audio play blocked:", e));
              }

              lastMessageIdRef.current = latest._id;
              isInitialFetchRef.current = false;
            }
          }
        } catch (err: any) { console.error("❌ fetchMsgs error:", err.message); }
      };
      fetchMsgs();

      // ✅ Re-fetch immediately when returning to tab
      const handleVisibilityChange = () => {
        if (!document.hidden) fetchMsgs();
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      const interval = setInterval(fetchMsgs, 7000); // ✅ Increased to 7s
      return () => {
        clearInterval(interval);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    } else {
      lastMessageIdRef.current = null;
      isInitialFetchRef.current = true;
    }
  }, [activeRoomId, currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeRoomId || !currentUser) return;
    const currentConv = sidebarList.find(c => c.roomId === activeRoomId);
    const otherParticipant = currentConv?.participants.find(p => p._id !== currentUser.id);
    try {
      const res = await axios.post('/api/messages', {
        content: input,
        roomId: activeRoomId,
        receiverId: otherParticipant?._id || null,
        messageType: "text"
      });
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.message]);
        setInput("");
        setShowEmoji(false);
        fetchConversations();
      }
    } catch (err) { console.error(err); }
  };

  const handleEmojiClick = (emoji: string) => {
    setInput(prev => prev + emoji);
  };

  const theme = useMemo(() => {
    switch (currentUser?.role) {
      case 'admin': return { btn: 'bg-secondary', text: 'text-secondary', border: 'border-secondary/30', badge: 'badge-secondary' };
      case 'instructor': return { btn: 'bg-warning', text: 'text-warning', border: 'border-warning/30', badge: 'badge-warning' };
      default: return { btn: 'bg-primary', text: 'text-primary', border: 'border-primary/30', badge: 'badge-primary' };
    }
  }, [currentUser]);

  return (
    <div className={`flex h-[85vh] bg-base-100 text-base-content overflow-hidden rounded-2xl border ${theme.border} shadow-xl mx-auto`}>
      {/* ✅ Image Modal/Lightbox */}
      {imageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setImageModal(null)}
        >
          {/* Close button - Smaller with pointer cursor */}
          <button
            onClick={() => setImageModal(null)}
            className="absolute top-4 right-4 z-[60] w-8 h-8 flex items-center justify-center rounded-full bg-black/80 hover:bg-black text-white transition-all hover:scale-110 shadow-lg border border-white/20 cursor-pointer"
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
            className="absolute top-4 right-14 z-[60] w-8 h-8 flex items-center justify-center rounded-full bg-black/80 hover:bg-black text-white transition-all hover:scale-110 shadow-lg border border-white/20 cursor-pointer"
            title="Download"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          <div className="relative max-w-7xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={imageModal}
              alt="Full size image"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
            Click outside or press ESC to close
          </div>
        </div>
      )}

      <aside className="w-60 bg-base-200 border-r border-base-300 flex flex-col">
        <div className="p-5 border-b border-base-300">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className={`text-lg font-bold ${theme.text}`}>Message Center</h2>
              <div className={`badge ${theme.badge} badge-sm text-white uppercase font-bold mt-1`}>{currentUser?.role}</div>
            </div>
            {/* Live indicator */}
            {!loading && (
              <div className="flex items-center gap-1.5 text-[10px] opacity-60">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="font-bold">Live</span>
              </div>
            )}
          </div>

          <div className="relative mt-2">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              className="input input-xs h-9 w-full rounded-lg bg-base-300 border-none px-3 focus:ring-1 focus:ring-primary placeholder:opacity-50 text-[11px] disabled:opacity-50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1.5 opacity-50 hover:opacity-100 text-[10px]"
              >✕</button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            // ✅ OPTIMIZED: Beautiful skeleton loader with shimmer effect
            <div className="space-y-1 p-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-base-200/50 border border-base-300/30 relative overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-base-100/50 to-transparent"></div>

                  {/* Avatar skeleton */}
                  <div className="w-10 h-10 rounded-full bg-base-300/60 flex-shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-base-100/30 to-transparent"></div>
                  </div>

                  {/* Content skeleton */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 bg-base-300/60 rounded-md w-24 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-base-100/30 to-transparent"></div>
                      </div>
                      <div className="h-3 bg-base-300/40 rounded-md w-12 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-base-100/30 to-transparent"></div>
                      </div>
                    </div>
                    <div className="h-2 bg-base-300/40 rounded-md w-32 relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-base-100/30 to-transparent"></div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading text indicator */}
              <div className="text-center py-3">
                <div className="inline-flex items-center gap-2 text-xs opacity-50">
                  <span className="loading loading-spinner loading-xs"></span>
                  <span className="font-medium">Loading conversations...</span>
                </div>
              </div>
            </div>
          ) : sidebarList.length > 0 ? (
            sidebarList.map((conv) => {
              const user = conv.participants.find(p => p._id !== currentUser?.id) || { name: "User", photoURL: "", role: "student" };
              const isSelected = activeRoomId === conv.roomId;
              return (
                <div
                  key={conv._id}
                  onClick={() => { setActiveRoomId(conv.roomId); setActiveUser(user); }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${isSelected ? `bg-base-100 ${theme.border}` : 'hover:bg-base-300 border-transparent'}`}
                >
                  <div className="avatar">
                    <div className="w-10 rounded-full ring ring-base-300">
                      <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}`} alt="avatar" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-hidden mb-0.5">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? theme.text : ''}`}>{user.name}</h4>
                      <span className="px-1.5 py-0.5 rounded-md bg-base-300 text-[10px] capitalize font-bold opacity-70 flex-shrink-0">{user.role}</span>

                      {currentUser && (conv as any).unreadCount?.[currentUser.id] > 0 && !isSelected && (
                        <span className="ml-auto badge badge-error badge-xs text-[9px] p-1.5 min-w-[18px] h-[18px] text-white font-bold border-none">
                          {(conv as any).unreadCount[currentUser.id]}
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] truncate font-medium ${currentUser && (conv as any).unreadCount?.[currentUser.id] > 0 && !isSelected ? 'opacity-100 text-base-content font-bold' : 'opacity-60'}`}>
                      {conv.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-4 opacity-40 text-xs italic">No conversations.</div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-base-100">
        {activeRoomId ? (
          <>
            <header className="p-4 border-b border-base-300 flex items-center gap-3 bg-base-100">
              <div className="avatar online w-10">
                <img className="rounded-full ring-1 ring-base-300" src={activeUser?.photoURL || "https://ui-avatars.com/api/?name=User"} alt="" />
              </div>
              <div>
                <h3 className="text-sm font-bold">{activeUser?.name}</h3>
                <p className="text-[10px] opacity-50 uppercase font-bold">{activeUser?.role}</p>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => {
                const sender = typeof msg.senderId === 'object' ? msg.senderId : null;
                const isMe = (sender?._id || msg.senderId) === currentUser?.id;
                const avatarUrl = isMe ? (currentUser?.photoURL || `https://ui-avatars.com/api/?name=Me`) : (activeUser?.photoURL || `https://ui-avatars.com/api/?name=${activeUser?.name}`);

                const isOnlyEmoji = /^[\p{Emoji}\s]+$/u.test(msg.content.trim()) && msg.content.trim().length <= 10;

                // --- Date Helper ---
                const msgDate = new Date(msg.createdAt);
                const prevMsg = idx > 0 ? messages[idx - 1] : null;
                const isNewDay = !prevMsg || new Date(prevMsg.createdAt).toDateString() !== msgDate.toDateString();

                const dateDisplay = () => {
                  const today = new Date().toDateString();
                  const yesterday = new Date(Date.now() - 86400000).toDateString();
                  if (msgDate.toDateString() === today) return "Today";
                  if (msgDate.toDateString() === yesterday) return "Yesterday";
                  return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
                };

                return (
                  <React.Fragment key={msg._id}>
                    {isNewDay && (
                      <div className="flex justify-center my-8">
                        <span className="px-3 py-1 rounded-full bg-base-300/50 text-[10px] uppercase font-bold tracking-wider opacity-60 backdrop-blur-sm ring-1 ring-base-content/5">
                          {dateDisplay()}
                        </span>
                      </div>
                    )}
                    <div className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end group`}>
                      <div className="avatar flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <div className="w-8 rounded-full ring-2 ring-base-300 ring-offset-base-100 ring-offset-1">
                          <img src={avatarUrl} alt="avatar" />
                        </div>
                      </div>
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                        <div className="opacity-0 group-hover:opacity-40 text-[9px] mb-1 font-bold mx-1 transition-opacity">
                          {msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {isOnlyEmoji ? (
                          <div className="text-5xl leading-none drop-shadow-sm hover:scale-110 transition-transform duration-200 cursor-default">
                            {msg.content}
                          </div>
                        ) : msg.messageType === "image" && msg.fileUrl ? (
                          // ✅ Image message
                          <div className={`rounded-2xl overflow-hidden shadow-lg border transition-all hover:scale-[1.02] cursor-pointer
                            ${isMe ? 'border-white/20' : 'border-base-300'}`}
                            onClick={() => setImageModal(msg.fileUrl!)}
                          >
                            <img
                              src={msg.fileUrl}
                              alt="Shared image"
                              className="max-w-xs max-h-96 object-cover"
                            />
                            <div className={`px-3 py-1.5 text-[10px] font-medium ${isMe ? 'bg-white/10 text-white' : 'bg-base-200 text-base-content/70'}`}>
                              📷 Image • Click to view
                            </div>
                          </div>
                        ) : msg.messageType === "file" && msg.fileUrl ? (
                          // ✅ File message
                          <button
                            onClick={() => handleDownload(msg.fileUrl!, msg.fileName || msg.content)}
                            className={`flex items-center gap-3 py-3 px-4 rounded-2xl transition-all shadow-sm border hover:shadow-md cursor-pointer w-full text-left
                              ${isMe
                                ? 'bg-gradient-to-br from-[#f52e99] to-[#d42d87] text-white border-transparent'
                                : 'bg-white dark:bg-neutral-800 text-slate-800 dark:text-neutral-50 border-base-300'
                              }`}
                          >
                            <div className={`p-2 rounded-lg ${isMe ? 'bg-white/20' : 'bg-base-200'}`}>
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{msg.fileName || msg.content}</p>
                              <p className={`text-[10px] ${isMe ? 'text-white/70' : 'text-base-content/50'}`}>
                                {msg.fileSize ? `${(msg.fileSize / 1024).toFixed(1)} KB • ` : ''}Click to download
                              </p>
                            </div>
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        ) : (
                          <div className={`py-2.5 px-4 text-[13px] leading-relaxed rounded-2xl transition-all shadow-sm border
                            ${isMe
                              ? `bg-gradient-to-br from-[#f52e99] to-[#d42d87] text-white font-medium rounded-br-none border-transparent`
                              : 'bg-white dark:bg-neutral-800 text-slate-800 dark:text-neutral-50 border-base-300 rounded-bl-none'
                            }`}
                          >
                            {formatMessageWithLinks(msg.content, isMe)}
                          </div>
                        )}
                        {/* Status detail shown on hover */}
                        <div className="opacity-0 group-hover:opacity-30 text-[8px] mt-1 font-bold">
                          {isMe ? 'Delivered' : ''}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            <form onSubmit={handleSend} className="p-4 pr-30 border-t border-base-300 bg-base-100 relative">
              <div className="flex gap-2 items-center">
                <div className="relative" ref={emojiRef}>
                  <button
                    type="button"
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="btn btn-circle btn-ghost h-11 w-11 text-xl "
                  >
                    😊
                  </button>
                  {showEmoji && (
                    <div className="absolute bottom-14 left-0 bg-base-100 border border-base-300 rounded-2xl shadow-2xl p-3 w-80 max-h-64 overflow-y-auto z-50">
                      <div className="grid grid-cols-8 gap-1">
                        {EMOJIS.map((emoji, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleEmojiClick(emoji)}
                            className="text-2xl rounded-lg cursor-pointer p-2 transition-all hover:scale-125"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  type="text"
                  placeholder="Type here..."
                  className="input input-bordered flex-1 rounded-full bg-base-200 focus:bg-base-100 transition-all border-none ring-1 ring-base-300 h-11 text-sm outline-none"
                />
                <button
                  disabled={!input.trim()}
                  type="submit"
                  className={`btn btn-circle border-none ${theme.btn} text-white shadow-md h-11 w-11 -rotate-90`}
                >
                  <Send size={20} className="rotate-90" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center p-10">
            <h3 className="text-xl font-bold">LMS Support</h3>
            <p className="text-sm">Select a contact to start messaging.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SupportChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[85vh] bg-base-100 rounded-2xl border border-base-300">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    }>
      <SupportChatContent />
    </Suspense>
  );
}