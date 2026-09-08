import React, { useState } from 'react';
import { Camera, X, QrCode, AlertCircle, RefreshCw } from 'lucide-react';

export default function QrScannerModal({ onClose, onScanSuccess }) {
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState('');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      // Extract token if full URL is pasted
      let tokenStr = manualInput.trim();
      if (tokenStr.includes('/verify/')) {
        tokenStr = tokenStr.split('/verify/')[1];
      }
      onScanSuccess(tokenStr);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-6">

        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Scan QR / Verify Certificate</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Camera Placeholder Box */}
        <div className="relative aspect-square rounded-2xl bg-slate-950 border-2 border-dashed border-blue-500/50 flex flex-col items-center justify-center text-center p-6 space-y-3 overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center animate-pulse">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white">Position QR Code in Frame</h4>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Or enter cryptographic token below</p>
          </div>
          <div className="absolute inset-x-8 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        </div>

        {/* Manual Token / Certificate ID Write-in */}
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Or Paste Token / Verification URL
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              required
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g. CERT-12345 or token string"
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all shrink-0"
            >
              Verify Now
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
