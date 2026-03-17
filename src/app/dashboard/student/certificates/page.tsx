"use client";

import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Certificate {
  _id: string;
  courseId: string | { _id: string; title?: string; category?: string };
  courseName: string;
  enrolledAt: string;
  completedAt?: string;
  certificate: {
    issued: boolean;
    issuedAt?: string;
    certificateUrl?: string;
    verificationCode?: string;
  };
  results?: Array<{
    score: number;
    maxScore: number;
  }>;
}

const MyCertificatesPage = () => {
  const [theme, setTheme] = useState("light");
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/enrollments?status=completed&hasCertificate=true", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (data.success) {
        // Filter only enrollments with issued certificates
        const certsWithIssued = (data.enrollments || []).filter(
          (e: Certificate) => e.certificate?.issued
        );
        setCertificates(certsWithIssued);
      } else {
        console.error("Failed to fetch certificates:", data.error);
      }
    } catch (err) {
      console.error("Error fetching certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCourseName = (cert: Certificate): string => {
    if (typeof cert.courseId === 'object' && cert.courseId?.title) {
      return cert.courseId.title;
    }
    return cert.courseName || "Untitled Course";
  };

  const getCourseCategory = (cert: Certificate): string => {
    if (typeof cert.courseId === 'object' && cert.courseId?.category) {
      return (cert.courseId as any).category;
    }
    return "Course";
  };

  const getScorePercent = (cert: Certificate): number => {
    if (!cert.results || cert.results.length === 0) return 100;
    const totalScore = cert.results.reduce((sum, r) => sum + r.score, 0);
    const totalMax = cert.results.reduce((sum, r) => sum + r.maxScore, 0);
    return totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 100;
  };

  const getTotalMarks = (cert: Certificate): { earned: number; total: number } => {
    if (!cert.results || cert.results.length === 0) return { earned: 0, total: 0 };
    const earned = cert.results.reduce((sum, r) => sum + r.score, 0);
    const total = cert.results.reduce((sum, r) => sum + r.maxScore, 0);
    return { earned, total };
  };

  const getScoreColor = (percent: number) => {
    if (percent === 100) return '#00C48C';
    if (percent >= 80) return '#F89B29';
    return '#FF0F7B';
  };

  const categoryColor: Record<string, string> = {
    Design: '#8B5CF6',         // Purple
    CMS: '#3B82F6',            // Blue  
    Frontend: '#10B981',       // Green
    Programming: '#F59E0B',    // Amber
    Development: '#06B6D4',    // Cyan
    Business: '#EC4899',       // Pink
    Marketing: '#F97316',      // Orange
    'Data Science': '#6366F1', // Indigo
    'Web Development': '#14B8A6', // Teal
    'Data Management': '#98b8e4ff', // Slate
    Course: '#999da2ff',         // Slate (default)
  };

  // ✅ Get background color with opacity for better visibility
  const getCategoryStyle = (category: string) => {
    const color = categoryColor[category] || '#64748B';
    return {
      backgroundColor: `${color}20`, // 20% opacity background
      color: color,
      border: `1px solid ${color}40`, // 40% opacity border
    };
  };

  const totalEarned = certificates.length;
  const perfectScores = certificates.filter(c => getScorePercent(c) === 100).length;
  const avgScore = totalEarned > 0
    ? Math.round(certificates.reduce((acc, c) => acc + getScorePercent(c), 0) / totalEarned)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#832388' }} />
          <p className="text-sm opacity-60">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Certificates</h1>
          <p className="text-sm opacity-50 mt-1 font-medium">Your earned achievements & credentials</p>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Earned', value: totalEarned, suffix: '', icon: '🏆', color: '#FF0F7B' },
          { label: 'Perfect Scores', value: perfectScores, suffix: '', icon: '⭐', color: '#00C48C' },
          { label: 'Avg. Score', value: avgScore, suffix: '%', icon: '📊', color: '#F89B29' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col gap-1 shadow-sm"
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-black" style={{ color: stat.color }}>
              {stat.value}{stat.suffix}
            </p>
            <p className="text-xs font-semibold opacity-50">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {certificates.length === 0 ? (
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-bold mb-2">No Certificates Yet</h3>
          <p className="opacity-60 mb-6">Complete courses to earn certificates and showcase your achievements!</p>
        </div>
      ) : (
        /* ── Table Card ── */
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">

          {/* Table Header */}
          <div className="px-6 py-4 border-b border-base-300 flex items-center gap-2">
            <TrendingUp size={16} style={{ color: '#FF0F7B' }} />
            <span className="text-sm font-bold opacity-70">Certificate Records</span>
          </div>

          {/* ✅ Responsive table wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-base-200">
                  <th className="px-4 py-4 text-left text-xs font-black opacity-50 uppercase tracking-wider w-12">#</th>
                  <th className="px-4 py-4 text-left text-xs font-black opacity-50 uppercase tracking-wider min-w-[250px]">Certificate</th>
                  <th className="px-4 py-4 text-left text-xs font-black opacity-50 uppercase tracking-wider w-32">Category</th>
                  <th className="px-4 py-4 text-left text-xs font-black opacity-50 uppercase tracking-wider w-32">Date</th>
                  <th className="px-4 py-4 text-left text-xs font-black opacity-50 uppercase tracking-wider w-24">Score</th>
                  <th className="px-4 py-4 text-left text-xs font-black opacity-50 uppercase tracking-wider w-40">Performance</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert, index) => {
                  const percent = getScorePercent(cert);
                  const scoreColor = getScoreColor(percent);
                  const marks = getTotalMarks(cert);
                  const courseName = getCourseName(cert);
                  const category = getCourseCategory(cert);
                  const issuedDate = cert.certificate?.issuedAt
                    ? new Date(cert.certificate.issuedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                    : new Date(cert.completedAt || cert.enrolledAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

                  return (
                    <tr
                      key={cert._id}
                      className="border-t border-base-200 hover:bg-base-200 transition-colors duration-200 group"
                    >
                      {/* ID */}
                      <td className="px-4 py-5">
                        <span className="text-xs font-black opacity-30">{String(index + 1).padStart(2, '0')}</span>
                      </td>

                      {/* Name - ✅ Truncated with tooltip and link */}
                      <td className="px-4 py-5">
                        <Link href="/dashboard/student/courses" className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: '#FF0F7B15' }}
                          >
                            <Award size={16} style={{ color: '#FF0F7B' }} />
                          </div>
                          <span
                            className="text-sm font-bold group-hover:text-[#FF0F7B] transition-colors duration-200 truncate block max-w-[200px]"
                            title={courseName}
                          >
                            {courseName}
                          </span>
                        </Link>
                      </td>

                      {/* Category badge */}
                      <td className="px-4 py-5">
                        <span
                          className="badge badge-sm font-bold whitespace-nowrap"
                          style={getCategoryStyle(category)}
                        >
                          {category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-5">
                        <span className="text-sm font-semibold opacity-60 whitespace-nowrap">{issuedDate}</span>
                      </td>

                      {/* Score */}
                      <td className="px-4 py-5">
                        <span className="text-sm font-black whitespace-nowrap" style={{ color: scoreColor }}>
                          {marks.earned}
                          <span className="opacity-40 font-semibold text-xs">/{marks.total || 'N/A'}</span>
                        </span>
                      </td>

                      {/* Progress bar */}
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3 w-full">
                          <div className="flex-1 bg-base-300 rounded-full h-2 overflow-hidden min-w-[80px]">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${percent}%`, backgroundColor: scoreColor }}
                            />
                          </div>
                          <span className="text-xs font-black w-9 text-right flex-shrink-0" style={{ color: scoreColor }}>
                            {percent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-base-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-semibold opacity-40">
              Showing {certificates.length} of {certificates.length} certificates
            </p>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: '#00C48C' }}
              />
              <span className="text-xs font-semibold opacity-50">All verified</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default MyCertificatesPage;