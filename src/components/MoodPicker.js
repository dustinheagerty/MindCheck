export const MOODS = {
  1: {
    label: "Very Low",
    emoji: "😞",
    description: "Rough day",
  },
  2: {
    label: "Low",
    emoji: "😕",
    description: "Could be better",
  },
  3: {
    label: "Okay",
    emoji: "😐",
    description: "Neutral",
  },
  4: {
    label: "Good",
    emoji: "🙂",
    description: "Feeling positive",
  },
  5: {
    label: "Great",
    emoji: "😄",
    description: "Excellent day",
  },
};

export default function MoodPicker({ value, onChange }) {
  return (
    <div className="mood-picker">
      {Object.entries(MOODS).map(([score, mood]) => (
        <button
          key={score}
          type="button"
          className={Number(value) === Number(score) ? "active" : ""}
          onClick={() => onChange(Number(score))}
        >
          <span className="mood-emoji">{mood.emoji}</span>
          <span className="mood-label">{mood.label}</span>
          <span className="mood-score">{score}</span>
        </button>
      ))}
    </div>
  );
}