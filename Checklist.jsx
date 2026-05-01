import { useState, useEffect } from 'react'

const workTasks = [
  { id: 'w1', title: 'Spanish: 1 Duolingo lesson', detail: 'Daily reps beat long study sessions. One lesson is all you need.', badge: '~10 min', cat: 'learn' },
  { id: 'w2', title: 'Read 10 pages', detail: 'Any book — fiction, non-fiction. Just 10 pages.', badge: '~15 min', cat: 'learn' },
  { id: 'w3', title: 'One finance or AI tidbit', detail: 'Short article, newsletter, or YouTube clip. Rotate between finance and AI topics.', badge: '~10 min', cat: 'money' },
  { id: 'w4', title: 'AI hands-on time', detail: 'Try a new AI tool, follow a short tutorial, or experiment with Claude/ChatGPT for a real task.', badge: '~20 min', cat: 'learn' },
  { id: 'w5', title: 'Explore one new thing', detail: 'Cooking video, music theory, coding tutorial — whatever has your attention today.', badge: 'bonus', cat: 'create' },
]

const homeTasks = [
  { id: 'h1', title: 'Workout', detail: "You're already consistent — protect the streak. Log it as a win.", badge: 'habit', cat: 'body' },
  { id: 'h2', title: 'Cook one intentional meal', detail: 'Pick a recipe slightly above your comfort zone. Focus on one new technique.', badge: '3×/week', cat: 'cook' },
  { id: 'h3', title: '30 min creative or project time', detail: 'Music, side project, woodworking, coding. Rotate freely.', badge: '~30 min', cat: 'create' },
  { id: 'h4', title: 'Read before TV or gaming', detail: 'Earn your fun. 10 pages first — then enjoy guilt-free.', badge: 'trigger', cat: 'learn' },
  { id: 'h5', title: 'One social touchpoint', detail: 'Text a friend, make a plan, or join a community. Three times a week.', badge: '3×/week', cat: 'social' },
]

const CAT = {
  learn:  { bg: 'var(--blue-bg)',   text: 'var(--blue-text)',   dot: 'var(--blue)'   },
  money:  { bg: 'var(--amber-bg)',  text: 'var(--amber-text)',  dot: 'var(--amber)'  },
  create: { bg: 'var(--purple-bg)', text: 'var(--purple-text)', dot: 'var(--purple)' },
  body:   { bg: 'var(--teal-bg)',   text: 'var(--teal-text)',   dot: 'var(--teal)'   },
  cook:   { bg: 'var(--coral-bg)',  text: 'var(--coral-text)',  dot: 'var(--coral)'  },
  social: { bg: 'var(--rose-bg)',   text: 'var(--rose-text)',   dot: 'var(--rose)'   },
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function TaskItem({ task, done, onToggle }) {
  const c = CAT[task.cat]
  return (
    <div onClick={onToggle} style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      background: 'var(--white)', border: '1px solid var(--border-soft)',
      borderLeft: `3px solid ${done ? 'var(--teal)' : c.dot}`,
      borderRadius: 'var(--radius)', padding: '12px 16px',
      cursor: 'pointer', transition: 'all 0.15s',
      opacity: done ? 0.6 : 1,
      boxShadow: 'var(--shadow)'
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        border: done ? 'none' : '1.5px solid var(--ink-faint)',
        background: done ? 'var(--teal)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s'
      }}>
        {done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: done ? 'var(--ink-muted)' : 'var(--ink)', textDecoration: done ? 'line-through' : 'none' }}>
            {task.title}
          </p>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: c.bg, color: c.text, letterSpacing: '0.03em' }}>
            {task.badge}
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-faint)', lineHeight: 1.5 }}>{task.detail}</p>
      </div>
    </div>
  )
}

function ProgressBar({ done, total, winAt }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  const won = done >= winAt
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 500 }}>
          {done} of {total} done {won ? '🎉' : `— win at ${winAt}`}
        </span>
        <span style={{ fontSize: 12, color: won ? 'var(--teal)' : 'var(--ink-faint)', fontWeight: 600 }}>
          {won ? 'Day won!' : `${pct}%`}
        </span>
      </div>
      <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: pct + '%',
          background: won ? 'var(--teal)' : 'var(--blue)',
          borderRadius: 99, transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  )
}

export default function Checklist() {
  const [tab, setTab] = useState('work')
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem('checklist-' + todayKey())
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem('checklist-' + todayKey(), JSON.stringify(checked))
  }, [checked])

  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }))
  const tasks = tab === 'work' ? workTasks : homeTasks
  const done = tasks.filter(t => checked[t.id]).length
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 12, color: 'var(--ink-faint)', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>{today}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--ink)', lineHeight: 1.1, marginBottom: 6 }}>Today's checklist</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-muted)' }}>Small wins, every day. You only need 3 to win the day.</p>
      </div>
      <div style={{
        display: 'inline-flex', gap: 3, background: 'var(--white)',
        border: '1px solid var(--border)', borderRadius: 99,
        padding: 3, marginBottom: 20, boxShadow: 'var(--shadow)'
      }}>
        {[['work', '💼 At Work'], ['home', '🏠 At Home']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            fontSize: 13, fontWeight: 500, padding: '6px 18px', borderRadius: 99,
            border: 'none',
            background: tab === key ? 'var(--ink)' : 'transparent',
            color: tab === key ? 'var(--white)' : 'var(--ink-muted)',
            transition: 'all 0.15s'
          }}>{label}</button>
        ))}
      </div>
      <ProgressBar done={done} total={tasks.length} winAt={3} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.map(t => (
          <TaskItem key={t.id} task={t} done={!!checked[t.id]} onToggle={() => toggle(t.id)} />
        ))}
      </div>
      <div style={{
        marginTop: 20, padding: '12px 16px',
        borderLeft: '3px solid var(--teal)', borderRadius: '0 var(--radius) var(--radius) 0',
        background: 'var(--teal-bg)', fontSize: 13, color: 'var(--teal-text)'
      }}>
        <strong>The anti-burnout rule:</strong> 3 tasks = a winning day. Everything else is a bonus. Checks reset automatically each morning.
      </div>
    </div>
  )
}
