import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";

const exampleStages = ["Reported", "In Progress", "Resolved"];

export const HeroVisual: React.FC = () => (
  <motion.section
    aria-labelledby="sample-issue-heading"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
    className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-950/5 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/20"
  >
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/80">
      <h2
        id="sample-issue-heading"
        className="text-sm font-semibold text-slate-900 dark:text-white"
      >
        Sample Issue Preview
      </h2>
      <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
        Demo data
      </span>
    </div>

    <div className="space-y-6 p-6 sm:p-7">
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
        Example content only—not a live municipal record.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
          FX-20261002-4821
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            High priority
          </span>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
            In Progress
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
          Broken streetlight near Main Gate
        </h3>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-indigo-500" />
            Near Main Gate, Sector 4
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
            Example report
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Status
          </h4>
          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
            In Progress
          </span>
        </div>
        <ol aria-label="Example report status" className="grid grid-cols-3 gap-2">
          {exampleStages.map((stage, index) => {
            const current = index === 1;
            const complete = index === 0;
            return (
              <li key={stage} className="space-y-2">
                <div
                  className={`h-1.5 rounded-full ${
                    complete || current
                      ? "bg-indigo-500"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
                <span
                  className={`block text-xs ${
                    current
                      ? "font-semibold text-indigo-700 dark:text-indigo-300"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {stage}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  </motion.section>
);
