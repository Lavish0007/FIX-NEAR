import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Clock,
  MessageSquare,
  Sparkles,
  CheckCheck,
  RefreshCw,
} from 'lucide-react';
import { notificationService } from '../services/api';
import { PageTransition } from '../components/PageTransition';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll();
      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'STATUS_UPDATE':
        return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'COMMENT':
        return <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-24 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
                Activity Feed
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight font-display text-slate-950 dark:text-white">
                Notifications
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Real-time lifecycle updates on your neighborhood reports
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadNotifications}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors shadow-sm shadow-slate-950/5 cursor-pointer"
                title="Refresh notifications"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm shadow-slate-950/5 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {loading ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center shadow-sm shadow-slate-950/5">
                <div className="w-8 h-8 border-3 border-indigo-200 dark:border-indigo-900/60 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mx-auto mb-3" />
                <span className="text-xs text-slate-500 font-mono">Loading notifications...</span>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <motion.div
                  key={notif._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                    notif.read
                      ? 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 opacity-80'
                      : 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-900/60 shadow-sm'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
                      {notif.message}
                    </p>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      {new Date(notif.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {!notif.read && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold shrink-0 cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center space-y-3 shadow-sm shadow-slate-950/5">
                <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="text-base font-bold font-display text-slate-950 dark:text-white">No notifications yet</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Updates on submitted issues and crew assignments will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
