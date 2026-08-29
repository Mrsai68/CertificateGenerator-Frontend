import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AppShell from './components/AppShell.jsx';
import Login from "./pages/Login.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import HodDashboard from "./pages/HodDashboard.jsx";
import PublicVerify from "./pages/PublicVerify.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import BonafideLandingPage from "./pages/HomePage.jsx";

const App = () => {
  const location = useLocation();
  const isDashboardRoute = ['/student-dashboard', '/hod', '/admin'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {!isDashboardRoute && <Navbar />}

      <main className="flex-grow">
        <AppShell>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<BonafideLandingPage />} />

            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hod"
              element={
                <ProtectedRoute allowedRoles={["ROLE_HOD", "ROLE_ADMIN"]}>
                  <HodDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/verify/:token" element={<PublicVerify />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </main>

      {!isDashboardRoute && <Footer />}
    </div>
  );
};

export default App;
