import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LogOut, Sun, Moon, LayoutDashboard, UserCheck, ShieldAlert, Building2 } from 'lucide-react';
import { useAuth } from "../context/useAuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import INSTITUTION_CONFIG from "../config/institutionConfig.js";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ROLE_ADMIN') return '/admin';
    if (user.role === 'ROLE_HOD') return '/hod';
    return '/student-dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/80 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo Section */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src="/msbte.png"
                  alt="MSBTE Emblem"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 hidden" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight block leading-tight">
                  {INSTITUTION_CONFIG.collegeShortName} BONAFIDE
                </span>
                <span className="text-[10px] text-slate-500 font-semibold block hidden sm:block">
                  Digital Certificate Ledger
                </span>
              </div>
            </Link>

            {/* Quick Navigation Links */}
            {user && (
              <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-200 dark:border-slate-800 text-xs font-extrabold">
                <Link
                  to={getDashboardPath()}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                    location.pathname.includes('/dashboard') || location.pathname.includes('/admin') || location.pathname.includes('/hod')
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>My Dashboard</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">

            {/* Theme Switcher Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                {/* Role Badge */}
                <div className="hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                  {user.role === 'ROLE_ADMIN' ? 'Super Admin' : user.role === 'ROLE_HOD' ? `HOD (${user.department || 'General'})` : 'Student Portal'}
                </div>

                <div className="flex items-center space-x-3 pl-2 border-l border-slate-300 dark:border-slate-800">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-200 leading-tight">{user.fullName || user.username}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{user.enrollmentNo || user.role.replace('ROLE_', '')}</p>
                  </div>
                  <button
                    id="logout-btn"
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-extrabold text-slate-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
