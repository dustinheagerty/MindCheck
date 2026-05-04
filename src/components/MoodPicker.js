import React from 'react';
import './MoodPicker.css';

export const MOODS = [
  { value: 1, label: 'Terrible', emoji: '😔', color: '#e57373' },
  { value: 2, label: 'Bad',      emoji: '😕', color: '#f4a261' },
  { value: 3, label: 'Okay',     emoji: '😐', color: '#f9c74f' },
  { value: 4, label: 'Good',     emoji: '🙂', color: '#90be6d' },
  { value: 5, label: 'Great',    emoji: '😄', color: '#43aa8b' },
];

export default function MoodPicker({ value, onChange, size = 'normal' }) {
  return (
    <div className={`mood-picker${size === 'compact' ? ' mood-picker--compact' : ''}`}>
      {MOODS.map(m => (
        <button
          key={m.value}
          type="button"
          className={`mood-btn${value === m.value ? ' selected' : ''}`}
          style={{ '--mc': m.color }}
          onClick={() => onChange(m.value)}
          aria-label={m.label}
        >
          <span className="mood-btn__emoji">{m.emoji}</span>
          <span className="mood-btn__label">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
