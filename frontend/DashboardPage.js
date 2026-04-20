import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { MOODS } from '../components/MoodPicker';
import { entriesService, trendsService, promptsService } from '../services/api';
import './DashboardPage.css';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const [today,   setToday]   = useState(undefined); // undefined = loading, null = none
  const [streak,  setStreak]  = useState(null);
  const [prompt,  setPrompt]  = useState(null);
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      entriesService.getToday(),
      trendsService.getStreak(),
      promptsService.getDaily(),
      entriesService.getAll({ limit: 5 }),
    ]).then(([t, s, p, r]) => {
      setToday(t.status  === 'fulfilled' ? t.value : null);
      setStreak(s.status === 'fulfilled' ? s.value : null);
      setPrompt(p.status === 'fulfilled' ? p.value : null);
      setRecent(r.status === 'fulfilled' ? (r.value || []) : []);
      setLoading(false);
    });
  }, []);

  if (loading) return <><Nav /><div className="page-loading">Loading your dashboard…</div></>;

  const moodInfo = today ? MOODS.find(m => m.value === today.mood) : null;

  return (
    <>
      <Nav />
      <main className="dash fade-up">
        <div className="dash__inner">

          {/* Header */}
          <div className="dash__header">
            <div>
              <p className="dash__eyebrow">{greeting()}</p>
              <h1 className="dash__title">How's your day going?</h1>
            </div>
            {!today && (
              <Link to="/checkin" className="dash__cta-btn">+ Daily check-in</Link>
            )}
          </div>

          {/* Top cards */}
          <div className="dash__grid">

            {/* Today */}
            <div className="dash__card dash__card--today">
              <p className="dash__card-label">Today's mood</p>
              {today ? (
                <div className="dash__today">
                  <span className="dash__today-emoji" style={{ '--mc': moodInfo?.color }}>
                    {moodInfo?.emoji}
                  </span>
                  <div>
                    <p className="dash__today-mood">{moodInfo?.label}</p>
                    {today.note && <p className="dash__today-note">"{today.note}"</p>}
                    <Link to="/checkin" className="dash__edit-link">Edit entry →</Link>
                  </div>
                </div>
              ) : (
                <div className="dash__no-today">
                  <p>You haven't checked in yet today.</p>
                  <Link to="/checkin" className="dash__inline-link">Log your mood →</Link>
                </div>
              )}
            </div>

            {/* Streak */}
            <div className="dash__card dash__card--streak">
              <p className="dash__card-label">Current streak</p>
              <p className="dash__streak-num">{streak?.current_streak ?? '—'}</p>
              <p className="dash__streak-unit">days in a row</p>
              <p className="dash__streak-best">Best: {streak?.longest_streak ?? '—'} days</p>
            </div>

            {/* Prompt */}
            <div className="dash__card dash__card--prompt">
              <p className="dash__card-label">Today's reflection</p>
              <p className="dash__prompt">
                "{prompt?.prompt ?? 'What\'s one small thing that went well today?'}"
              </p>
              {prompt?.category && (
                <span className="dash__prompt-cat">{prompt.category}</span>
              )}
            </div>

          </div>

          {/* Quick nav */}
          <div className="dash__quick">
            {[
              { to: '/checkin', icon: '📝', label: today ? 'Edit today' : 'Check in' },
              { to: '/history', icon: '📅', label: 'History' },
              { to: '/trends',  icon: '📊', label: 'Trends' },
              { to: '/settings',icon: '⚙️', label: 'Settings' },
            ].map(q => (
              <Link key={q.to} to={q.to} className="dash__quick-btn">
                <span>{q.icon}</span>
                <span>{q.label}</span>
              </Link>
            ))}
          </div>

          {/* Recent entries */}
          {recent.length > 0 && (
            <section className="dash__recent">
              <div className="dash__recent-header">
                <h2 className="dash__section-title">Recent entries</h2>
                <Link to="/history" className="dash__inline-link">View all →</Link>
              </div>
              <div className="dash__entries">
                {recent.map(entry => {
                  const mood = MOODS.find(m => m.value === entry.mood);
                  const date = new Date(entry.created_at).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric',
                  });
                  return (
                    <div key={entry.id} className="dash__entry">
                      <span className="dash__entry-emoji" style={{ '--mc': mood?.color }}>
                        {mood?.emoji}
                      </span>
                      <div className="dash__entry-body">
                        <p className="dash__entry-date">{date}</p>
                        {entry.note && (
                          <p className="dash__entry-note">{entry.note}</p>
                        )}
                      </div>
                      <span className="dash__entry-label" style={{ color: mood?.color }}>
                        {mood?.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}
