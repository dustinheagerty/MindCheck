import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, Cell,
} from 'recharts';
import Nav from '../components/Nav';
import { MOODS } from '../components/MoodPicker';
import { trendsService, entriesService } from '../services/api';
import './TrendsPage.css';

// Maps mood value 1-5 to its CSS variable color string
const MOOD_COLORS = ['#e57373','#f4a261','#f9c74f','#90be6d','#43aa8b'];

function MoodTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val  = payload[0]?.value;
  const mood = val != null ? MOODS[Math.round(val) - 1] : null;
  return (
    <div className="tt">
      <p className="tt__date">{label}</p>
      {mood && <p className="tt__mood" style={{ color: mood.color }}>{mood.emoji} {mood.label}</p>}
      <p className="tt__val">Score: {Number(val).toFixed(1)}</p>
    </div>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="trends__stat">
      <p className="trends__stat-label">{label}</p>
      <p className="trends__stat-value" style={accent ? { color: accent } : {}}>
        {value ?? '—'}
      </p>
      <p className="trends__stat-sub">{sub}</p>
    </div>
  );
}

export default function TrendsPage() {
  const [weekly,    setWeekly]    = useState(null);
  const [monthly,   setMonthly]   = useState(null);
  const [streak,    setStreak]    = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.allSettled([
      trendsService.getWeekly(),               // GET /trends/weekly
      trendsService.getMonthly(),              // GET /trends/monthly
      trendsService.getStreak(),               // GET /trends/streak
      entriesService.getAll({ limit: 30 }),   // last 30 entries for line chart
    ]).then(([w, m, s, e]) => {
      if (w.status === 'fulfilled') setWeekly(w.value);
      if (m.status === 'fulfilled') setMonthly(m.value);
      if (s.status === 'fulfilled') setStreak(s.value);
      if (e.status === 'fulfilled') {
        // Backend returns newest-first; chart wants oldest-first
        const entries = [...(e.value || [])].reverse();
        setChartData(entries.map(en => ({
          date:  new Date(en.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric' }),
          mood:  en.mood,
          label: MOODS.find(m => m.value === en.mood)?.label,
        })));
      }
      setLoading(false);
    });
  }, []);

  // Weekly bar chart data from mood_distribution
  const distData = weekly?.mood_distribution
    ? Object.entries(weekly.mood_distribution)
        .map(([k, v]) => ({ mood: MOODS.find(m => m.value === Number(k)), count: v }))
    : [];

  const weeklyColor  = MOOD_COLORS[Math.round(weekly?.avg_mood  ?? 3) - 1];
  const monthlyColor = MOOD_COLORS[Math.round(monthly?.avg_mood ?? 3) - 1];

  if (loading) return <><Nav /><div className="page-loading">Loading your trends…</div></>;

  return (
    <>
      <Nav />
      <main className="trends fade-up">
        <div className="trends__inner">

          <h1 className="trends__title">Mood trends</h1>
          <p className="trends__sub">A look at how your mood has shifted over time</p>

          {/* Stat cards */}
          <div className="trends__stats">
            <StatCard
              label="This week's avg"
              value={weekly?.avg_mood != null ? weekly.avg_mood.toFixed(1) : null}
              sub="out of 5"
              accent={weeklyColor}
            />
            <StatCard
              label="This month's avg"
              value={monthly?.avg_mood != null ? monthly.avg_mood.toFixed(1) : null}
              sub="out of 5"
              accent={monthlyColor}
            />
            <StatCard
              label="Current streak"
              value={streak?.current_streak}
              sub="days in a row"
              accent="var(--color-accent)"
            />
            <StatCard
              label="Longest streak"
              value={streak?.longest_streak}
              sub="days"
              accent="var(--color-accent)"
            />
          </div>

          {/* 30-day line chart */}
          <div className="trends__card">
            <h2 className="trends__card-title">Last 30 entries</h2>
            {chartData.length === 0 ? (
              <p className="trends__empty">
                No entries yet. Start checking in daily to see your trend here.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ top: 10, right: 16, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                    axisLine={false} tickLine={false} interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[1, 5]} ticks={[1,2,3,4,5]}
                    tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v => MOODS[v - 1]?.emoji}
                  />
                  <Tooltip content={<MoodTooltip />} />
                  <Line
                    type="monotone" dataKey="mood"
                    stroke="var(--color-accent)" strokeWidth={2.5}
                    dot={{ r: 4, fill: 'var(--color-accent)', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Weekly distribution bar chart */}
          <div className="trends__card">
            <h2 className="trends__card-title">This week's mood distribution</h2>
            {distData.every(d => d.count === 0) ? (
              <p className="trends__empty">No entries logged this week yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={distData} margin={{ top: 10, right: 16, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="mood.label"
                    tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip
                    formatter={v => [v, 'days']}
                    contentStyle={{
                      fontFamily: 'var(--font-body)', fontSize: '.85rem',
                      borderRadius: 12, border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                    }}
                  />
                  <Bar dataKey="count" radius={[6,6,0,0]}>
                    {distData.map((d, i) => (
                      <Cell key={i} fill={d.mood?.color ?? MOOD_COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend */}
          <div className="trends__legend">
            {MOODS.map(m => (
              <div key={m.value} className="trends__legend-item">
                <span style={{ color: m.color }}>{m.emoji}</span>
                <span>{m.label} = {m.value}</span>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
