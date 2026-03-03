"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ChevronDown, ChevronLeft, 
  ChevronRight, AlertCircle, Rocket 
} from 'lucide-react';

const Payouts = () => {
  const [selectedGateway, setSelectedGateway] = useState('paypal');

  const payoutHistory = [
    { id: "#1010", date: "22 Aug 2025", amount: 160, method: "Paypal", status: "Paid" },
    { id: "#1009", date: "10 Aug 2025", amount: 180, method: "Bank Transfer", status: "Pending" },
    { id: "#1008", date: "26 Jul 2025", amount: 200, method: "Stripe", status: "Paid" },
    { id: "#1007", date: "12 Jul 2025", amount: 220, method: "Paypal", status: "Paid" },
    { id: "#1006", date: "02 Jul 2025", amount: 170, method: "Stripe", status: "Paid" },
    { id: "#1005", date: "25 Jun 2025", amount: 150, method: "Bank Transfer", status: "Paid" },
    { id: "#1002", date: "20 May 2025", amount: 140, method: "Paypal", status: "Cancelled" },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      {/* --- Notification Bar --- */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3 text-amber-800 text-sm font-bold">
          <AlertCircle size={18} />
          Your selected payout method was confirmed on Next Payout on 15 Jan, 2025 for "payout@example.com"
        </div>
        <button className="text-amber-500 hover:text-amber-700">
          <ChevronRight size={20} />
        </button>
      </motion.div>

      {/* --- Top Section: Earning & Gateways --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Earning Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-6">
          <div className="relative">
            <Rocket size={48} className="text-orange-400" />
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-400">Earning this month</p>
            <h2 className="text-3xl font-black text-indigo-700 dark:text-indigo-400">$8,420</h2>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Update your payout in settings</p>
          </div>
          <button className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg">
            Withdraw
          </button>
        </div>

        {/* Payment Gateways */}
        <div className="lg:col-span-2 flex flex-wrap md:flex-nowrap gap-4">
          <div className="w-full">
             <p className="text-sm font-black text-gray-800 dark:text-white mb-3">Select Payment Gateway for Payout</p>
             <div className="flex gap-4">
                {/* Paypal */}
                <div 
                  onClick={() => setSelectedGateway('paypal')}
                  className={`flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-center gap-3 ${selectedGateway === 'paypal' ? 'border-pink-500 bg-pink-50/30' : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === 'paypal' ? 'border-pink-500' : 'border-gray-300'}`}>
                    {selectedGateway === 'paypal' && <div className="w-2.5 h-2.5 bg-pink-500 rounded-full"></div>}
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-6" />
                </div>

                {/* Bank Transfer */}
                <div 
                  onClick={() => setSelectedGateway('bank')}
                  className={`flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-center gap-3 ${selectedGateway === 'bank' ? 'border-pink-500 bg-pink-50/30' : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === 'bank' ? 'border-pink-500' : 'border-gray-300'}`}>
                    {selectedGateway === 'bank' && <div className="w-2.5 h-2.5 bg-pink-500 rounded-full"></div>}
                  </div>
                  <span className="font-black text-gray-700 dark:text-gray-200">Bank Transfer</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- Payouts Table Section --- */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b dark:border-slate-800">
           <h2 className="text-xl font-black text-gray-800 dark:text-white mb-6">Payouts</h2>
           <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border dark:border-slate-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400">
                  Payment Method <ChevronDown size={16} />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border dark:border-slate-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400">
                  Status <ChevronDown size={16} />
                </button>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium"
                />
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-gray-400 text-[11px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {payoutHistory.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-5 text-sm font-bold text-indigo-600 dark:text-indigo-400">{row.id}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-500">{row.date}</td>
                  <td className="px-6 py-5 text-sm font-black text-gray-800 dark:text-white">${row.amount}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-500">{row.method}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider ${
                      row.status === 'Paid' ? 'bg-emerald-500 text-white' : 
                      row.status === 'Pending' ? 'bg-indigo-600 text-white' : 
                      'bg-red-600 text-white'
                    }`}>
                      ● {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        <div className="p-6 border-t dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-400">Page 1 of 2</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border rounded-lg text-gray-400 hover:bg-gray-50"><ChevronLeft size={18} /></button>
            <button className="w-9 h-9 rounded-lg bg-pink-500 text-white font-black text-sm shadow-lg shadow-pink-200">1</button>
            <button className="w-9 h-9 rounded-lg border text-gray-500 font-bold text-sm hover:border-pink-500">2</button>
            <button className="w-9 h-9 rounded-lg border text-gray-500 font-bold text-sm hover:border-pink-500">3</button>
            <button className="p-2 border rounded-lg text-gray-400 hover:bg-gray-50"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payouts;