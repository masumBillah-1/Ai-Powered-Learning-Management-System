"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, FileQuestion, Clock } from 'lucide-react';

interface QuizAttempt {
  id: number;
  title: string;
  questions: string;
  slug: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const quizData: Record<string, { title: string; icon: string; totalTime: number; questions: Question[] }> = {
  "ui-ux-design-degree": {
    title: "Information About UI/UX Design Degree",
    icon: "🎨",
    totalTime: 180,
    questions: [
      { id: 1, question: "What does UI stand for?", options: ["User Intention", "User Interface", "Universal Interaction", "Usability Information"], correct: 1 },
      { id: 2, question: "What does UX stand for?", options: ["User Experience", "Universal Exchange", "User Extension", "Usability Expert"], correct: 0 },
      { id: 3, question: "Which tool is most popular for UI/UX design?", options: ["Photoshop", "Figma", "MS Paint", "Notepad"], correct: 1 },
      { id: 4, question: "What is a wireframe?", options: ["A finished design", "A low-fidelity layout sketch", "A color palette", "A font collection"], correct: 1 },
      { id: 5, question: "What is a prototype?", options: ["Final code", "An interactive model of a design", "A database", "A server"], correct: 1 },
    ],
  },
  "javascript-express": {
    title: "Learn JavaScript and Express to become a Expert",
    icon: "⚡",
    totalTime: 600,
    questions: [
      { id: 1, question: "What does 'const' do in JavaScript?", options: ["Declares a variable that can change", "Declares a constant variable", "Creates a function", "Imports a module"], correct: 1 },
      { id: 2, question: "Express.js is built on top of which platform?", options: ["Django", "Node.js", "PHP", "Ruby"], correct: 1 },
      { id: 3, question: "What is middleware in Express?", options: ["A database", "A function that runs between request and response", "A frontend library", "A CSS framework"], correct: 1 },
      { id: 4, question: "Which method handles GET requests in Express?", options: ["app.post()", "app.get()", "app.put()", "app.delete()"], correct: 1 },
      { id: 5, question: "What does async/await do?", options: ["Adds CSS", "Handles asynchronous operations", "Deletes data", "Renders HTML"], correct: 1 },
      { id: 6, question: "What is npm?", options: ["Node Package Manager", "New Program Module", "Network Protocol Manager", "None"], correct: 0 },
      { id: 7, question: "How do you export a module in Node.js?", options: ["export default", "module.exports", "exports.default", "send.module"], correct: 1 },
      { id: 8, question: "What is a REST API?", options: ["A sleep API", "An architectural style for APIs", "A database", "A CSS tool"], correct: 1 },
      { id: 9, question: "What does JSON stand for?", options: ["Java Source Object Notation", "JavaScript Object Notation", "Java Standard Output Notation", "None"], correct: 1 },
      { id: 10, question: "Which HTTP status code means 'Not Found'?", options: ["200", "401", "404", "500"], correct: 2 },
    ],
  },
  "python-programming": {
    title: "Introduction to Python Programming",
    icon: "🐍",
    totalTime: 480,
    questions: [
      { id: 1, question: "What is Python?", options: ["A snake", "A high-level programming language", "A database", "An OS"], correct: 1 },
      { id: 2, question: "How do you print in Python?", options: ["console.log()", "print()", "echo()", "printf()"], correct: 1 },
      { id: 3, question: "What symbol is used for comments in Python?", options: ["//", "/*", "#", "--"], correct: 2 },
      { id: 4, question: "What is a list in Python?", options: ["A dictionary", "An ordered mutable collection", "A string", "A tuple"], correct: 1 },
      { id: 5, question: "Which keyword is used to define a function?", options: ["func", "def", "function", "define"], correct: 1 },
      { id: 6, question: "What does len() do?", options: ["Adds length", "Returns the length of an object", "Deletes an item", "Sorts a list"], correct: 1 },
      { id: 7, question: "What is a tuple?", options: ["A mutable list", "An immutable sequence", "A dictionary", "A set"], correct: 1 },
      { id: 8, question: "How do you import a module?", options: ["include module", "import module", "require module", "use module"], correct: 1 },
    ],
  },
  "html5-css3": {
    title: "Build Responsive Websites with HTML5 and CSS3",
    icon: "🌐",
    totalTime: 300,
    questions: [
      { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink Text Method Language", "None"], correct: 0 },
      { id: 2, question: "Which tag is used for headings?", options: ["<p>", "<head>", "<h1>", "<title>"], correct: 2 },
      { id: 3, question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "None"], correct: 1 },
      { id: 4, question: "Which property changes text color in CSS?", options: ["font-color", "text-color", "color", "background-color"], correct: 2 },
      { id: 5, question: "What is Flexbox?", options: ["A JavaScript library", "A CSS layout model", "An HTML tag", "A database"], correct: 1 },
    ],
  },
  "photoshop-design-degree": {
    title: "Information About Photoshop Design Degree",
    icon: "🖼️",
    totalTime: 600,
    questions: [
      { id: 1, question: "What is Photoshop used for?", options: ["Coding", "Image editing and design", "Video calls", "Spreadsheets"], correct: 1 },
      { id: 2, question: "What does PSD stand for?", options: ["Photoshop Design", "Photoshop Document", "Photo Standard Definition", "None"], correct: 1 },
      { id: 3, question: "What are layers in Photoshop?", options: ["Filters", "Stacked transparent sheets", "Brushes", "Colors"], correct: 1 },
      { id: 4, question: "What is the magic wand tool used for?", options: ["Drawing", "Selecting areas by color", "Cropping", "Zooming"], correct: 1 },
      { id: 5, question: "What does DPI stand for?", options: ["Dots Per Image", "Dots Per Inch", "Design Per Inch", "None"], correct: 1 },
      { id: 6, question: "What is masking in Photoshop?", options: ["Hiding parts of a layer", "Adding text", "Changing color", "Resizing"], correct: 0 },
      { id: 7, question: "What format supports transparency in Photoshop?", options: ["JPEG", "BMP", "PNG", "GIF"], correct: 2 },
      { id: 8, question: "What is the shortcut to undo in Photoshop?", options: ["Ctrl+Z", "Ctrl+Y", "Ctrl+X", "Ctrl+S"], correct: 0 },
      { id: 9, question: "What is a smart object?", options: ["An AI feature", "A layer that preserves source content", "A brush", "A filter"], correct: 1 },
      { id: 10, question: "What does RGB stand for?", options: ["Really Good Blue", "Red Green Blue", "Raw Graphics Blend", "None"], correct: 1 },
    ],
  },
  "csharp-visual-studio": {
    title: "C# Developers Double Your Coding with Visual Studio",
    icon: "💻",
    totalTime: 420,
    questions: [
      { id: 1, question: "What is C#?", options: ["A music note", "A programming language by Microsoft", "A database", "An OS"], correct: 1 },
      { id: 2, question: "What platform does C# primarily run on?", options: ["JVM", ".NET", "Node.js", "PHP"], correct: 1 },
      { id: 3, question: "What is Visual Studio?", options: ["A photo editor", "An IDE for development", "A browser", "A database tool"], correct: 1 },
      { id: 4, question: "What does 'var' do in C#?", options: ["Declares a constant", "Implicitly typed local variable", "Creates a class", "None"], correct: 1 },
      { id: 5, question: "What is a namespace in C#?", options: ["A variable", "A way to organize code", "A loop", "A method"], correct: 1 },
      { id: 6, question: "What is inheritance in C#?", options: ["A loop type", "A class deriving from another class", "A data type", "An interface"], correct: 1 },
      { id: 7, question: "What does LINQ stand for?", options: ["Language Integrated Query", "Linear Input Queue", "Linked Interface Query", "None"], correct: 0 },
    ],
  },
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `00:${m}:${s}`;
};

const quizAttempts: QuizAttempt[] = [
  { id: 1, title: "Information About UI/UX Design Degree",               questions: "05", slug: "ui-ux-design-degree" },
  { id: 2, title: "Learn JavaScript and Express to become a Expert",     questions: "10", slug: "javascript-express" },
  { id: 3, title: "Introduction to Python Programming",                  questions: "08", slug: "python-programming" },
  { id: 4, title: "Build Responsive Websites with HTML5 and CSS3",       questions: "05", slug: "html5-css3" },
  { id: 5, title: "Information About Photoshop Design Degree",           questions: "10", slug: "photoshop-design-degree" },
  { id: 6, title: "C# Developers Double Your Coding with Visual Studio", questions: "07", slug: "csharp-visual-studio" },
];

// ─────────────────────────────────────────────
// Quiz Questions View
// ─────────────────────────────────────────────
function QuizQuestionsView({ slug, onBack }: { slug: string; onBack: () => void }) {
  const quiz = quizData[slug];
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz?.totalTime || 180);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished || !quiz) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); setFinished(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished, quiz]);

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz not found</h2>
          <button onClick={onBack} className="btn" style={{ backgroundColor: '#FF0F7B', color: '#fff', border: 'none' }}>Go Back</button>
        </div>
      </div>
    );
  }

  const totalQ = quiz.questions.length;
  const currentQuestion = quiz.questions[currentQ];

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (currentQ + 1 >= totalQ) {
      setFinished(true);
    } else {
      setCurrentQ(prev => prev + 1);
    }
  };

  // Results screen
  if (finished) {
    const score = answers.filter((a, i) => a === quiz.questions[i]?.correct).length;
    const percent = Math.round((score / totalQ) * 100);
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-base-100 border border-base-300 rounded-3xl p-10 shadow-lg">
            <div className="text-6xl mb-4">{percent >= 60 ? "🎉" : "😔"}</div>
            <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
            <p className="opacity-60 mb-6">{quiz.title}</p>
            <div className="text-5xl font-black mb-2" style={{ color: percent >= 60 ? '#22c55e' : '#FF0F7B' }}>
              {score}/{totalQ}
            </div>
            <p className="text-sm opacity-50 mb-8">You scored {percent}%</p>
            <div className="flex gap-3 justify-center">
              <button onClick={onBack} className="btn btn-outline rounded-full px-6">Back to Quizzes</button>
              <button
                onClick={() => { setCurrentQ(0); setSelected(null); setAnswers([]); setTimeLeft(quiz.totalTime); setFinished(false); }}
                className="btn rounded-full px-6 text-white border-0"
                style={{ backgroundColor: '#FF0F7B' }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Quiz Attempts</h1>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden shadow-sm">

          {/* Title Bar */}
          <div className="flex items-center justify-between px-5 py-4 bg-base-200 border-b border-base-300">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                {quiz.icon}
              </div>
              <h2 className="text-[15px] font-bold leading-snug">{quiz.title}</h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold opacity-70 flex-shrink-0">
              <Clock size={15} />
              <span>
                <span style={{ color: timeLeft < 30 ? '#FF0F7B' : undefined }}>{formatTime(timeLeft)}</span>
                {" / "}{formatTime(quiz.totalTime)}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="px-5 pt-5 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">Quiz Progress</span>
              <span className="text-sm opacity-50">Question {currentQ + 1} out of {totalQ}</span>
            </div>
            <div className="w-full h-2 bg-base-300 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentQ + 1) / totalQ) * 100}%`, backgroundColor: '#22c55e' }}
              />
            </div>
          </div>

          {/* Question + Options */}
          <div className="px-5 pt-5 pb-6">
            <h3 className="text-[16px] font-bold mb-5">{currentQuestion.question}</h3>
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((opt, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer" onClick={() => setSelected(i)}>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      borderColor: selected === i ? '#FF0F7B' : undefined,
                      backgroundColor: selected === i ? '#FF0F7B' : undefined,
                    }}
                  >
                    {selected === i && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span
                    className="text-[14px] transition-colors duration-200"
                    style={{ color: selected === i ? '#FF0F7B' : undefined, fontWeight: selected === i ? 600 : undefined }}
                  >
                    {opt}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleNext}
                disabled={selected === null}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#FF0F7B' }}
              >
                {currentQ + 1 >= totalQ ? "Submit" : "Next"}
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Export — Quiz List
// ─────────────────────────────────────────────
const QuizAttemptsPage = () => {
  const [theme, setTheme] = useState("light");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem("theme") || "light";
      if (currentTheme !== theme) {
        setTheme(currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [theme]);

  if (activeSlug) {
    return <QuizQuestionsView slug={activeSlug} onBack={() => setActiveSlug(null)} />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Quiz Attempts</h1>
          <div className="badge badge-outline text-xs font-semibold px-3 py-3">
            {quizAttempts.length} Total
          </div>
        </div>

        {/* Quiz List */}
        <div className="flex flex-col gap-3">
          {quizAttempts.map((quiz, index) => (
            <div
              key={quiz.id}
              onClick={() => setActiveSlug(quiz.slug)}
              className="group flex items-center justify-between bg-base-100 border border-base-300 hover:border-[#FF0F7B] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: '#FF0F7B15' }}
                >
                  <FileQuestion size={22} style={{ color: '#FF0F7B' }} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[15px] font-bold leading-snug group-hover:text-[#FF0F7B] transition-colors duration-200">
                    {quiz.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold opacity-50">Number of Questions :</span>
                    <span className="badge badge-sm font-bold text-white border-0" style={{ backgroundColor: '#FF0F7B' }}>
                      {quiz.questions}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 bg-base-200 group-hover:text-white"
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FF0F7B')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
              >
                <ArrowRight size={18} strokeWidth={2.5} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-base-300 pt-6">
          <p className="text-xs font-semibold opacity-50">
            Showing {quizAttempts.length} of {quizAttempts.length} results
          </p>
          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-ghost border border-base-300 cursor-pointer">
              <ChevronLeft size={18} />
            </button>
            <button className="btn btn-sm btn-circle text-white font-bold shadow-md border-0 cursor-pointer" style={{ backgroundColor: '#FF0F7B' }}>
              1
            </button>
            {[2, 3].map(num => (
              <button key={num} className="btn btn-sm btn-circle btn-ghost cursor-pointer">{num}</button>
            ))}
            <button className="btn btn-sm btn-ghost border border-base-300 cursor-pointer">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizAttemptsPage;