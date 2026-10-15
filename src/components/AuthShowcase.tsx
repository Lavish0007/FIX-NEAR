import React from 'react';
import { Building2, Compass, Users } from 'lucide-react';

export const AuthShowcase: React.FC = () => (
  <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-slate-800 bg-slate-900 p-12 text-white select-none lg:flex lg:w-1/2 xl:w-7/12 xl:p-16">
    <div className="pointer-events-none absolute inset-0 opacity-10">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="auth-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#6366f1" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-grid)" />
      </svg>
    </div>

    <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />

    <div className="relative z-10">
      <span className="flex items-center gap-1.5 font-display text-xl font-bold tracking-tight text-white">
        FixNear<span className="h-2 w-2 rounded-full bg-indigo-500" />
      </span>
      <span className="mt-1 block font-mono text-[11px] uppercase tracking-widest text-indigo-300">
        Civic Infrastructure Network
      </span>
    </div>

    <div className="relative z-10 my-auto max-w-xl space-y-8 py-8">
      <div className="space-y-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Community Participation
        </span>
        <h2 className="font-display text-3xl font-extrabold leading-[1.12] tracking-tight xl:text-5xl">
          A platform built for neighborhood pride.
        </h2>
        <p className="pt-1 text-sm leading-relaxed text-slate-300 xl:text-base">
          When you report an issue, you give local authorities exact locations, photographs,
          and priority signals to accelerate neighborhood maintenance.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="space-y-1.5 rounded-2xl border border-slate-700/80 bg-slate-800/80 p-4 shadow-sm backdrop-blur-sm">
          <Users className="h-5 w-5 text-indigo-400" />
          <h3 className="text-xs font-bold text-white">Community First</h3>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Join neighbors who care about their streets.
          </p>
        </div>

        <div className="space-y-1.5 rounded-2xl border border-slate-700/80 bg-slate-800/80 p-4 shadow-sm backdrop-blur-sm">
          <Building2 className="h-5 w-5 text-indigo-400" />
          <h3 className="text-xs font-bold text-white">Direct Notice</h3>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Route problems straight into actionable dispatch.
          </p>
        </div>

        <div className="space-y-1.5 rounded-2xl border border-slate-700/80 bg-slate-800/80 p-4 shadow-sm backdrop-blur-sm">
          <Compass className="h-5 w-5 text-indigo-400" />
          <h3 className="text-xs font-bold text-white">Live Tracking</h3>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Track every milestone until the repair is verified.
          </p>
        </div>
      </div>
    </div>

    <div className="relative z-10 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
      <span>Verified Citizen Accounts</span>
      <span className="font-mono text-[11px] text-indigo-400">INSTANT ONBOARDING</span>
    </div>
  </section>
);
