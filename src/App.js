import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage     from './frontend/LandingPage';
import LoginPage       from './frontend/LoginPage';
import RegisterPage    from './frontend/RegisterPage';
import DashboardPage   from './frontend/DashboardPage';
import CheckInPage     from './frontend/CheckInPage';
import HistoryPage     from './frontend/HistoryPage';
import TrendsPage      from './frontend/TrendsPage';

// Route guard – redirect unauthenticated users to /login
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

// Route guard – redirect logged-in users away from auth pages
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Protected */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/checkin"   element={<PrivateRoute><CheckInPage /></PrivateRoute>} />
          <Route path="/history"   element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
          <Route path="/trends"    element={<PrivateRoute><TrendsPage /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
