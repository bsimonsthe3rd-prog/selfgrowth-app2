import { useState } from 'react'

const PILLARS = [
  { key: 'learn',  label: 'Learning',          icon: '📚', sub: 'Spanish, AI, reading, quick tidbits' },
  { key: 'create', label: 'Creative / Project', icon: '🎵', sub: 'Music, coding, woodworking' },
  { key: 'body',   label: 'Body',               icon: '💪', sub: 'Workouts — protect the streak' },
  { key: 'money',  label: 'Finance & AI',        icon: '💰', sub: 'Investing, AI skills, career moves' },
  { key: 'cook',   label: 'Cooking',             icon: '🍳', sub: 'Techniques, new meals, cooking for others' },
  { key: 'social', label: 'Social',              icon: '🤝', sub: 'Friends, community, connection' },
]

const PROMPTS = [
  { key: 'win',      label: '🏆 Biggest win this week',           placeholder: 'What are you most proud of? Even small things count.' },
  { key: 'struggle', label: '⚡ What was hardest?',               placeholder: 'Where did you lose momentum or skip something?' },
  { key: 'insight',  label: '💡 One thing you learned',           placeholder: 'A skill, a fact, something about yourself...' },
  { key: 'improve',  label: '🎯 One thing to do differently',     placeholder: 'Keep it small and specific — one thing only.' },
  { key: 'excited',  label: '✨ What are you looking forward to?', placeholder: 'Something on the horizon that excites you...' },
]

const RATING_LABEL = { 1: 'Rough', 2: 'OK', 3: 'Solid', 4: 'Great', 5: 'Crushing it' }
const RATING_COLOR = {
  1: { bg: 'var(--coral-bg)',  text: 'var(--coral-text)',  active: 'var(--coral)'  },
  2: { bg: 'var(--amber-bg)',  text: 'var(--amber-text)',  active: 'var(--amber)'  },
  3: { bg: 'var(--blue-bg)',   text: 'var(--blue-text)',   active: 'var(--blue)'   },
  4: { bg: 'var(--teal-bg)',   text: 'var(--teal-text)',   active: 'var(--teal)'   },
  5: { bg: 'var(--purple-bg)', text: 'var(--purple-text)', active: 'var(--purple)' },
}

function getWeekKey() {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${week}`
}

function getWeekLabel() {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day + 6) % 7))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(monday)} – ${fmt(sunday)}`
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  const active = hover || value
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
      {[1,2,3,4,5].map(r => {
        const c = RATING_COLOR[r]
        const isActive = active >= r
        return (
          <button key={r}
            onClick={() => onChange(r)}
            onMouseEnter={() => setHover(r)}
            onMouseLeave={() => setHover(0)}
            style={{
              width: 36, height: 36, borderRadius: 8,
              border: '1px solid ' + (isActive ? c.active : 'var(--border)'),
              background: isActive ? c.bg : 'transparent',
              color: isActive ? c.text : 'var(--ink-faint)',
              fontSize: 13, fontWeight: 600, transition: 'all 0.12s'
            }}>{r}</button>
        )
      })}
      {value > 0 && (
        <span style={{
          fontSize: 12, fontWeight: 600, marginLeft: 6,
          color: RATING_COLOR[value].text,
          background: RATING_COLOR[value].bg,
          padding: '3px 10px', borderRadius: 99
        }}>{RATING_LABEL[value]}</span>
      )}
    </div>
  )
}

function OverallRing({ pct }) {
  const r = 32, stroke = 5
  const circ = 2 * Math.PI * r
  return (
    <svg width={78} height={78} viewBox="0 0 78 78">
      <circle cx={39} cy={39} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle cx={39} cy={39} r={r} fill="none" stroke="var(--teal)" strokeWidth={stroke}
        strokeDasharray={`${circ * pct / 100} ${circ}`}
        strokeLinecap="round" transform="rotate(-90 39 39)"
        style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      <text x={39} y={43} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--ink)"
        fontFamily="var(--font-body)">{pct}%</text>
    </svg>
  )
}

