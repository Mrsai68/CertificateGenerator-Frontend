import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { ShieldCheck, ShieldAlert, Calendar, CheckCircle2, XCircle, FileCheck2, ArrowLeft, Copy, Check, QrCode, Search, FileText } from 'lucide-react';
import QrScannerModal from '../components/QrScannerModal.jsx';

export default function VerifyDocument() {
  const { certNo } = useParams();
  const navigate = useNavigate();

  const [certInput, setCertInput] = useState(certNo || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [copied, setCopied] = useState(false);

  const performVerification = async (targetQuery) => {
    if (!targetQuery || !targetQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/api/v1/public/verify-document', { query: targetQuery.trim() });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification service unavailable. Please try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certNo) {
      setCertInput(certNo);
      performVerification(certNo);
    }
  }, [certNo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (certInput.trim()) {
      let query = certInput.trim();
      if (query.includes('/verify/')) {
        query = query.split('/verify/')[1];
      }
      navigate(`/verify-document/${encodeURIComponent(query)}`);
      performVerification(query);
    }
  };

  const handleScanSuccess = (scannedText) => {
    setShowScanner(false);
    let cleaned = scannedText.trim();
    if (cleaned.includes('/verify/')) {
      cleaned = cleaned.split('/verify/')[1];
    }
    setCertInput(cleaned);
    navigate(`/verify-document/${encodeURIComponent(cleaned)}`);
    performVerification(cleaned);
  };

  const handleCopyLink = () => {
    const activeCertNo = data?.certificateNumber || certInput;
    const url = `${window.location.origin}/verify/${activeCertNo}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-transparent">
      <div className="w-full max-w-2xl space-y-6">

        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/20 text-white animate-pulseHalo mx-auto">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Verify Certificate Document</h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-semibold max-w-md mx-auto">
            Enter your Certificate Reference Number or scan the anti-tamper QR Code to verify document authenticity.
          </p>
        </div>

        {/* Verification Input & Scan Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 shadow-md space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Certificate Reference Number or Scanned Code
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  placeholder="e.g. CERT-123456..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Verifying...' : 'Verify Certificate Number'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="w-full sm:w-auto py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shrink-0"
              >
                <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Scan QR Code</span>
              </button>
            </div>
          </form>
        </div>

        {/* QR Scanner Modal */}
        {showScanner && (
          <QrScannerModal
            onClose={() => setShowScanner(false)}
            onScanSuccess={handleScanSuccess}
          />
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="glass-card p-10 rounded-3xl text-center space-y-3 bg-white/95 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold">Validating certificate record...</p>
          </div>
        )}

        {/* Invalid / Not Found Banner */}
        {!loading && (error || (data && !data.valid)) && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-2 border-rose-500/60 bg-rose-50 dark:bg-rose-950/20 shadow-xl text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/40 border border-rose-300 dark:border-rose-500/30 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-500 shadow-lg">
              <ShieldAlert className="w-10 h-10" />
            </div>

            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700/50 mb-2">
                <XCircle className="w-3.5 h-3.5 mr-1" /> VERIFICATION FAILED
              </span>
              <h3 className="text-xl font-extrabold text-rose-900 dark:text-rose-200">Invalid or Unverified Document</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 max-w-md mx-auto mt-1 font-medium">
                {error || data?.message || 'No active certificate document matches this Reference Number.'}
              </p>
            </div>
          </div>
        )}

        {/* Valid Certificate Result Card */}
        {!loading && data && data.valid && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/50 bg-white/95 dark:bg-slate-900/80 shadow-xl space-y-6 animate-fadeIn">

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-xl mb-3">
                <FileCheck2 className="w-10 h-10" />
              </div>
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/50">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" /> OFFICIAL CERTIFICATE VERIFIED
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">Authentic Bonafide Document</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-semibold">
                Ref No: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{data.certificateNumber}</span>
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Student Name</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{data.fullName}</span>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Enrollment Number</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 font-mono text-sm">{data.enrollmentNo}</span>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Department</span>
                <span className="font-bold text-slate-900 dark:text-slate-200">{data.department}</span>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Year of Study</span>
                <span className="font-bold text-slate-900 dark:text-slate-200">{data.yearOfStudy} ({data.academicYear})</span>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Purpose</span>
                <span className="font-extrabold text-blue-700 dark:text-blue-300 text-sm">{data.purpose}</span>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-600 dark:text-slate-400 font-semibold">
                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> Issued: {data.issueDate ? new Date(data.issueDate).toLocaleDateString() : 'Official'}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Status: VALID</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold">
              <span className="truncate pr-2">Link: {window.location.origin}/verify/{data.certificateNumber}</span>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 flex items-center space-x-1 shrink-0 font-sans"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

          </div>
        )}

        <div className="text-center pt-2">
          <Link to="/" className="inline-flex items-center text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Institution Home
          </Link>
        </div>

      </div>
    </div>
  );
}
