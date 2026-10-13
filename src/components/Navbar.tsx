import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  PlusCircle,
  Search,
  LayoutDashboard,
  Bell,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const location = useLocation();
  const { user, isAuthenticated, logout, theme, toggleTheme } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Check unread notifications periodically if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUnread = async () => {
      try {
        const res = await notificationService.getAll();
        if (res.success) {
          setUnreadCount(res.unreadCount || 0);
        }
      } catch (e) {
        // silent
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, location.pathname]);

  const guestNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'Track', path: '/track' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'About', path: '/about' },
  ];

  const authNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'My Reports', path: '/my-reports' },
    { label: 'Track Issue', path: '/track' },
    { label: 'Report Issue', path: '/report' },
  ];

  const navLinks = isAuthenticated ? authNavLinks : guestNavLinks;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 py-3.5 shadow-sm shadow-slate-950/5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
          >
            FixNear<span className="inline-block w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-400"
          >
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors whitespace-nowrap hover:text-slate-950 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded py-1 px-1 relative ${
                    active
                      ? 'text-slate-950 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1.5 left-1 right-1 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Auth States */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white rounded-lg transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </Link>

                {/* Primary CTA */}
                <Link
                  to="/report"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-950/10"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Report Issue
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm shadow-slate-950/5 cursor-pointer"
                  >
                    <span className="max-w-[100px] truncate">{user?.name || 'Account'}</span>
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center font-display">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-950/10 border border-slate-200/90 dark:border-slate-700 py-2 z-50 text-xs">
                      <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-700/80">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {user?.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                      </div>

                      <Link
                        to="/"
                        className="flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                        Dashboard
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Profile
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        Settings
                      </Link>

                      <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-700/80">
                        <button
                          type="button"
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/report"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-950/10"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report Issue
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 pb-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-xl space-y-3">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Profile ({user?.name})
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="w-full py-2.5 bg-indigo-600 text-white font-semibold text-center rounded-xl text-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
