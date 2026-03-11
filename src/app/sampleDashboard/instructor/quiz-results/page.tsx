"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Award, 
  Timer, 
  Search,
  Download,
  Filter,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

interface QuizResult {
  id: number;
  studentName: string;
  email: string;
  score: number;
  totalMarks: number;
  attempts: number;
  finishTime: string;
  status: 'Passed' | 'Failed';
  avatar: string;
  timeTaken?: string;
}

export default function QuizResultsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage
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

  const quizInfo = {
    title: "Information About UI/UX Design Degree",
    course: "UI/UX Design Fundamentals",
    questions: 25,
    duration: "30 Minutes",
    totalMarks: 100,
    passMarks: 60,
    thumbnail: "https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149052117.jpg"
  };

  const resultsData: QuizResult[] = [
    { 
      id: 1, 
      studentName: "Thompson Hicks", 
      email: "thompson.h@email.com",
      score: 75, 
      totalMarks: 100,
      attempts: 4, 
      finishTime: "2025-08-22T09:00:00",
      status: "Passed",
      avatar: "https://i.pravatar.cc/150?u=11",
      timeTaken: "25 min"
    },
    { 
      id: 2, 
      studentName: "Jennifer Tovar", 
      email: "jennifer.t@email.com",
      score: 50, 
      totalMarks: 100,
      attempts: 3, 
      finishTime: "2025-08-10T09:15:00",
      status: "Failed",
      avatar: "https://i.pravatar.cc/150?u=12",
      timeTaken: "30 min"
    },
    { 
      id: 3, 
      studentName: "James Schulte", 
      email: "james.s@email.com",
      score: 85, 
      totalMarks: 100,
      attempts: 2, 
      finishTime: "2025-07-26T14:20:00",
      status: "Passed",
      avatar: "https://i.pravatar.cc/150?u=13",
      timeTaken: "22 min"
    },
    { 
      id: 4, 
      studentName: "Kristy Cardona", 
      email: "kristy.c@email.com",
      score: 68, 
      totalMarks: 100,
      attempts: 2, 
      finishTime: "2025-07-12T11:40:00",
      status: "Passed",
      avatar: "https://i.pravatar.cc/150?u=14",
      timeTaken: "28 min"
    },
    { 
      id: 5, 
      studentName: "William Aragon", 
      email: "william.a@email.com",
      score: 45, 
      totalMarks: 100,
      attempts: 4, 
      finishTime: "2025-07-02T16:30:00",
      status: "Failed",
      avatar: "https://i.pravatar.cc/150?u=15",
      timeTaken: "30 min"
    },
    { 
      id: 6, 
      studentName: "Shirley Lis", 
      email: "shirley.l@email.com",
      score: 92, 
      totalMarks: 100,
      attempts: 1, 
      finishTime: "2025-06-25T08:10:00",
      status: "Passed",
      avatar: "https://i.pravatar.cc/150?u=16",
      timeTaken: "20 min"
    },
    { 
      id: 7, 
      studentName: "Robert Martinez", 
      email: "robert.m@email.com",
      score: 78, 
      totalMarks: 100,
      attempts: 3, 
      finishTime: "2025-06-20T10:30:00",
      status: "Passed",
      avatar: "https://i.pravatar.cc/150?u=17",
      timeTaken: "26 min"
    },
    { 
      id: 8, 
      studentName: "Sarah Johnson", 
      email: "sarah.j@email.com",
      score: 55, 
      totalMarks: 100,
      attempts: 2, 
      finishTime: "2025-06-15T15:45:00",
      status: "Failed",
      avatar: "https://i.pravatar.cc/150?u=18",
      timeTaken: "29 min"
    },
  ];

  // Filter results
  const filteredResults = resultsData.filter(result => {
    const matchesSearch = 
      result.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      filterStatus === 'All Status' || 
      result.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    totalParticipants: resultsData.length,
    passed: resultsData.filter(r => r.status === 'Passed').length,
    failed: resultsData.filter(r => r.status === 'Failed').length,
    averageScore: Math.round(resultsData.reduce((sum, r) => sum + r.score, 0) / resultsData.length),
    averageTime: "25 min"
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen ">
      
      {/* Quiz Info Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300 mb-8">
        <div className="card-body p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Thumbnail */}
            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
              <img 
                src={quizInfo.thumbnail} 
                alt={quizInfo.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{quizInfo.title}</h1>
              <p className="text-sm opacity-60 mb-3">{quizInfo.course}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                <div className="flex items-center gap-2 opacity-70">
                  <span>📝</span>
                  <span>{quizInfo.questions} Questions</span>
                </div>
                <div className="flex items-center gap-2 opacity-70">
                  <span>🕒</span>
                  <span>{quizInfo.duration}</span>
                </div>
                <div className="flex items-center gap-2 opacity-70">
                  <span>📊</span>
                  <span>Pass: {quizInfo.passMarks}/{quizInfo.totalMarks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div 
          className="card bg-base-100 shadow-lg border"
          style={{ borderColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff' }}
        >
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                  Total Participants
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#832388' }}>
                  {stats.totalParticipants}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff' }}
              >
                <Users className="w-6 h-6" style={{ color: '#832388' }} />
              </div>
            </div>
          </div>
        </div>

        <div 
          className="card bg-base-100 shadow-lg border"
          style={{ borderColor: theme === 'dark' ? '#0f2520' : '#d1fae5' }}
        >
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                  Passed
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#00C48C' }}>
                  {stats.passed}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#0f2520' : '#d1fae5' }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: '#00C48C' }} />
              </div>
            </div>
          </div>
        </div>

        <div 
          className="card bg-base-100 shadow-lg border"
          style={{ borderColor: theme === 'dark' ? '#2a1520' : '#fce7f3' }}
        >
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                  Failed
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#FF0F7B' }}>
                  {stats.failed}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1520' : '#fce7f3' }}
              >
                <XCircle className="w-6 h-6" style={{ color: '#FF0F7B' }} />
              </div>
            </div>
          </div>
        </div>

        <div 
          className="card bg-base-100 shadow-lg border"
          style={{ borderColor: theme === 'dark' ? '#2a1f15' : '#fef3c7' }}
        >
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                  Average Score
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#F89B29' }}>
                  {stats.averageScore}%
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1f15' : '#fef3c7' }}
              >
                <Award className="w-6 h-6" style={{ color: '#F89B29' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6 md:p-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-bold">Student Results</h2>
            <button 
              className="btn btn-sm gap-2 cursor-pointer"
              style={{ backgroundColor: '#832388', color: 'white', border: 'none' }}
            >
              <Download size={16} />
              Export Results
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input 
                type="text" 
                placeholder="Search by student name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-11 bg-base-100"
              />
            </div>
            
            {/* Status Filter */}
            <select 
              className="select select-bordered bg-base-100 cursor-pointer min-w-[180px]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All Status</option>
              <option>Passed</option>
              <option>Failed</option>
            </select>
          </div>

          {/* Table */}
          {filteredResults.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">No Results Found</h3>
              <p className="opacity-60 mb-6">Try adjusting your search or filters</p>
              <button 
                className="btn gap-2 cursor-pointer"
                style={{ backgroundColor: '#832388', color: 'white', border: 'none' }}
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('All Status');
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Student</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Score</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Percentage</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Attempts</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Time Taken</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Status</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Finish Time</th>
                    <th className="text-right text-xs font-bold uppercase tracking-wider opacity-60">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result) => {
                    const percentage = Math.round((result.score / result.totalMarks) * 100);
                    return (
                      <tr key={result.id} className="hover">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full">
                                <img src={result.avatar} alt={result.studentName} />
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold hover:text-[#832388] transition-colors cursor-pointer">
                                {result.studentName}
                              </h4>
                              <p className="text-xs opacity-60">{result.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="text-sm font-bold">
                            {result.score}/{result.totalMarks}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <TrendingUp size={14} className="opacity-60" />
                            <span className="text-sm font-bold" style={{ 
                              color: percentage >= 60 ? '#00C48C' : '#FF0F7B'
                            }}>
                              {percentage}%
                            </span>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="text-sm font-semibold opacity-70">
                            {result.attempts}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Timer size={14} className="opacity-60" />
                            <span className="text-sm font-semibold opacity-70">
                              {result.timeTaken}
                            </span>
                          </div>
                        </td>
                        <td className="text-center">
                          {result.status === 'Passed' ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                              style={{ 
                                backgroundColor: theme === 'dark' ? '#0f2520' : '#d1fae5',
                                color: '#00C48C'
                              }}
                            >
                              <CheckCircle size={12} />
                              Passed
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                              style={{ 
                                backgroundColor: theme === 'dark' ? '#2a1520' : '#fce7f3',
                                color: '#FF0F7B'
                              }}
                            >
                              <XCircle size={12} />
                              Failed
                            </div>
                          )}
                        </td>
                        <td className="text-center">
                          <span className="text-xs opacity-60 font-semibold">
                            {formatDate(result.finishTime)}
                          </span>
                        </td>
                        <td>
                          <div className="flex justify-end">
                            <button 
                              className="btn btn-ghost btn-sm cursor-pointer"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredResults.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-base-300">
              <p className="text-sm opacity-60">
                Showing {filteredResults.length} of {resultsData.length} results
              </p>
              <div className="join">
                <button className="join-item btn btn-sm cursor-pointer">«</button>
                <button className="join-item btn btn-sm btn-active cursor-pointer">1</button>
                <button className="join-item btn btn-sm cursor-pointer">2</button>
                <button className="join-item btn btn-sm cursor-pointer">»</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}