import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/useAuthContext.jsx";
import { useNavigate } from "react-router-dom";
import INSTITUTION_CONFIG from "../config/institutionConfig.js";
import {
  FileText, PlusCircle, Download, Clock, CheckCircle2, XCircle, Award, Building2,
  AlertCircle, RefreshCw, Sparkles, Edit3, LogOut, Loader2, Eye, LayoutGrid, List, Copy, Check, User, X
} from 'lucide-react';
import api from "../api/axios.js";
import CertificatePreviewModal from '../components/CertificatePreviewModal.jsx';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [purpose, setPurpose] = useState(INSTITUTION_CONFIG.certificatePurposes[0] || 'Scholarship Application (MahaDBT / National Scholarship)');
  const [customPurpose, setCustomPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forbiddenError, setForbiddenError] = useState(false);
  const [previewReq, setPreviewReq] = useState(null);
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' | 'TABLE'
  const [copiedId, setCopiedId] = useState(null);

  // Edit Profile State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    enrollmentNo: '',
    department: '',
    yearOfStudy: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);

  const isOtherSelected = purpose.includes('Other');

  const handleApply = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const finalPurpose = isOtherSelected ? (customPurpose.trim() ? `Other: ${customPurpose.trim()}` : '') : purpose;

    if (!finalPurpose) {
      setError('Please specify the custom purpose for your Bonafide certificate.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/api/v1/requests/apply', { purpose: finalPurpose });
      setSuccess(`Application submitted successfully for ${finalPurpose}!`);
      setRequests([res.data, ...requests]);
      if (isOtherSelected) {
        setCustomPurpose('');
      }
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setForbiddenError(true);
      }
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await api.get('/api/v1/requests/my-requests');
      setRequests(res.data || []);
      setForbiddenError(false);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setForbiddenError(true);
      }
      console.error('Failed to fetch requests', err);
    } finally {
      setFetching(false);
    }
  };

  const fetchStudentProfile = async () => {
    try {
      const res = await api.get('/api/v1/student/profile');
      if (res.data) {
        setStudentProfile(res.data);
        setProfileForm({
          fullName: res.data.fullName || '',
          enrollmentNo: res.data.enrollmentNo || '',
          department: res.data.department || INSTITUTION_CONFIG.departments[0],
          yearOfStudy: res.data.yearOfStudy || INSTITUTION_CONFIG.yearsOfStudy[0]
        });
      }
    } catch (err) {
      console.error('Failed to fetch student profile', err);
    }
  };

  useEffect(() => {
    fetchMyRequests();
    fetchStudentProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);

    try {
      const res = await api.put('/api/v1/student/profile', profileForm);
      setStudentProfile(prev => ({ ...prev, ...profileForm }));
      setShowEditProfileModal(false);
      fetchMyRequests(); // Refresh requests so updated fullName reflects everywhere
    } catch (err) {
      alert('Failed to update profile: ' + (err.response?.data?.message || err.message));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleReLogin = () => {
    logout();
    navigate('/login');
  };

  const handleDownload = async (requestId, certNo) => {
    setDownloadingId(requestId);
    try {
      const response = await api.get(`/api/v1/certificates/download/${requestId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bonafide_Certificate_${certNo || requestId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      let errorMsg = 'Error generating PDF certificate';
      if (err.response?.status === 403 || err.response?.status === 401) {
        setForbiddenError(true);
        errorMsg = 'Session expired. Please click Re-Login Now.';
      } else if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          if (json.message) errorMsg = json.message;
        } catch (e) {
          errorMsg = 'Failed to download certificate PDF';
        }
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      alert('Download Error: ' + errorMsg);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopyLink = (token, reqId) => {
    if (!token) return;
    const url = `${window.location.origin}/verify/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(reqId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const displayName = studentProfile?.fullName || user?.fullName || user?.username || 'Student';
  const displayEnrollment = studentProfile?.enrollmentNo || user?.enrollment || user?.enrollmentNo || 'N/A';
  const displayDept = studentProfile?.department || user?.department || 'General';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">

      {/* Forbidden 403 Session Error Banner */}
      {forbiddenError && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/80 border-2 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-pulse">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <h4 className="font-extrabold text-sm">Session Permission Update Required (HTTP 403)</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 font-medium">
                Your browser is holding an outdated session token. Please click <strong>Re-Login</strong> to issue a fresh security token.
              </p>
            </div>
          </div>
          <button
            onClick={handleReLogin}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all flex items-center space-x-1.5 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Re-Login Now</span>
          </button>
        </div>
      )}

      {/* Student Profile Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 relative overflow-hidden shadow-xs animate-slideInDown card-hover-lift">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none animate-pulseGlow"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-600/30 animate-pulseHalo">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{displayName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50">
                  Active Student
                </span>
                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400 border border-slate-300 dark:border-slate-700 transition-colors btn-animated"
                  title="Edit Profile Full Name & Details"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-4 font-semibold">
                <span className="flex items-center"><Award className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" /> {displayEnrollment}</span>
                <span className="flex items-center"><Building2 className="w-4 h-4 mr-1 text-indigo-600 dark:text-indigo-400" /> {displayDept}</span>
                {studentProfile?.yearOfStudy && (
                  <span className="flex items-center text-xs text-purple-600 dark:text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                    {studentProfile.yearOfStudy}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs bg-slate-100 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 self-stretch md:self-auto justify-around">
            <div>
              <span className="text-slate-600 dark:text-slate-500 block font-semibold">Institution</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-200">{INSTITUTION_CONFIG.collegeShortName}</span>
            </div>
            <div className="h-8 w-px bg-slate-300 dark:bg-slate-800"></div>
            <div>
              <span className="text-slate-600 dark:text-slate-500 block font-semibold">Total Applied</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">{requests.length} Requests</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Application Submission Form */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 h-fit space-y-6 bg-white/95 dark:bg-slate-900/60 shadow-xs card-hover-lift animate-slideInLeft">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">New Certificate Application</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Select purpose & submit for HOD review</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Purpose of Bonafide Certificate
              </label>
              <select
                id="apply-purpose-select"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 transition-all text-sm font-semibold"
              >
                {INSTITUTION_CONFIG.certificatePurposes.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Conditional Custom Purpose Field */}
            {isOtherSelected && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 mb-1.5 uppercase tracking-wider flex items-center">
                  <Edit3 className="w-3.5 h-3.5 mr-1" /> Specify Custom Purpose *
                </label>
                <textarea
                  id="custom-purpose-input"
                  rows={2}
                  required
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  placeholder="Please explain the specific reason for requesting this certificate..."
                  className="w-full p-3 bg-slate-100 dark:bg-slate-950 border-2 border-blue-400 dark:border-blue-700/60 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm font-semibold focus:outline-none"
                />
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 space-y-2 font-medium">
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Automated Verification Workflow
              </div>
              <p>Approved certificates generate an official digital PDF with embedded anti-tamper QR code sent to your registered email.</p>
            </div>

            <button
              id="submit-request-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.01]"
            >
              {loading ? (
                <span>Submitting Application...</span>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Requests Grid / Table Viewport */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section Header with View Toggle */}
          <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/95 dark:bg-slate-900/60 shadow-xs">
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">My Certificate Ledger</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Real-time approval status, previews, and PDF downloads</p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-300 dark:border-slate-800">
                <button
                  onClick={() => setViewMode('GRID')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'GRID' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Grid Bento View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('TABLE')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'TABLE' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => { fetchMyRequests(); fetchStudentProfile(); }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-300 dark:border-slate-800"
                title="Refresh Queue"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {fetching ? (
            <div className="glass-card p-12 rounded-3xl text-center text-slate-600 dark:text-slate-500 text-sm font-semibold">
              Loading application records...
            </div>
          ) : requests.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl text-center text-slate-600 dark:text-slate-500 text-sm font-semibold">
              No certificate requests submitted yet. Select a purpose on the left to get started.
            </div>
          ) : viewMode === 'GRID' ? (
            /* Bento Cards Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {requests.map((req) => (
                <div
                  key={req.requestId}
                  className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400">
                        <FileText className="w-5 h-5" />
                      </span>
                      {req.status === 'PENDING' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800/50">
                          <Clock className="w-3 h-3 mr-1 animate-spin" /> PENDING
                        </span>
                      )}
                      {req.status === 'APPROVED' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> APPROVED
                        </span>
                      )}
                      {req.status === 'REJECTED' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800/50">
                          <XCircle className="w-3 h-3 mr-1" /> REJECTED
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 line-clamp-2">{req.purpose || 'Bonafide Certificate'}</h3>
                      {req.certificateNumber && (
                        <p className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 mt-1">Ref: {req.certificateNumber}</p>
                      )}
                      {req.remarks && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic mt-1 font-medium">Remarks: "{req.remarks}"</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold text-[11px]">
                      {req.appliedDate ? new Date(req.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </span>

                    <div className="flex items-center space-x-2">
                      {req.status === 'APPROVED' && (
                        <button
                          onClick={() => setPreviewReq(req)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center space-x-1"
                          title="Live Preview Document"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>Preview</span>
                        </button>
                      )}

                      {req.verificationToken && (
                        <button
                          onClick={() => handleCopyLink(req.verificationToken, req.requestId)}
                          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-300 dark:border-slate-700"
                          title="Copy Verification Link"
                        >
                          {copiedId === req.requestId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      {req.status === 'APPROVED' && (
                        <button
                          disabled={downloadingId !== null}
                          onClick={() => handleDownload(req.requestId, req.certificateNumber)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-400 text-xs uppercase tracking-wider font-extrabold bg-slate-50 dark:bg-slate-900/80">
                    <th className="py-3.5 px-4">Request Details</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {requests.map((req) => (
                    <tr key={req.requestId} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-slate-100">{req.purpose || 'Bonafide Certificate'}</div>
                        {req.certificateNumber && (
                          <div className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">Ref: {req.certificateNumber}</div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                        {req.appliedDate ? new Date(req.appliedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        {req.status === 'PENDING' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800/50">
                            <Clock className="w-3 h-3 mr-1 animate-spin" /> PENDING
                          </span>
                        )}
                        {req.status === 'APPROVED' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> APPROVED
                          </span>
                        )}
                        {req.status === 'REJECTED' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800/50">
                            <XCircle className="w-3 h-3 mr-1" /> REJECTED
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {req.status === 'APPROVED' && (
                            <button
                              onClick={() => setPreviewReq(req)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                            >
                              Preview
                            </button>
                          )}
                          {req.status === 'APPROVED' && (
                            <button
                              onClick={() => handleDownload(req.requestId, req.certificateNumber)}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md"
                            >
                              PDF
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* Edit Student Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-6">

            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" /> Edit Student Profile Details
              </h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Full Name (Appears on Official Certificate) *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  placeholder="e.g. Rahul Suresh Patil"
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Enrollment Number *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.enrollmentNo}
                  onChange={(e) => setProfileForm({ ...profileForm, enrollmentNo: e.target.value })}
                  placeholder="e.g. 2105120001"
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm font-mono font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Department *
                  </label>
                  <select
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    {INSTITUTION_CONFIG.departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Year of Study *
                  </label>
                  <select
                    value={profileForm.yearOfStudy}
                    onChange={(e) => setProfileForm({ ...profileForm, yearOfStudy: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    {INSTITUTION_CONFIG.yearsOfStudy.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-500 text-white shadow-md"
                >
                  {profileSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Live Certificate Preview Modal */}
      {previewReq && (
        <CertificatePreviewModal
          req={previewReq}
          onClose={() => setPreviewReq(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