const emptyData = () => ({ ratings: {}, prompts: {}, savedAt: null })

export default function WeeklyReview() {
  const weekKey = getWeekKey()
  const storageKey = 'weekly-review-' + weekKey

  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : emptyData()
    } catch { return emptyData() }
  })
  const [justSaved, setJustSaved] = useState(false)

  const save = (next) => {
    const withTime = { ...next, savedAt: new Date().toISOString() }
    setData(withTime)
    localStorage.setItem(storageKey, JSON.stringify(withTime))
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  const setRating = (key, val) => save({ ...data, ratings: { ...data.ratings, [key]: val } })
  const setPrompt = (key, val) => save({ ...data, prompts: { ...data.prompts, [key]: val } })

  const ratedCount = Object.keys(data.ratings).length
  const overallPct = ratedCount === 0 ? 0
    : Math.round((Object.values(data.ratings).reduce((a,b) => a+b, 0) / (ratedCount * 5)) * 100)
  const filledPrompts = PROMPTS.filter(p => data.prompts[p.key]?.trim()).length
  const completePct = Math.round(((ratedCount + filledPrompts) / (PILLARS.length + PROMPTS.length)) * 100)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 12, color: 'var(--ink-faint)', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>Weekly Review</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--ink)', lineHeight: 1.1, marginBottom: 6 }}>{getWeekLabel()}</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-muted)' }}>10 minutes every Sunday. Be honest, not harsh.</p>
      </div>
      <div style={{
        display: 'flex', gap: 16, alignItems: 'center',
        background: 'var(--white)', border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 28,
        boxShadow: 'var(--shadow-md)'
      }}>
        <OverallRing pct={overallPct} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>This week's score</p>
          <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 10 }}>
            {ratedCount === 0 ? 'Rate your pillars below to see your score' : `Based on ${ratedCount} of ${PILLARS.length} pillars rated`}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 5, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: completePct + '%', background: 'var(--teal)', borderRadius: 99, transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--ink-faint)', minWidth: 80, textAlign: 'right' }}>
              {justSaved ? '✓ Saved' : `${completePct}% complete`}
            </span>
          </div>
        </div>
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 12 }}>Rate each pillar</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
        {PILLARS.map(p => (
          <div key={p.key} style={{
            background: 'var(--white)', border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius)', padding: '14px 16px', boxShadow: 'var(--shadow)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{p.icon}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 1 }}>{p.label}</p>
                <p style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{p.sub}</p>
              </div>
            </div>
            <StarRating value={data.ratings[p.key] || 0} onChange={v => setRating(p.key, v)} />
          </div>
        ))}
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 12 }}>Reflect</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {PROMPTS.map(p => (
          <div key={p.key} style={{
            background: 'var(--white)', border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius)', padding: '14px 16px', boxShadow: 'var(--shadow)'
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>{p.label}</p>
            <textarea
              value={data.prompts[p.key] || ''}
              onChange={e => setPrompt(p.key, e.target.value)}
              placeholder={p.placeholder}
              style={{
                width: '100%', minHeight: 72, fontSize: 13, color: 'var(--ink)',
                background: 'var(--cream)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '10px 12px',
                resize: 'vertical', outline: 'none', lineHeight: 1.6,
              }}
              onFocus={e => e.target.style.borderColor = 'var(--teal)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        ))}
      </div>
      <div style={{
        padding: '12px 16px', borderLeft: '3px solid var(--teal)',
        borderRadius: '0 var(--radius) var(--radius) 0',
        background: 'var(--teal-bg)', fontSize: 13, color: 'var(--teal-text)'
      }}>
        <strong>The only rule:</strong> Be honest, not harsh. A 2/5 week where you showed up is still progress.
      </div>
    </div>
  )
}
