import { AlertCircle, Eye, EyeOff, ShieldCheck, User, Sparkles, Building2, ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuthContext.jsx";
import INSTITUTION_CONFIG from "../config/institutionConfig.js";
import api from "../api/axios.js";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (u, p) => {
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/v1/auth/login', { username: u, password: p });
      login(res.data);

      if (res.data.role === 'ROLE_HOD') {
        navigate('/hod');
      } else if (res.data.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(username, password);
  };

  function togglePassVisible() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-transparent">
      <div className="w-full max-w-md space-y-6 animate-scaleUp">
        {/* Login Form Container */}
        <div className="glass-card p-8 rounded-3xl shadow-xl card-hover-lift">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20 mb-4 text-white animate-pulseHalo">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-extrabold text-2xl text-slate-900 dark:text-slate-100">Sign in to {INSTITUTION_CONFIG.collegeShortName} Portal</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-semibold">{INSTITUTION_CONFIG.portalName}</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300 text-sm flex items-center space-x-3 font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Username / User ID
              </label>
              <input
                id="login-username-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-5 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm font-semibold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-5 pr-12 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm font-semibold"
                />
                <button type="button" className="flex justify-center items-center absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200" onClick={togglePassVisible}>
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 mt-2 hover:scale-[1.01]"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          <div className="text-slate-700 dark:text-slate-400 text-sm mt-5 text-center font-medium">
            <p>Don't have an account? <span className="text-blue-600 dark:text-blue-400 font-bold"><Link to="/register">Register new account</Link></span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
