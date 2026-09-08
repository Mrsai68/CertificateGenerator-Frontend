import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Info, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import api from '../api/axios';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/v1/notifications');
      if (res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      // Quiet fail if guest / unauthenticated
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/api/v1/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/api/v1/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50 glass-card bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {unreadCount} New
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-900">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 font-semibold">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`p-4 text-xs transition-colors flex items-start justify-between space-x-3 ${
                      !n.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {n.type === 'ERROR' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                        {n.type === 'WARNING' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                        {n.type === 'INFO' && <Info className="w-4 h-4 text-blue-600" />}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-slate-100 leading-snug">{n.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 font-medium">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block flex items-center font-semibold">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(n._id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
