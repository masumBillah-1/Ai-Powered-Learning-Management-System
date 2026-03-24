"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera, Plus, Calendar,
  Trash2, Globe, Shield,
  Bell, CreditCard, User,
  Wallet, Clock, CheckCircle,
  AlertCircle, Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WithdrawStats {
  available: number;
  pending: number;
  totalWithdrawn: number;
  totalLifetime: number;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [stats, setStats] = useState<WithdrawStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Withdrawal Form State
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bkash');
  const [accountDetails, setAccountDetails] = useState('');

  const tabs = [
    'Profile', 'Security', 'Plans', 'Notifications', 'Withdraw'
  ];

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (data.withdrawStats) {
        setStats(data.withdrawStats);
      }
    } catch (error) {
      console.error("Failed to fetch withdraw stats", error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Withdraw') {
      fetchStats();
    }
  }, [activeTab]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 500) {
      toast.error("Minimum withdrawal amount is ৳500");
      return;
    }

    if (stats && numAmount > stats.available) {
      toast.error("Insufficient balance");
      return;
    }

    if (!accountDetails) {
      toast.error("Please provide account details");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'withdraw',
          amount: numAmount,
          payoutMethod: method,
          accountDetails
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Withdrawal request submitted");
        setAmount('');
        setAccountDetails('');
        fetchStats(); // Refresh stats
      } else {
        toast.error(data.error || "Failed to submit request");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-6 tracking-tight">Settings</h1>

      {/* --- Tab Navigation --- */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl mb-8 overflow-x-auto">
        <div className="flex items-center min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold transition-all relative ${activeTab === tab
                  ? 'text-pink-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl">
        {activeTab === 'Profile' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* --- Profile Content --- */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-6 mb-10 pb-10 border-b dark:border-slate-800">
                <div className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-800 dark:text-white mb-1">Your Avatar</h3>
                  <p className="text-sm font-bold text-gray-400 mb-3">PNG or JPG no bigger than 800px width and height</p>
                  <div className="flex gap-3">
                    <button className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-xs font-black hover:bg-gray-200 transition-colors">Upload</button>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-xs font-black hover:bg-pink-600 transition-colors">Delete</button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-black text-gray-800 dark:text-white">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 dark:text-gray-300">Full Name <span className="text-pink-500">*</span></label>
                    <input type="text" defaultValue="Eugene Andre" className="w-full p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-gray-600 dark:text-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 dark:text-gray-300">User Name <span className="text-pink-500">*</span></label>
                    <input type="text" defaultValue="instructordemo" className="w-full p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-gray-600 dark:text-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 dark:text-gray-300">Phone Number <span className="text-pink-500">*</span></label>
                    <input type="text" defaultValue="90154-91036" className="w-full p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-gray-600 dark:text-gray-200" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-black text-gray-700 dark:text-gray-300">Bio <span className="text-pink-500">*</span></label>
                    <textarea rows={4} className="w-full p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-medium text-gray-600 dark:text-gray-200">I am a web developer with a vast array of knowledge in many different front end and back end languages.</textarea>
                  </div>
                </div>
              </div>

              <button className="mt-12 bg-pink-500 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-pink-100 dark:shadow-none hover:bg-pink-600 transition-all">
                Update Profile
              </button>
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-black text-gray-800 dark:text-white mb-2">Delete Account</h3>
              <p className="text-sm font-bold text-gray-400 mb-6">Are you sure you want to delete your account? This action is permanent.</p>
              <button className="bg-pink-500 text-white px-8 py-3 rounded-xl font-black hover:bg-pink-600 transition-all">
                Delete Account
              </button>
            </section>
          </div>
        )}

        {activeTab === 'Withdraw' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* --- Stat Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'AVAILABLE', amount: stats?.available || 0, icon: <Wallet className="text-green-500" /> },
                { title: 'PENDING', amount: stats?.pending || 0, icon: <Clock className="text-amber-500" /> },
                { title: 'TOTAL', amount: stats?.totalWithdrawn || 0, icon: <CheckCircle className="text-blue-500" /> },
              ].map((card, idx) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-wider">{card.title}</span>
                    {card.icon}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-800 dark:text-white">৳{(card.amount).toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* --- Withdrawal Form --- */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <CreditCard className="text-pink-500" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-800 dark:text-white">REQUEST WITHDRAWAL</h3>
                  <p className="text-xs font-bold text-gray-400">Request payout to your preferred method</p>
                </div>
              </div>

              {loadingStats ? (
                <div className="flex items-center justify-center p-10">
                  <Loader2 className="animate-spin text-pink-500" size={32} />
                </div>
              ) : (
                <form onSubmit={handleWithdraw} className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 dark:text-gray-300">Amount (৳)</label>
                    <input
                      type="number"
                      placeholder="Min 500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-gray-600 dark:text-gray-200"
                    />
                    {stats && stats.available < 500 && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-bold">
                        <AlertCircle size={12} /> You need at least ৳500 to withdraw
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 dark:text-gray-300">Payment Method</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-gray-600 dark:text-gray-200"
                    >
                      <option value="bkash">bKash</option>
                      <option value="nagad">Nagad</option>
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 dark:text-gray-300">Account Details</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Phone number for bKash/Nagad or Email for PayPal/Stripe"
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                      className="w-full p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-medium text-gray-600 dark:text-gray-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || (stats ? stats.available < 500 : false)}
                    className="flex items-center justify-center gap-2 bg-pink-500 text-white px-8 py-3.5 rounded-xl font-black shadow-lg shadow-pink-100 dark:shadow-none hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
                    Request Withdrawal
                  </button>
                </form>
              )}
            </section>

            <div className="bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/20 rounded-2xl p-6">
              <h4 className="text-sm font-black text-pink-600 dark:text-pink-400 mb-2">Withdrawal Policy</h4>
              <ul className="text-xs font-bold text-pink-500/80 space-y-1 list-disc pl-4">
                <li>Minimum withdrawal amount is ৳500.</li>
                <li>Withdrawal requests are typically processed within 24-48 hours.</li>
                <li>"Total Withdrawn" only updates once the admin approves your request.</li>
              </ul>
            </div>
          </div>
        )}

        {(activeTab === 'Security' || activeTab === 'Plans' || activeTab === 'Notifications') && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in duration-500">
            <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2">{activeTab} Settings</h3>
            <p className="text-gray-500 font-bold">This section is under development.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;