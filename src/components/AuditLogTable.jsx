import React, { useState, useEffect } from 'react';
import { Activity, Search, Shield, User, Clock, Filter, RefreshCw } from 'lucide-react';
import api from '../api/axios';

export default function AuditLogTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/audit-logs', {
        params: { action: actionFilter, search }
      });
      if (res.data) {
        setLogs(res.data.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs space-y-6">

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-600" /> Security Audit Log Trail
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Immutable system action logs for authentication, approvals, and user status modifications</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, action..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </form>

          <button
            onClick={fetchLogs}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 font-semibold">Loading security audit records...</div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 font-semibold">No audit log entries recorded yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-400 uppercase tracking-wider font-extrabold bg-slate-50 dark:bg-slate-900/80">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Details / Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{log.username || 'SYSTEM'}</div>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">{log.role}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      log.action.includes('APPROVED') ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        log.action.includes('REJECTED') ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                          log.action.includes('SUBMITTED') ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                            'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {log.entityType}
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px] max-w-xs truncate">
                    {JSON.stringify(log.metadata)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
