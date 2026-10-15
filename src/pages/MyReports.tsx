import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Inbox,
  PlusCircle,
  Search,
  MapPin,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { issueService } from '../services/api';
import { PageTransition } from '../components/PageTransition';

export const MyReports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const loadReports = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await issueService.getMyIssues();
      if (res.success) {
        setReports(res.issues);
      } else {
        setErrorMessage('Unable to load your reports. Please try again.');
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to load your reports. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this report record?')) return;

    try {
      const res = await issueService.delete(id);
      if (res.success) {
        setReports((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete report.');
    }
  };

  const copyId = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter computation
  const filteredReports = reports.filter((report) => {
    const matchesStatus =
      statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority =
      priorityFilter === 'all' || report.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-28 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/80 dark:border-slate-800">
            <div className="space-y-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
                Civic Records Registry
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
                My Reports
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
                View the reports submitted from your account and their current stored status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadReports}
                aria-label="Refresh reports"
                disabled={loading}
                className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors shadow-sm shadow-slate-950/5 cursor-pointer"
                title="Refresh reports"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-950/10"
              >
                <PlusCircle className="w-4 h-4" />
                Report an Issue
              </Link>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="py-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, location, or FX-ID..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm shadow-slate-950/5 transition-colors cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="REPORTED">Reported</option>
                <option value="UNDER REVIEW">Under Review</option>
                <option value="VERIFIED">Verified</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm shadow-slate-950/5 transition-colors cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {/* Reports Content */}
          {loading ? (
            <div className="p-16 text-center text-xs font-mono text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-200 dark:border-indigo-900/60 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mx-auto mb-3" />
              Loading your reports...
            </div>
          ) : errorMessage ? (
            <div
              role="alert"
              className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
            >
              <p>{errorMessage}</p>
              <button
                type="button"
                onClick={loadReports}
                className="mt-4 rounded-lg border border-red-300 px-4 py-2 font-semibold transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-800 dark:hover:bg-red-950/50"
              >
                Try again
              </button>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <motion.div
                  key={report._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm shadow-slate-950/5 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Header Row: Report ID + Copy + Status */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/80 text-xs">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-950 dark:text-white">
                          {report.reportId}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => copyId(report.reportId, e)}
                          className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 cursor-pointer"
                          title="Copy ID"
                        >
                          {copiedId === report.reportId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          report.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                            : report.status === 'IN PROGRESS'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    {/* Issue Title & Category */}
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase text-[11px]">
                          {report.category}
                        </span>
                        <span>·</span>
                        <span className="font-mono text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">
                          {report.priority}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-950 dark:text-white font-display leading-snug">
                        {report.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{report.location}</span>
                      </div>
                    </div>

                    {/* Added & Fixed Dates */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-750/70 rounded-xl text-[11px] font-mono space-y-1 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700/50">
                      <div className="flex justify-between">
                        <span>Added:</span>
                        <span className="text-slate-900 dark:text-slate-200">
                          {new Date(report.createdAt).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fixed:</span>
                        <span
                          className={
                            report.resolvedAt
                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'text-slate-400'
                          }
                        >
                          {report.resolvedAt
                            ? new Date(report.resolvedAt).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-slate-750/50 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(report._id, e)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>

                    <Link
                      to={`/track?id=${report.reportId}`}
                      className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      Details &amp; Timeline
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Tactile, Warm Empty State (Requirement 3) */
            <div className="p-12 sm:p-16 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm shadow-slate-950/5 text-center space-y-4 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-900/50">
                <Inbox className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'No matching reports found'
                    : 'No reports logged yet'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Try clearing your search query or reset the category and priority filters.'
                    : 'Spot an infrastructure issue in your neighborhood? Submit your first report to start tracking its resolution.'}
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-950/10"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report an Issue
                </Link>

                {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
                    }}
                    className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
