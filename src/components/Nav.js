import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Nav.css';

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="nav">
      <Link to="/dashboard" className="nav__brand">MindCheck</Link>
      <div className="nav__links">
        <NavLink to="/dashboard" className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>Dashboard</NavLink>
        <NavLink to="/checkin"   className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>Check In</NavLink>
        <NavLink to="/history"   className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>History</NavLink>
        <NavLink to="/trends"    className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>Trends</NavLink>
        <NavLink to="/settings"  className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>Settings</NavLink>
      </div>
      {user && <button className="nav__logout" onClick={handleLogout}>Sign out</button>}
    </nav>
  );
}
