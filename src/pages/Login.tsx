import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Clock,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/PageTransition';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, theme, toggleTheme } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@fixnear.app');
    setPassword('FixNear@2026');
    setErrorMessage('');
    setIsLoading(true);

    try {
      await login('demo@fixnear.app', 'FixNear@2026');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed.');
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

        {/* ========================================================================= */}
{/* LEFT COLUMN: Product Showcase                                             */}
{/* ========================================================================= */}

<div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative bg-slate-950 text-white pt-6 pb-12 px-12 xl:pt-8 xl:pb-16 xl:px-16 flex-col justify-between overflow-hidden border-r border-slate-800 select-none">

  {/* Subtle architectural grid */}
  <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
    <svg
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="login-grid"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="#6366f1"
            strokeWidth="0.75"
          />
        </pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#login-grid)"
      />
    </svg>
  </div>

  {/* Ambient lighting */}
  <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

  <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />


  {/* ----------------------------------------------------------------------- */}
  {/* Brand                                                                   */}
  {/* ----------------------------------------------------------------------- */}

  <div className="relative z-10 max-w-xl space-y-6 my-auto py-4">

    <span className="text-xl font-bold tracking-tight font-display flex items-center gap-1.5 text-white">
      FixNear
      <span className="w-2 h-2 rounded-full bg-indigo-500" />
    </span>

    <span className="text-[11px] font-mono tracking-widest text-indigo-300 uppercase mt-1 block">
      Civic Issue Reporting
    </span>

  </div>


  {/* ----------------------------------------------------------------------- */}
  {/* Main message + report preview                                           */}
  {/* ----------------------------------------------------------------------- */}

  <div className="relative z-10 max-w-xl space-y-8 my-auto py-8">

    {/* Editorial heading */}
    <div className="space-y-4">

      <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
        Notice · Report · Track · Resolve
      </span>

      <h2 className="text-3xl xl:text-5xl font-extrabold tracking-tight font-display leading-[1.08]">

        Your neighborhood.
        <br />

        <span className="text-slate-400 font-normal">
          Your voice.
        </span>

        <br />

        Your report.

      </h2>

      <p className="text-sm xl:text-base text-slate-300 leading-relaxed pt-1 max-w-lg">
        Report local issues, track their progress, and stay informed as
        community repairs move from submission to resolution.
      </p>

    </div>


    {/* --------------------------------------------------------------------- */}
    {/* Realistic report preview                                             */}
    {/* --------------------------------------------------------------------- */}

    <div className="bg-slate-800/70 backdrop-blur-md rounded-2xl border border-slate-700/80 p-5 shadow-xl space-y-4">

      {/* Report header */}
      <div className="flex items-center justify-between">

        <span className="flex items-center gap-1.5 text-white font-semibold text-xs">

          <CheckCircle2 className="w-4 h-4 text-emerald-400" />

          REPORT SUBMITTED

        </span>

        <span className="text-indigo-300 text-xs font-mono">
          FX-20261002-4821
        </span>

      </div>


      {/* Issue information */}
      <div className="flex items-center justify-between gap-4 pt-1">

        <div>

          <h4 className="text-sm font-bold text-white">
            Streetlight not working
          </h4>

          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">

            <MapPin className="w-3.5 h-3.5 text-indigo-400" />

            <span>
              Main Gate Road · Sector 4
            </span>

          </div>

        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/25 shrink-0">
          IN PROGRESS
        </span>

      </div>


      {/* Status history */}
      <div className="pt-3 border-t border-slate-700/80">

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">

            <Clock className="w-3 h-3 shrink-0" />

            <span>
              Reported
            </span>

          </div>

          <div className="flex-1 h-px bg-slate-700" />

          <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">

            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />

            <span>
              Under Review
            </span>

          </div>

          <div className="flex-1 h-px bg-slate-700" />

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">

            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />

            <span>
              Assigned
            </span>

          </div>

        </div>

      </div>


      {/* Last update */}
      <div className="flex items-center justify-between pt-1 text-[10px] font-mono">

        <span className="text-slate-500">
          Last updated
        </span>

        <span className="text-slate-400">
          Recently
        </span>

      </div>

    </div>

  </div>


  {/* ----------------------------------------------------------------------- */}
  {/* Bottom product information                                              */}
  {/* ----------------------------------------------------------------------- */}

  <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">

    <span className="text-slate-500">
      Track issues from report to resolution
    </span>

    <span className="font-mono text-[11px] text-indigo-400">
      FIXNEAR
    </span>

  </div>
</div>

  <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-10 dark:bg-slate-900 sm:px-8 lg:px-10 xl:px-16">
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/80 p-7 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/80"
    >
      <div className="mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 ring-1 ring-indigo-500/20">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Sign in to continue reporting issues and tracking community updates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Email address
          </label>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@fixnear.app"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Password
          </label>

          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-slate-800 dark:hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500" />
            Remember me
          </label>

          <Link to="/forgot-password" className="font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400">
            Forgot password?
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
            >
              <CheckCircle2 className="h-4 w-4" />
              Login successful. Redirecting...
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Use demo account
        </button>
      </form>

      <div className="mt-7 border-t border-slate-200 pt-5 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
        Need an account?{' '}
        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          Create one
        </Link>
      </div>
    </motion.div>
  </div>
</div>
</PageTransition>
  );
};