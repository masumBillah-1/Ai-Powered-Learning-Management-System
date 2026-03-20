

"use client";


import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, FileQuestion, Clock, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface QuizAttempt {
  id: number;
  title: string;
  questions: QuizQuestion[];
  totalTime: number; // seconds
}


interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}


type PageView = 'list' | 'quiz' | 'result';


const quizData: QuizAttempt[] = [
  {
    id: 1,
    title: "Information About UI/UX Design Degree",
    totalTime: 180,
    questions: [
      { id: 1, question: "What does UI stand for?", options: ["User Intention", "User Interface", "Universal Interaction", "Usability Information"], correct: 1 },
      { id: 2, question: "What does UX stand for?", options: ["User Experience", "Universal Exchange", "User Expectation", "Unified Experience"], correct: 0 },
      { id: 3, question: "Which tool is commonly used for UI design?", options: ["VS Code", "Figma", "GitHub", "Postman"], correct: 1 },
      { id: 4, question: "What is wireframing?", options: ["Final design", "Basic layout sketch", "Color scheme", "Font selection"], correct: 1 },
      { id: 5, question: "What is a prototype?", options: ["A bug report", "A live product", "An interactive mockup", "A design system"], correct: 2 },
    ]
  },
  {
    id: 2,
    title: "Learn JavaScript and Express to become a Expert",
    totalTime: 300,
    questions: [
      { id: 1, question: "What is JavaScript?", options: ["A markup language", "A styling language", "A programming language", "A database"], correct: 2 },
      { id: 2, question: "What does 'const' do in JavaScript?", options: ["Declares a variable", "Declares a constant", "Creates a function", "Imports a module"], correct: 1 },
      { id: 3, question: "Express.js is a framework for?", options: ["Frontend", "Mobile", "Node.js backend", "Database"], correct: 2 },
      { id: 4, question: "What is an API?", options: ["A database", "Application Programming Interface", "A server", "A framework"], correct: 1 },
      { id: 5, question: "What does 'async/await' do?", options: ["Sync code", "Handle promises", "Create loops", "Define classes"], correct: 1 },
      { id: 6, question: "What is middleware in Express?", options: ["A database layer", "Functions that execute during request", "A frontend component", "A testing tool"], correct: 1 },
      { id: 7, question: "What is npm?", options: ["A language", "Node Package Manager", "A framework", "A database"], correct: 1 },
      { id: 8, question: "What is JSON?", options: ["Java Source Object Notation", "JavaScript Object Notation", "A database", "A framework"], correct: 1 },
      { id: 9, question: "What does REST stand for?", options: ["Remote Execution State Transfer", "Representational State Transfer", "Remote State Transfer", "Resource State Transfer"], correct: 1 },
      { id: 10, question: "What is a callback function?", options: ["A function called at start", "A function passed as argument", "A recursive function", "An async function"], correct: 1 },
    ]
  },
  {
    id: 3,
    title: "Introduction to Python Programming",
    totalTime: 240,
    questions: [
      { id: 1, question: "What is Python?", options: ["A snake", "A markup language", "A programming language", "A database"], correct: 2 },
      { id: 2, question: "How do you print in Python?", options: ["echo()", "console.log()", "print()", "write()"], correct: 2 },
      { id: 3, question: "What is a list in Python?", options: ["A dictionary", "An ordered collection", "A function", "A class"], correct: 1 },
      { id: 4, question: "What does 'def' keyword do?", options: ["Defines a variable", "Defines a function", "Imports a module", "Creates a class"], correct: 1 },
      { id: 5, question: "What is pip?", options: ["Python Package Installer", "Python Import Protocol", "Python Interface Program", "Python Integration Platform"], correct: 0 },
      { id: 6, question: "What is indentation in Python?", options: ["Optional styling", "Required code structure", "A comment style", "A variable type"], correct: 1 },
      { id: 7, question: "What is a tuple?", options: ["Mutable collection", "Immutable ordered collection", "A dictionary", "A function"], correct: 1 },
      { id: 8, question: "What does 'import' do?", options: ["Exports code", "Loads a module", "Creates a file", "Deletes a module"], correct: 1 },
    ]
  },
  {
    id: 4,
    title: "Build Responsive Websites with HTML5 and CSS3",
    totalTime: 180,
    questions: [
      { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correct: 0 },
      { id: 2, question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], correct: 1 },
      { id: 3, question: "What is Flexbox used for?", options: ["3D layouts", "1D layout model", "Database queries", "JavaScript functions"], correct: 1 },
      { id: 4, question: "What is a media query?", options: ["A database query", "CSS technique for responsive design", "An HTML tag", "A JavaScript method"], correct: 1 },
      { id: 5, question: "What does 'viewport' mean in responsive design?", options: ["The server", "The visible area of a web page", "The database", "The stylesheet"], correct: 1 },
    ]
  },
  {
    id: 5,
    title: "Information About Photoshop Design Degree",
    totalTime: 300,
    questions: [
      { id: 1, question: "What is Photoshop primarily used for?", options: ["Video editing", "Image editing", "3D modeling", "Audio editing"], correct: 1 },
      { id: 2, question: "What are layers in Photoshop?", options: ["File formats", "Separate levels of an image", "Filters", "Brushes"], correct: 1 },
      { id: 3, question: "What is the magic wand tool?", options: ["A brush tool", "A selection tool", "A filter", "A crop tool"], correct: 1 },
      { id: 4, question: "What is PSD format?", options: ["PNG format", "Photoshop Document", "PDF format", "Vector format"], correct: 1 },
      { id: 5, question: "What does 'flatten image' do?", options: ["Adds layers", "Merges all layers", "Deletes the image", "Resizes image"], correct: 1 },
      { id: 6, question: "What is a mask in Photoshop?", options: ["A filter", "Hides parts of a layer", "A brush type", "A color tool"], correct: 1 },
      { id: 7, question: "What is DPI?", options: ["Digital Print Interface", "Dots Per Inch", "Design Per Image", "Display Pixel Index"], correct: 1 },
      { id: 8, question: "What is the clone stamp tool?", options: ["A text tool", "Copies part of an image", "A crop tool", "A filter"], correct: 1 },
      { id: 9, question: "What is a smart object?", options: ["An animation", "A layer that preserves source data", "A filter", "A brush"], correct: 1 },
      { id: 10, question: "What does 'crop' do?", options: ["Adds borders", "Removes outer parts of image", "Resizes canvas only", "Adds filters"], correct: 1 },
    ]
  },
  {
    id: 6,
    title: "C# Developers Double Your Coding with Visual Studio",
    totalTime: 210,
    questions: [
      { id: 1, question: "What is C#?", options: ["A markup language", "A programming language", "A database", "A framework"], correct: 1 },
      { id: 2, question: "What company developed C#?", options: ["Google", "Apple", "Microsoft", "Meta"], correct: 2 },
      { id: 3, question: "What is a namespace in C#?", options: ["A variable", "A container for classes", "A function", "A loop"], correct: 1 },
      { id: 4, question: "What does 'public' mean in C#?", options: ["Private access", "Accessible from anywhere", "Only in same class", "Only in same file"], correct: 1 },
      { id: 5, question: "What is Visual Studio?", options: ["A design tool", "An IDE for development", "A database tool", "A browser"], correct: 1 },
      { id: 6, question: "What is a class in C#?", options: ["A variable type", "A blueprint for objects", "A function", "A loop"], correct: 1 },
      { id: 7, question: "What does 'new' keyword do in C#?", options: ["Deletes an object", "Creates an instance", "Imports a library", "Defines a method"], correct: 1 },
    ]
  },
];


