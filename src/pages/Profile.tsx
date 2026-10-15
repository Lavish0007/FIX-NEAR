import React, { useState, useEffect } from 'react';
import {
  Mail,
  MapPin,
  Calendar,
  UserRound,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { issueService } from '../services/api';
import { PageTransition } from '../components/PageTransition';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ total: 0, resolved: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await issueService.getStats();
        if (res.success) {
          setStats({ total: res.stats.total, resolved: res.stats.resolved });
        }
      } catch (err) {
        console.error('Error fetching profile stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-24 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <div className="pb-8 border-b border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
              Account Overview
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight font-display text-slate-950 dark:text-white">
              Citizen Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your registered details and civic participation history
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Identity Card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-7 sm:p-9 shadow-sm shadow-slate-950/5">
              <div className="flex items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-700/80">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-bold text-2xl flex items-center justify-center font-display">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-display text-slate-950 dark:text-white">
                    {user?.name || 'Citizen'}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <UserRound className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>FixNear account</span>
                  </div>
                </div>
              </div>

              {/* Detail Rows */}
              <div className="py-6 space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    Email
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                    {user?.email}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    City / Neighborhood
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {user?.city || 'Metro Area'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Member Since
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'October 2026'}
                  </span>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-700/80 grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                  <span className="text-[11px] font-mono text-slate-400 uppercase block">
                    TOTAL REPORTS
                  </span>
                  <span className="text-2xl font-bold font-display text-slate-950 dark:text-white tabular-nums">
                    {stats.total}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                  <span className="text-[11px] font-mono text-slate-400 uppercase block">
                    RESOLVED ISSUES
                  </span>
                  <span className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {stats.resolved}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Action */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl hover:bg-red-100 dark:hover:bg-red-950 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
