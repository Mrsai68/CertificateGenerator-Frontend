import React from 'react';
import { CheckCircle2, Clock, XCircle, FileText, Award, AlertCircle } from 'lucide-react';

export default function RequestTimeline({ request }) {
  if (!request) return null;

  const isPending = request.status === 'PENDING';
  const isApproved = request.status === 'APPROVED';
  const isRejected = request.status === 'REJECTED';

  const steps = [
    {
      id: 1,
      name: 'Request Submitted',
      desc: request.appliedDate ? new Date(request.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Applied',
      status: 'complete',
      icon: FileText
    },
    {
      id: 2,
      name: 'Under HOD Review',
      desc: isPending ? 'In Progress' : 'Completed',
      status: isPending ? 'current' : 'complete',
      icon: Clock
    },
    {
      id: 3,
      name: isRejected ? 'Request Rejected' : 'Approval & Issuance',
      desc: isApproved ? (request.approvedDate ? new Date(request.approvedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Approved') : (isRejected ? 'Rejected' : 'Pending HOD Sign'),
      status: isApproved ? 'complete' : (isRejected ? 'error' : 'upcoming'),
      icon: isRejected ? XCircle : CheckCircle2
    },
    {
      id: 4,
      name: 'Certificate Available',
      desc: isApproved ? 'Ready for Download' : (isRejected ? 'N/A' : 'Awaiting Approval'),
      status: isApproved ? 'complete' : (isRejected ? 'error' : 'upcoming'),
      icon: Award
    }
  ];

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Request Lifecycle Timeline
        </h4>
        <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
          ID: {request.requestId?.slice(-8) || request.requestId}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          let colorClasses = 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700';

          if (step.status === 'complete') {
            colorClasses = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-400 dark:border-emerald-800';
          } else if (step.status === 'current') {
            colorClasses = 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-400 dark:border-amber-800 animate-pulse';
          } else if (step.status === 'error') {
            colorClasses = 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-400 dark:border-rose-800';
          }

          return (
            <div key={step.id} className="flex flex-col items-center text-center p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs mb-2 ${colorClasses}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 leading-tight">{step.name}</span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1">{step.desc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
