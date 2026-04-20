import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import MoodPicker, { MOODS } from '../components/MoodPicker';
import { entriesService } from '../services/api';
import './CheckInPage.css';

const SUGGESTION_TAGS = ['work', 'school', 'family', 'health', 'social', 'exercise', 'sleep', 'stress'];

export default function CheckInPage() {
  const navigate = useNavigate();

  const [existingId, setExistingId] = useState(null);
  const [mood,    setMood]    = useState(null);
  const [note,    setNote]    = useState('');
  const [tags,    setTags]    = useState([]);
  const [tagInput,setTagInput]= useState('');

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  // Load today's existing entry if any (GET /entries/today)
  useEffect(() => {
    entriesService.getToday()
      .then(entry => {
        if (entry) {
          setExistingId(entry.id);
          setMood(entry.mood);
          setNote(entry.note || '');
          setTags(entry.tags || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Tag helpers
  const addTag = (raw) => {
    const t = raw.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t) && tags.length < 10) setTags(p => [...p, t]);
    setTagInput('');
  };
  const removeTag = (t) => setTags(p => p.filter(x => x !== t));
  const onTagKey  = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!mood) { setError('Please select a mood before saving.'); return; }
    setError(''); setSaving(true);
    try {
      const payload = { mood, note: note.trim() || null, tags };
      if (existingId) {
        await entriesService.update(existingId, payload);  // PUT /entries/:id
      } else {
        await entriesService.create(payload);              // POST /entries
      }
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (err) {
      setError(err.message || 'Failed to save. Please try again.');
      setSaving(false);
    }
  }

  const moodInfo = mood ? MOODS.find(m => m.value === mood) : null;

  if (loading) return <><Nav /><div className="page-loading">Loading…</div></>;

  return (
    <>
      <Nav />
      <main className="checkin fade-up">
        <div className="checkin__inner">

          <div className="checkin__header">
            <p className="checkin__date">
              {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
            </p>
            <h1 className="checkin__title">
              {existingId ? "Edit today's check-in" : 'Daily check-in'}
            </h1>
          </div>

          {success ? (
            <div className="checkin__success">
              <span>{moodInfo?.emoji}</span>
              <h2>Saved!</h2>
              <p>Feeling {moodInfo?.label?.toLowerCase()} — logged. Redirecting…</p>
            </div>
          ) : (
            <form className="checkin__form" onSubmit={handleSubmit}>

              {/* Mood */}
              <section className="checkin__section">
                <h2 className="checkin__section-title">How are you feeling?</h2>
                <MoodPicker value={mood} onChange={setMood} />
                {mood && (
                  <p className="checkin__mood-hint" style={{ color: moodInfo?.color }}>
                    {moodInfo?.emoji} {moodInfo?.label}
                  </p>
                )}
              </section>

              {/* Note */}
              <section className="checkin__section">
                <h2 className="checkin__section-title">
                  Journal note <span className="checkin__optional">(optional)</span>
                </h2>
                <textarea
                  className="checkin__textarea"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Write a few words about your day — what happened, how you feel about it…"
                  rows={5}
                  maxLength={1000}
                />
                <p className="checkin__char">{note.length} / 1000</p>
              </section>

              {/* Tags */}
              <section className="checkin__section">
                <h2 className="checkin__section-title">
                  Tags <span className="checkin__optional">(optional)</span>
                </h2>
                <div className="checkin__tag-box">
                  {tags.map(t => (
                    <span key={t} className="checkin__tag">
                      {t}
                      <button type="button" onClick={() => removeTag(t)} aria-label={`Remove ${t}`}>×</button>
                    </span>
                  ))}
                  <input
                    className="checkin__tag-input"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={onTagKey}
                    placeholder={tags.length < 10 ? 'Add tag…' : 'Max 10 tags'}
                    disabled={tags.length >= 10}
                    maxLength={20}
                  />
                </div>
                <div className="checkin__suggestions">
                  {SUGGESTION_TAGS.filter(t => !tags.includes(t)).map(t => (
                    <button key={t} type="button" className="checkin__suggest" onClick={() => addTag(t)}>
                      + {t}
                    </button>
                  ))}
                </div>
              </section>

              {error && <p className="checkin__error">{error}</p>}

              <button type="submit" className="checkin__submit" disabled={saving || !mood}>
                {saving ? 'Saving…' : existingId ? 'Update entry' : 'Save check-in'}
              </button>

            </form>
          )}

        </div>
      </main>
    </>
  );
}
