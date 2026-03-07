"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Upload, 
  Download,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  dueTime: string;
  totalMarks: number;
  description: string;
  status: 'Pending' | 'Submitted' | 'Graded';
  score?: number;
  submittedDate?: string;
  attachments?: number;
}

export default function StudentAssignmentsPage() {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Submitted' | 'Graded'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');
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

  const assignments: Assignment[] = [
    {
      id: 1,
      title: 'UI/UX Design Principles Assignment',
      course: 'UI/UX Design Degree',
      dueDate: '2024-03-15',
      dueTime: '11:59 PM',
      totalMarks: 100,
      description: 'Create a complete user interface design for a mobile banking application',
      status: 'Pending',
      attachments: 3
    },
    {
      id: 2,
      title: 'WordPress Theme Development',
      course: 'Wordpress for Beginners',
      dueDate: '2024-03-18',
      dueTime: '11:59 PM',
      totalMarks: 50,
      description: 'Develop a custom WordPress theme from scratch',
      status: 'Pending',
      attachments: 2
    },
    {
      id: 3,
      title: 'Responsive Website Project',
      course: 'Build Responsive Websites',
      dueDate: '2024-03-10',
      dueTime: '11:59 PM',
      totalMarks: 100,
      description: 'Build a fully responsive portfolio website using HTML5 and CSS3',
      status: 'Submitted',
      submittedDate: '2024-03-09',
      attachments: 5
    },
    {
      id: 4,
      title: 'JavaScript DOM Manipulation',
      course: 'Learn JavaScript',
      dueDate: '2024-03-20',
      dueTime: '11:59 PM',
      totalMarks: 75,
      description: 'Create interactive web components using vanilla JavaScript',
      status: 'Pending',
      attachments: 1
    },
    {
      id: 5,
      title: 'Python Data Structures',
      course: 'Introduction to Python',
      dueDate: '2024-03-05',
      dueTime: '11:59 PM',
      totalMarks: 100,
      description: 'Implement various data structures in Python',
      status: 'Graded',
      score: 85,
      submittedDate: '2024-03-04',
      attachments: 2
    },
    {
      id: 6,
      title: 'Sketch Design Project',
      course: 'Sketch from A to Z',
      dueDate: '2024-03-01',
      dueTime: '11:59 PM',
      totalMarks: 50,
      description: 'Design a complete mobile app interface in Sketch',
      status: 'Graded',
      score: 92,
      submittedDate: '2024-02-28',
      attachments: 4
    },
    {
      id: 7,
      title: 'React Component Library',
      course: 'Advanced React',
      dueDate: '2024-03-12',
      dueTime: '11:59 PM',
      totalMarks: 80,
      description: 'Build a reusable component library with React and TypeScript',
      status: 'Submitted',
      submittedDate: '2024-03-11',
      attachments: 6
    },
  ];

  // Filter assignments based on active tab
  const filteredAssignments = assignments.filter(a => a.status === activeTab);

  // Count assignments by status
  const counts = {
    Pending: assignments.filter(a => a.status === 'Pending').length,
    Submitted: assignments.filter(a => a.status === 'Submitted').length,
    Graded: assignments.filter(a => a.status === 'Graded').length,
  };

  const tabs = [
    { name: 'Pending' as const, count: counts.Pending, color: '#FF0F7B' },
    { name: 'Submitted' as const, count: counts.Submitted, color: '#F89B29' },
    { name: 'Graded' as const, count: counts.Graded, color: '#00C48C' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return '#FF0F7B';
      case 'Submitted': return '#F89B29';
      case 'Graded': return '#00C48C';
      default: return '#6b7280';
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Assignments</h1>
        <p className="opacity-60">Manage and track your course assignments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wide opacity-60 mb-1">
                  Pending
                </p>
                <h2 className="text-3xl font-bold mb-1">{counts.Pending}</h2>
                <p className="text-xs opacity-60">Assignments due</p>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: theme === 'dark' ? '#2a1520' : '#fce7f3'
                }}
              >
                <AlertCircle className="w-6 h-6" style={{ color: '#FF0F7B' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wide opacity-60 mb-1">
                  Submitted
                </p>
                <h2 className="text-3xl font-bold mb-1">{counts.Submitted}</h2>
                <p className="text-xs opacity-60">Under review</p>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: theme === 'dark' ? '#2a1f15' : '#fef3c7'
                }}
              >
                <Clock className="w-6 h-6" style={{ color: '#F89B29' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wide opacity-60 mb-1">
                  Graded
                </p>
                <h2 className="text-3xl font-bold mb-1">{counts.Graded}</h2>
                <p className="text-xs opacity-60">Completed</p>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: theme === 'dark' ? '#0f2520' : '#d1fae5'
                }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: '#00C48C' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-40" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pl-10 bg-base-100"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-base-200 p-1.5 rounded-full border border-base-300">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === tab.name 
                ? "text-white shadow-lg" 
                : "hover:bg-base-300"
              }`}
              style={{
                backgroundColor: activeTab === tab.name ? tab.color : 'transparent'
              }}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold mb-2">No {activeTab} Assignments</h3>
          <p className="opacity-60">You don't have any {activeTab.toLowerCase()} assignments.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const daysRemaining = getDaysRemaining(assignment.dueDate);
            const isOverdue = daysRemaining < 0 && assignment.status === 'Pending';
            
            return (
              <div 
                key={assignment.id}
                className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="card-body p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Icon */}
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ 
                        backgroundColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff'
                      }}
                    >
                      <FileText className="w-7 h-7" style={{ color: '#832388' }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-1">{assignment.title}</h3>
                          <p className="text-sm opacity-60 font-semibold">{assignment.course}</p>
                        </div>
                        <div 
                          className="badge badge-lg font-bold"
                          style={{ 
                            backgroundColor: theme === 'dark' 
                              ? `${getStatusColor(assignment.status)}20` 
                              : `${getStatusColor(assignment.status)}15`,
                            color: getStatusColor(assignment.status),
                            border: 'none'
                          }}
                        >
                          {assignment.status}
                        </div>
                      </div>

                      <p className="text-sm opacity-70 mb-4">{assignment.description}</p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 opacity-60" />
                          <div>
                            <p className="text-xs opacity-60 font-semibold">Due Date</p>
                            <p className="text-sm font-bold">
                              {new Date(assignment.dueDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 opacity-60" />
                          <div>
                            <p className="text-xs opacity-60 font-semibold">Time</p>
                            <p className="text-sm font-bold">{assignment.dueTime}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 opacity-60" />
                          <div>
                            <p className="text-xs opacity-60 font-semibold">Total Marks</p>
                            <p className="text-sm font-bold">{assignment.totalMarks}</p>
                          </div>
                        </div>

                        {assignment.status === 'Graded' && assignment.score !== undefined && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 opacity-60" />
                            <div>
                              <p className="text-xs opacity-60 font-semibold">Score</p>
                              <p className="text-sm font-bold" style={{ color: '#00C48C' }}>
                                {assignment.score}/{assignment.totalMarks}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Time Remaining or Submitted Date */}
                      {assignment.status === 'Pending' && (
                        <div className="mb-4">
                          {isOverdue ? (
                            <div 
                              className="alert alert-error py-2 px-3"
                              style={{ backgroundColor: '#2a1520', borderColor: '#FF0F7B' }}
                            >
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm font-bold" style={{ color: '#FF0F7B' }}>
                                Overdue by {Math.abs(daysRemaining)} days
                              </span>
                            </div>
                          ) : (
                            <div 
                              className="alert py-2 px-3"
                              style={{ 
                                backgroundColor: theme === 'dark' ? '#2a1f15' : '#fef3c7',
                                borderColor: '#F89B29'
                              }}
                            >
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-bold" style={{ color: '#F89B29' }}>
                                {daysRemaining === 0 ? 'Due today' : `${daysRemaining} days remaining`}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {assignment.submittedDate && (
                        <p className="text-xs opacity-60 mb-4">
                          Submitted on {new Date(assignment.submittedDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        {assignment.status === 'Pending' && (
                          <>
                            <button 
                              className="btn btn-sm gap-2 text-white border-0 cursor-pointer hover:opacity-90"
                              style={{ backgroundColor: '#832388' }}
                            >
                              <Upload className="w-4 h-4" />
                              Submit Assignment
                            </button>
                            <button className="btn btn-sm btn-ghost gap-2 cursor-pointer">
                              <Download className="w-4 h-4" />
                              Download ({assignment.attachments})
                            </button>
                          </>
                        )}
                        
                        {assignment.status === 'Submitted' && (
                          <button className="btn btn-sm btn-ghost gap-2 cursor-pointer">
                            <FileText className="w-4 h-4" />
                            View Submission
                          </button>
                        )}

                        {assignment.status === 'Graded' && (
                          <>
                            <button 
                              className="btn btn-sm gap-2 text-white border-0 cursor-pointer hover:opacity-90"
                              style={{ backgroundColor: '#00C48C' }}
                            >
                              <CheckCircle className="w-4 h-4" />
                              View Feedback
                            </button>
                            <button className="btn btn-sm btn-ghost gap-2 cursor-pointer">
                              <Download className="w-4 h-4" />
                              Download Result
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}