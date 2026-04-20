import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import { settingsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './SettingsPage.css';

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'America/Phoenix', 'Europe/London',
  'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney',
];

export default function SettingsPage() {
  const { user, logout } = useAuth();

  const [settings,  setSettings]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState('');

  // Local form state
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime,    setReminderTime]    = useState('09:00');
  const [timezone,        setTimezone]        = useState('UTC');

  useEffect(() => {
    settingsService.get()               // GET /settings
      .then(data => {
        setSettings(data);
        setReminderEnabled(data.reminder_enabled ?? false);
        setReminderTime(data.reminder_time ?? '09:00');
        setTimezone(data.timezone ?? 'UTC');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setError(''); setSaving(true); setSaved(false);
    try {
      const updated = await settingsService.update({    // PUT /settings
        reminder_enabled: reminderEnabled,
        reminder_time: reminderEnabled ? reminderTime : null,
        timezone,
      });
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally { setSaving(false); }
  }

  if (loading) return <><Nav /><div className="page-loading">Loading settings…</div></>;

  return (
    <>
      <Nav />
      <main className="settings fade-up">
        <div className="settings__inner">

          <h1 className="settings__title">Settings</h1>

          {/* Account info */}
          <section className="settings__section">
            <h2 className="settings__section-title">Account</h2>
            <div className="settings__info-row">
              <span className="settings__info-label">Username</span>
              <span className="settings__info-value">{user?.username}</span>
            </div>
            <div className="settings__info-row">
              <span className="settings__info-label">Email</span>
              <span className="settings__info-value">{user?.email}</span>
            </div>
            <div className="settings__info-row">
              <span className="settings__info-label">Member since</span>
              <span className="settings__info-value">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
                  : '—'}
              </span>
            </div>
          </section>

          {/* Preferences form */}
          <form className="settings__section" onSubmit={handleSave}>
            <h2 className="settings__section-title">Preferences</h2>

            {/* Reminder toggle */}
            <div className="settings__row">
              <div>
                <p className="settings__row-label">Daily reminder</p>
                <p className="settings__row-desc">Get a nudge to complete your daily check-in</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={e => setReminderEnabled(e.target.checked)}
                />
                <span className="toggle__track" />
              </label>
            </div>

            {/* Reminder time */}
            {reminderEnabled && (
              <div className="settings__field">
                <label className="settings__label" htmlFor="reminder-time">Reminder time</label>
                <input
                  id="reminder-time"
                  type="time"
                  className="settings__input"
                  value={reminderTime}
                  onChange={e => setReminderTime(e.target.value)}
                />
              </div>
            )}

            {/* Timezone */}
            <div className="settings__field">
              <label className="settings__label" htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                className="settings__input settings__select"
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            {error && <p className="settings__error">{error}</p>}

            <div className="settings__save-row">
              {saved && <span className="settings__saved">✓ Saved</span>}
              <button type="submit" className="settings__save-btn" disabled={saving}>
                {saving ? 'Saving…' : 'Save preferences'}
              </button>
            </div>
          </form>

          {/* Danger zone */}
          <section className="settings__section settings__section--danger">
            <h2 className="settings__section-title settings__section-title--danger">Account actions</h2>
            <div className="settings__row">
              <div>
                <p className="settings__row-label">Sign out</p>
                <p className="settings__row-desc">Sign out of MindCheck on this device</p>
              </div>
              <button className="settings__danger-btn" onClick={logout}>Sign out</button>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
