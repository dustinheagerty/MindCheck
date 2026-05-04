import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <main className="landing">
      <div className="landing__inner">
        <h1 className="landing__title">MindCheck</h1>
        <p className="landing__sub">A simple daily mental wellness check-in.</p>
        <p className="landing__desc">
          Log your mood, write a journal note, and track how you feel over time.
        </p>
        <div className="landing__actions">
          <Link to="/register" className="landing__btn landing__btn--primary">Get started</Link>
          <Link to="/login"    className="landing__btn landing__btn--secondary">Sign in</Link>
        </div>
      </div>
    </main>
  );
}
