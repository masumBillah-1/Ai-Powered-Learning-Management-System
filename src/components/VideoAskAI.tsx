"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPaperPlane, FaRobot, FaVideo, FaLightbulb, FaQuestionCircle } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface VideoAskAIProps {
    isOpen: boolean;
    onClose: () => void;
    videoTitle: string;
    videoUrl?: string;
    lessonId: string;
    courseId: string;
}

export default function VideoAskAI({
    isOpen,
    onClose,
    videoTitle,
    videoUrl,
    lessonId,
    courseId
}: VideoAskAIProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initial welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: "assistant",
                content: `🎥 আমি এই video "${videoTitle}" সম্পর্কে আপনার যেকোনো প্রশ্নের উত্তর দিতে পারি!\n\n✨ আপনি জিজ্ঞেস করতে পারেন:\n• এই video এর main points কি?\n• কোনো concept explain করতে বলুন\n• Practice questions চান\n• Examples বা real-life applications\n\nকি জানতে চান?`,
                timestamp: new Date()
            }]);
        }
    }, [isOpen, videoTitle, messages.length]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input.trim(),
                    context: {
                        type: "video_lesson",
                        videoTitle,
                        videoUrl,
                        lessonId,
                        courseId
                    },
                    history: messages.slice(-5) // Last 5 messages for context
                })
            });

            const data = await response.json();

            if (data.message) {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: data.message,
                    timestamp: new Date()
                }]);
            } else {
                throw new Error(data.error || "Unknown error");
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "দুঃখিত, কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        "এই video এর main points কি?",
        "Practice questions দাও",
        "এই concept টা আরো explain করো",
        "Real-life examples দাও"
    ];

    const handleQuickQuestion = (question: string) => {
        setInput(question);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[9998]"
                        onClick={onClose}
                    />

                    {/* Chat Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl h-[80vh] max-h-[600px] bg-[#161b22] border border-white/10 rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-violet-500/10 to-indigo-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                                    <FaRobot className="text-white text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Video AI Assistant</h3>
                                    <div className="flex items-center gap-1 text-xs text-violet-400">
                                        <FaVideo size={10} />
                                        <span className="truncate max-w-[200px]">{videoTitle}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[80%] ${message.role === "user"
                                            ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white"
                                            : "bg-[#0d1117] border border-white/10 text-gray-200"
                                        } rounded-2xl px-4 py-3`}>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {message.content}
                                        </div>
                                        <div className={`text-xs mt-2 ${message.role === "user" ? "text-white/70" : "text-gray-500"
                                            }`}>
                                            {message.timestamp.toLocaleTimeString("bn-BD", {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#0d1117] border border-white/10 rounded-2xl px-4 py-3">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                            </div>
                                            <span className="text-xs">AI thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions */}
                        {messages.length <= 1 && (
                            <div className="px-4 pb-2">
                                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickQuestions.map((question, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickQuestion(question)}
                                            className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-[#0d1117]">
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="এই video সম্পর্কে প্রশ্ন করুন..."
                                        rows={1}
                                        disabled={isLoading}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-200 text-sm resize-none focus:outline-none focus:border-violet-500 transition-colors placeholder-gray-500"
                                        style={{ minHeight: "44px", maxHeight: "120px" }}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = "auto";
                                            target.style.height = Math.min(target.scrollHeight, 120) + "px";
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="w-11 h-11 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <FaPaperPlane size={14} />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                                <HiSparkles size={12} />
                                AI powered by Gemini • Video context aware
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}