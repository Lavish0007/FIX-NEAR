import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/PageTransition';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAuth();

  // Step 1: email, Step 2: new password, Step 3: success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 450);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 600);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-6 py-12 relative">
        {/* Top-Right Theme Toggle */}
        <div className="absolute top-5 right-6 z-20">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all shadow-sm shadow-slate-950/5 cursor-pointer"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-2xl font-bold font-display tracking-tight text-slate-950 dark:text-white focus:outline-none"
            >
              FixNear<span className="w-2 h-2 rounded-full bg-indigo-500" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-950 dark:text-white">
              Reset your password
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Recover access to your civic reporting account
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-8 sm:p-9 shadow-sm shadow-slate-950/5">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form
                  key="step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleEmailSubmit}
                  className="space-y-5"
                >
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
                    <KeyRound className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-display text-slate-950 dark:text-white">
                      Enter your registered email
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      We'll verify your email address and guide you through setting a new password.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-300">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-indigo-950/10 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Verifying...' : 'Continue to Reset Password'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center">
                    <Link
                      to="/login"
                      className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-medium"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to login
                    </Link>
                  </div>
                </motion.form>
              )}

              {step === 2 && (
                <motion.form
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handlePasswordReset}
                  className="space-y-5"
                >
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
                    <ShieldCheck className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-display text-slate-950 dark:text-white">
                      Create new password
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Account: <span className="font-mono text-slate-900 dark:text-slate-200">{email}</span>
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-300">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      New password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Confirm new password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-indigo-950/10 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to email
                    </button>
                  </div>
                </motion.form>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 py-2"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-display text-slate-950 dark:text-white">
                      Password updated
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Your password has been changed successfully. You can now log in with your new credentials.
                    </p>
                  </div>

                  <div className="pt-3">
                    <Link
                      to="/login"
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-indigo-950/10 inline-flex items-center justify-center gap-2"
                    >
                      Return to Sign In
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
