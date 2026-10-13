import React, { useState, useEffect } from 'react';
import { Sun, Moon, Check, Server } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkApiHealth } from '../services/api';
import { PageTransition } from '../components/PageTransition';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useAuth();
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [serverTimestamp, setServerTimestamp] = useState<string>('');

  useEffect(() => {
    const verifyApi = async () => {
      try {
        const res = await checkApiHealth();
        if (res.success) {
          setApiStatus('connected');
          setServerTimestamp(res.timestamp || new Date().toISOString());
        } else {
          setApiStatus('disconnected');
        }
      } catch (err) {
        setApiStatus('disconnected');
      }
    };
    verifyApi();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-24 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <div className="pb-8 border-b border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
              Configuration
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight font-display text-slate-950 dark:text-white">
              Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage theme preferences, system diagnostics, and display mode
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Appearance Preference */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-7 sm:p-8 shadow-sm shadow-slate-950/5 space-y-5">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-950 dark:text-white">Appearance</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Choose between light and dark visual themes. Saved locally.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => theme !== 'light' && toggleTheme()}
                  className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-bold block text-slate-950 dark:text-white">Light Mode</span>
                    <span className="text-xs text-slate-500">Standard crisp canvas</span>
                  </div>
                  {theme === 'light' && <Check className="w-4 h-4 text-indigo-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-1">
                    <Moon className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-bold block text-slate-950 dark:text-white">Dark Mode</span>
                    <span className="text-xs text-slate-400">Deep charcoal palette</span>
                  </div>
                  {theme === 'dark' && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              </div>
            </div>

            {/* Backend Connectivity Status */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-7 sm:p-8 shadow-sm shadow-slate-950/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold font-display text-slate-950 dark:text-white">Backend API Status</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live endpoint connectivity check at <code className="font-mono text-slate-700 dark:text-slate-300">/api/health</code>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {apiStatus === 'connected' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      API Connected
                    </span>
                  ) : apiStatus === 'checking' ? (
                    <span className="text-xs text-slate-400">Verifying...</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 rounded-full text-xs font-semibold">
                      Offline
                    </span>
                  )}
                </div>
              </div>

              {serverTimestamp && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>Server sync</span>
                  <span>{new Date(serverTimestamp).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
