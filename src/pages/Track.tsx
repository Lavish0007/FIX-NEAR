import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  Copy,
  Check,
  CheckCircle2,
  FileQuestion,
  MessageSquare,
  Send,
  FilePlus2,
  Clock,
  BadgeCheck,
  SearchCheck,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { ApiError, issueService, commentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/PageTransition';

const JOURNEY_STAGES = [
  {
    status: 'REPORTED',
    label: 'Reported',
    desc: 'Your issue has been submitted.',
    icon: FilePlus2,
  },
  {
    status: 'UNDER REVIEW',
    label: 'Under Review',
    desc: 'The report is being checked.',
    icon: SearchCheck,
  },
  {
    status: 'VERIFIED',
    label: 'Verified',
    desc: 'The issue has been confirmed.',
    icon: BadgeCheck,
  },
  {
    status: 'ASSIGNED',
    label: 'Assigned',
    desc: 'Assigned to the right team.',
    icon: Send,
  },
  {
    status: 'IN PROGRESS',
    label: 'In Progress',
    desc: 'Repair work is underway.',
    icon: Wrench,
  },
  {
    status: 'RESOLVED',
    label: 'Resolved',
    desc: 'The reported issue has been fixed.',
    icon: Sparkles,
  },
  {
    status: 'CLOSED',
    label: 'Closed',
    desc: 'The case has been completed.',
    icon: Check,
  },
];

export const Track: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const { isAuthenticated, user } = useAuth();

  const [searchInput, setSearchInput] = useState(queryId);
  const [activeReport, setActiveReport] = useState<any | null>(null);
  const [searchError, setSearchError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  // Comments
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Status update
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchReport = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setHasSearched(true);
    setSearchError('');
    setActiveReport(null);
    setComments([]);
    try {
      const res = await issueService.getById(id.trim());
      if (res.success && res.issue) {
        setActiveReport(res.issue);
        loadComments(res.issue.reportId || res.issue._id);
      } else {
        setSearchError('No report with that ID was found. Check the ID and try again.');
      }
    } catch (err: unknown) {
      setSearchError(
        err instanceof ApiError && err.status === 404
          ? 'No report with that ID was found. Check the ID and try again.'
          : err instanceof Error
            ? err.message
            : 'Unable to search reports right now. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (issueId: string) => {
    try {
      const res = await commentService.getByIssueId(issueId);
      if (res.success) setComments(res.comments);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  useEffect(() => {
    if (queryId) {
      setSearchInput(queryId);
      fetchReport(queryId);
    }
  }, [queryId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const reportId = searchInput.trim();
    if (!reportId) return;
    if (reportId.toLowerCase() === queryId.toLowerCase()) {
      fetchReport(reportId);
    } else {
      setSearchParams({ id: reportId });
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeReport) return;

    setSubmittingComment(true);
    try {
      const res = await commentService.add(activeReport.reportId, newComment.trim());
      if (res.success && res.comment) {
        setComments((prev) => [...prev, res.comment]);
        setNewComment('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!activeReport) return;
    setUpdatingStatus(true);
    try {
      const res = await issueService.updateStatus(activeReport.reportId, newStatus);
      if (res.success && res.issue) {
        setActiveReport(res.issue);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStageIndex = (status: string) => {
    const idx = JOURNEY_STAGES.findIndex((s) => s.status === status?.toUpperCase());
    return idx !== -1 ? idx : 0;
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-28 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {/* Header */}
          <div className="space-y-3 mb-10">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Report lookup
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-950 dark:text-white">
              Track a Report
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Search a report ID to view its current status, details, and discussion.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mb-12">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm shadow-slate-950/5 focus-within:border-indigo-600 dark:focus-within:border-indigo-500 transition-all">
                <div className="relative flex-1 flex items-center">
                  <Search aria-hidden="true" className="w-5 h-5 text-slate-400 absolute left-4" />
                  <input
                    type="text"
                    aria-label="Report ID"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter your report ID (e.g. FX-20261002-4821)"
                    required
                    className="w-full pl-12 pr-4 py-3 text-sm bg-transparent focus:outline-none font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-950/10 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  {loading ? 'Searching...' : 'Track Issue'}
                </button>
              </div>
            </form>
          </div>

          {/* Result Section */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="p-16 text-center text-xs font-mono text-slate-400">
                <div className="w-8 h-8 border-3 border-indigo-200 dark:border-indigo-900/60 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mx-auto mb-3" />
                Searching reports...
              </div>
            ) : hasSearched ? (
              activeReport ? (
                /* Found Report */
                <motion.div
                  key="found"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Top Dossier Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-8 sm:p-10 shadow-sm shadow-slate-950/5 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/80">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => copyId(activeReport.reportId)}
                          className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-700/80 rounded-xl font-mono text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 inline-flex items-center gap-2 transition-colors border border-slate-200/60 dark:border-slate-600/60"
                        >
                          <span>{activeReport.reportId}</span>
                          {copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                        <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                          {activeReport.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            activeReport.status === 'RESOLVED'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                              : activeReport.status === 'IN PROGRESS'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                          }`}
                        >
                          {activeReport.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-950 dark:text-white">
                        {activeReport.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          {activeReport.location}
                        </span>
                        {activeReport.landmark && (
                          <>
                            <span>·</span>
                            <span>Landmark: {activeReport.landmark}</span>
                          </>
                        )}
                        <span>·</span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          Logged {new Date(activeReport.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeReport.description}
                    </div>

                    {activeReport.imageUrl && (
                      <div className="space-y-2">
                        <span className="text-xs font-mono uppercase text-slate-400 block font-semibold">
                          Attached image
                        </span>
                        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-w-md h-56 bg-slate-100 dark:bg-slate-900">
                          <img
                            src={activeReport.imageUrl}
                            alt={activeReport.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Visual Status Journey */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-8 sm:p-10 shadow-sm shadow-slate-950/5 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/80">
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold block">
                          Visual Status Journey
                        </span>
                        <h3 className="text-xl font-bold font-display text-slate-950 dark:text-white mt-0.5">
                          Report status timeline
                        </h3>
                      </div>

                      {activeReport.resolvedAt && (
                        <div className="text-right">
                          <span className="text-[11px] font-mono text-slate-400 uppercase block">Fixed Date</span>
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {new Date(activeReport.resolvedAt).toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Timeline Stages */}
                    {/* Timeline Stages */}
<div className="relative pt-4">

  {/* Connecting line - desktop */}
  <div className="hidden lg:block absolute top-[42px] left-[8%] right-[8%] h-px bg-slate-200 dark:bg-slate-700" />

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-2">

    {JOURNEY_STAGES.map((stage, idx) => {
      const currentIdx = getStageIndex(activeReport.status);
      const isPassed = idx < currentIdx;
      const isCurrent = idx === currentIdx;
      const Icon = stage.icon;

      return (
        <motion.div
          key={stage.status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06, duration: 0.3 }}
          className="relative flex flex-col items-center text-center"
        >

          {/* Step number */}
          <span
            className={`mb-3 text-[10px] font-mono font-bold tracking-wider ${
              isCurrent
                ? 'text-indigo-600 dark:text-indigo-400'
                : isPassed
                ? 'text-slate-400 dark:text-slate-500'
                : 'text-slate-300 dark:text-slate-600'
            }`}
          >
            0{idx + 1}
          </span>

          {/* Stage icon */}
          <div
            className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-slate-800 transition-all duration-300 ${
              isCurrent
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-110'
                : isPassed
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>

          {/* Stage information */}
          <div className="mt-4 max-w-[135px]">

            <h4
              className={`text-sm font-bold ${
                isCurrent
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : isPassed
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {stage.label}
            </h4>

            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {stage.desc}
            </p>

            {/* Current stage */}
            {isCurrent && (
              <span className="mt-3 inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Active Stage
              </span>
            )}

            {/* Completed stage */}
            {isPassed && (
              <span className="mt-3 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <CheckCircle2 className="w-3 h-3" />
                Complete
              </span>
            )}

          </div>

        </motion.div>
      );
    })}

  </div>
</div>

                    {/* Interactive Testing Status Control */}
                    {isAuthenticated &&
                      user?.id === String(
                        typeof activeReport.userId === 'object'
                          ? activeReport.userId?._id
                          : activeReport.userId
                      ) && (
                      <div className="pt-6 border-t border-slate-100 dark:border-slate-700/80 space-y-2">
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                          Update your report status
                        </span>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => handleStatusChange('UNDER REVIEW')}
                            disabled={updatingStatus || activeReport.status === 'UNDER REVIEW'}
                            className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-all disabled:opacity-40 cursor-pointer"
                          >
                            Under Review
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange('IN PROGRESS')}
                            disabled={updatingStatus || activeReport.status === 'IN PROGRESS'}
                            className="px-3 py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-xl font-semibold transition-all disabled:opacity-40 cursor-pointer"
                          >
                            In Progress
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange('RESOLVED')}
                            disabled={updatingStatus || activeReport.status === 'RESOLVED'}
                            className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-xl font-semibold transition-all disabled:opacity-40 cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Community Comments Thread */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-8 shadow-sm shadow-slate-950/5 space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/80">
                      <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <h3 className="text-base font-bold font-display text-slate-950 dark:text-white">
                        Issue Discussion &amp; Updates ({comments.length})
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {comments.length > 0 ? (
                        comments.map((comm) => (
                          <div
                            key={comm._id}
                            className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-750 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {comm.userName}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                {new Date(comm.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                              {comm.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          No comments posted on this issue yet.
                        </p>
                      )}
                    </div>

                    {isAuthenticated ? (
                      <form onSubmit={handleAddComment} className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a field comment or status observation..."
                          className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 shadow-sm shadow-slate-950/5"
                        />
                        <button
                          type="submit"
                          disabled={submittingComment || !newComment.trim()}
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm shadow-indigo-950/10 disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Post
                        </button>
                      </form>
                    ) : (
                      <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700/80">
                        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">
                          Sign in
                        </Link>{' '}
                        to add comments.
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* Report Not Found (Tactile Empty State) */
                <div className="p-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 text-center space-y-4 max-w-xl mx-auto shadow-sm shadow-slate-950/5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-900/40">
                    <FileQuestion className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-950 dark:text-white">
                    {searchError.includes('No report with that ID')
                      ? 'Report not found'
                      : 'Unable to search reports'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {searchError || 'Please check the report ID and try again.'}{' '}
                    {searchError.includes('No report with that ID') && (
                      <>The format is typically{' '}
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                      FX-YYYYMMDD-XXXX
                    </span>
                      .</>
                    )}
                  </p>
                </div>
              )
            ) : (
              /* Pre-search Prompt */
              <div className="p-8 sm:p-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 max-w-2xl space-y-2 shadow-sm shadow-slate-950/5">
                <h3 className="text-base font-bold font-display text-slate-950 dark:text-white">Where to find your Report ID</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every civic submission produces a standardized ticket code (e.g.{' '}
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">FX-20261002-4821</span>). You can also
                  view all your logged tickets anytime inside{' '}
                  <Link to="/my-reports" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">
                    My Reports
                  </Link>
                  .
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};
