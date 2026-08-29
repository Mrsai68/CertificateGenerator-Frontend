import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuthContext.jsx';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ROLE_HOD') {
      return <Navigate to="/hod" replace />;
    } else if (user.role === 'ROLE_ADMIN') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/student-dashboard" replace />;
    }
  }

  return children;
}
