import React from 'react';
import { X, Download, ShieldCheck, CheckCircle2, Copy, Check } from 'lucide-react';
import INSTITUTION_CONFIG from '../config/institutionConfig.js';

export default function CertificatePreviewModal({ req, onClose, onDownload }) {
  const [copied, setCopied] = React.useState(false);

  if (!req) return null;

  const studentName = (req.fullName || req.username || 'STUDENT').toUpperCase();
  const enrollmentNo = req.enrollmentNo || 'N/A';
  const department = req.department || 'Engineering';
  const yearOfStudy = req.yearOfStudy || 'Diploma Study';
  const academicYear = req.academicYear || '2025-2026';
  const purpose = (req.purpose || 'OFFICIAL PURPOSE').toUpperCase();
  const certNo = req.certificateNumber || `GPM/CERT/${req.requestId || Date.now()}`;
  const issueDateStr = req.approvedDate || req.issueDate || new Date().toISOString();

  const formattedDate = new Date(issueDateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const istTimestamp = new Date(issueDateStr).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const verificationToken = req.verificationToken || 'VALID-TOKEN';
  const verificationUrl = `${window.location.origin}/verify/${verificationToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto custom-scrollbar">

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Live Certificate Preview</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Official Digital Bonafide Certificate Ledger Format</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Verify URL'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Certificate Rendered Canvas Frame */}
        <div className="bg-white text-slate-900 border-4 border-blue-900 p-8 sm:p-10 rounded-2xl shadow-xl font-serif space-y-6 relative overflow-hidden select-none">

          {/* Letterhead Header */}
          <div className="text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-blue-900 font-sans uppercase">
              {INSTITUTION_CONFIG.collegeName}
            </h1>
            <p className="text-xs font-semibold text-slate-600 font-sans">
              {INSTITUTION_CONFIG.address}
            </p>
            <div className="w-full h-0.5 bg-blue-900 my-3"></div>
          </div>

          {/* Reference Meta Table */}
          <div className="flex items-center justify-between text-xs font-bold font-sans text-slate-800">
            <div>Ref No: <span className="font-mono text-blue-800">{certNo}</span></div>
            <div>Date: <span>{formattedDate}</span></div>
          </div>

          {/* Title */}
          <div className="text-center pt-2">
            <h2 className="text-2xl font-extrabold text-red-700 font-sans tracking-wider border-b-2 border-red-700 inline-block pb-1">
              BONAFIDE CERTIFICATE
            </h2>
          </div>

          {/* Body Content */}
          <div className="text-sm leading-relaxed text-slate-900 text-justify font-serif space-y-4 pt-2">
            <p>
              This is to certify that Mr. / Ms. <strong className="font-sans uppercase text-blue-900 font-extrabold">{studentName}</strong>, bearing Enrollment No. <strong className="font-mono text-slate-900 font-bold">{enrollmentNo}</strong>, is a genuine and bonafide student of this institution studying in <strong className="font-sans font-bold">{yearOfStudy} ({department})</strong> during the Academic Year <strong className="font-sans font-bold">{academicYear}</strong>.
            </p>
            <p>
              This certificate is issued upon the student's request for the purpose of: <strong className="font-sans uppercase text-blue-900 font-extrabold">{purpose}</strong>. To the best of our knowledge, his/her character and conduct during the stay in the college have been GOOD.
            </p>
          </div>

          {/* Footer Grid: QR Code, Seal, & e-Sign Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 items-center text-center font-sans">

            {/* QR Code Simulation */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-20 h-20 bg-slate-900 text-white p-1 rounded border border-slate-300 flex items-center justify-center text-[9px] font-mono text-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verificationUrl)}`}
                  alt="QR Verification Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] text-slate-500 italic">Scan to Verify</span>
            </div>

            {/* Emblem Seal Box */}
            <div className="text-[10px] text-slate-600 italic">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-900 mx-auto flex items-center justify-center mb-1 text-[9px] font-bold text-blue-900">
                OFFICIAL SEAL
              </div>
              Government Polytechnic, Miraj
            </div>

            {/* Indian Govt Digital Signature Box */}
            <div className="bg-emerald-50 border-2 border-emerald-600 rounded-lg p-2.5 text-left text-[10px] space-y-1">
              <div className="flex items-center text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 shrink-0" />
                <span>Signature Valid</span>
              </div>
              <div className="text-slate-800 space-y-0.5 leading-tight text-[9px]">
                <p><strong>Digitally Signed by:</strong> Principal</p>
                <p><strong>Issuer:</strong> Govt Polytechnic Miraj CA</p>
                <p><strong>Date:</strong> {istTimestamp} IST</p>
                <p><strong>Reason:</strong> Official Document Approval</p>
              </div>
            </div>

          </div>

          {/* Verification Disclaimer */}
          <div className="text-[9px] text-center text-slate-500 font-sans italic pt-2 border-t border-slate-200">
            Note: System-generated document digitally signed under Indian e-Sign framework. Verify online at {verificationUrl}
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700"
          >
            Close Preview
          </button>
          {req.status === 'APPROVED' && onDownload && (
            <button
              onClick={() => onDownload(req.requestId, req.certificateNumber)}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-500 text-white shadow-lg flex items-center space-x-1.5 hover:scale-105 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
