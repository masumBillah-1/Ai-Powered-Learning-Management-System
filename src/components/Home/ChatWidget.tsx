"use client";


import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaComments,
    FaTimes,
    FaArrowLeft,
    FaBars,
    FaPen,
    FaEnvelope,
    FaVolumeUp,
    FaVolumeMute,
    FaExternalLinkAlt,
    FaPlusSquare,
    FaPaperclip,
    FaLink,
    FaPaperPlane,
    FaDownload,
    FaTrash,
    FaRobot,
    FaUser,
    FaMicrophone,
    FaStop,
    FaPlay,
} from "react-icons/fa";


const ChatWidget = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [soundOn, setSoundOn] = useState(true);
    const [chatName, setChatName] = useState("Customer Support");
    const [inputValue, setInputValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [onlineStatus, setOnlineStatus] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showPopoutModal, setShowPopoutModal] = useState(false);
    const [showEmbedModal, setShowEmbedModal] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const [showResponsivePanel, setShowResponsivePanel] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState('mobile');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "bot",
            text: "Hello! Welcome to CareerCanvas LMS customer support.",
            timestamp: new Date().toLocaleTimeString(),
            type: "text"
        },
        {
            id: 2,
            sender: "bot",
            text: "How can we help you today? You can ask about courses, enrollment, technical issues, or anything else!",
            timestamp: new Date().toLocaleTimeString(),
            type: "text"
        },
    ]);


    const menuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };


        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }


        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);


    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    // Simulate online/offline status
    useEffect(() => {
        const interval = setInterval(() => {
            setOnlineStatus(Math.random() > 0.1); // 90% online
        }, 30000);
        return () => clearInterval(interval);
    }, []);


    // Play notification sound
    const playNotificationSound = () => {
        if (soundOn) {
            try {
                // Simple beep sound using Web Audio API
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (error) {
                console.log('Could not play notification sound');
            }
        }
    };


    // Play voice message sound - visual feedback only (audio removed per user request)
    const playVoiceMessageSound = () => {
        // Audio functionality removed - keeping function for visual feedback only
        // User requested to remove the "bobooob" sound when clicking voice play button
        console.log('Voice message play button clicked - audio disabled');
    };


    // Play message sent sound
    const playMessageSentSound = () => {
        if (soundOn) {
            try {
                // Quick confirmation sound for sent messages
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 1000;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.05);
            } catch (error) {
                console.log('Could not play sent message sound');
            }
        }
    };


    const handleChangeName = () => {
        const newName = prompt("Enter new chat title:", chatName);
        if (newName && newName.trim()) {
            setChatName(newName.trim());
            const systemMessage = {
                id: Date.now(),
                sender: "system",
                text: `Chat renamed to "${newName.trim()}"`,
                timestamp: new Date().toLocaleTimeString(),
                type: "system"
            };
            setMessages(prev => [...prev, systemMessage]);
        }
        setIsMenuOpen(false);
    };


    const handleEmailTranscript = () => {
        setShowEmailModal(true);
        setIsMenuOpen(false);
    };


    const confirmEmailTranscript = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailAddress.trim()) {
            alert('Please enter an email address');
            return;
        }

        if (!emailRegex.test(emailAddress.trim())) {
            alert('Please enter a valid email address');
            return;
        }


        const transcript = messages
            .filter(msg => msg.type !== "system")
            .map((msg) => `[${msg.timestamp}] ${msg.sender === "user" ? "You" : "Support"}: ${msg.text}`)
            .join("\n");

        const chatSummary = `
Chat Transcript - ${chatName}
Generated on: ${new Date().toLocaleString()}
Total Messages: ${messages.filter(m => m.type !== "system").length}
Email sent to: ${emailAddress.trim()}


${transcript}


---
This transcript was generated from CareerCanvas LMS Chat Widget
Visit: ${window.location.origin}
    `.trim();

        const subject = encodeURIComponent(`Chat Transcript - ${chatName}`);
        const body = encodeURIComponent(chatSummary);

        // Create mailto link with the entered email
        window.location.href = `mailto:${emailAddress.trim()}?subject=${subject}&body=${body}`;

        // Show success message
        const systemMessage = {
            id: Date.now(),
            sender: "system",
            text: `📧 Chat transcript sent to ${emailAddress.trim()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: "system"
        };
        setMessages(prev => [...prev, systemMessage]);

        // Reset and close modal
        setEmailAddress('');
        setShowEmailModal(false);
    };


    const handleDownloadTranscript = () => {
        const transcript = messages
            .filter(msg => msg.type !== "system")
            .map((msg) => `[${msg.timestamp}] ${msg.sender === "user" ? "You" : "Support"}: ${msg.text}`)
            .join("\n");

        const chatSummary = `Chat Transcript - ${chatName}\nGenerated on: ${new Date().toLocaleString()}\nTotal Messages: ${messages.length}\n\n${transcript}`;

        const blob = new Blob([chatSummary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-transcript-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsMenuOpen(false);
    };


    const handleClearChat = () => {
        setShowClearModal(true);
        setIsMenuOpen(false);
    };


    const confirmClearChat = () => {
        setMessages([
            {
                id: Date.now(),
                sender: "bot",
                text: "Chat cleared. How can I help you today?",
                timestamp: new Date().toLocaleTimeString(),
                type: "text"
            }
        ]);
        setShowClearModal(false);
    };


    const handleToggleSound = () => {
        setSoundOn((prev) => !prev);
        const systemMessage = {
            id: Date.now(),
            sender: "system",
            text: `🔊 Notifications ${!soundOn ? "enabled" : "disabled"}`,
            timestamp: new Date().toLocaleTimeString(),
            type: "system"
        };
        setMessages(prev => [...prev, systemMessage]);

        // Play a test sound if enabling
        if (!soundOn) {
            setTimeout(() => playNotificationSound(), 500);
        }

        setIsMenuOpen(false);
    };


    const handlePopout = () => {
        setShowPopoutModal(true);
        setIsMenuOpen(false);
    };


    const confirmPopout = () => {
        // Show responsive panel instead of opening new window
        setShowResponsivePanel(true);
        setSelectedDevice('mobile'); // Reset to mobile view
        setShowPopoutModal(false);
    };


    const getDeviceInfo = (device: string) => {
        switch (device) {
            case 'mobile':
                return { width: '320px', height: '568px', name: 'iPhone SE', scale: 0.75, frameWidth: '133%' };
            case 'tablet':
                return { width: '768px', height: '1024px', name: 'iPad', scale: 0.45, frameWidth: '222%' };
            case 'desktop':
                return { width: '1024px', height: '768px', name: 'Desktop', scale: 0.35, frameWidth: '285%' };
            case 'large':
                return { width: '1440px', height: '900px', name: 'Large Desktop', scale: 0.25, frameWidth: '400%' };
            default:
                return { width: '320px', height: '568px', name: 'iPhone SE', scale: 0.75, frameWidth: '133%' };
        }
    };


    const handleAddChatToWebsite = async () => {
        setShowEmbedModal(true);
        setIsMenuOpen(false);
    };


    const confirmEmbedCode = async () => {
        const embedCode = `<!-- CareerCanvas LMS Chat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://your-domain.com/chat-widget.js';
    script.async = true;
    script.onload = function() {
      CareerCanvasChat.init({
        apiKey: 'your-api-key',
        theme: 'default',
        position: 'bottom-left',
        welcomeMessage: 'Hello! How can we help you today?'
      });
    };
    document.head.appendChild(script);
  })();
