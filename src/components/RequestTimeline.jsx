import React, { useState, useEffect } from 'react';
import {
  FileText, Clock, CheckCircle2, XCircle, Award, Building2,
  Calendar, ShieldCheck, ArrowRight, Sparkles, UserCheck, AlertCircle, Check
} from 'lucide-react';

export default function RequestTimeline({ request }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!request) return null;

  const isPending = request.status === 'PENDING';
  const isApproved = request.status === 'APPROVED';
  const isRejected = request.status === 'REJECTED';

  // 5-Minute Digital Wallet Security Release Delay
  const WALLET_DELAY_MS = 5 * 60 * 1000;
  const approvedTime = request.approvedDate ? new Date(request.approvedDate).getTime() : 0;
  const remainingMs = isApproved ? (approvedTime + WALLET_DELAY_MS) - now : 0;
  const isWalletUnlocked = isApproved && remainingMs <= 0;

  const formatCountdown = (ms) => {
    const totalSecs = Math.max(0, Math.ceil(ms / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate progress percentage
  let progressPct = 33; // Step 1 & 2 Under Review
  if (isRejected) progressPct = 66; // Failed at review stage
  else if (isApproved) {
    progressPct = isWalletUnlocked ? 100 : 80; // 80% while 5-min delay active, 100% when unlocked
  }

  const appliedFormatted = request.appliedDate
    ? new Date(request.appliedDate).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : 'Date Recorded';

  const approvedFormatted = request.approvedDate
    ? new Date(request.approvedDate).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : (isRejected ? 'Action Completed' : 'Awaiting Review');

  const timelineSteps = [
    {
      step: 1,
      title: 'Application Submitted',
      subtitle: `Purpose: ${request.purpose}`,
      timestamp: appliedFormatted,
      status: 'completed',
      icon: FileText,
      badge: 'Step 1'
    },
    {
      step: 2,
      title: 'Department HOD Verification',
      subtitle: `${request.department || 'Department'} Review Queue`,
      timestamp: isPending ? 'Currently Under Review...' : 'Review Completed',
      status: isPending ? 'current' : 'completed',
      icon: Clock,
      badge: 'Step 2'
    },
    {
      step: 3,
      title: isRejected ? 'Application Rejected' : 'Approval & Digital Seal',
      subtitle: isApproved ? `Official Ref: ${request.certificateNumber || 'GPM/CERT'}` : (isRejected ? `Remarks: "${request.remarks || 'Incomplete documentation'}"` : 'Pending HOD Digital Signature'),
      timestamp: approvedFormatted,
      status: isApproved ? 'completed' : (isRejected ? 'error' : 'upcoming'),
      icon: isRejected ? XCircle : CheckCircle2,
      badge: 'Step 3'
    },
    {
      step: 4,
      title: isApproved ? (isWalletUnlocked ? 'Digital Wallet Available' : 'Digital Wallet Syncing') : 'Digital Wallet Availability',
      subtitle: isApproved
        ? (isWalletUnlocked
            ? 'A4 PDF Download & QR Verification Active'
            : `5-Min Security Release Lock Active (Unlocks in ${formatCountdown(remainingMs)})`)
        : (isRejected ? 'Application Terminated' : 'Unlocks Upon HOD Approval'),
      timestamp: isApproved
        ? (isWalletUnlocked ? 'Ready in Wallet' : `Syncing in ${formatCountdown(remainingMs)}`)
        : 'Locked',
      status: isApproved ? (isWalletUnlocked ? 'completed' : 'current') : (isRejected ? 'error' : 'upcoming'),
      icon: Award,
      badge: 'Step 4'
    }
  ];

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 shadow-md space-y-6 animate-fadeIn">

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Live Certificate Lifecycle Timeline</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold">Real-time status tracking from submission to official issuance</p>
        </div>

        <div className="flex items-center space-x-3">
          {isPending && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800/50 shadow-xs">
              <Clock className="w-3.5 h-3.5 mr-1.5 animate-spin" /> UNDER HOD REVIEW
            </span>
          )}
          {isApproved && (
            isWalletUnlocked ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/50 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> APPROVED & WALLET READY
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800/50 shadow-xs">
                <Clock className="w-3.5 h-3.5 mr-1.5 animate-spin" /> APPROVED (WALLET SYNC: {formatCountdown(remainingMs)})
              </span>
            )
          )}
          {isRejected && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800/50 shadow-xs">
              <XCircle className="w-3.5 h-3.5 mr-1.5" /> REQUEST REJECTED
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider">Overall Clearance Progress</span>
          <span className="text-blue-600 dark:text-blue-400 font-mono">{progressPct}% Completed</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isRejected
                ? 'bg-rose-500'
                : isApproved
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Real Timeline Node Stepper (Desktop Horizontal & Mobile Vertical) */}
      <div className="relative pt-4 pb-2">
        {/* Connecting Line background */}
        <div className="hidden md:block absolute top-12 left-10 right-10 h-1 bg-slate-200 dark:bg-slate-800 -z-0 rounded" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {timelineSteps.map((s) => {
            const Icon = s.icon;
            const isDone = s.status === 'completed';
            const isCurr = s.status === 'current';
            const isErr = s.status === 'error';

            let circleStyle = "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400";
            if (isDone) {
              circleStyle = "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30";
            } else if (isCurr) {
              circleStyle = "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 animate-pulseHalo ring-4 ring-blue-500/20";
            } else if (isErr) {
              circleStyle = "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30";
            }

            return (
              <div key={s.step} className="flex md:flex-col items-start md:items-center text-left md:text-center space-x-4 md:space-x-0 space-y-0 md:space-y-3">
                {/* Node Circle */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all shrink-0 ${circleStyle}`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Node Text Content */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                    {s.badge}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-tight">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold line-clamp-2">
                    {s.subtitle}
                  </p>
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block pt-1">
                    {s.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Remarks / Details Drawer Box */}
      {request.remarks && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start space-x-3 text-xs">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 block">Department Remarks:</span>
            <p className="text-slate-700 dark:text-slate-300 font-semibold mt-0.5">"{request.remarks}"</p>
          </div>
        </div>
      )}

    </div>
  );
}
