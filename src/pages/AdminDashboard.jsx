import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import INSTITUTION_CONFIG from '../config/institutionConfig.js';
import {
  ShieldAlert, Search, CheckCircle2, XCircle, Clock, AlertCircle, RefreshCw, Building2,
  Check, X, Users, FileText, Layers, Mail, UserPlus, UserCheck, UserX, Trash2, Power,
  TrendingUp, BarChart3, FileCheck2, LogOut, Eye, EyeOff, LayoutGrid, List, Sparkles, Award
} from 'lucide-react';
import CertificatePreviewModal from '../components/CertificatePreviewModal.jsx';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Data State
  const [requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [kpiData, setKpiData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [forbiddenError, setForbiddenError] = useState(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [activeTab, setActiveTab] = useState('REQUESTS'); // 'REQUESTS' | 'USERS' | 'KPIS'
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' | 'TABLE'

  // Modal State for Request Action (Approve / Reject)
  const [selectedReq, setSelectedReq] = useState(null);
  const [modalType, setModalType] = useState(''); // 'approve' | 'reject'
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState('');
  const [previewReq, setPreviewReq] = useState(null);

  // Modal State for Adding User
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddUserPassword, setShowAddUserPassword] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'ROLE_STUDENT',
    department: INSTITUTION_CONFIG.departments[0] || 'Computer Engineering',
    fullName: '',
    enrollmentNo: '',
    yearOfStudy: INSTITUTION_CONFIG.yearsOfStudy[0] || 'First Year'
  });
  const [addUserError, setAddUserError] = useState('');
  const [addUserSuccess, setAddUserSuccess] = useState('');

  // Modal State for Deactivate User Reason
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [deactivateReason, setDeactivateReason] = useState('');

  // Modal State for Delete User Confirmation
  const [userToDelete, setUserToDelete] = useState(null);

  const handleForbidden = (err) => {
    if (err.response && (err.response.status === 403 || err.response.status === 401)) {
      setForbiddenError(true);
    }
  };

  const fetchAllRequests = async () => {
    setFetching(true);
    try {
      const res = await api.get('/api/v1/admin/requests');
      setRequests(res.data || []);
      setForbiddenError(false);
    } catch (err) {
      console.error('Failed to fetch admin requests', err);
    } finally {
      setFetching(false);
    }
  };

  const fetchAllUsers = async () => {
    setFetchingUsers(true);
    try {
      const res = await api.get('/api/v1/admin/users');
      setAllUsers(res.data || []);
      setForbiddenError(false);
    } catch (err) {
      console.error('Failed to fetch users directory', err);
      handleForbidden(err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const fetchKpiReports = async () => {
    try {
      const res = await api.get('/api/v1/admin/reports/kpis');
      setKpiData(res.data || null);
      setForbiddenError(false);
    } catch (err) {
      console.error('Failed to fetch KPI reports', err);
      handleForbidden(err);
    }
  };

  useEffect(() => {
    fetchAllRequests();
    fetchAllUsers();
    fetchKpiReports();
  }, []);

  const handleRefresh = () => {
    setForbiddenError(false);
    fetchAllRequests();
    fetchAllUsers();
    fetchKpiReports();
  };

  const handleReLogin = () => {
    logout();
    navigate('/login');
  };

  const handleToggleUserClick = (u) => {
    if (u.active) {
      setUserToDeactivate(u);
      setDeactivateReason('');
    } else {
      executeToggleUserStatus(u.userId, null);
    }
  };

  const executeToggleUserStatus = async (targetUserId, reasonText) => {
    try {
      await api.put(`/api/v1/admin/users/${targetUserId}/toggle-status`, { reason: reasonText });
      setUserToDeactivate(null);
      setDeactivateReason('');
      fetchAllUsers();
      fetchKpiReports();
    } catch (err) {
      alert('Failed to toggle status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/api/v1/admin/users/${userToDelete.userId}`);
      setUserToDelete(null);
      fetchAllUsers();
      fetchKpiReports();
    } catch (err) {
      alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setAddUserError('');
    setAddUserSuccess('');
    setProcessing(true);

    try {
      const res = await api.post('/api/v1/admin/users', newUserForm);
      setAddUserSuccess(res.data.message || 'User created successfully!');
      setNewUserForm({
        username: '',
        email: '',
        password: '',
        role: 'ROLE_STUDENT',
        department: INSTITUTION_CONFIG.departments[0] || 'Computer Engineering',
        fullName: '',
        enrollmentNo: '',
        yearOfStudy: INSTITUTION_CONFIG.yearsOfStudy[0] || 'First Year'
      });
      fetchAllUsers();
      fetchKpiReports();
      setTimeout(() => {
        setShowAddUserModal(false);
        setAddUserSuccess('');
      }, 1500);
    } catch (err) {
      setAddUserError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setProcessing(false);
    }
  };

  const openActionModal = (req, type) => {
    setSelectedReq(req);
    setModalType(type);
    setRemarks(type === 'approve' ? 'Approved by Super Admin' : '');
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
      fetchKpiReports();
      closeModal();
    } catch (err) {
      setActionError(err.response?.data?.message || `Failed to ${modalType} request`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async (requestId, certNo) => {
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
      alert('Download Error: Failed to generate certificate PDF');
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesDepartment = selectedDepartment === 'ALL' || req.department === selectedDepartment;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (req.fullName && req.fullName.toLowerCase().includes(q)) ||
      (req.enrollmentNo && req.enrollmentNo.toLowerCase().includes(q)) ||
      (req.department && req.department.toLowerCase().includes(q)) ||
      (req.purpose && req.purpose.toLowerCase().includes(q));

    return matchesStatus && matchesDepartment && matchesSearch;
  });

  const filteredUsersList = allUsers.filter(u => {
    const matchesDepartment = selectedDepartment === 'ALL' || u.department === selectedDepartment;
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.enrollmentNo && u.enrollmentNo.toLowerCase().includes(q)) ||
      (u.department && u.department.toLowerCase().includes(q));

    return matchesDepartment && matchesRole && matchesSearch;
  });

  const totalRequestsCount = requests.length;
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;
  const totalUsersCount = allUsers.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">

      {/* Forbidden Error Banner */}
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

      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{INSTITUTION_CONFIG.collegeShortName} Super Admin Command Center</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    <Building2 className="w-3.5 h-3.5 mr-1" />
                    {INSTITUTION_CONFIG.collegeName}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                    Root: {user?.username || 'System Admin'}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
              Manage user accounts, department routing, approval overrides, and real-time institution KPI reports.
            </p>
          </div>

          {/* Metric Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="px-4 py-2.5 rounded-2xl glass-card bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-center">
              <span className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">All Users</span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{totalUsersCount}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl glass-card bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Total Requests</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{totalRequestsCount}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl glass-card bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-center">
              <span className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Pending</span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{pendingCount}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl glass-card bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center">
              <span className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Approved</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{approvedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Module Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'REQUESTS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Applications Queue ({filteredRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('USERS')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'USERS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Directory ({filteredUsersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('KPIS')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'KPIS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>KPI Reports & Analytics</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'REQUESTS' && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-300 dark:border-slate-800">
              <button
                onClick={() => setViewMode('GRID')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'GRID' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Bento Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'TABLE' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'USERS' && (
            <button
              id="add-new-user-btn"
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all hover:scale-105"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Bar */}
      {activeTab !== 'KPIS' && (
        <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4 bg-white/95 dark:bg-slate-900/60 shadow-xs">

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="admin-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'REQUESTS' ? "Search student, enrollment..." : "Search user name, email, enrollment..."}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-purple-600 font-semibold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">

            {activeTab === 'USERS' && (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-600 font-semibold"
              >
                <option value="ALL">All System Roles</option>
                {INSTITUTION_CONFIG.userRoles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            )}

            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-600 font-semibold"
              >
                <option value="ALL">All Departments</option>
                {INSTITUTION_CONFIG.departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {activeTab === 'REQUESTS' && (
              <div className="flex items-center space-x-1.5">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === st
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-300 dark:border-slate-800"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: REQUESTS APPLICATION QUEUE */}
      {activeTab === 'REQUESTS' && (
        viewMode === 'GRID' ? (
          /* Bento Cards Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fetching ? (
              <div className="col-span-full glass-card p-12 text-center text-slate-600 dark:text-slate-500 text-sm font-semibold">Loading application queue...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="col-span-full glass-card p-12 text-center text-slate-600 dark:text-slate-500 text-sm font-semibold">No certificate requests found matching your filters.</div>
            ) : (
              filteredRequests.map((req) => (
                <div
                  key={req.requestId}
                  className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{req.fullName || req.username}</h4>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold font-mono">{req.enrollmentNo || req.username}</p>
                      </div>
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

                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px] border border-purple-200 dark:border-purple-800">
                        {req.department}
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 pt-1">{req.purpose}</p>
                      {req.remarks && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic font-medium">Remarks: "{req.remarks}"</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    {req.status === 'APPROVED' && (
                      <button
                        onClick={() => setPreviewReq(req)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold flex items-center space-x-1"
                        title="Preview Certificate Document"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-600" />
                        <span>Preview</span>
                      </button>
                    )}

                    {req.status === 'PENDING' ? (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => openActionModal(req, 'approve')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-md flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => openActionModal(req, 'reject')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-md flex items-center space-x-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-semibold text-[11px]">Processed</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Table View */
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-400 text-xs uppercase tracking-wider font-extrabold bg-slate-50 dark:bg-slate-900/80">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Department / Year</th>
                  <th className="py-3.5 px-4">Purpose</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">SuperAdmin Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredRequests.map((req) => (
                  <tr key={req.requestId} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-900 dark:text-slate-100">{req.fullName || req.username}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-500 font-medium">{req.enrollmentNo || req.username}</div>
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold mb-1 border border-purple-200 dark:border-slate-700">
                        {req.department}
                      </span>
                      <div className="text-slate-600 dark:text-slate-400 font-medium">{req.yearOfStudy || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-bold text-slate-800 dark:text-slate-300 truncate">{req.purpose}</div>
                      {req.remarks && (
                        <div className="text-xs text-slate-600 dark:text-slate-500 italic mt-0.5 truncate font-medium">
                          Note: {req.remarks}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                      {new Date(req.appliedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 px-4">
                      {req.status === 'PENDING' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800/50">
                          <Clock className="w-3 h-3 mr-1 animate-spin" /> PENDING
                        </span>
                      )}
                      {req.status === 'APPROVED' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> APPROVED
                        </span>
                      )}
                      {req.status === 'REJECTED' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800/50">
                          <XCircle className="w-3 h-3 mr-1" /> REJECTED
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {req.status === 'APPROVED' && (
                          <button
                            onClick={() => setPreviewReq(req)}
                            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                            title="Preview Document"
                          >
                            <Eye className="w-3.5 h-3.5 text-purple-600" />
                          </button>
                        )}
                        {req.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => openActionModal(req, 'approve')}
                              className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openActionModal(req, 'reject')}
                              className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-500 text-white shadow-md"
                            >
                              Reject
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
        )
      )}

      {/* TAB 2: USER MANAGEMENT DIRECTORY */}
      {activeTab === 'USERS' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs">
          {fetchingUsers ? (
            <div className="p-12 text-center text-slate-600 dark:text-slate-500 text-sm font-semibold">Loading users directory...</div>
          ) : filteredUsersList.length === 0 ? (
            <div className="p-12 text-center text-slate-600 dark:text-slate-500 text-sm font-semibold">No registered users found matching your search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-400 text-xs uppercase tracking-wider font-extrabold bg-slate-50 dark:bg-slate-900/80">
                    <th className="py-3.5 px-4">User Identity</th>
                    <th className="py-3.5 px-4">Role / Department</th>
                    <th className="py-3.5 px-4">Enrollment / Year</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {filteredUsersList.map((u) => (
                    <tr key={u.userId} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-200 dark:border-purple-500/20">
                            {u.fullName ? u.fullName.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-slate-100">{u.fullName || u.username}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-1 font-medium">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold mb-1 ${
                          u.role === 'ROLE_ADMIN' ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300' :
                            u.role === 'ROLE_HOD' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300' :
                              'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300'
                        }`}>
                          {u.role ? u.role.replace('ROLE_', '') : 'USER'}
                        </span>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{u.department || 'General'}</div>
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold">
                        <div className="font-mono text-purple-700 dark:text-purple-300 font-bold">{u.enrollmentNo || 'N/A'}</div>
                        <div className="text-slate-600 dark:text-slate-400">{u.yearOfStudy || 'N/A'}</div>
                      </td>

                      <td className="py-4 px-4">
                        {u.active ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50">
                            <UserCheck className="w-3 h-3 mr-1" /> ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800/50">
                            <UserX className="w-3 h-3 mr-1" /> INACTIVE
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleToggleUserClick(u)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                              u.active
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                            }`}
                            title={u.active ? "Deactivate Account" : "Activate Account"}
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{u.active ? 'Deactivate' : 'Activate'}</span>
                          </button>

                          <button
                            onClick={() => setUserToDelete(u)}
                            className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-800 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: KPI REPORTS & ANALYTICS */}
      {activeTab === 'KPIS' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-600 dark:text-slate-400">Total User Base</span>
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{kpiData?.totalUsers || totalUsersCount}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Active: <strong className="text-emerald-600 dark:text-emerald-400">{kpiData?.activeUsers || 0}</strong> | Inactive: <strong className="text-rose-600 dark:text-rose-400">{kpiData?.inactiveUsers || 0}</strong>
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-600 dark:text-slate-400">Approval Rate KPI</span>
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{kpiData?.approvalRate || 0}%</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Approved vs Total Submitted Applications</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-600 dark:text-slate-400">Certificates Issued</span>
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{kpiData?.approvedRequests || approvedCount}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Official Digital PDF Certificates</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-600 dark:text-slate-400">Pending Review</span>
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{kpiData?.pendingRequests || pendingCount}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Awaiting Department HOD Clearance</p>
            </div>
          </div>

          {/* Department Breakdown Cards */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-purple-600" /> Departmental Distribution & Activity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INSTITUTION_CONFIG.departments.map((dept) => {
                const count = kpiData?.departmentRequestDistribution ? kpiData.departmentRequestDistribution[dept] || 0 : 0;
                const total = kpiData?.totalRequests || 1;
                const pct = Math.round((count / total) * 100);

                return (
                  <div key={dept} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900 dark:text-slate-100">{dept}</span>
                      <span className="text-purple-600 dark:text-purple-400">{count} Requests ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full transition-all" style={{ width: `${Math.max(pct, 5)}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 flex items-center">
                <UserPlus className="w-5 h-5 mr-2 text-purple-600" /> Create New System User
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {addUserError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{addUserError}</span>
              </div>
            )}

            {addUserSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{addUserSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 uppercase tracking-wider">Username *</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 uppercase tracking-wider">Password *</label>
                  <div className="relative">
                    <input
                      type={showAddUserPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                      className="w-full px-3 py-2 pr-10 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAddUserPassword(!showAddUserPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                      title={showAddUserPassword ? "Hide password" : "Show password"}
                    >
                      {showAddUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 uppercase tracking-wider">User Role *</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold"
                  >
                    {INSTITUTION_CONFIG.userRoles.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 uppercase tracking-wider">Department *</label>
                  <select
                    value={newUserForm.department}
                    onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold"
                  >
                    {INSTITUTION_CONFIG.departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {newUserForm.role === 'ROLE_STUDENT' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        value={newUserForm.fullName}
                        onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 uppercase tracking-wider">Enrollment No</label>
                      <input
                        type="text"
                        value={newUserForm.enrollmentNo}
                        onChange={(e) => setNewUserForm({ ...newUserForm, enrollmentNo: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 uppercase tracking-wider">Year of Study</label>
                      <select
                        value={newUserForm.yearOfStudy}
                        onChange={(e) => setNewUserForm({ ...newUserForm, yearOfStudy: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold"
                      >
                        {INSTITUTION_CONFIG.yearsOfStudy.map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-purple-600 hover:bg-purple-500 text-white shadow-md"
                >
                  {processing ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Reason Modal */}
      {userToDeactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-rose-600">Deactivate Account Notice</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              You are deactivating account for <strong>{userToDeactivate.username}</strong> ({userToDeactivate.email}). An official notification email will be dispatched.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 uppercase tracking-wider">Reason for Deactivation (Optional)</label>
              <textarea
                rows={3}
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                placeholder="e.g. Course completed / Enrollment cancelled..."
                className="w-full p-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setUserToDeactivate(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => executeToggleUserStatus(userToDeactivate.userId, deactivateReason)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-500 text-white shadow-md"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-rose-600">Delete User Account</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Are you sure you want to permanently delete user <strong>{userToDelete.username}</strong> ({userToDelete.email})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteUser}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-500 text-white shadow-md"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal (Requests Override) */}
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
              <p><span className="text-slate-600 dark:text-slate-400">Student:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedReq.fullName || selectedReq.username}</strong> {selectedReq.enrollmentNo ? `(${selectedReq.enrollmentNo})` : ''}</p>
              <p><span className="text-slate-600 dark:text-slate-400">Department:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedReq.department}</strong></p>
              <p><span className="text-slate-600 dark:text-slate-400">Purpose:</span> <strong className="text-purple-600 dark:text-purple-400">{selectedReq.purpose}</strong></p>
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
                placeholder={modalType === 'approve' ? 'Approved by Super Admin' : 'Explain reason for rejection...'}
                className="w-full p-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-purple-600 text-sm font-semibold"
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
          onDownload={handleDownload}
        />
      )}

    </div>
  );
}
