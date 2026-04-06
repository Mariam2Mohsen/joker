import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute
 * Wraps any route that requires the user to be logged in.
 * If no session is found in localStorage the user is redirected to /login,
 * and the original URL is stored in location.state.from so the Login page
 * can send them back after a successful sign-in.
 *
 * Optional props:
 *  - allowedRoles: string[]  — if provided, the user's role must be in this list.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();

  // Read session from localStorage (same key used by useAuth.js)
  const raw = localStorage.getItem('currentUser');
  const user = raw ? JSON.parse(raw) : null;

  // Not logged in → redirect to login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Logged in but wrong role → redirect to home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
