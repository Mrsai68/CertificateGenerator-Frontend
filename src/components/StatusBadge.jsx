import React from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function StatusBadge({ status, countdownStr }) {
  if (status === 'PENDING') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800/50">
        <Clock className="w-3 h-3 mr-1 animate-spin shrink-0" /> PENDING
      </span>
    );
  }

  if (status === 'APPROVED') {
    if (countdownStr) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800/50">
          <Clock className="w-3 h-3 mr-1 animate-spin shrink-0" /> SYNCING ({countdownStr})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50">
        <CheckCircle2 className="w-3 h-3 mr-1 shrink-0" /> APPROVED
      </span>
    );
  }

  if (status === 'REJECTED') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800/50">
        <XCircle className="w-3 h-3 mr-1 shrink-0" /> REJECTED
      </span>
    );
  }

  return null;
}
