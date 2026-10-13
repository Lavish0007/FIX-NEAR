import React from "react";
import { Link } from "react-router-dom";
import { Copyright } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-white dark:bg-[#0B1120] border-t border-slate-200 dark:border-[#334765] transition-colors duration-300">

  <div className="max-w-7xl mx-auto px-6 sm:px-8">

    {/* Main footer */}
    <div className="py-14 sm:py-16">

      <div className="grid grid-cols-1 md:grid-cols-[1.6fr_0.8fr_0.8fr] gap-12 lg:gap-20">

        {/* Brand */}
        <div className="max-w-md">

          <Link
            to="/"
            className="inline-flex items-center text-xl font-bold tracking-tight text-slate-950 dark:text-white font-display"
          >
            FixNear
            <span className="ml-1.5 h-2 w-2 rounded-full bg-indigo-500" />
          </Link>

          <p className="mt-5 text-sm font-medium text-slate-700 dark:text-slate-300">
            Your neighborhood. Your voice. Your report.
          </p>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            A modern civic-tech platform designed to help citizens
            document, submit, and track everyday community issues.
          </p>

        </div>


        {/* Navigation */}
        <div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Navigation
          </p>

          <div className="mt-5 flex flex-col gap-3">

            <Link
              to="/"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Home
            </Link>

            <Link
              to={isAuthenticated ? "/report" : "/login"}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Report an Issue
            </Link>

            <Link
              to="/track"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Track a Report
            </Link>

            <Link
              to="/my-reports"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              My Reports
            </Link>

          </div>

        </div>


        {/* Platform */}
        <div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Platform
          </p>

          <div className="mt-5 flex flex-col gap-3">

            <Link
              to="/#how-it-works"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              How It Works
            </Link>

            <Link
              to="/about"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              About FixNear
            </Link>

          </div>

        </div>

      </div>

    </div>


    {/* Bottom bar */}
    <div className="border-t border-slate-200 dark:border-[#334765] py-5">

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Copyright */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">

          <Copyright className="h-3.5 w-3.5" />

          <span>
            Vidushi Srivastava 2026. All rights reserved.
          </span>

        </div>


        {/* Bottom links */}
        <div className="flex items-center gap-5 text-xs text-slate-500 dark:text-slate-500">

          <Link
            to="/"
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Process
          </Link>

          <span className="text-slate-300 dark:text-slate-700">
            ·
          </span>

          <Link
            to="/"
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Mission
          </Link>

          <span className="text-slate-300 dark:text-slate-700">
            ·
          </span>

          <Link
            to={isAuthenticated ? "/report" : "/login"}
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Submit Report
          </Link>

        </div>

      </div>

    </div>

  </div>

</footer>
  );
};
