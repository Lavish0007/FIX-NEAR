import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-sm shadow-slate-950/5">
          <div className="w-7 h-7 border-2 border-indigo-200 dark:border-indigo-900/60 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Loading FixNear...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
