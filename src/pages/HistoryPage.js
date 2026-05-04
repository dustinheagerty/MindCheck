import React, { useState, useEffect, useCallback } from 'react';
import Nav from '../components/Nav';
import MoodPicker, { MOODS } from '../components/MoodPicker';
import { entriesService } from '../services/api';
import './HistoryPage.css';

export default function HistoryPage() {
  const [entries,  setEntries]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all'); // 'all' | 1-5

  // Edit state
  const [editId,   setEditId]   = useState(null);
  const [editMood, setEditMood] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [editErr,  setEditErr]  = useState('');

  const load = useCallback(() => {
    setLoading(true);
    entriesService.getAll()                    // GET /entries
      .then(data => setEntries(data || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Edit ──────────────────────────────────────────────────────────────────
  const startEdit = (entry) => {
    setEditId(entry.id);
    setEditMood(entry.mood);
    setEditNote(entry.note || '');
    setEditErr('');
  };
  const cancelEdit = () => { setEditId(null); setEditMood(null); setEditNote(''); setEditErr(''); };

  const saveEdit = async (id) => {
    setEditErr(''); setSaving(true);
    try {
      const updated = await entriesService.update(id, { mood: editMood, note: editNote.trim() || null });
      setEntries(prev => prev.map(e => e.id === id ? updated : e));
      cancelEdit();
    } catch (err) {
      setEditErr(err.message || 'Failed to update.');
    } finally { setSaving(false); }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteEntry = async (id) => {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    try {
      await entriesService.delete(id);          // DELETE /entries/:id
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete.');
    }
  };

  const filtered = filter === 'all'
    ? entries
    : entries.filter(e => e.mood === Number(filter));

  return (
    <>
      <Nav />
      <main className="history fade-up">
        <div className="history__inner">

          <div className="history__header">
            <h1 className="history__title">Entry history</h1>
            <p className="history__count">{entries.length} total {entries.length === 1 ? 'entry' : 'entries'}</p>
          </div>

          {/* Mood filter */}
          <div className="history__filters">
            <button
              className={`hf-btn${filter === 'all' ? ' active' : ''}`}
              onClick={() => setFilter('all')}
            >All</button>
            {MOODS.map(m => (
              <button
                key={m.value}
                className={`hf-btn${filter === m.value ? ' active' : ''}`}
                style={{ '--mc': m.color }}
                onClick={() => setFilter(filter === m.value ? 'all' : m.value)}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="page-loading">Loading entries…</div>
          ) : filtered.length === 0 ? (
            <div className="history__empty">
              {entries.length === 0
                ? 'No entries yet. Start with a daily check-in!'
                : 'No entries match that mood filter.'}
            </div>
          ) : (
            <div className="history__list">
              {filtered.map(entry => {
                const mood     = MOODS.find(m => m.value === entry.mood);
                const isEdit   = editId === entry.id;
                const dateStr  = new Date(entry.created_at).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                });

                return (
                  <article key={entry.id} className={`he${isEdit ? ' he--editing' : ''}`}>

                    {/* Top row */}
                    <div className="he__top">
                      <div className="he__left">
                        <span className="he__emoji" style={{ '--mc': mood?.color }}>{mood?.emoji}</span>
                        <div>
                          <p className="he__date">{dateStr}</p>
                          <p className="he__label" style={{ color: mood?.color }}>{mood?.label}</p>
                        </div>
                      </div>
                      {!isEdit && (
                        <div className="he__actions">
                          <button className="he__btn he__btn--edit" onClick={() => startEdit(entry)}>Edit</button>
                          <button className="he__btn he__btn--del"  onClick={() => deleteEntry(entry.id)}>Delete</button>
                        </div>
                      )}
                    </div>

                    {/* Note (view mode) */}
                    {!isEdit && entry.note && (
                      <p className="he__note">{entry.note}</p>
                    )}

                    {/* Tags (view mode) */}
                    {!isEdit && entry.tags?.length > 0 && (
                      <div className="he__tags">
                        {entry.tags.map(t => <span key={t} className="he__tag">{t}</span>)}
                      </div>
                    )}

                    {/* Edit form */}
                    {isEdit && (
                      <div className="he__edit">
                        <MoodPicker value={editMood} onChange={setEditMood} size="compact" />
                        <textarea
                          className="he__edit-textarea"
                          value={editNote}
                          onChange={e => setEditNote(e.target.value)}
                          placeholder="Edit your note…"
                          rows={3}
                          maxLength={1000}
                        />
                        {editErr && <p className="he__edit-err">{editErr}</p>}
                        <div className="he__edit-btns">
                          <button className="he__btn he__btn--save" onClick={() => saveEdit(entry.id)} disabled={saving}>
                            {saving ? 'Saving…' : 'Save changes'}
                          </button>
                          <button className="he__btn he__btn--cancel" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </div>
                    )}

                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
