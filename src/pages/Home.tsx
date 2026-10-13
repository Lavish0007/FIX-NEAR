import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  PlusCircle,
  Lightbulb,
  Droplet,
  Trash2,
  Copyright,
  Trees,
  Truck,
  MapPin,
  CheckCircle,
  FileText,
  Eye,
  Sliders,
  Sparkles,
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
import { HeroVisual } from "../components/HeroVisual";
import { PageTransition } from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [quickTrackId, setQuickTrackId] = useState("");
  const { isAuthenticated } = useAuth();

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTrackId.trim()) return;
    navigate(`/track?id=${encodeURIComponent(quickTrackId.trim())}`);
  };

  // Five exact citizen reports as specified in requirements
  const citizenReports = [
    {
      id: "CR-01",
      reporter: "Aditi Sharma",
      title: "Broken streetlight near Main Gate",
      category: "STREETLIGHT",
      location: "Near Main Gate",
      description:
        "The streetlight has not been working for the last two nights, making the area difficult to see after sunset.",
      featured: true,
      time: "2h ago",
    },
    {
      id: "CR-02",
      reporter: "Rahul Verma",
      title: "Large pothole on the road",
      category: "ROAD DAMAGE",
      location: "Near Market Road",
      description:
        "There is a large pothole in the middle of the road. Vehicles have to suddenly move around it, especially during busy hours.",
      featured: false,
      time: "5h ago",
    },
    {
      id: "CR-03",
      reporter: "Neha Singh",
      title: "Garbage overflowing from collection point",
      category: "GARBAGE",
      location: "Community Park Entrance",
      description:
        "The garbage collection point is overflowing and waste is spreading onto the nearby walkway.",
      featured: false,
      time: "Yesterday",
    },
    {
      id: "CR-04",
      reporter: "Arjun Mehta",
      title: "Water leakage near the footpath",
      category: "WATER LEAKAGE",
      location: "Near Block C",
      description:
        "Water appears to be continuously leaking near the footpath and the area remains wet throughout the day.",
      featured: false,
      time: "1d ago",
    },
    {
      id: "CR-05",
      reporter: "Priya Kapoor",
      title: "Damaged public bench",
      category: "PUBLIC SPACE",
      location: "Community Park",
      description:
        "One of the public benches has a damaged seat and should be repaired before someone gets injured.",
      featured: false,
      time: "2d ago",
    },
  ];

  // Steps for storytelling section
  const steps = [
    {
      number: "01",
      title: "Notice",
      tagline: "See something that needs attention.",
      details:
        "Whether it is a dark street, a damaged road surface, or leaking supply main, noticing is the first step toward civic resolution.",
      icon: Eye,
      previewLabel: "Observation Logged",
    },
    {
      number: "02",
      title: "Report",
      tagline: "Describe the problem and provide its location.",
      details:
        "Enter a title, select a category, write a brief description, and optionally upload a photograph for clear local verification.",
      icon: FileText,
      previewLabel: "Ticket Created",
    },
    {
      number: "03",
      title: "Track",
      tagline: "Keep your report ID and check its current status.",
      details:
        "Every report generates a permanent ID formatted like FX-20261002-4821. Search it anytime to see its lifecycle timeline.",
      icon: Sliders,
      previewLabel: "Unique ID Generated",
    },
    {
      number: "04",
      title: "Resolve",
      tagline: "Follow the progress of your submitted issue.",
      details:
        "Watch your submission transition through triage, assignment, and completion in our clear visual progress tracker.",
      icon: CheckCircle,
      previewLabel: "Resolution Target",
    },
  ];

  return (
    <PageTransition>
      <div className="w-full overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* ======================================================== */}
        {/* HERO SECTION                                            */}
        {/* ======================================================== */}
        <section className="fixnear-page fixnear-glow relative pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
          {" "}
          {/* Subtle background ambient radial light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
              {/* Left Column: Editorial Headline & Copy */}
              <div className="lg:col-span-6 space-y-8 pr-0 lg:pr-2 xl:pr-4 max-w-xl">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-900/60 text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400"></div>

                  <h1 className="text-4xl sm:text-6xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white font-display leading-[1.08]">
                    Your neighborhood.
                    <br />
                    <span className="text-slate-400 dark:text-slate-500 font-normal">
                      Your voice.
                    </span>
                    <br />
                    Your report.
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.18 }}
                    className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed pt-1"
                  >
                    FixNear empowers citizens to document everyday public
                    infrastructure defects, track municipal resolution in real
                    time, and build safer, cleaner communities.
                  </motion.p>
                </motion.div>

                {/* Primary & Secondary Action CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.28 }}
                    className="flex flex-wrap items-center gap-3.5"
                  >
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/my-reports"
                          className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-950/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                        >
                          <ClipboardList className="w-4 h-4 text-white" />
                          Track My Reports
                        </Link>

                        <Link
                          to="/report"
                          className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200/90 dark:border-slate-700 rounded-xl transition-all shadow-sm shadow-slate-950/5"
                        >
                          <PlusCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          Report an Issue
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-950/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                        >
                          Sign In to FixNear
                          <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                          to="/track"
                          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200/90 dark:border-slate-700 rounded-xl transition-all shadow-sm shadow-slate-950/5"
                        >
                          <Search className="w-4 h-4 text-slate-400" />
                          Track a Report
                        </Link>
                      </>
                    )}
                  </motion.div>

                  {/* Inline Quick Track Search */}
                  <form
                    onSubmit={handleQuickTrack}
                    className="flex items-center max-w-md bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-xl p-1.5 shadow-sm shadow-slate-950/5 focus-within:border-indigo-600 dark:focus-within:border-indigo-500 transition-colors"
                  >
                    <div className="pl-2.5 text-slate-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={quickTrackId}
                      onChange={(e) => setQuickTrackId(e.target.value)}
                      placeholder="Search Report ID (e.g. FX-20261002-4821)"
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                    >
                      Track
                    </button>
                  </form>
                </motion.div>

                {/* Proof Metrics Strip */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/70 dark:border-slate-800/80"
                >
                  <div>
                    <span className="text-xl sm:text-2xl font-bold font-display text-slate-950 dark:text-white block">
                      1,280+
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Reports Triaged
                    </span>
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-bold font-display text-slate-950 dark:text-white block">
                      94.8%
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Resolution Rate
                    </span>
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-bold font-display text-slate-950 dark:text-white block">
                      &lt; 48 hrs
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Avg. Dispatch Time
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: High-End Layered Operational Card */}
              {/* Positioned more towards the right with generous left padding so it never overlaps the text */}
              <div className="lg:col-span-6 lg:pl-10 xl:pl-16 flex justify-center lg:justify-end w-full">
                <HeroVisual />
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* WHAT WE HELP WITH */}
        {/* ======================================================== */}
        <section className="fixnear-section py-20 sm:py-24 border-b border-slate-200/80 dark:border-slate-800">
          {" "}
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mb-12 sm:mb-14"
            >
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                What FixNear helps with
              </span>

              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display leading-[1.08] text-slate-950 dark:text-white">
                Everyday problems deserve
                <span className="text-indigo-600 dark:text-indigo-400">
                  {" "}
                  attention.
                </span>
              </h2>

              <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                From potholes to broken streetlights, FixNear makes it easier to
                report neighborhood issues and follow them through resolution.
              </p>
            </motion.div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* Roads */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.5, delay: 0 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-6 sm:p-7 transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-100 dark:border-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Truck className="w-5 h-5" />
                </div>

                <h3 className="mt-6 text-xl font-bold font-display text-slate-950 dark:text-white">
                  Roads & Potholes
                </h3>

                <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Report potholes, damaged roads, broken curbs, and unsafe
                  pathways in your neighborhood.
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Road maintenance
                </div>
              </motion.div>

              {/* Streetlights */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="fixnear-card group rounded-2xl p-6 sm:p-7"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Lightbulb className="w-5 h-5" />
                </div>

                <h3 className="mt-6 text-xl font-bold font-display text-slate-950 dark:text-white">
                  Streetlights
                </h3>

                <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Report broken lamps, flickering lights, damaged fixtures, and
                  poorly lit public areas.
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Lighting & safety
                </div>
              </motion.div>

              {/* Waste */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-6 sm:p-7 transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Trash2 className="w-5 h-5" />
                </div>

                <h3 className="mt-6 text-xl font-bold font-display text-slate-950 dark:text-white">
                  Waste & Cleanliness
                </h3>

                <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Report overflowing bins, illegal dumping, and neglected public
                  spaces that need attention.
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Cleanliness
                </div>
              </motion.div>
            </div>

            {/* Small supporting row */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                },
              }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="fixnear-card min-h-[92px] flex items-center gap-3 px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <Droplet className="w-5 h-5 text-blue-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Water & Drainage
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Leaks, blocked drains & flooding
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="fixnear-card min-h-[92px] flex items-center gap-3 px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <Trees className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Public Spaces
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Parks, benches & public facilities
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="fixnear-card min-h-[92px] flex items-center gap-3 px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <MapPin className="w-5 h-5 text-purple-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Location-Based Reports
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pinpoint where the issue exists
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* "WHAT PEOPLE ARE REPORTING" SECTION                      */}
        {/* ======================================================== */}
        <section className="fixnear-section-muted py-20 sm:py-24 border-b border-slate-200/80 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
            >
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
                  Community Submissions
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display leading-[1.12] text-slate-950 dark:text-white">
                  What people are reporting
                </h2>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                  Actual neighborhood issues observed and submitted by local
                  residents.
                </p>
              </div>

              <Link
                to={isAuthenticated ? "/report" : "/login"}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline self-start md:self-auto"
              >
                Submit your own report
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Structured Category Presentation: 3 in row 1, 2 in row 2, identical box size */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 sm:gap-8">
              {citizenReports.map((report, idx) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className={`bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm shadow-slate-950/5 p-7 sm:p-8 flex flex-col justify-between h-full transition-all hover:shadow-md ${
                    idx === 3 ? "md:col-span-2 md:col-start-2" : "md:col-span-2"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700/80">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">
                          Submitted by
                        </span>
                        <span className="text-sm font-bold text-slate-950 dark:text-white truncate block">
                          {report.reporter}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 px-2 py-0.5 rounded-full">
                          {report.category}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold font-display text-slate-950 dark:text-white leading-snug">
                        {report.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="truncate">{report.location}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed min-h-[4rem] line-clamp-3 pt-1">
                        “{report.description}”
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      {report.id} · {report.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Logged
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* HOW IT WORKS STORYTELLING SECTION                        */}
        {/* ======================================================== */}
        <motion.section
          className="fixnear-section py-20 sm:py-24 border-b border-slate-200/80 dark:border-slate-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{ duration: 0.7 }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl mb-14 space-y-4"
            >
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.45 }}
                className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400 block"
              >
                Simple. Transparent. Trackable.
              </motion.span>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display leading-[1.08] text-slate-950 dark:text-white">
                From Report to Resolution
              </h2>

              <p className="max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Report a local issue, follow its progress, and know when action
                has been taken.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Interactive Step Selector */}
              <div className="lg:col-span-7 space-y-4">
                {steps.map((step, index) => {
                  const isActive = activeStep === index;

                  return (
                    <motion.div
                      key={step.number}
                      onClick={() => setActiveStep(index)}
                      initial={{ opacity: 0, x: -45 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.25 }}
                      transition={{
                        duration: 0.55,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                      whileHover={{ x: 6, scale: 1.01 }}
                      whileTap={{ scale: 0.995 }}
                      className={`group cursor-pointer rounded-2xl border transition-colors duration-300 p-6 sm:p-7 ${
                        isActive
                          ? "bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-500 dark:border-indigo-500 shadow-lg shadow-indigo-500/10"
                          : "bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <motion.span
                          animate={{
                            scale: isActive ? 1.08 : 1,
                            backgroundColor: isActive ? "#4F46E5" : undefined,
                          }}
                          transition={{ duration: 0.25 }}
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold font-display ${
                            isActive
                              ? "text-white shadow-md shadow-indigo-600/20"
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                          }`}
                        >
                          {step.number}
                        </motion.span>

                        <div className="flex-1 space-y-2">
                          <div className="space-y-1">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
                              {step.title}
                            </h3>

                            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                              {step.tagline}
                            </span>
                          </div>

                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {step.details}
                          </p>

                          <motion.div
                            initial={false}
                            animate={{
                              opacity: isActive ? 1 : 0,
                              height: isActive ? "auto" : 0,
                            }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                              View this step
                              <motion.span
                                animate={{ x: isActive ? 3 : 0 }}
                                transition={{
                                  duration: 0.3,
                                  repeat: isActive ? Infinity : 0,
                                  repeatType: "reverse",
                                  repeatDelay: 1,
                                }}
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </motion.span>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Column: Sticky Step Visual Preview */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <motion.div
                  initial={{ opacity: 0, x: 35, scale: 0.97 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className="fixnear-card relative overflow-hidden rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-950/5"
                >
                  <motion.div
                    animate={{
                      x: [0, 8, 0],
                      y: [0, -6, 0],
                      scale: [1, 1.04, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl"
                  />

                  <div className="relative flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <motion.span
                        animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-2 h-2 rounded-full bg-indigo-500"
                      />

                      <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Step {steps[activeStep].number} in action
                      </span>
                    </div>

                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      {activeStep + 1} / {steps.length}
                    </span>
                  </div>

                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 28, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative py-8 space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0.65, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.08,
                        ease: "easeOut",
                      }}
                      className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm"
                    >
                      {React.createElement(steps[activeStep].icon, {
                        className: "w-6 h-6",
                      })}
                    </motion.div>

                    <div>
                      <motion.h4
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.12 }}
                        className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white font-display"
                      >
                        {steps[activeStep].title}
                      </motion.h4>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.18 }}
                        className="mt-1.5 text-sm text-slate-500 dark:text-slate-400"
                      >
                        {steps[activeStep].tagline}
                      </motion.p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.2 }}
                      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                        <span>Stage Detail</span>

                        <span className="text-slate-900 dark:text-white font-semibold">
                          {steps[activeStep].previewLabel}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {steps[activeStep].details}
                      </p>
                    </motion.div>
                  </motion.div>

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                    <Link
                      to={isAuthenticated ? "/report" : "/login"}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
                    >
                      Start a report
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Track every stage
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ======================================================== */}
        {/* EDITORIAL BANNER SECTION (Refined Civic Slate/Indigo)     */}
        {/* ======================================================== */}

        <section className="relative overflow-hidden bg-slate-50 dark:bg-[#0B1120] text-slate-950 dark:text-white py-24 sm:py-28 lg:py-32 border-y border-slate-200 dark:border-[#334765] transition-colors duration-300">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -top-32 right-[-120px] h-96 w-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl" />

          <div className="pointer-events-none absolute bottom-[-180px] left-[-120px] h-96 w-96 rounded-full bg-sky-400/5 dark:bg-sky-400/5 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-24 items-center">
              {/* LEFT — MESSAGE */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <p className="text-xs sm:text-sm font-mono font-semibold tracking-[0.2em] uppercase text-indigo-600 dark:text-indigo-400 mb-6">
                  Civic impact
                </p>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.05] max-w-3xl text-slate-950 dark:text-white">
                  A visible problem
                  <br />
                  <span className="text-slate-400 dark:text-slate-500">
                    is easier to solve.
                  </span>
                </h2>

                <p className="mt-8 text-base sm:text-lg leading-8 text-slate-600 dark:text-slate-400 max-w-2xl">
                  When civic issues are documented clearly, they become easier
                  to understand, prioritize, and act on.
                </p>
              </motion.div>

              {/* RIGHT — REPORT VISUAL */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                className="relative"
              >
                {/* Soft glow */}
                <div className="absolute inset-8 rounded-3xl bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl" />

                {/* Report card */}
                <div className="relative rounded-3xl border border-slate-200 dark:border-[#3B5275] bg-white dark:bg-[#17233B] shadow-xl shadow-slate-200/60 dark:shadow-black/30 overflow-hidden transition-colors duration-300">
                  {/* Card header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-[#334765] bg-slate-50/70 dark:bg-[#1E2D49]/80">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                        Citizen report
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        Streetlight outage
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-400/20 bg-emerald-50 dark:bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                      VERIFIED
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-5 space-y-5">
                    {/* Ticket */}
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-[#3B5275] bg-slate-50 dark:bg-[#1E2D49] px-4 py-3 transition-colors duration-300">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Report ID
                        </p>

                        <p className="mt-1 font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
                          FX-20261002-4821
                        </p>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-100 dark:border-indigo-400/20">
                        <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Resolution progress
                        </span>

                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                          68%
                        </span>
                      </div>

                      <div className="h-1.5 rounded-full bg-slate-100 dark:bg-[#334765] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "68%" }}
                          viewport={{ once: false, amount: 0.5 }}
                          transition={{
                            duration: 1,
                            delay: 0.2,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400"
                        />
                      </div>
                    </div>

                    {/* Status timeline */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* Reported */}
                      <div className="rounded-xl border border-slate-200 dark:border-[#3B5275] bg-white dark:bg-[#1E2D49] p-3 transition-colors duration-300">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 mb-2" />

                        <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                          Reported
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                          Complete
                        </p>
                      </div>

                      {/* Assigned */}
                      <div className="rounded-xl border border-indigo-200 dark:border-indigo-400/30 bg-indigo-50/60 dark:bg-indigo-500/10 p-3 transition-colors duration-300">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400 mb-2 animate-pulse" />

                        <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                          Assigned
                        </p>

                        <p className="mt-1 text-[10px] text-indigo-600 dark:text-indigo-300">
                          Active
                        </p>
                      </div>

                      {/* Resolved */}
                      <div className="rounded-xl border border-slate-200 dark:border-[#3B5275] bg-white dark:bg-[#1E2D49] p-3 transition-colors duration-300">
                        <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 mb-2" />

                        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                          Resolved
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                          Pending
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* FINAL CONVERSION STRIP                                   */}
        {/* ======================================================== */}
        <section className="py-20 sm:py-24 bg-white dark:bg-[#0B1120] text-slate-950 dark:text-white border-t border-slate-200 dark:border-[#334765] transition-colors duration-300">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-8"
          >
            {/* Heading */}
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display max-w-2xl mx-auto text-balance text-slate-950 dark:text-white">
              Spotted an issue in your street today?
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Take 30 seconds to document it. Keep your generated ticket number
              to follow its status.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {/* Primary */}
              <Link
                to={isAuthenticated ? "/report" : "/login"}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl transition-all shadow-sm shadow-indigo-500/20"
              >
                Report an Issue
              </Link>

              {/* Secondary */}
              <Link
                to="/track"
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#17233B] hover:bg-slate-200 dark:hover:bg-[#1E2D49] border border-slate-200 dark:border-[#3B5275] rounded-xl transition-all"
              >
                Track Existing Report
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  );
};
