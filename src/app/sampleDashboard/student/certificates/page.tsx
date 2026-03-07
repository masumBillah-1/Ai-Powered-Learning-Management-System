"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Download, Award, TrendingUp } from 'lucide-react';

interface Certificate {
  id: string;
  name: string;
  date: string;
  marks: number;
  total: number;
  category: string;
}

const MyCertificatesPage = () => {
  const [theme, setTheme] = useState("light");

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

  const certificates: Certificate[] = [
    { id: '01', name: 'UI/UX Design Certificate',  date: '22 Aug 2025', marks: 20, total: 20, category: 'Design' },
    { id: '02', name: 'Wordpress Certificate',      date: '10 Aug 2025', marks: 18, total: 20, category: 'CMS' },
    { id: '03', name: 'HTML CSS Certificate',       date: '26 Jul 2025', marks: 25, total: 30, category: 'Frontend' },
    { id: '04', name: 'JavaScript Certificate',     date: '14 Jul 2025', marks: 15, total: 20, category: 'Programming' },
    { id: '05', name: 'Photoshop Certificate',      date: '19 Jun 2025', marks: 20, total: 30, category: 'Design' },
    { id: '06', name: 'Python Certificate',         date: '12 Jun 2025', marks: 20, total: 20, category: 'Programming' },
  ];

  const getScorePercent = (marks: number, total: number) => Math.round((marks / total) * 100);

  const getScoreColor = (percent: number) => {
    if (percent === 100) return '#00C48C';
    if (percent >= 80)  return '#F89B29';
    return '#FF0F7B';
  };

  const categoryColor: Record<string, string> = {
    Design:      '#832388',
    CMS:         '#0EA5E9',
    Frontend:    '#F89B29',
    Programming: '#FF0F7B',
  };

  const totalEarned = certificates.length;
  const perfectScores = certificates.filter(c => c.marks === c.total).length;
  const avgScore = Math.round(
    certificates.reduce((acc, c) => acc + getScorePercent(c.marks, c.total), 0) / totalEarned
  );

  return (
    <div className="min-h-screen">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Certificates</h1>
          <p className="text-sm opacity-50 mt-1 font-medium">Your earned achievements & credentials</p>
        </div>
        <button
          className="btn btn-sm text-white border-0 gap-2 self-start sm:self-auto"
          style={{ backgroundColor: '#832388' }}
        >
          <Award size={15} />
          Request Certificate
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Earned',    value: totalEarned,        suffix: '',  icon: '🏆', color: '#FF0F7B' },
          { label: 'Perfect Scores',  value: perfectScores,      suffix: '',  icon: '⭐', color: '#00C48C' },
          { label: 'Avg. Score',      value: avgScore,           suffix: '%', icon: '📊', color: '#F89B29' },
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

      {/* ── Table Card ── */}
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="px-6 py-4 border-b border-base-300 flex items-center gap-2">
          <TrendingUp size={16} style={{ color: '#FF0F7B' }} />
          <span className="text-sm font-bold opacity-70">Certificate Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-base-200">
                <th className="px-6 py-4 text-left text-xs font-black opacity-50 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-black opacity-50 uppercase tracking-wider">Certificate</th>
                <th className="px-6 py-4 text-left text-xs font-black opacity-50 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-black opacity-50 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-black opacity-50 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-left text-xs font-black opacity-50 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-4 text-center text-xs font-black opacity-50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert, index) => {
                const percent = getScorePercent(cert.marks, cert.total);
                const scoreColor = getScoreColor(percent);
                return (
                  <tr
                    key={cert.id}
                    className="border-t border-base-200 hover:bg-base-200 transition-colors duration-200 group"
                  >
                    {/* ID */}
                    <td className="px-6 py-5">
                      <span className="text-xs font-black opacity-30">{cert.id}</span>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#FF0F7B15' }}
                        >
                          <Award size={16} style={{ color: '#FF0F7B' }} />
                        </div>
                        <span className="text-sm font-bold group-hover:text-[#FF0F7B] transition-colors duration-200 whitespace-nowrap">
                          {cert.name}
                        </span>
                      </div>
                    </td>

                    {/* Category badge */}
                    <td className="px-6 py-5">
                      <span
                        className="badge badge-sm font-bold border-0 text-white"
                        style={{ backgroundColor: categoryColor[cert.category] || '#999' }}
                      >
                        {cert.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold opacity-60 whitespace-nowrap">{cert.date}</span>
                    </td>

                    {/* Score */}
                    <td className="px-6 py-5">
                      <span className="text-sm font-black" style={{ color: scoreColor }}>
                        {cert.marks}
                        <span className="opacity-40 font-semibold text-xs">/{cert.total}</span>
                      </span>
                    </td>

                    {/* Progress bar */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <div className="flex-1 bg-base-300 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${percent}%`, backgroundColor: scoreColor }}
                          />
                        </div>
                        <span className="text-xs font-black w-9 text-right" style={{ color: scoreColor }}>
                          {percent}%
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="btn btn-xs btn-ghost btn-circle hover:text-[#832388] transition-all hover:scale-110"
                          title="View Certificate"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn btn-xs btn-ghost btn-circle hover:text-[#FF0F7B] transition-all hover:scale-110"
                          title="Download Certificate"
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-base-300 flex items-center justify-between">
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
    </div>
  );
};

export default MyCertificatesPage;