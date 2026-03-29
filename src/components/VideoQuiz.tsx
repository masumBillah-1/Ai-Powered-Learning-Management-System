"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaSync,
    FaLightbulb,
    FaAward,
    FaBrain,
    FaArrowRight,
    FaPlay
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import toast from "react-hot-toast";

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface VideoQuizProps {
    videoUrl?: string;
    videoTitle: string;
    courseId: string;
    lessonId: string;
    onSeekTo?: (seconds: number) => void;
}

export default function VideoQuiz({
    videoUrl,
    videoTitle,
    courseId,
    lessonId,
    onSeekTo
}: VideoQuizProps) {
    const [quiz, setQuiz] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [mistakes, setMistakes] = useState<Question[]>([]);
    const [aiAnalysis, setAiAnalysis] = useState<{ weakTopic: string; suggestion: string; encouragement: string; suggestedTimestamp?: number } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);

    const CACHE_KEY = `quiz_cache_${lessonId}`;

    useEffect(() => {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            try {
                const parsed = JSON.parse(cachedData);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setQuiz(parsed);
                } else {
                    setQuiz([]);
                }
            } catch {
                setQuiz([]);
            }
        } else {
            setQuiz([]);
        }

        // Reset state when lessonId changes
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
        setError(null);
        setMistakes([]);
        setAiAnalysis(null);
        setIsAnalyzing(false);
    }, [lessonId, CACHE_KEY]);

    const handleGenerate = async () => {
        if (!videoUrl || isGenerating) return;

        setIsGenerating(true);
        setIsLoading(true);
        setError(null);
        setQuiz([]);
        setMistakes([]);
        setAiAnalysis(null);
        setIsAnalyzing(false);

        try {
            const res = await fetch("/api/quiz/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoUrl, videoTitle })
            });

            const data = await res.json();

            if (data.success && Array.isArray(data.quiz)) {
                localStorage.setItem(CACHE_KEY, JSON.stringify(data.quiz));
                setQuiz(data.quiz);
            } else {
                throw new Error(data.error || "Quiz generation failed");
            }
        } catch (err: any) {
            setError(err.message || "Failed to generate deep quiz. Please try again.");
            toast.error("AI Quiz generation failed!");
        } finally {
            setIsLoading(false);
            setIsGenerating(false);
        }
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null || isAnswered) return;
        setIsAnswered(true);
        if (selectedOption === quiz[currentIndex].correctAnswer) {
            setScore(prev => prev + 1);
            toast.success("Correct Answer!", { icon: "✅" });
        } else {
            toast.error("Wrong Answer!", { icon: "❌" });
            setMistakes(prev => {
                if (!prev.find(m => m.question === quiz[currentIndex].question)) {
                    return [...prev, quiz[currentIndex]];
                }
                return prev;
            });
        }
    };

    useEffect(() => {
        if (showResults && mistakes.length > 0 && !aiAnalysis) {
            analyzeMistakes();
        }
    }, [showResults, mistakes.length, aiAnalysis]);

    const analyzeMistakes = async () => {
        setIsAnalyzing(true);
        try {
            const res = await fetch("/api/quiz/analyze-mistakes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mistakes, videoTitle })
            });
            const data = await res.json();
            if (data.success && data.analysis) {
                setAiAnalysis(data.analysis);
            }
        } catch (err) {
            console.error("Failed to analyze mistakes:", err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < quiz.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            // Scroll logic for better UX
            containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            setShowResults(true);
        }
    };

    const handleRetry = () => {
        localStorage.removeItem(CACHE_KEY);
        handleGenerate();
    };

    if (!videoUrl) return null;

    // --- Initial Generate View ---
    if (!quiz.length && !isLoading && !error) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-[#161b22] border border-white/10 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C81D77]/5 blur-[60px] -z-10"></div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white relative bg-gradient-to-br from-[#C81D77] to-[#6710C2]">
                        <FaBrain size={20} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                            <HiSparkles size={10} className="text-black" />
                        </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-base font-bold text-white">Unlock AI Quiz</h3>
                        <p className="text-gray-400 text-xs">Test your learning depth with AI-generated MCQs</p>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-xs transition-all disabled:opacity-50 cursor-pointer bg-gradient-to-r from-[#C81D77] to-[#6710C2] hover:shadow-[0_0_20px_rgba(200,29,119,0.3)]"
                    >
                        {isGenerating ? <span className="loading loading-spinner loading-xs"></span> : <><HiSparkles /> Generate Now</>}
                    </button>
                </div>
            </motion.div>
        );
    }

    // --- Loading View ---
    if (isLoading) {
        return (
            <div className="p-10 rounded-2xl bg-[#161b22] border border-white/10 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-4 border-[#C81D77]/20 border-t-[#C81D77] rounded-full animate-spin"></div>
                    <HiSparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#C81D77] text-xl animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-white font-bold text-base">Analyzing Video Context...</h3>
                    <p className="text-gray-500 text-xs mt-1">Our AI is crafting high-quality questions for you.</p>
                </div>
            </div>
        );
    }

    // --- Error View ---
    if (error) {
        return (
            <div className="p-6 rounded-2xl bg-[#161b22] border border-red-500/20 text-center space-y-4">
                <FaTimesCircle className="text-red-500 text-4xl mx-auto opacity-50" />
                <div>
                    <p className="text-white font-bold text-sm">Generation Failed</p>
                    <p className="text-gray-400 text-xs mt-1">{error}</p>
                </div>
                <button onClick={handleGenerate} className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all">
                    Try Again
                </button>
            </div>
        );
    }

    // --- Results View ---
    if (showResults) {
        const percentage = Math.round((score / quiz.length) * 100);
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-2xl bg-[#161b22] border border-white/10 text-center overflow-hidden">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 bg-gradient-to-br from-[#C81D77] to-[#6710C2]">
                    <FaAward />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Lesson Mastered!</h3>
                <p className="text-gray-400 text-xs mb-6">You've completed the assessment based on this video.</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Final Score</p>
                        <p className="text-2xl font-black text-white">{score}<span className="text-gray-500 text-sm">/{quiz.length}</span></p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Accuracy</p>
                        <p className={`text-2xl font-black ${percentage >= 80 ? 'text-emerald-400' : 'text-orange-400'}`}>{percentage}%</p>
                    </div>
                </div>

                {/* AI WEAKNESS DETECTOR & INSIGHTS */}
                {mistakes.length > 0 && (
                    <div className="mb-6 p-5 text-left rounded-2xl border border-[#C81D77]/30 bg-gradient-to-br from-[#C81D77]/10 to-[#6710C2]/10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C81D77]/10 blur-[50px] -z-10"></div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#C81D77]/20 flex items-center justify-center">
                                <HiSparkles className="text-[#C81D77] text-lg" />
                            </div>
                            <h4 className="text-white font-bold text-sm tracking-wide">AI Insights & Weakness Detector</h4>
                        </div>
                        
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center p-6 border border-white/5 rounded-xl bg-black/20">
                                <div className="w-6 h-6 border-2 border-[#C81D77]/30 border-t-[#C81D77] rounded-full animate-spin mb-3"></div>
                                <p className="text-xs text-[#C81D77] animate-pulse font-medium">Analyzing your mistakes to find weaknesses...</p>
                            </div>
                        ) : aiAnalysis ? (
                            <div className="space-y-4">
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-1.5">Weak Topic Detected</p>
                                        <div className="flex items-center gap-2">
                                            <FaBrain className="text-[#C81D77]" size={14} />
                                            <span className="text-white font-bold inline-block text-sm">
                                                {aiAnalysis.weakTopic}
                                            </span>
                                        </div>
                                    </div>
                                    {(aiAnalysis.suggestedTimestamp !== undefined && onSeekTo) && (
                                        <button 
                                            onClick={() => onSeekTo(aiAnalysis.suggestedTimestamp || 120)}
                                            className="px-4 py-2 rounded-lg bg-[#C81D77] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#C81D77] transition-all flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(200,29,119,0.4)] cursor-pointer flex-shrink-0"
                                        >
                                            <FaPlay size={10} /> Watch Again
                                        </button>
                                    )}
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <p className="text-gray-300 text-sm italic leading-relaxed border-l-2 border-[#C81D77] pl-3">
                                        "{aiAnalysis.suggestion}"
                                    </p>
                                </div>
                                <p className="text-emerald-400 text-[11px] font-bold tracking-wide pt-1 flex items-center gap-2">
                                    <FaLightbulb /> {aiAnalysis.encouragement}
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-red-400 text-center py-4 bg-black/20 rounded-xl">Analysis failed to load. Please try again.</p>
                        )}
                    </div>
                )}

                {mistakes.length === 0 && quiz.length > 0 && (
                    <div className="mb-6 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-bold flex items-center justify-center gap-2">
                        <FaCheckCircle size={18} /> Perfect Score! No weaknesses found.
                    </div>
                )}

                <div className="flex gap-3">
                    <button onClick={handleRetry} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <FaSync className="text-[10px]" /> Retake Quiz
                    </button>
                    <button onClick={() => setQuiz([])} className="flex-1 py-3 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-[#C81D77] to-[#6710C2] hover:opacity-90 transition-all">
                        Complete Lesson
                    </button>
                </div>
            </motion.div>
        );
    }

    // --- Main Quiz UI ---
    const currentQ = quiz[currentIndex];
    return (
        <div ref={containerRef} className="p-5 md:p-6 rounded-2xl bg-[#161b22] border border-white/10 relative overflow-hidden">
            {/* Progress */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${((currentIndex + 1) / quiz.length) * 100}%` }} 
                    className="h-full bg-gradient-to-r from-[#C81D77] to-[#6710C2]"
                />
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-[#C81D77] to-[#6710C2]">
                        {currentIndex + 1}
                    </div>
                    <div>
                        <p className="text-white font-bold text-xs uppercase tracking-tight">Question {currentIndex + 1} of {quiz.length}</p>
                        <p className="text-[10px] text-gray-500">Video Content Assessment</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C81D77]/10 border border-[#C81D77]/20">
                    <HiSparkles size={12} className="text-[#C81D77]" />
                    <span className="text-[10px] font-black text-[#C81D77]">AI POWERED</span>
                </div>
            </div>

            <div className="space-y-6">
                <h4 className="text-lg md:text-xl font-bold text-white leading-snug tracking-tight">
                    {currentQ.question}
                </h4>

                <div className="grid gap-3">
                    {currentQ.options.map((option, idx) => {
                        const isCorrect = isAnswered && idx === currentQ.correctAnswer;
                        const isSelected = selectedOption === idx;
                        const isWrong = isAnswered && isSelected && idx !== currentQ.correctAnswer;

                        return (
                            <motion.button
                                key={idx}
                                disabled={isAnswered}
                                onClick={() => setSelectedOption(idx)}
                                whileTap={{ scale: 0.99 }}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                                    isCorrect ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-50" :
                                    isWrong ? "bg-red-500/10 border-red-500/40 text-red-50" :
                                    isSelected ? "bg-white/5 border-[#C81D77] text-white" : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black ${
                                        isCorrect ? "bg-emerald-500 text-white" :
                                        isWrong ? "bg-red-500 text-white" :
                                        isSelected ? "bg-[#C81D77] text-white" : "bg-white/10 text-gray-500"
                                    }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="text-sm font-medium">{option}</span>
                                </div>
                                {isAnswered && (isCorrect ? <FaCheckCircle className="text-emerald-500" /> : isWrong ? <FaTimesCircle className="text-red-500" /> : null)}
                            </motion.button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {isAnswered && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 mt-2">
                                <div className="flex items-center gap-2 text-[#C81D77] text-[10px] font-black uppercase tracking-widest mb-1.5">
                                    <FaLightbulb /> Why this is correct?
                                </div>
                                <p className="text-gray-300 text-xs leading-relaxed italic">{currentQ.explanation}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pt-2">
                    {!isAnswered ? (
                        <button
                            disabled={selectedOption === null}
                            onClick={handleCheckAnswer}
                            className="w-full py-4 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest disabled:opacity-30 transition-all active:scale-95 cursor-pointer shadow-lg shadow-white/5"
                        >
                            Verify Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                        >
                            {currentIndex === quiz.length - 1 ? "Check Results" : "Continue to Next"} <FaArrowRight />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}