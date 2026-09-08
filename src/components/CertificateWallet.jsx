import React, { useState, useEffect } from 'react';
import { Award, Download, Eye, Copy, Check, Calendar, Building2, ShieldCheck, CheckCircle2, Clock, Lock } from 'lucide-react';

export default function CertificateWallet({ certificates, onPreview, onDownload }) {
  const [copiedId, setCopiedId] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyLink = (token, id) => {
    const url = `${window.location.origin}/verify/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const WALLET_DELAY_MS = 5 * 60 * 1000; // 5 Minutes

  const approvedCertificates = certificates.filter(c => c.status === 'APPROVED');

  const formatCountdown = (ms) => {
    const totalSecs = Math.max(0, Math.ceil(ms / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const unlockedCertificates = approvedCertificates.filter(c => {
    if (!c.approvedDate) return true;
    return (new Date(c.approvedDate).getTime() + WALLET_DELAY_MS) <= now;
  });

  const syncingCertificates = approvedCertificates.filter(c => {
    if (!c.approvedDate) return false;
    return (new Date(c.approvedDate).getTime() + WALLET_DELAY_MS) > now;
  });

  if (approvedCertificates.length === 0) {
    return (
      <div className="glass-card p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 bg-white/95 dark:bg-slate-900/60 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">No Issued Certificates Yet</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto font-medium">
          Once your certificate request is reviewed and approved by your Head of Department, your official digital certificate will appear here after a 5-minute security verification delay.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Syncing Certificates Section (Within 5-Minute Delay Window) */}
      {syncingCertificates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Digital Wallet Syncing In Progress ({syncingCertificates.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {syncingCertificates.map((cert) => {
              const remainingMs = (new Date(cert.approvedDate).getTime() + WALLET_DELAY_MS) - now;
              const countdownStr = formatCountdown(remainingMs);

              return (
                <div
                  key={cert.requestId}
                  className="glass-card p-6 rounded-3xl border-2 border-indigo-500/40 bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/40 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-950/30 shadow-md relative overflow-hidden space-y-4 animate-pulseHalo"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <Lock className="w-5 h-5" />
                      </span>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Certificate ID</span>
                        <span className="font-mono font-extrabold text-xs text-indigo-600 dark:text-indigo-400">{cert.certificateNumber || 'GPM/CERT'}</span>
                      </div>
                    </div>

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                      <Clock className="w-3.5 h-3.5 mr-1.5 animate-spin" /> UNLOCKS IN {countdownStr}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{cert.purpose || 'Bonafide Certificate'}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold flex items-center">
                      <Building2 className="w-3.5 h-3.5 mr-1 text-slate-500" /> {cert.department} • {cert.academicYear}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-indigo-100/50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-indigo-900 dark:text-indigo-200 font-bold">
                      <span>5-Minute Security Clearance Active</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{countdownStr} remaining</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      Your certificate was approved by HOD! It is undergoing anti-tamper signature indexing before entering your wallet.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center space-x-2 opacity-60">
                    <button
                      disabled
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold text-xs flex items-center justify-center space-x-1 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Wallet Locked ({countdownStr})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fully Unlocked Certificates Section */}
      {unlockedCertificates.length > 0 && (
        <div className="space-y-4">
          {syncingCertificates.length > 0 && (
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 pt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Available Digital Certificates ({unlockedCertificates.length})</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {unlockedCertificates.map((cert) => (
              <div
                key={cert.requestId}
                className="glass-card p-6 rounded-3xl border-2 border-emerald-500/30 bg-white/95 dark:bg-slate-900/80 shadow-md relative overflow-hidden space-y-5 card-hover-lift"
              >
                {/* Top Status Capsule */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      <Award className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Certificate ID</span>
                      <span className="font-mono font-extrabold text-xs text-blue-600 dark:text-blue-400">{cert.certificateNumber || 'GPM/CERT'}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> VALID
                  </span>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{cert.purpose || 'Bonafide Certificate'}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-slate-500" /> {cert.department} • {cert.academicYear}
                  </p>
                </div>

                {/* Dates */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between text-slate-600 dark:text-slate-400 font-semibold">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" /> Issued: {cert.approvedDate ? new Date(cert.approvedDate).toLocaleDateString() : 'Official'}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Anti-Tamper Signed</span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={() => onPreview(cert)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-extrabold text-xs border border-slate-300 dark:border-slate-700 flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => onDownload(cert.requestId, cert.certificateNumber)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download A4 PDF</span>
                  </button>

                  {cert.verificationToken && (
                    <button
                      onClick={() => handleCopyLink(cert.verificationToken, cert.requestId)}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-300 dark:border-slate-700"
                      title="Copy Public Verification Link"
                    >
                      {copiedId === cert.requestId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
