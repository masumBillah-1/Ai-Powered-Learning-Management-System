"use client";

import { useState, useEffect, useRef } from "react";
import { Send, CheckCheck, Circle, Search, Users, Headphones } from "lucide-react";
import { io, Socket } from "socket.io-client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserData {
  _id?: string;
  name: string;
  email: string;
  photoURL?: string;
  role: string;
}

interface Message {
  _id?: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  createdAt?: string;
  read: boolean;
}

interface OnlineUser {
  userId: string;
  socketId: string;
  role: string;
  name: string;
}

interface Conversation {
  userId: string;
  userName: string;
  userRole: string;
  roomId: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
const STAFF_ROLES = ["admin", "instructor"];

const getRoomId = (userId: string) => `support_${userId}`;
const getAvatar = (name: string, bg = "FF0F7B") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff`;

// ─── Typing dots ──────────────────────────────────────────────────────────────
function TypingBubble({ src, name }: { src: string; name: string }) {
  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-9 rounded-full overflow-hidden">
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="chat-bubble bg-base-100 shadow-sm">
        <span className="flex gap-1 items-center h-4">
          {[0, 150, 300].map(d => (
            <span key={d} className="w-2 h-2 rounded-full bg-current opacity-50 animate-bounce"
              style={{ animationDelay: `${d}ms` }} />
          ))}
        </span>
      </div>
      <div className="chat-footer opacity-40 text-xs">{name} is typing...</div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MsgBubble({ msg, fromMe, avatar, name, gradientStyle }:
  { msg: Message; fromMe: boolean; avatar: string; name: string; gradientStyle: React.CSSProperties }) {
  return (
    <div className={`chat ${fromMe ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="w-9 rounded-full overflow-hidden">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="chat-header text-xs opacity-50 mb-0.5">
        {name}
        {msg.createdAt && (
          <time className="ml-1 opacity-60">
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </time>
        )}
      </div>
      <div className="chat-bubble text-sm font-medium shadow-sm" style={fromMe ? gradientStyle : {}}>
        {msg.content}
      </div>
      <div className="chat-footer opacity-40 text-xs mt-0.5 flex items-center gap-1">
        {fromMe && <CheckCheck size={12} className={msg.read ? "text-blue-400" : ""} />}
        {fromMe ? (msg.read ? "Seen" : "Delivered") : ""}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [theme, setTheme] = useState("light");
  const [ready, setReady] = useState(false);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  // staff only
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const joinedRooms = useRef<Set<string>>(new Set());

  // ── Theme sync ────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = localStorage.getItem("theme") || "light";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    const iv = setInterval(() => {
      const cur = localStorage.getItem("theme") || "light";
      if (cur !== theme) { setTheme(cur); document.documentElement.setAttribute("data-theme", cur); }
    }, 100);
    return () => clearInterval(iv);
  }, [theme]);

  // ── Load user + connect ───────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) return;
    const u: UserData = JSON.parse(saved);
    setUser(u);
    setReady(true);

    const myId = u._id || u.email;
    const isStaff = STAFF_ROLES.includes(u.role);
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("user:join", { userId: myId, userName: u.name, userRole: u.role });
      // student auto-joins their own room
      if (!isStaff) {
        const room = getRoomId(myId);
        socket.emit("room:join", { roomId: room, userId: myId });
        joinedRooms.current.add(room);
      }
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("room:history", (history: Message[]) => {
      setMessages(history);
      if (history.length > 0) {
        const last = history[history.length - 1];
        setConversations(prev => prev.map(c =>
          c.roomId === last.roomId ? {
            ...c,
            lastMessage: last.content,
            lastTime: last.createdAt
              ? new Date(last.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "",
          } : c
        ));
      }
    });

    socket.on("message:receive", (msg: Message) => {
      if (!isStaff) {
        if (msg.roomId === getRoomId(myId)) setMessages(p => [...p, msg]);
        return;
      }
      setActiveConv(prev => {
        if (prev?.roomId === msg.roomId) setMessages(p => [...p, msg]);
        return prev;
      });
      setConversations(prev => prev.map(c =>
        c.roomId === msg.roomId
          ? { ...c, lastMessage: msg.content, lastTime: new Date(msg.createdAt || "").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), unread: c.unread + 1 }
          : c
      ));
    });

    socket.on("users:online", (users: OnlineUser[]) => {
      setOnlineUsers(users);
      if (!isStaff) return;
      const students = users.filter(u2 => u2.role === "student" && u2.userId !== myId);
      setConversations(prev => {
        const map = new Map(prev.map(c => [c.userId, c]));
        students.forEach(s => {
          if (!map.has(s.userId)) {
            map.set(s.userId, { userId: s.userId, userName: s.name, userRole: s.role, roomId: getRoomId(s.userId), lastMessage: "No messages yet", lastTime: "", unread: 0, online: true });
          } else { map.get(s.userId)!.online = true; }
        });
        prev.forEach(c => { if (!students.find(s => s.userId === c.userId)) map.get(c.userId)!.online = false; });
        return Array.from(map.values());
      });
    });

    socket.on("typing:show", ({ userName }: { userName: string }) => { setIsTyping(true); setTypingUser(userName); });
    socket.on("typing:hide", () => { setIsTyping(false); setTypingUser(""); });

    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const emitTyping = (roomId: string, name: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("typing:start", { roomId, userName: name });
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => socketRef.current?.emit("typing:stop", { roomId }), 2000);
  };

  const sendMessage = () => {
    if (!input.trim() || !user || !socketRef.current) return;
    const myId = user._id || user.email;
    const isStaff = STAFF_ROLES.includes(user.role);
    const roomId = isStaff ? activeConv?.roomId : getRoomId(myId);
    if (!roomId) return;
    socketRef.current.emit("message:send", { roomId, senderId: myId, senderName: user.name, senderRole: user.role, content: input.trim() });
    socketRef.current.emit("typing:stop", { roomId });
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setInput("");
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!user) return;
    const myId = user._id || user.email;
    const isStaff = STAFF_ROLES.includes(user.role);
    const roomId = isStaff ? activeConv?.roomId : getRoomId(myId);
    if (roomId) emitTyping(roomId, user.name);
  };

  const openConv = (conv: Conversation) => {
    setActiveConv(conv);
    setMessages([]);
    setShowSidebar(false);
    setConversations(prev => prev.map(c => c.userId === conv.userId ? { ...c, unread: 0 } : c));
    if (socketRef.current && !joinedRooms.current.has(conv.roomId)) {
      socketRef.current.emit("room:join", { roomId: conv.roomId, userId: user?._id || user?.email });
      joinedRooms.current.add(conv.roomId);
    }
  };

  if (!ready) return null;

  const isStaff = STAFF_ROLES.includes(user?.role || "");
  const myId = user?._id || user?.email || "";
  const myAvatar = user?.photoURL || getAvatar(user?.name || "Me", isStaff ? "832388" : "FF0F7B");
  const supportAvatar = getAvatar("Support Team", "832388");
  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);
  const filteredConvs = conversations.filter(c => c.userName.toLowerCase().includes(search.toLowerCase()));

  // ── Input bar shared component ────────────────────────────────────────────
  const InputBar = ({ placeholder, gradient }: { placeholder: string; gradient: string }) => (
    <div className="px-4 py-3 bg-base-100 border-t border-base-300 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 hidden sm:block">
          <img src={myAvatar} alt={user?.name} className="w-full h-full object-cover" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={handleInput}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          className="input input-sm flex-1 bg-base-200 border-base-300 rounded-xl text-sm h-10"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || !connected}
          className="btn btn-sm btn-circle border-0 text-white disabled:opacity-30 hover:scale-110 transition-all"
          style={{ background: gradient }}
        >
          <Send size={15} />
        </button>
      </div>
      {!isStaff && (
        <p className="text-center text-xs opacity-25 mt-2 font-medium">🔒 Your messages are secure and encrypted</p>
      )}
    </div>
  );

  // ══════════════════════════════════════════════════════
  // STUDENT VIEW
  // ══════════════════════════════════════════════════════
  if (!isStaff) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-start justify-center">
        <div className="w-full max-w-2xl flex flex-col bg-base-100 border border-base-300 rounded-2xl shadow-xl overflow-hidden"
          style={{ height: "calc(100vh - 130px)" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-base-300 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#832388]">
                  <img src={supportAvatar} alt="Support" className="w-full h-full object-cover" />
                </div>
                {connected && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100" />}
              </div>
              <div>
                <p className="font-black text-sm flex items-center gap-1.5">
                  <Headphones size={14} style={{ color: "#832388" }} /> Support Team
                </p>
                <p className="text-xs opacity-50 flex items-center gap-1">
                  {connected ? <><Circle size={7} className="fill-green-500 text-green-500" /> Online — replies within minutes</> : "Connecting..."}
                </p>
              </div>
            </div>
            <div className="badge badge-sm font-bold border-0 text-white"
              style={{ backgroundColor: connected ? "#00C48C" : "#999" }}>
              {connected ? "Live" : "Offline"}
            </div>
          </div>

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: "#FF0F7B15" }}>💬</div>
              <div>
                <p className="font-black text-base mb-1">How can we help you?</p>
                <p className="text-sm opacity-50">Send a message and our support team will reply shortly.</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Question about my course", "Payment issue", "Technical problem"].map(p => (
                  <button key={p} onClick={() => setInput(p)}
                    className="btn btn-xs rounded-full border border-base-300 bg-base-200 font-semibold hover:text-[#FF0F7B] hover:border-[#FF0F7B] transition-colors">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-base-200 space-y-1">
              {messages.map((msg, i) => (
                <MsgBubble key={msg._id || i} msg={msg} fromMe={msg.senderId === myId}
                  avatar={msg.senderId === myId ? myAvatar : supportAvatar}
                  name={msg.senderId === myId ? (user?.name || "You") : msg.senderName}
                  gradientStyle={{ background: "linear-gradient(135deg, #FF0F7B, #F89B29)", color: "#fff" }}
                />
              ))}
              {isTyping && <TypingBubble src={supportAvatar} name={typingUser} />}
              <div ref={messagesEndRef} />
            </div>
          )}

          <InputBar placeholder="Type your message..." gradient="linear-gradient(135deg, #FF0F7B, #F89B29)" />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // STAFF VIEW (admin / instructor)
  // ══════════════════════════════════════════════════════
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="flex bg-base-100 border border-base-300 rounded-2xl shadow-xl overflow-hidden"
        style={{ height: "calc(100vh - 130px)" }}>

        {/* Sidebar */}
        <div className={`${showSidebar ? "flex" : "hidden"} md:flex flex-col w-full md:w-[300px] lg:w-[320px] bg-base-100 border-r border-base-300 flex-shrink-0`}>
          <div className="p-4 border-b border-base-300 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-black flex items-center gap-2">
                <Users size={16} style={{ color: "#FF0F7B" }} />
                Student Messages
                {totalUnread > 0 && (
                  <span className="badge badge-sm text-white font-bold border-0" style={{ backgroundColor: "#FF0F7B" }}>{totalUnread}</span>
                )}
              </h2>
              <div className="badge badge-sm font-bold border-0 text-white" style={{ backgroundColor: connected ? "#00C48C" : "#999" }}>
                {connected ? "Live" : "Off"}
              </div>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
              <input type="text" placeholder="Search students..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="input input-sm w-full pl-9 bg-base-200 border-base-300 rounded-xl text-sm" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConvs.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40 p-6 text-center">
                <Users size={32} />
                <p className="text-xs font-semibold">{conversations.length === 0 ? "Waiting for students..." : "No results"}</p>
              </div>
            )}
            {filteredConvs.map(conv => (
              <button key={conv.userId} onClick={() => openConv(conv)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-base-200 transition-colors border-b border-base-200 ${activeConv?.userId === conv.userId ? "bg-base-200 border-l-[3px]" : ""}`}
                style={activeConv?.userId === conv.userId ? { borderLeftColor: "#FF0F7B" } : {}}>
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-base-300">
                    <img src={getAvatar(conv.userName)} alt={conv.userName} className="w-full h-full object-cover" />
                  </div>
                  {conv.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-bold truncate">{conv.userName}</span>
                    <span className="text-xs opacity-40 ml-1 flex-shrink-0">{conv.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs opacity-50 truncate">{conv.lastMessage}</span>
                    {conv.unread > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: "#FF0F7B" }}>{conv.unread}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeConv && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center bg-base-200">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#83238820" }}>
                <Headphones size={28} style={{ color: "#832388" }} />
              </div>
              <div>
                <p className="font-black text-base mb-1 capitalize">{user?.role} Support Dashboard</p>
                <p className="text-sm opacity-50">Select a student conversation to start replying.</p>
              </div>
              <div className="flex gap-6 mt-2">
                {[
                  { label: "Conversations", value: conversations.length, color: "#FF0F7B" },
                  { label: "Online Now", value: onlineUsers.filter(u => u.role === "student").length, color: "#00C48C" },
                  { label: "Unread", value: totalUnread, color: "#F89B29" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs opacity-50 font-semibold">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeConv && (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-base-100 border-b border-base-300 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button className="md:hidden btn btn-ghost btn-sm btn-circle" onClick={() => setShowSidebar(true)}>←</button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#FF0F7B]">
                      <img src={getAvatar(activeConv.userName)} alt={activeConv.userName} className="w-full h-full object-cover" />
                    </div>
                    {activeConv.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-base-100" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{activeConv.userName}</p>
                    <p className="text-xs opacity-50 flex items-center gap-1">
                      {activeConv.online ? <><Circle size={7} className="fill-green-500 text-green-500" /> Online</> : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-70">
                  <div className="w-7 h-7 rounded-full overflow-hidden">
                    <img src={myAvatar} alt={user?.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold hidden sm:block">{user?.name}</span>
                  <span className="badge badge-xs font-bold border-0 text-white capitalize"
                    style={{ backgroundColor: user?.role === "admin" ? "#832388" : "#F89B29" }}>
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 bg-base-200 space-y-1">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-2 opacity-40">
                    <span className="text-4xl">💬</span>
                    <p className="text-sm font-semibold">No messages yet. Be the first to reply!</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <MsgBubble key={msg._id || i} msg={msg} fromMe={msg.senderId === myId}
                    avatar={msg.senderId === myId ? myAvatar : getAvatar(activeConv.userName)}
                    name={msg.senderId === myId ? (user?.name || "Support") : activeConv.userName}
                    gradientStyle={{ background: "linear-gradient(135deg, #832388, #FF0F7B)", color: "#fff" }}
                  />
                ))}
                {isTyping && <TypingBubble src={getAvatar(activeConv.userName)} name={typingUser} />}
                <div ref={messagesEndRef} />
              </div>

              <InputBar placeholder={`Reply to ${activeConv.userName}...`} gradient="linear-gradient(135deg, #832388, #FF0F7B)" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}