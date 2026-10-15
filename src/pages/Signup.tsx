import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  Mail,
  Lock,
  MapPin,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/PageTransition';
import { AuthShowcase } from '../components/AuthShowcase';
import { validateRegistration } from '../utils/registration';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, theme, toggleTheme } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;
    setErrorMessage('');

    const validationError = validateRegistration({ name, email, password, confirmPassword });
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await signup(name.trim(), email.trim().toLowerCase(), password, city.trim() || 'Metro Area');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 700);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to create your account right now. Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased relative">
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

        <AuthShowcase />

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Signup Form                                                 */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-1/2 xl:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16 my-auto">
          <div className="w-full max-w-md space-y-6">
            <div>
              <div className="lg:hidden inline-flex items-center gap-1.5 text-2xl font-bold font-display tracking-tight text-slate-950 dark:text-white mb-6">
                FixNear<span className="w-2 h-2 rounded-full bg-indigo-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-slate-950 dark:text-white">
                Create account.
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Start reporting and tracking civic defects in your area.
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-300"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="signup-name" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Full name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="signup-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vidushi Srivastava"
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="signup-email" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="signup-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vidushi@example.com"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* City / Neighborhood */}
              <div className="space-y-1.5">
                <label htmlFor="signup-city" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  City / Neighborhood
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="signup-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ghaziabad / Sector 4"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Passwords (2-Col Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="signup-password" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="signup-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      minLength={6}
                      maxLength={128}
                      required
                      className="w-full pl-10 pr-10 py-3 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="signup-confirm-password" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="signup-confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      minLength={6}
                      maxLength={128}
                      required
                      className="w-full pl-10 pr-10 py-3 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-indigo-950/10 flex items-center justify-center gap-2 disabled:opacity-50 pt-3 cursor-pointer"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Account Created
                  </>
                ) : isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up profile...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Transition Overlay */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white"
            >
              <motion.div
                initial={{ scale: 0.9, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className="text-center space-y-3"
              >
                <span className="text-3xl sm:text-4xl font-bold font-display tracking-tight flex items-center justify-center gap-2">
                  FixNear<span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                </span>
                <p className="text-xs font-mono uppercase tracking-widest text-indigo-300">
                  Account provisioned. Entering neighborhood command center...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
