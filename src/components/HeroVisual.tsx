import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Wrench,
  Users,
  Copy,
  Check,
  Radio,
  ArrowUpRight,
} from "lucide-react";

export const HeroVisual: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"status" | "dispatch">("status");

  const handleCopyId = () => {
    navigator.clipboard.writeText("FX-20261002-4821");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-lg xl:max-w-xl mx-auto lg:ml-auto lg:mr-0 select-none pt-4 lg:pt-0">
      {/* Ambient gradient glow backdrop */}
      <div className="absolute -top-12 left-0 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-slate-400/10 dark:bg-indigo-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Dashboard Window */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white/95 dark:bg-[#17233B]/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-[#3B5275] backdrop-blur-xl shadow-lg shadow-slate-950/5 dark:shadow-black/30 overflow-hidden ring-1 ring-inset ring-white/5"
      >
        {/* Top Operational Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-[#334765] flex items-center justify-between bg-slate-50/70 dark:bg-[#1E2D49]/90">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-900 dark:text-slate-100">
                Civic Dispatch Console
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                LIVE
              </span>
            </div>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0F1A2D] p-0.5 rounded-lg text-[11px] font-mono font-medium">
            <button
              onClick={() => setActiveTab("status")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === "status"
                  ? "bg-white dark:bg-[#334765] text-slate-950 dark:text-white shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Inspection
            </button>
            <button
              onClick={() => setActiveTab("dispatch")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === "dispatch"
                  ? "bg-white dark:bg-[#334765] text-slate-950 dark:text-white shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Telemetry
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Ticket Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyId}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#223451] hover:bg-slate-200 dark:hover:bg-[#2A3D5C] font-mono text-xs font-bold text-slate-800 dark:text-slate-100 transition-colors border border-slate-200/80 dark:border-[#3B5275]"
                title="Click to copy Report ID"
              >
                <span>FX-20261002-4821</span>
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
              </button>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                · Verified Public Record
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                HIGH PRIORITY
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-400/40">
                TRIAGED
              </span>
            </div>
          </div>

          {/* Incident Overview */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-950 dark:text-white flex items-center justify-between">
              <span>Broken Streetlight near Main Gate</span>
              <span className="text-xs font-mono font-normal text-indigo-600 dark:text-indigo-400 hidden sm:inline-flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Active Triage
              </span>
            </h3>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                Sector 4 East Crossroad, Metro Block B
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Reported 2 hours ago
              </span>
            </div>
          </div>

          {/* Dynamic Panel based on tab */}
          {activeTab === "status" ? (
            <div className="space-y-4">
              {/* Progress Timeline Indicator */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111A2D] border border-slate-200/80 dark:border-[#334765] space-y-3 shadow-sm dark:shadow-black/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Resolution Lifecycle
                  </span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                    STAGE 03 / 05 · IN PROGRESS
                  </span>
                </div>

                {/* 5-Step Visual Track */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-emerald-500" />
                    <span className="block text-[9px] font-mono text-slate-400 uppercase truncate">
                      Reported
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-emerald-500" />
                    <span className="block text-[9px] font-mono text-slate-400 uppercase truncate">
                      Verified
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.45)]" />
                    <span className="block text-[9px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase truncate">
                      Assigned
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-[#4A607D]" />
                    <span className="block text-[9px] font-mono text-slate-400 uppercase truncate">
                      Repairing
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-[#4A607D]" />
                    <span className="block text-[9px] font-mono text-slate-400 uppercase truncate">
                      Resolved
                    </span>
                  </div>
                </div>
              </div>

              {/* Citizen Validation Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1E2D49] border border-slate-200/70 dark:border-[#3B5275] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 font-bold text-xs flex items-center justify-center font-display shrink-0">
                    AS
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      Aditi Sharma
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      Verified Resident · 4 reports
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1E2D49] border border-slate-200/70 dark:border-[#3B5275] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                        18 Neighbors
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                        Confirmed this issue
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +HIGH REACH
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Telemetry and Crew Dispatch */}
              <div className="bg-white dark:bg-[#263A59]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-indigo-500" /> Municipal
                    Operations
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                    CREW EN ROUTE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-white dark:bg-slate-700/70 p-3 rounded-xl border border-slate-200/60 dark:border-[#456080]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Assigned Crew
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                      Electrical Team 04
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Pole ID: #ST-8820-E
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-700/70 p-3 rounded-xl border border-slate-200/60 dark:border-slate-600/60">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Target Resolution
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      Within 4 Hours
                    </span>
                    <span className="text-[10px] text-slate-500">
                      SLA: 24h Standard
                    </span>
                  </div>
                </div>
              </div>

              {/* Coordinates & Accuracy */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1E2D49] border border-slate-200/70 dark:border-[#3B5275] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Geospatial precision: 28.5355° N, 77.3910° E
                  </span>
                </div>
                <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                  ACCURACY 99.8%
                </span>
              </div>
            </div>
          )}

          {/* Footer Dispatch Audit */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Real-time Database Sync (MongoDB)
            </span>
            <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
              Encrypted Audit Trail <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
