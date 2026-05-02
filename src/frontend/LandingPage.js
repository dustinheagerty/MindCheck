import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">MindCheck Wellness Tracker</p>

          <h1>Understand your mood one check-in at a time.</h1>

          <p className="hero-description">
            MindCheck helps students and busy professionals track daily moods,
            journal quick reflections, tag important life factors, and recognize
            emotional patterns over time.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              Start Checking In
            </Link>
            <Link to="/login" className="btn btn-secondary">
              I already have an account
            </Link>
          </div>
        </div>

        <div className="mock-dashboard">
          <div className="mock-header">
            <div>
              <p className="mock-label">Today’s mood</p>
              <h2>Feeling balanced</h2>
            </div>
            <span className="mood-badge">4/5</span>
          </div>

          <div className="mood-scale">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span className="active">4</span>
            <span>5</span>
          </div>

          <div className="mock-note">
            “Had a productive day and felt more focused after getting enough
            sleep.”
          </div>

          <div className="tag-row">
            <span>Sleep</span>
            <span>School</span>
            <span>Focus</span>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-card">
          <h3>Daily Check-Ins</h3>
          <p>
            Log a simple 1–5 mood score and optional journal note each day.
          </p>
        </div>

        <div className="feature-card">
          <h3>Context Tags</h3>
          <p>
            Tag entries with school, sleep, stress, exercise, or anything that
            influenced your mood.
          </p>
        </div>

        <div className="feature-card">
          <h3>Mood Trends</h3>
          <p>
            Review recent patterns through history views and simple visual
            trend charts.
          </p>
        </div>
      </section>

      <section className="landing-cta">
        <h2>Build a healthier daily reflection habit.</h2>
        <p>
          MindCheck turns quick daily check-ins into useful personal insight.
        </p>
        <Link to="/register" className="btn btn-primary">
          Create Free Account
        </Link>
      </section>
    </div>
  );
}