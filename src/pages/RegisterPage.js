import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { token, user } = await authService.register({ username, email, password });
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page fade-up">
      <div className="auth-box">
        <h1 className="auth-title">Create account</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Username
            <input className="auth-input" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </label>
          <label className="auth-label">
            Email
            <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <label className="auth-label">
            Password
            <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </main>
  );
}
