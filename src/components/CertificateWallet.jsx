import React, { useState } from 'react';
import { Award, Download, Eye, Copy, Check, ExternalLink, Calendar, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CertificateWallet({ certificates, onPreview, onDownload }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyLink = (token, id) => {
    const url = `${window.location.origin}/verify/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const approvedCertificates = certificates.filter(c => c.status === 'APPROVED');

  if (approvedCertificates.length === 0) {
    return (
      <div className="glass-card p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 bg-white/95 dark:bg-slate-900/60 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">No Issued Certificates Yet</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto font-medium">
          Once your certificate request is reviewed and approved by your Head of Department, your official digital certificate will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {approvedCertificates.map((cert) => (
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
  );
}
