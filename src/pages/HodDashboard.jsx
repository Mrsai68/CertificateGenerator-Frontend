import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuthContext.jsx';
import api from '../api/axios';
import { ShieldCheck, Search, CheckCircle2, XCircle, Clock, AlertCircle, RefreshCw, Building2, Check, X, Sparkles, Eye } from 'lucide-react';
import CertificatePreviewModal from '../components/CertificatePreviewModal.jsx';

export default function HodDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [students, setStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [previewReq, setPreviewReq] = useState(null);

  // Modal state for Approve / Reject
  const [selectedReq, setSelectedReq] = useState(null);
  const [modalType, setModalType] = useState(''); // 'approve' or 'reject'
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState('');

  const fetchAllRequests = async () => {
    setFetching(true);
    try {
      const res = await api.get('/api/v1/admin/requests');
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to fetch admin requests', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
    fetchAllRegisteredStudents();
  }, []);

  const openActionModal = (req, type) => {
    setSelectedReq(req);
    setModalType(type);
    setRemarks(type === 'approve' ? 'Approved by Head of Department' : '');
    setActionError('');
  };

  const closeModal = () => {
    setSelectedReq(null);
    setModalType('');
    setRemarks('');
    setActionError('');
  };

  const handleConfirmAction = async () => {
    if (!selectedReq) return;
    setProcessing(true);
    setActionError('');

    try {
      const endpoint = `/api/v1/admin/requests/${selectedReq.requestId}/${modalType}`;
      const res = await api.put(endpoint, { remarks });

      setRequests(requests.map(r => r.requestId === selectedReq.requestId ? res.data : r));
      closeModal();
    } catch (err) {
      setActionError(err.response?.data?.message || `Failed to ${modalType} request`);
    } finally {
      setProcessing(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (req.fullName && req.fullName.toLowerCase().includes(q)) ||
      (req.enrollmentNo && req.enrollmentNo.toLowerCase().includes(q)) ||
      (req.department && req.department.toLowerCase().includes(q)) ||
      (req.purpose && req.purpose.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const fetchAllRegisteredStudents = async () => {
    setFetchingStudents(true);
    try {
      const res = await api.get('/api/v1/admin/students');
      setStudents(res.data || []);
    } catch (err) {
      console.error('Failed to fetch registered students', err);
    } finally {
      setFetchingStudents(false);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;
  const totalStudents = students.length;

  const hodDept = user?.department || 'General';
  const isSuperAdmin = hodDept === 'ALL' || user?.role === 'ROLE_ADMIN';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">HOD Queue</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    <Building2 className="w-3.5 h-3.5 mr-1" />
                    {isSuperAdmin ? 'Super Admin Portal (All Departments)' : `${hodDept} HOD Queue`}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
              {isSuperAdmin
                ? 'Super Admin view for all department student applications'
                : `Student applications belonging to ${hodDept} department are routed to this dashboard for review`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-2xl glass-card bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-center">
              <span className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Pending Queue</span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{pendingCount}</span>
            </div>
            <div className="px-4 py-2 rounded-2xl glass-card bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center">
              <span className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Approved</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{approvedCount}</span>
            </div>
            <div className="px-4 py-2 rounded-2xl glass-card bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-center">
              <span className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Rejected</span>
              <span className="text-lg font-bold text-rose-600 dark:text-rose-400">{rejectedCount}</span>
            </div>
            <div className="px-4 py-2 rounded-2xl glass-card bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-center">
              <span className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Total Students</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{totalStudents}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Routing Info Card */}
      <div className="glass-card p-4 rounded-2xl border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-950/20 flex items-center justify-between text-xs text-blue-800 dark:text-blue-300 font-semibold">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong>Department-Based Automatic Routing:</strong> Student applications are routed to their respective department HOD ({hodDept}).
          </span>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 dark:bg-slate-900/60 shadow-xs">

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="admin-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Enrollment, Name, Dept..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-600 font-semibold"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              id={`filter-btn-${st.toLowerCase()}`}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}

          <button
            onClick={fetchAllRequests}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-300 dark:border-slate-800 ml-2"
            title="Refresh Queue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Tabular Queue */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs">
        {fetching ? (
          <div className="p-12 text-center text-slate-600 dark:text-slate-500 text-sm font-semibold">
            Loading student application queue...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-600 dark:text-slate-500 text-sm font-semibold">
            No certificate requests found for {hodDept} department matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-400 text-xs uppercase tracking-wider font-extrabold bg-slate-50 dark:bg-slate-900/80">
                  <th className="py-3.5 px-4">Student Profile</th>
                  <th className="py-3.5 px-4">Enrollment / Dept</th>
                  <th className="py-3.5 px-4">Purpose</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">HOD Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredRequests.map((req) => (
                  <tr key={req.requestId} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-900 dark:text-slate-100">{req.fullName || req.username || 'Student'}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-500 font-medium">{req.username || 'N/A'}</div>
                    </td>

                    <td className="py-4 px-4 text-xs">
                      <div className="font-bold text-blue-600 dark:text-blue-400">{req.enrollmentNo || 'N/A'}</div>
                      <div className="text-slate-600 dark:text-slate-400 font-medium">
                        {req.department || 'General'} {req.yearOfStudy ? `(${req.yearOfStudy})` : ''}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-300">{req.purpose || 'Bonafide Certificate'}</div>
                      {req.remarks && (
                        <div className="text-xs text-slate-600 dark:text-slate-500 italic mt-0.5 font-medium">Remarks: {req.remarks}</div>
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
                        {/* Live Preview Button */}
                        {req.status === 'APPROVED' && (
                          <button
                            onClick={() => setPreviewReq(req)}
                            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all"
                            title="Preview Certificate Document"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                        )}

                        {req.status === 'PENDING' ? (
                          <>
                            <button
                              id={`approve-btn-${req.requestId}`}
                              onClick={() => openActionModal(req, 'approve')}
                              className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center space-x-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              id={`reject-btn-${req.requestId}`}
                              onClick={() => openActionModal(req, 'reject')}
                              className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-500 text-white transition-all flex items-center space-x-1 shadow-md"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-500 font-semibold">Processed</span>
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

      {/* Action Confirmation Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-6">

            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 capitalize">
                {modalType === 'approve' ? 'Approve Certificate Request' : 'Reject Certificate Request'}
              </h3>
              <button onClick={closeModal} className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-semibold">
              <p><span className="text-slate-600 dark:text-slate-400">Student:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedReq.fullName || selectedReq.username || 'Student'}</strong> {selectedReq.enrollmentNo ? `(${selectedReq.enrollmentNo})` : ''}</p>
              <p><span className="text-slate-600 dark:text-slate-400">Department:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedReq.department || 'General'}</strong></p>
              <p><span className="text-slate-600 dark:text-slate-400">Purpose:</span> <strong className="text-blue-600 dark:text-blue-400">{selectedReq.purpose || 'Bonafide Certificate'}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                {modalType === 'approve' ? 'Approval Remarks / Note' : 'Rejection Reason / Remarks *'}
              </label>
              <textarea
                id="action-remarks-input"
                rows={3}
                required={modalType === 'reject'}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={modalType === 'approve' ? 'Approved by HOD' : 'Explain reason for rejection...'}
                className="w-full p-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm font-semibold"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                id="confirm-modal-action-btn"
                type="button"
                disabled={processing}
                onClick={handleConfirmAction}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-lg transition-all flex items-center space-x-1.5 ${
                  modalType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {processing ? (
                  <span>Processing...</span>
                ) : (
                  <span>Confirm {modalType === 'approve' ? 'Approval & Generate PDF' : 'Rejection'}</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Live Certificate Preview Modal */}
      {previewReq && (
        <CertificatePreviewModal
          req={previewReq}
          onClose={() => setPreviewReq(null)}
        />
      )}

    </div>
  );
}