const QuizPage = () => {
  const router = useRouter();
  const [view, setView] = useState<PageView>('list');
  const [selectedQuiz, setSelectedQuiz] = useState<QuizAttempt | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);


  // Timer
  useEffect(() => {
    if (view !== 'quiz') return;
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [view, timeLeft]);


  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };


  const startQuiz = (quiz: QuizAttempt) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswers(new Array(quiz.questions.length).fill(null));
    setTimeLeft(quiz.totalTime);
    setView('quiz');
  };


  const handleNext = () => {
    if (!selectedQuiz) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption;
    setAnswers(newAnswers);
    setSelectedOption(null);


    if (currentQuestion + 1 < selectedQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinish(newAnswers);
    }
  };


  const handleFinish = (finalAnswers?: (number | null)[]) => {
    if (!selectedQuiz) return;
    const ans = finalAnswers || answers;
    const correct = ans.filter((a, i) => a === selectedQuiz.questions[i].correct).length;
    setScore(correct);
    setView('result');
  };


  const percentage = selectedQuiz ? Math.round((score / selectedQuiz.questions.length) * 100) : 0;
  const passed = percentage >= 60;


  // ── LIST VIEW ──
  if (view === 'list') {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">My Quiz Attempts</h1>
            <div className="badge badge-outline text-xs font-semibold px-3 py-3">
              {quizData.length} Total
            </div>
          </div>


          <div className="flex flex-col gap-4">
            {quizData.map((quiz, index) => (
              <div
                key={quiz.id}
                onClick={() => startQuiz(quiz)}
                className="group flex items-center justify-between bg-base-100 border border-base-300 hover:border-[#FF0F7B] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: '#FF0F7B15' }}>
                    <FileQuestion size={22} style={{ color: '#FF0F7B' }} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[15px] font-bold leading-snug group-hover:text-[#FF0F7B] transition-colors duration-200">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold opacity-50">Questions:</span>
                        <span className="badge badge-sm font-bold text-white border-0" style={{ backgroundColor: '#FF0F7B' }}>
                          {quiz.questions.length.toString().padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs opacity-50">
                        <Clock size={12} />
                        <span className="font-semibold">{formatTime(quiz.totalTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-base-200 group-hover:text-white transition-all duration-300 group-hover:translate-x-1"
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FF0F7B')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                >
                  <ArrowRight size={18} strokeWidth={2.5} />
                </div>
              </div>
            ))}
          </div>


          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-base-300 pt-6">
            <p className="text-xs font-semibold opacity-50">Showing {quizData.length} of {quizData.length} results</p>
            <div className="flex items-center gap-2">
              <button className="btn btn-sm btn-ghost border border-base-300"><ChevronLeft size={18} /></button>
              <button className="btn btn-sm btn-circle text-white font-bold shadow-md border-0" style={{ backgroundColor: '#FF0F7B' }}>1</button>
              {[2, 3].map(n => <button key={n} className="btn btn-sm btn-circle btn-ghost">{n}</button>)}
              <button className="btn btn-sm btn-ghost border border-base-300"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ── QUIZ VIEW ──
  if (view === 'quiz' && selectedQuiz) {
    const q = selectedQuiz.questions[currentQuestion];
    const progress = ((currentQuestion) / selectedQuiz.questions.length) * 100;
    const isLowTime = timeLeft <= 30;


    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-3xl mx-auto">


          {/* Header */}
          <div className="bg-base-100 border border-base-300 rounded-2xl p-5 mb-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FF0F7B15' }}>
                <FileQuestion size={20} style={{ color: '#FF0F7B' }} />
              </div>
              <div>
                <h2 className="text-[15px] font-bold leading-snug line-clamp-1">{selectedQuiz.title}</h2>
                <p className="text-xs opacity-50 font-semibold mt-0.5">Question {currentQuestion + 1} of {selectedQuiz.questions.length}</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${isLowTime ? 'bg-red-100 text-red-500' : 'bg-base-200'}`}>
              <Clock size={15} />
              {formatTime(timeLeft)}
            </div>
          </div>


          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-semibold opacity-50 mb-2">
              <span>Quiz Progress</span>
              <span>Question {currentQuestion + 1} out of {selectedQuiz.questions.length}</span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2.5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #832388, #FF0F7B)' }} />
            </div>
          </div>


          {/* Question */}
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-bold mb-6">{q.question}</h3>
            <div className="flex flex-col gap-3">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer w-full
                    ${selectedOption === i
                      ? 'border-[#FF0F7B] bg-[#FF0F7B10]'
                      : 'border-base-300 hover:border-[#FF0F7B80] bg-base-100'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${selectedOption === i ? 'border-[#FF0F7B]' : 'border-base-300'}`}>
                    {selectedOption === i && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FF0F7B' }} />
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${selectedOption === i ? 'text-[#FF0F7B]' : ''}`}>{option}</span>
                </button>
              ))}
            </div>
          </div>


          {/* Next Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setView('list')}
              className="btn btn-ghost btn-sm gap-2 opacity-60 hover:opacity-100"
            >
              <ChevronLeft size={16} /> Back to List
            </button>
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="btn btn-md px-8 text-white border-0 gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#FF0F7B' }}
            >
              {currentQuestion + 1 === selectedQuiz.questions.length ? 'Submit Quiz' : 'Next'}
              <ChevronRight size={16} />
            </button>
          </div>


        </div>
      </div>
    );
  }


  // ── RESULT VIEW ──
  if (view === 'result' && selectedQuiz) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-base-100 border border-base-300 rounded-2xl p-8 shadow-sm text-center">


            {/* Circle Progress */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="opacity-10" />
                  <circle cx="60" cy="60" r="50" fill="none"
                    stroke={passed ? '#00C48C' : '#FF0F7B'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - percentage / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: passed ? '#00C48C' : '#FF0F7B' }}>{percentage}%</span>
                </div>
              </div>
            </div>


            <p className="text-sm font-semibold opacity-50 mb-4">Pass Score : 60%</p>


            {passed ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy size={22} style={{ color: '#00C48C' }} />
                  <h2 className="text-xl font-bold">Congratulations! You Passed</h2>
                </div>
                <p className="text-sm opacity-60 mb-6">You've successfully passed the quiz. Keep up the great work!</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <XCircle size={22} style={{ color: '#FF0F7B' }} />
                  <h2 className="text-xl font-bold">Better Luck Next Time!</h2>
                </div>
                <p className="text-sm opacity-60 mb-6">You didn't pass this time. Review the material and try again!</p>
              </>
            )}


            {/* Score Detail */}
            <div className="flex justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <CheckCircle size={16} style={{ color: '#00C48C' }} />
                  <span className="text-lg font-bold">{score}</span>
                </div>
                <p className="text-xs opacity-50 font-semibold">Correct</p>
              </div>
              <div className="w-px bg-base-300" />
              <div className="text-center">
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <XCircle size={16} style={{ color: '#FF0F7B' }} />
                  <span className="text-lg font-bold">{selectedQuiz.questions.length - score}</span>
                </div>
                <p className="text-xs opacity-50 font-semibold">Wrong</p>
              </div>
              <div className="w-px bg-base-300" />
              <div className="text-center">
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <FileQuestion size={16} style={{ color: '#832388' }} />
                  <span className="text-lg font-bold">{selectedQuiz.questions.length}</span>
                </div>
                <p className="text-xs opacity-50 font-semibold">Total</p>
              </div>
            </div>


            <div className="flex gap-3 justify-center">
              <button
                onClick={() => startQuiz(selectedQuiz)}
                className="btn btn-md px-6 border-0 gap-2 hover:opacity-90"
                style={{ backgroundColor: '#83238820', color: '#832388' }}
              >
                <RotateCcw size={16} /> Retry Quiz
              </button>
              <button
                onClick={() => setView('list')}
                className="btn btn-md px-6 text-white border-0 gap-2 hover:opacity-90"
                style={{ backgroundColor: '#FF0F7B' }}
              >
                <ChevronLeft size={16} /> Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return null;
};


export default QuizPage;

