import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ShieldCheck, UserCheck, Wrench, Sparkles } from 'lucide-react';
import { IssueStatus } from '../utils/storage';

interface IssueTimelineProps {
  currentStatus: IssueStatus;
  createdAt: string;
}

const STAGES: {
  status: IssueStatus;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    status: 'Reported',
    label: 'Reported',
    description: 'Submitted and cataloged with unique ID',
    icon: Clock,
  },
  {
    status: 'Under Review',
    label: 'Under Review',
    description: 'Queued for category and location triage',
    icon: CheckCircle2,
  },
  {
    status: 'Verified',
    label: 'Verified',
    description: 'Incident verified by community checks',
    icon: ShieldCheck,
  },
  {
    status: 'Assigned',
    label: 'Assigned',
    description: 'Allocated to civic maintenance queue',
    icon: UserCheck,
  },
  {
    status: 'In Progress',
    label: 'In Progress',
    description: 'Field inspection or active work initiated',
    icon: Wrench,
  },
  {
    status: 'Resolved',
    label: 'Resolved',
    description: 'Maintenance complete and closed',
    icon: Sparkles,
  },
];

export const IssueTimeline: React.FC<IssueTimelineProps> = ({ currentStatus, createdAt }) => {
  const currentIndex = STAGES.findIndex((s) => s.status === currentStatus);
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
            Current Status
          </span>
          <span className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 mt-0.5 font-display">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
            {currentStatus}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
            Submission Time
          </span>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-300 mt-0.5 block tabular-nums">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-7 before:absolute before:left-[11px] before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
        {STAGES.map((stage, index) => {
          const isPassed = index < activeIndex;
          const isCurrent = index === activeIndex;
          const isUpcoming = index > activeIndex;
          const Icon = stage.icon;

          return (
            <motion.div
              key={stage.status}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className="relative flex items-start gap-4"
            >
              {/* Node Indicator */}
              <div
                className={`absolute -left-6 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ring-4 ring-white dark:ring-slate-900 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isPassed
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Stage Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : isPassed
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider font-mono">
                      Active State
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {stage.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs text-zinc-600">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
        <span>
          Local prototype status. In production, status changes occur when local authorities process tickets.
        </span>
      </div>
    </div>
  );
};
