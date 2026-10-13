import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { Report } from './pages/Report';
import { Track } from './pages/Track';
import { MyReports } from './pages/MyReports';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { HowItWorks } from './pages/HowItWorks';
import { About } from './pages/About';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  // 1. Refined Loading Splash State (Requirement 2)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200 p-6">
        <div className="flex flex-col items-center gap-5 p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-sm shadow-slate-950/5">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              FixNear
            </span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600 dark:bg-indigo-400" />
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-indigo-200 dark:border-indigo-900/60 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Verifying Session
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Experience (Immediate Auth - Section 1 & 2)
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // 3. Authenticated Experience: Main FixNear Application with Navbar & Footer
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-indigo-500/20 selection:text-indigo-800 dark:selection:bg-indigo-900/40 dark:selection:text-indigo-200 font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/track" element={<Track />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />

          {/* Auth redirects for authenticated users */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="/forgot-password" element={<Navigate to="/" replace />} />

          {/* Fallback to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
