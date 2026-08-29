import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCheck, AlertCircle } from 'lucide-react';
import INSTITUTION_CONFIG from '../config/institutionConfig.js';
import api from '../api/axios.js';

const Register = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Name: '',
    Department: INSTITUTION_CONFIG.departments[0] || '',
    YearOfStudy: INSTITUTION_CONFIG.yearsOfStudy[0] || '',
    EnrollmentNo: '',
    academicYear: INSTITUTION_CONFIG.academicYears[1] || '2025-2026',
    gender: 'Male',
    contactNo: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/v1/auth/register', {
        username: formData.Username,
        email: formData.Email,
        password: formData.Password,
        name: formData.Name,
        Name: formData.Name,
        fullName: formData.Name,
        department: formData.Department,
        Department: formData.Department,
        yearOfStudy: formData.YearOfStudy,
        YearOfStudy: formData.YearOfStudy,
        enrollmentNo: formData.EnrollmentNo,
        EnrollmentNo: formData.EnrollmentNo,
        academicYear: formData.academicYear,
        gender: formData.gender,
        contactNo: formData.contactNo
      });

      if (response.status === 200 || response.status === 201) {
        navigate('/login', { state: { message: 'Registration successful! Please login.' } });
      } else {
        setError(response.data?.message || 'Registration failed. Please check your inputs.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Could not connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-xl w-full">

        <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 bg-white/95 dark:bg-slate-900/60 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl"></div>

          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 mb-2">
              <UserCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Student Portal Registration</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Create your official student account for {INSTITUTION_CONFIG.collegeName}</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Username
                </label>
                <input
                  name="Username"
                  type="text"
                  required
                  placeholder="e.g. rahul_patil"
                  value={formData.Username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  name="Email"
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={formData.Email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <input
                  name="Password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.Password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                />
              </div>

              {/* Enrollment No */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Enrollment No
                </label>
                <input
                  name="EnrollmentNo"
                  type="text"
                  required
                  placeholder="e.g. 230401..."
                  value={formData.EnrollmentNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                />
              </div>

              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  name="Name"
                  type="text"
                  required
                  placeholder="Your Full Official Name"
                  value={formData.Name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Department
                </label>
                <select
                  name="Department"
                  required
                  value={formData.Department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                >
                  {INSTITUTION_CONFIG.departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Year of Study */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Year Of Study
                </label>
                <select
                  name="YearOfStudy"
                  required
                  value={formData.YearOfStudy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                >
                  {INSTITUTION_CONFIG.yearsOfStudy.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Academic Year
                </label>
                <select
                  name="academicYear"
                  required
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                >
                  {INSTITUTION_CONFIG.academicYears.map((ay) => (
                    <option key={ay} value={ay}>{ay}</option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>

            <button
              name="register-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 mt-6"
            >
              {loading ? 'Registering Account...' : 'Register Account'}
            </button>
          </form>

          <div className="text-slate-600 dark:text-slate-400 text-sm mt-5 text-center font-medium">
            <p>Already have an account? <span className="text-blue-600 dark:text-blue-400 font-semibold"><Link to="/login">Sign In</Link></span></p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