</script>
<!-- End CareerCanvas LMS Chat Widget -->`;

        try {
            await navigator.clipboard.writeText(embedCode);
            alert("✅ Embed code copied to clipboard!\n\nPaste this code before the closing </body> tag on your website to add the chat widget.");
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = embedCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert("✅ Embed code copied to clipboard!");
        }
        setShowEmbedModal(false);
    };


    const handleFileAttach = () => {
        fileInputRef.current?.click();
    };


    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileMessage = {
                id: Date.now(),
                sender: "user",
                text: `📎 Attached file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
                timestamp: new Date().toLocaleTimeString(),
                type: "file"
            };
            setMessages(prev => [...prev, fileMessage]);
            playMessageSentSound(); // Play sent sound for file

            // Reset file input
            event.target.value = '';

            // Simulate bot response
            setTimeout(() => {
                const botReply = {
                    id: Date.now() + 1,
                    sender: "bot",
                    text: "Thank you for sharing the file! Our team will review it and get back to you shortly.",
                    timestamp: new Date().toLocaleTimeString(),
                    type: "text"
                };
                setMessages(prev => [...prev, botReply]);
                playNotificationSound();
            }, 1000);
        }
    };


    const handleInsertLink = () => {
        const url = prompt("Enter URL:");
        if (url && url.trim()) {
            setInputValue(prev => prev + ` ${url.trim()}`);
        }
    };


    // Send message to backend API
    const sendMessageToBackend = async (userMessage: string): Promise<string> => {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages
                        .filter(msg => msg.sender !== 'system')
                        .map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text })),
                    context: { type: 'customer_support' },
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Chat API non-ok body:', text);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                console.warn('Chat API error response (still delivering message):', data.error);
                // If backend includes fallback message, return it; show error notice in UI.
                if (data.message) {
                    // preserve error in caller to render error banner
                    setError(data.error);
                    return data.message;
                }
                throw new Error(data.error);
            }

            return data.message || data.response || "Thank you for your message. Our team will respond shortly.";
        } catch (err) {
            console.error('Chat API error:', err);
            throw new Error(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
        }
    };


    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessageText = inputValue.trim();
        setInputValue("");
        setError(null);

        const userMessage = {
            id: Date.now(),
            sender: "user",
            text: userMessageText,
            timestamp: new Date().toLocaleTimeString(),
            type: "text"
        };

        setMessages((prev) => [...prev, userMessage]);

        // Play sent message sound
        playMessageSentSound();

        // Show typing indicator
        setIsTyping(true);
        setIsLoading(true);

        try {
            const botResponse = await sendMessageToBackend(userMessageText);

            const botReply = {
                id: Date.now() + 1,
                sender: "bot",
                text: botResponse,
                timestamp: new Date().toLocaleTimeString(),
                type: "text"
            };

            setMessages((prev) => [...prev, botReply]);
            setRetryCount(0); // Reset retry count on success

            if (!isChatOpen) {
                setUnreadCount(prev => prev + 1);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);

            // Add error message to chat
            const errorReply = {
                id: Date.now() + 1,
                sender: "system",
                text: `❌ ${errorMessage}`,
                timestamp: new Date().toLocaleTimeString(),
                type: "error"
            };
            setMessages((prev) => [...prev, errorReply]);
        } finally {
            setIsTyping(false);
            setIsLoading(false);
        }
    };


    const handleVoiceRecord = () => {
        if (!isRecording) {
            setIsRecording(true);
            playVoiceMessageSound(); // Play sound when starting recording

            // Simulate recording
            setTimeout(() => {
                setIsRecording(false);
                const voiceMessage = {
                    id: Date.now(),
                    sender: "user",
                    text: "🎤 Voice message (0:05)",
                    timestamp: new Date().toLocaleTimeString(),
                    type: "voice"
                };
                setMessages(prev => [...prev, voiceMessage]);
                playMessageSentSound(); // Play sent sound for voice message

                // Simulate bot response to voice message
                setTimeout(() => {
                    const botReply = {
                        id: Date.now() + 1,
                        sender: "bot",
                        text: "I received your voice message! Let me help you with that.",
                        timestamp: new Date().toLocaleTimeString(),
                        type: "text"
                    };
                    setMessages(prev => [...prev, botReply]);
                    playNotificationSound();
                }, 2000);
            }, 3000);
        } else {
            setIsRecording(false);
        }
    };


    return (
        <div className="fixed bottom-9 right-4 z-[9999] flex flex-col items-end gap-3">
            {/* Screen Reader Announcements */}
            <div aria-live="assertive" aria-atomic="true" className="sr-only">
                {messages.length > 2 && messages[messages.length - 1]?.sender === 'bot' &&
                    `New message from support: ${messages[messages.length - 1]?.text}`
                }
                {error && `Error: ${error}`}
                {isLoading && "Sending message..."}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.txt"
            />

            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -30, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.96 }}
                        transition={{ duration: 0.28 }}
                        className="relative h-[620px] w-[360px] overflow-hidden rounded-[28px] bg-[#f3f3f5] shadow-[0_25px_60px_rgba(0,0,0,0.25)]"
                        role="dialog"
                        aria-labelledby="chat-title"
                        aria-describedby="chat-status"
                    >
                        {/* Chat Header */}
                        <div className="flex h-[94px] items-center justify-between bg-[#e4002b] px-5 text-white">
                            <button
                                onClick={() => {
                                    setIsChatOpen(false);
                                    setUnreadCount(0);
                                }}
                                className="text-xl hover:opacity-80 transition-opacity"
                                aria-label="Close chat"
                            >
                                <FaArrowLeft />
                            </button>

                            <div className="flex flex-col items-center">
                                <h3 id="chat-title" className="text-[18px] font-extrabold">{chatName}</h3>
                                <div id="chat-status" className="flex items-center gap-1 text-xs opacity-90">
                                    <div className={`w-2 h-2 rounded-full ${onlineStatus ? 'bg-green-400' : 'bg-gray-400'}`} />
                                    <span>{onlineStatus ? 'Online' : 'Offline'}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsMenuOpen((prev) => !prev)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setIsMenuOpen((prev) => !prev);
                                    }
                                }}
                                className="text-xl hover:opacity-80 transition-opacity"
                                aria-label="Menu"
                                aria-expanded={isMenuOpen}
                                aria-haspopup="true"
                            >
                                <FaBars />
                            </button>
                        </div>


                        {/* Enhanced Menu Dropdown */}
                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    ref={menuRef}
                                    initial={{ opacity: 0, y: -10, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-[74px] left-1/2 z-50 w-[330px] -translate-x-1/2 rounded-[26px] bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.12)] max-h-[400px] overflow-y-auto"
                                >
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={handleChangeName}
                                            className="flex items-center gap-3 p-3 text-left text-[14px] text-[#4a4a4a] hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <FaPen className="text-[#7a7a7a]" />
                                            <span>Rename Chat</span>
                                        </button>

                                        <button
                                            onClick={handleEmailTranscript}
                                            className="flex items-center gap-3 p-3 text-left text-[14px] text-[#4a4a4a] hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <FaEnvelope className="text-blue-600" />
                                            <span>Email Transcript</span>
                                        </button>

                                        <button
                                            onClick={handleDownloadTranscript}
                                            className="flex items-center gap-3 p-3 text-left text-[14px] text-[#4a4a4a] hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <FaDownload className="text-[#7a7a7a]" />
                                            <span>Download Chat</span>
                                        </button>

                                        <button
                                            onClick={handleToggleSound}
                                            className="flex items-center gap-3 p-3 text-left text-[14px] text-[#4a4a4a] hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            {soundOn ? (
                                                <FaVolumeUp className="text-[#7a7a7a]" />
                                            ) : (
                                                <FaVolumeMute className="text-[#7a7a7a]" />
                                            )}
                                            <span>{soundOn ? "Mute" : "Unmute"}</span>
                                        </button>

                                        <button
                                            onClick={handlePopout}
                                            className="flex items-center gap-3 p-3 text-left text-[14px] text-[#4a4a4a] hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <FaExternalLinkAlt className="text-blue-600" />
                                            <span>Responsive Test</span>
                                        </button>

                                        <button
                                            onClick={handleClearChat}
                                            className="flex items-center gap-3 p-3 text-left text-[14px] text-[#dc2626] hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <FaTrash className="text-[#dc2626]" />
                                            <span>Clear Chat History</span>
                                        </button>
                                    </div>

                                    <div className="border-t border-gray-200 mt-4 pt-4">
                                        <button
                                            onClick={handleAddChatToWebsite}
                                            className="flex w-full items-center gap-3 p-3 text-left text-[14px] text-[#4a4a4a] hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <FaPlusSquare className="text-blue-600" />
                                            <span>Add Widget to Website</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* Messages Area */}
                        <div
                            className="flex h-[406px] flex-col gap-3 overflow-y-auto px-4 py-5"
                            role="log"
                            aria-live="polite"
                            aria-label="Chat messages"
                        >
                            {messages.map((msg) => (
                                <div key={msg.id}>
                                    {msg.type === "system" ? (
                                        <div className="text-center text-xs text-gray-500 italic py-2">
                                            {msg.text}
                                        </div>
                                    ) : (
                                        <div
                                            className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.sender === "user"
                                                ? "ml-auto bg-[#e4002b] text-white"
                                                : "bg-white text-[#3f3f46]"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                {msg.sender === "user" ? (
                                                    <FaUser className="text-xs opacity-70" />
                                                ) : (
                                                    <FaRobot className="text-xs opacity-70" />
                                                )}
                                                <span className="text-xs opacity-70">
                                                    {msg.timestamp}
                                                </span>
                                            </div>

                                            {/* Voice Message with Play Button */}
                                            {msg.type === "voice" ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => playVoiceMessageSound()}
                                                        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${msg.sender === "user"
                                                            ? "bg-white/20 hover:bg-white/30 text-white"
                                                            : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                                                            }`}
                                                    >
                                                        <FaPlay className="text-xs ml-0.5" />
                                                    </button>
                                                    <div>{msg.text}</div>
                                                </div>
                                            ) : (
                                                <div>{msg.text}</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="max-w-[82%] rounded-2xl px-4 py-3 text-sm bg-white text-[#3f3f46] shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <FaRobot className="text-xs opacity-70" />
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>


                        {/* Enhanced Input Area */}
                        <div className="absolute bottom-0 left-0 w-full border-t border-[#e5e5e5] bg-[#f3f3f5] px-4 py-6">
                            {/* Error Message */}
                            {error && (
                                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-red-500">⚠️</span>
                                            <span className="text-sm text-red-700">{error}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setError(null);
                                                setRetryCount(0);
                                            }}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                            aria-label="Dismiss error"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    {retryCount < 3 && (
                                        <button
                                            onClick={() => {
                                                setError(null);
                                                setRetryCount(prev => prev + 1);
                                                // Retry the last message
                                                const lastUserMessage = messages
                                                    .filter(m => m.sender === 'user')
                                                    .pop();
                                                if (lastUserMessage) {
                                                    setInputValue(lastUserMessage.text);
                                                }
                                            }}
                                            className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                                            aria-label="Retry sending message"
                                        >
                                            Retry ({retryCount}/3)
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Loading Indicator */}
                            {isLoading && (
                                <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span>Sending message...</span>
                                </div>
                            )}

                            <div className="flex items-center gap-3 rounded-[30px] border border-[#dddddd] bg-[#efeff1] px-5 py-4">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent text-[16px] text-[#4a4a4a] outline-none placeholder:text-[#7d7d7d]"
                                    aria-label="Type your message"
                                    aria-describedby="send-button"
                                    disabled={isLoading}
                                />

                                <button
                                    onClick={handleFileAttach}
                                    type="button"
                                    className="text-lg text-[#6f6f75] hover:text-[#e4002b] transition-colors"
                                    aria-label="Attach file"
                                    disabled={isLoading}
                                >
                                    <FaPaperclip />
                                </button>


                                <button
                                    onClick={handleInsertLink}
                                    type="button"
                                    className="text-lg text-[#6f6f75] hover:text-[#e4002b] transition-colors"
                                    aria-label="Insert link"
                                    disabled={isLoading}
                                >
                                    <FaLink />
                                </button>


                                <button
                                    onClick={handleVoiceRecord}
                                    type="button"
                                    className={`text-lg transition-colors ${isRecording
                                        ? "text-red-500 animate-pulse"
                                        : "text-[#6f6f75] hover:text-[#e4002b]"
                                        }`}
                                    aria-label={isRecording ? "Stop recording" : "Start voice recording"}
                                    disabled={isLoading}
                                >
                                    {isRecording ? <FaStop /> : <FaMicrophone />}
                                </button>


                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    type="button"
                                    id="send-button"
                                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${inputValue.trim() && !isLoading
                                        ? "bg-[#e4002b] text-white hover:bg-[#c8001f] scale-100"
                                        : "bg-gray-300 text-gray-500 scale-95"
                                        }`}
                                    aria-label="Send message"
                                    aria-disabled={!inputValue.trim() || isLoading}
                                >
                                    <FaPaperPlane className="text-xs" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Pop Out Confirmation Modal */}
            <AnimatePresence>
                {showPopoutModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowPopoutModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="mb-4 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <FaExternalLinkAlt className="text-xl text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Responsive Preview</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Open responsive preview panel to test website on different devices.
                                </p>
                            </div>


                            {/* Modal Content */}
                            <div className="mb-6 rounded-lg bg-gray-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                            <span className="text-sm">📱</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">Preview features:</h4>
                                        <ul className="mt-2 space-y-1 text-xs text-gray-600">
                                            <li>• Mobile, tablet, desktop views</li>
                                            <li>• Real-time responsive testing</li>
                                            <li>• Side-by-side comparison</li>
                                            <li>• Interactive website preview</li>
                                            <li>• No new tabs or windows</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            {/* Modal Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPopoutModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmPopout}
                                    className="flex-1 rounded-lg bg-[#e4002b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c8001f] focus:outline-none focus:ring-2 focus:ring-[#e4002b] focus:ring-offset-2 transition-colors"
                                >
                                    Open Preview Panel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Email Transcript Modal */}
            <AnimatePresence>
                {showEmailModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowEmailModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <FaEnvelope className="text-xl text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Email Chat Transcript</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Enter your email address to receive the chat transcript
                                </p>
                            </div>


                            {/* Email Input */}
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        value={emailAddress}
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                confirmEmailTranscript();
                                            }
                                        }}
                                        placeholder="Enter your email address"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 placeholder-gray-500"
                                        autoFocus
                                    />
                                    {emailAddress && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim()) ? (
                                                <span className="text-green-500 text-sm">✓</span>
                                            ) : (
                                                <span className="text-red-500 text-sm">✗</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim()) && (
                                    <p className="mt-1 text-xs text-red-600">Please enter a valid email address</p>
                                )}
                            </div>


                            {/* Chat Summary */}
                            <div className="mb-6 rounded-lg bg-gray-50 p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">What will be sent:</h4>
                                <ul className="space-y-1 text-xs text-gray-600">
                                    <li>• Complete chat history ({messages.filter(m => m.type !== "system").length} messages)</li>
                                    <li>• Message timestamps</li>
                                    <li>• Chat session details</li>
                                    <li>• CareerCanvas LMS branding</li>
                                </ul>
                            </div>


                            {/* Modal Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setEmailAddress('');
                                        setShowEmailModal(false);
                                    }}
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmEmailTranscript}
                                    disabled={!emailAddress.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim())}
                                    className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${emailAddress.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim())
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Send Email
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Embed Code Modal */}
            <AnimatePresence>
                {showEmbedModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowEmbedModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="relative mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="mb-4 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                    <FaPlusSquare className="text-xl text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Add Chat to Website</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Get the embed code to add this chat widget to your website.
                                </p>
                            </div>


                            {/* Modal Content */}
                            <div className="mb-6 space-y-4">
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <h4 className="mb-2 text-sm font-medium text-gray-900">What you'll get:</h4>
                                    <ul className="space-y-1 text-xs text-gray-600">
                                        <li>• Professional chat widget for your website</li>
                                        <li>• Customizable theme and position</li>
                                        <li>• Real-time customer support</li>
                                        <li>• Mobile-responsive design</li>
                                        <li>• Easy integration with one code snippet</li>
                                    </ul>
                                </div>

                                <div className="rounded-lg bg-blue-50 p-4">
                                    <h4 className="mb-2 text-sm font-medium text-blue-900">Installation:</h4>
                                    <p className="text-xs text-blue-700">
                                        Copy the code and paste it before the closing &lt;/body&gt; tag on your website.
                                    </p>
                                </div>
                            </div>


                            {/* Modal Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowEmbedModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmEmbedCode}
                                    className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                                >
                                    Copy Embed Code
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Clear Chat Confirmation Modal */}
            <AnimatePresence>
                {showClearModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowClearModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="mb-4 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                    <FaTrash className="text-xl text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Clear Chat History</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Are you sure you want to delete all messages? This action cannot be undone.
                                </p>
                            </div>


                            {/* Modal Content */}
                            <div className="mb-6 rounded-lg bg-yellow-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                                            <span className="text-sm">⚠️</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-yellow-900">What will happen:</h4>
                                        <ul className="mt-2 space-y-1 text-xs text-yellow-800">
                                            <li>• All chat messages will be permanently deleted</li>
                                            <li>• Chat history cannot be recovered</li>
                                            <li>• A fresh conversation will start</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            {/* Modal Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowClearModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmClearChat}
                                    className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                >
                                    Clear All Messages
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Responsive Preview Panel */}
            <AnimatePresence>
                {showResponsivePanel && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowResponsivePanel(false)}
                    >
                        <motion.div
                            initial={{ x: -400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -400, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute left-0 top-0 h-full w-96 bg-white shadow-2xl overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Panel Header */}
                            <div className="flex items-center justify-between bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] px-4 py-3 text-white">
                                <div>
                                    <h3 className="font-bold text-lg">Responsive Preview</h3>
                                    <p className="text-xs opacity-90">CareerCanvas LMS • Live Testing</p>
                                </div>
                                <button
                                    onClick={() => setShowResponsivePanel(false)}
                                    className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>


                            {/* Device Size Selector */}
                            <div className="border-b border-gray-200 p-4 bg-gray-50">
                                <div className="flex gap-2 mb-3">
                                    <button
                                        onClick={() => setSelectedDevice('mobile')}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium shadow-sm transition-colors ${selectedDevice === 'mobile'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        📱 Mobile (320px)
                                    </button>
                                    <button
                                        onClick={() => setSelectedDevice('tablet')}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${selectedDevice === 'tablet'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        📟 Tablet (768px)
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedDevice('desktop')}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${selectedDevice === 'desktop'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        💻 Desktop (1024px)
                                    </button>
                                    <button
                                        onClick={() => setSelectedDevice('large')}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${selectedDevice === 'large'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        🖥️ Large (1440px)
                                    </button>
                                </div>
                                <div className="mt-3 text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                                    ✅ Currently viewing: {getDeviceInfo(selectedDevice).name} ({getDeviceInfo(selectedDevice).width}×{getDeviceInfo(selectedDevice).height})
                                </div>
                            </div>


                            {/* Website Preview */}
                            <div className="flex-1 p-4 bg-gray-100">
                                <div className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 h-full">
                                    {/* Mobile Device Frame */}
                                    <div className="bg-gray-900 px-4 py-2 flex items-center justify-center">
                                        <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
                                    </div>

                                    {/* Screen Content */}
                                    <div className="relative h-full bg-white overflow-hidden">
                                        <iframe
                                            key={selectedDevice} // Force re-render when device changes
                                            src={window.location.origin}
                                            className="w-full h-full border-0 transition-all duration-300"
                                            style={{
                                                transform: `scale(${getDeviceInfo(selectedDevice).scale})`,
                                                transformOrigin: 'top left',
                                                width: getDeviceInfo(selectedDevice).frameWidth,
                                                height: getDeviceInfo(selectedDevice).frameWidth
                                            }}
                                            title={`Responsive Preview - ${getDeviceInfo(selectedDevice).name}`}
                                        />

                                        {/* Overlay with device info */}
                                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                            {getDeviceInfo(selectedDevice).width}×{getDeviceInfo(selectedDevice).height}
                                        </div>

                                        {/* Device Type Badge */}
                                        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                            {getDeviceInfo(selectedDevice).name}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Panel Footer */}
                            <div className="border-t border-gray-200 p-4 bg-white">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span>Live Preview</span>
                                    </div>
                                    <span>Zoom: {Math.round(getDeviceInfo(selectedDevice).scale * 100)}%</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => {
                                            window.open(window.location.origin, '_blank');
                                            setShowResponsivePanel(false);
                                        }}
                                        className="bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <FaExternalLinkAlt className="text-xs" />
                                        Open Full Site
                                    </button>
                                    <button
                                        onClick={() => setShowResponsivePanel(false)}
                                        className="bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
                                    >
                                        Close Preview
                                    </button>
                                </div>

                                <div className="mt-2 text-center">
                                    <span className="text-xs text-gray-400">Powered by CareerCanvas LMS</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Enhanced Chat Toggle Button */}
            <motion.button
                onClick={() => {
                    setIsChatOpen((prev) => !prev);
                    setIsMenuOpen(false);
                    if (!isChatOpen) {
                        setUnreadCount(0);
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsChatOpen((prev) => !prev);
                        setIsMenuOpen(false);
                        if (!isChatOpen) {
                            setUnreadCount(0);
                        }
                    }
                }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#e4002b] text-white shadow-[0_10px_35px_rgba(228,0,43,0.45)] hover:shadow-[0_15px_45px_rgba(228,0,43,0.6)] transition-all duration-300"
                aria-label={`${isChatOpen ? 'Close' : 'Open'} chat with ${chatName}`}
                aria-expanded={isChatOpen}
                aria-describedby="chat-status-summary"
            >
                {isChatOpen ? (
                    <FaTimes className="text-2xl" />
                ) : (
                    <FaComments className="text-2xl" />
                )}

                {!isChatOpen && (
                    <>
                        <span className="absolute inset-0 rounded-full animate-ping bg-[#e4002b]/30" />

                        {/* Unread Count Badge */}
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white border-2 border-white">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}

                        {/* Online Status Indicator */}
                        <span className={`absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white ${onlineStatus ? "bg-green-500" : "bg-gray-400"
                            }`}>
                            <FaComments className="text-[10px] text-white" />
                        </span>
                    </>
                )}
            </motion.button>

            {/* Status Summary for Screen Readers */}
            <div id="chat-status-summary" className="sr-only">
                {onlineStatus ? 'Support is online' : 'Support is offline'}.
                {unreadCount > 0 && `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`}.
            </div>
        </div>
    );
};


export default ChatWidget;

