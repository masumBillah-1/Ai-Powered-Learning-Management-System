"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';

// --- Emojis ---
const EMOJIS = ["😀", "😂", "😍", "🥰", "😎", "🤩", "😭", "😤", "🥺", "😏", "👍", "👎", "❤️", "🔥", "🎉", "✅", "💯", "🙏", "💪", "👏", "😊", "🤔", "😴", "🤣", "😇", "🤗", "😈", "👀", "💀", "🫡", "🌟", "💫", "⚡", "🎯", "🚀", "💥", "🌈", "🎊", "🏆", "🎁"];

// --- Interfaces ---
interface Message {
  _id: string;
  senderId: { _id: string; name: string; photoURL: string; role: string } | string;
  receiverId: string;
  content: string;
  messageType: "text" | "image" | "file" | "link";
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
const formatMessageWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-black-400 dark:text-whit-400 hover:text-white-300 break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

export default function SupportChatPage() {
  const [currentUser, setCurrentUser] = useState<{ id: string, role: string, photoURL?: string } | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [enrolledInstructors, setEnrolledInstructors] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      const userObj = { id: parsed._id || parsed.id, role: parsed.role, photoURL: parsed.photoURL };
      setCurrentUser(userObj);
      if (userObj.role === 'student') fetchEnrolledData();
    }
  }, []);

  const fetchEnrolledData = async () => {
    try {
      const res = await axios.get('/api/enrollments');
      if (res.data.success) {
        const instructors = res.data.enrollments
          .map((e: any) => e.courseId?.instructorId)
          .filter((inst: any) => inst && inst._id);
        const unique = Array.from(new Map(instructors.map((i: any) => [i._id, i])).values());
        setEnrolledInstructors(unique);
      }
    } catch (err) { console.error(err); }
  };

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/messages', { timeout: 10000 }); // 10s timeout
      if (res.data.success) setConversations(res.data.conversations);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'ECONNABORTED' || err.response?.status === 500) {
        setConversations([]); // Show empty state on timeout
      }
    } finally {
      setLoading(false);
    }
  };

  const sidebarList = useMemo(() => {
    if (!currentUser) return [];
    return conversations.filter(conv => {
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
        return other.role === 'instructor' || other.role === 'student' || other.role === 'admin';
      }

      return true;
    });
  }, [conversations, currentUser, enrolledInstructors]);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeRoomId) {
      const fetchMsgs = async () => {
        try {
          const res = await axios.get(`/api/messages/${activeRoomId}`);
          if (res.data.success) setMessages(res.data.messages);
        } catch (err) { console.error(err); }
      };
      fetchMsgs();
      const interval = setInterval(fetchMsgs, 4000);
      return () => clearInterval(interval);
    }
  }, [activeRoomId]);

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeRoomId || !currentUser) return;
    const currentConv = conversations.find(c => c.roomId === activeRoomId);
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
      <aside className="w-60 bg-base-200 border-r border-base-300 flex flex-col">
        <div className="p-5 border-b border-base-300">
          <h2 className={`text-lg font-bold ${theme.text}`}>Message Center</h2>
          <div className={`badge ${theme.badge} badge-sm text-white uppercase font-bold`}>{currentUser?.role}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="flex justify-center p-4"><span className="loading loading-spinner text-primary"></span></div>
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
                    </div>
                    <p className="text-[10px] opacity-60 truncate font-medium">{conv.lastMessage || "No messages yet"}</p>
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
              {messages.map((msg) => {
                const sender = typeof msg.senderId === 'object' ? msg.senderId : null;
                const isMe = (sender?._id || msg.senderId) === currentUser?.id;
                const avatarUrl = isMe ? (currentUser?.photoURL || `https://ui-avatars.com/api/?name=Me`) : (activeUser?.photoURL || `https://ui-avatars.com/api/?name=${activeUser?.name}`);

                // Check if message is only emoji (no text)
                const isOnlyEmoji = /^[\p{Emoji}\s]+$/u.test(msg.content.trim()) && msg.content.trim().length <= 10;

                return (
                  <div key={msg._id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                    <div className="avatar flex-shrink-0">
                      <div className="w-8 rounded-full ring-1 ring-base-300 ring-offset-base-100 ring-offset-1">
                        <img src={avatarUrl} alt="avatar" />
                      </div>
                    </div>
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="opacity-40 text-[9px] mb-1 font-bold mx-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {isOnlyEmoji ? (
                        <div className="text-4xl leading-none">
                          {msg.content}
                        </div>
                      ) : (
                        <div className={`shadow-sm py-2.5 px-4 text-[13px] leading-relaxed rounded-2xl max-w-md
                          ${isMe ? `${theme.btn} text-white font-medium rounded-br-sm` : 'bg-slate-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-base-300 rounded-bl-sm'}`}
                        >
                          {formatMessageWithLinks(msg.content)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-base-300 bg-base-100 pr-30 relative">
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
                  className="input input-bordered flex-1 rounded-full bg-base-200 focus:bg-base-100 transition-all border-none ring-1 ring-base-300 h-11 text-sm"
                />
                <button
                  disabled={!input.trim()}
                  type="submit"
                  className={`btn btn-circle border-none ${theme.btn} text-white shadow-md h-11 w-11 -rotate-90`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 rotate-90"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
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