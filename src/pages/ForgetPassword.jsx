import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { KeyRound, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from "../api/axios.js";

function ForgetPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & Reset
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  function togglePassVisible() {
    setShowPassword((prev) => !prev);
  }

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post("/api/v1/auth/forget-password", { email });
      const rawMsg = res.data.message || '6-digit OTP code has been sent to your email address.';
      setMessage(rawMsg);
      setStep(2);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to send OTP.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/v1/auth/reset-password", { email, otpCode, newPassword });
      setMessage(res.data.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to reset password.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-transparent">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/20 mb-4 text-white">
            <KeyRound className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Account Recovery</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-semibold">
            {step === 1 ? 'Enter your registered institutional email to receive a 6-digit OTP' : 'Enter OTP code and set your new password'}
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-700/60 text-rose-800 dark:text-rose-200 text-sm flex items-start space-x-3 shadow-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div>
                <strong className="block font-bold text-rose-900 dark:text-rose-100 mb-0.5">Request Failed</strong>
                <span className="text-xs">{error}</span>
              </div>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-200 text-sm flex items-center space-x-3 font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold">{message}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Registered Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="forgot-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              <button
                id="send-otp-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <span>Generating 6-Digit OTP...</span>
                ) : (
                  <>
                    <span>Send 6-Digit Email OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  6-Digit OTP Code *
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="reset-otp-input"
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm tracking-widest font-mono text-center text-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  New Password (min 6 characters) *
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="reset-password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm font-semibold"
                  />
                  <button type="button" className="flex justify-center items-center absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200" onClick={togglePassVisible}>
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                id="reset-password-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <span>Updating Password...</span>
                ) : (
                  <span>Reset Password & Login</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center flex items-center justify-between text-xs font-semibold">
            {step === 2 && (
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); setMessage(''); setOtpCode(''); }}
                className="font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors"
              >
                ← Back to Email Step
              </button>
            )}
            <Link to="/login" className="font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors ml-auto">
              Back to Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ForgetPassword;
