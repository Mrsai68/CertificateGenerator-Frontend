import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, CheckCircle2, ShieldAlert, Users, LogOut,
  Sun, Moon, Menu, X, ChevronRight, Sparkles, Building2, ShieldCheck, Activity, Award
} from 'lucide-react';
import { useAuth } from '../context/useAuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import INSTITUTION_CONFIG from '../config/institutionConfig.js';
import api from '../api/axios.js';

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    if (user?.role === 'ROLE_STUDENT') {
      api.get('/api/v1/student/profile')
        .then(res => {
          if (res.data?.fullName) {
            setStudentName(res.data.fullName);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleTitle = () => {
    if (user?.role === 'ROLE_ADMIN') return 'Super Admin Command Center';
    if (user?.role === 'ROLE_HOD') return `${user?.department || 'Department'} HOD Portal`;
    return 'Student Self-Service Portal';
  };

  let displayName = user?.username || 'User';
  let initialLetter = 'U';

  if (user?.role === 'ROLE_STUDENT') {
    displayName = studentName || user?.fullName || user?.username || 'Student';
    initialLetter = displayName.charAt(0).toUpperCase();
  } else if (user?.role === 'ROLE_HOD' || user?.role === 'ROLE_ADMIN') {
    displayName = user?.role === 'ROLE_ADMIN' ? 'Super Admin' : (user?.username || `HOD ${user?.department || 'Department'}`);
    const deptName = (user?.department && user.department !== 'ALL') ? user.department : (user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Department');
    initialLetter = deptName.charAt(0).toUpperCase();
  }

  const navItems = [
    {
      label: 'Main Portal Home',
      path: '/',
      icon: Building2,
      show: true
    },
    {
      label: 'Student Workspace',
      path: '/student-dashboard',
      icon: FileText,
      show: user?.role === 'ROLE_STUDENT'
    },
    {
      label: 'HOD Approval Queue',
      path: '/hod',
      icon: CheckCircle2,
      show: user?.role === 'ROLE_HOD' || user?.role === 'ROLE_ADMIN'
    },
    {
      label: 'Super Admin Control',
      path: '/admin',
      icon: ShieldAlert,
      show: user?.role === 'ROLE_ADMIN'
    }
  ];

  // If user is not logged in or on landing/auth/public verify page, render plain container
  const isStandalonePage = !user || ['/', '/login', '/register', '/forgot-password'].includes(location.pathname) || location.pathname.startsWith('/verify/');

  if (isStandalonePage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-transparent">

      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Left Sidebar Navigation Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 glass-card bg-white/95 dark:bg-slate-950/90 border-r border-slate-200 dark:border-slate-800/80 p-5 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Institution Brand Logo */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight leading-tight">
                  {INSTITUTION_CONFIG.collegeShortName} BONAFIDE
                </h2>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">
                  Quantum Ledger v2.0
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Capsule with Initial Letter Logo */}
          <div className="p-3.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center space-x-3 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0 border border-white/20">
              {initialLetter}
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                {displayName}
              </h4>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block truncate">
                {user?.role === 'ROLE_ADMIN' ? 'Super Admin' : user?.role === 'ROLE_HOD' ? `HOD (${user?.department || 'General'})` : 'Student User'}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 px-3 block mb-2">
              Portal Navigation
            </span>
            {navItems.filter(i => i.show).map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs px-2 font-semibold">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
              <Activity className="w-3 h-3 mr-1 animate-pulse" /> Live Server
            </span>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-extrabold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/50 transition-all flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Account</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header Control Bar */}
        <header className="sticky top-0 z-30 glass-card bg-white/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-300 dark:border-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {getRoleTitle()}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold hidden sm:block">
                {INSTITUTION_CONFIG.collegeName} • Automated Certificate Ledger
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Award className="w-3.5 h-3.5 mr-1 text-blue-600" />
              <span>MSBTE / DTE Govt Standard</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Component Render */}
        <main className="flex-1">
          {children}
        </main>
      </div>

    </div>
  );
}
