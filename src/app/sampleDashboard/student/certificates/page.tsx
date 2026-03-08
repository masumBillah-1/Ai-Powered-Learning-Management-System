"use client";

import React from 'react';
import { Eye, Download } from 'lucide-react';

// TypeScript Interface for Certificate Data
interface Certificate {
  id: string;
  name: string;
  date: string;
  marks: number;
  total: number;
}

const MyCertificatesPage = () => {
  // Mock Data from your uploaded image
  const certificates: Certificate[] = [
    { id: '01', name: 'UI/UX Design Certificate', date: '22 Aug 2025', marks: 20, total: 20 },
    { id: '02', name: 'Wordpress Certificate', date: '10 Aug 2025', marks: 18, total: 20 },
    { id: '03', name: 'HTML CSS Certificate', date: '26 Jul 2025', marks: 25, total: 30 },
    { id: '04', name: 'JavaScript Certificate', date: '14 Jul 2025', marks: 15, total: 20 },
    { id: '05', name: 'Photoshop Certificate', date: '19 Jun 2025', marks: 20, total: 30 },
    { id: '06', name: 'Python Certificate', date: '12 Jun 2025', marks: 20, total: 20 },
  ];

  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Page Heading */}
      <h2 className="text-xl font-black text-[#171717] mb-6">My Certificates</h2>

      {/* Certificate Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-0">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider rounded-tl-xl border-b border-gray-100">ID</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">Certificate Name</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">Date</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">Marks</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">Out of</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider rounded-tr-xl border-b border-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {certificates.map((cert) => (
              <tr key={cert.id} className="group hover:bg-pink-50/30 transition-colors">
                <td className="px-6 py-5 text-sm font-bold text-gray-400">{cert.id}</td>
                <td className="px-6 py-5 text-sm font-black text-[#171717] group-hover:text-[#FF0F7B] transition-colors">
                  {cert.name}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-gray-500">{cert.date}</td>
                <td className="px-6 py-5 text-sm font-black text-gray-700">{cert.marks}</td>
                <td className="px-6 py-5 text-sm font-black text-gray-700">{cert.total}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-4">
                    {/* View Icon - Using Purple on hover */}
                    <button className="text-gray-400 hover:text-[#832388] transition-all transform hover:scale-110">
                      <Eye size={18} />
                    </button>
                    {/* Download Icon - Using Hot Pink on hover */}
                    <button className="text-gray-400 hover:text-[#FF0F7B] transition-all transform hover:scale-110">
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Footer Info (Optional) */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xs font-bold text-gray-400 italic">Showing {certificates.length} certificates</p>
        <button className="text-xs font-black text-[#832388] hover:text-[#F89B29] transition-colors underline underline-offset-4">
          Request New Certificate
        </button>
      </div>
    </div>
  );
};

export default MyCertificatesPage;