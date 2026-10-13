import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Users,
  Eye,
  Sliders,
  ArrowRight,
} from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

export const About: React.FC = () => {
  const pillars = [
    {
      title: 'Accessibility',
      desc: 'Anyone with a web browser can file an issue in under a minute. Clean, fast, and responsive across desktop and mobile.',
      icon: Users,
    },
    {
      title: 'Simplicity',
      desc: 'We replace multi-page government forms with a fast, structured input: what is broken, where is it, and how urgent is it.',
      icon: Sliders,
    },
    {
      title: 'Transparency',
      desc: 'Every issue receives a standardized tracking ticket. Data is stored directly in persistent cloud storage for immediate retrieval.',
      icon: Eye,
    },
    {
      title: 'Community Participation',
      desc: 'Communities improve when everyday citizens have intuitive tools to document their surroundings and share verified records.',
      icon: Compass,
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-24 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Main Hero Header */}
          <div className="max-w-4xl space-y-6 mb-16">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              About FixNear
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display leading-[1.1] text-balance text-slate-950 dark:text-white">
              Built around a simple idea: problems should be easier to report.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-3xl">
              FixNear is an independent, full-stack civic reporting platform created to demonstrate
              how modern software design can make neighborhood problem tracking intuitive, transparent,
              and fast.
            </p>
          </div>

          {/* Narrative Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-12 border-t border-b border-slate-200/80 dark:border-slate-800">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-950 dark:text-white">
                The Gap in Everyday Civic Maintenance
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Most civic reporting systems are buried behind complex municipal portals, mandatory
                logins, slow mobile apps, or opaque ticketing workflows. As a result, citizens often
                choose silence over filing a report.
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                FixNear reframes this interaction: notice a problem, write the location, get a ticket
                code, and track the issue. Everything runs cleanly with real cloud database persistence.
              </p>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm shadow-slate-950/5 p-8 sm:p-10 space-y-6">
              <h3 className="text-xl font-bold font-display text-slate-950 dark:text-white">
                Core Architectural Principles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {pillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={pillar.title} className="space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-base font-bold text-slate-950 dark:text-white">{pillar.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Integrity & Independent Stance */}
          <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-950/10 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">
                Ethical Architecture
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display">
                Independent, Transparent, Real Database
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                FixNear is a full-stack civic utility that pairs an intuitive client experience with a
                real Node.js, Express, and MongoDB backend. No fake statistics, no opaque queues—just
                clear issue tracking designed for community impact.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center">
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-950/20"
              >
                Submit an Issue
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
