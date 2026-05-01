import { useState, useEffect } from 'react'
import { todayKey, loadChecklist, saveChecklist, loadTasks, loadStreak } from './storage.js'

const CAT = {
  learn:  { bg: 'var(--blue-bg)',   text: 'var(--blue-text)',   dot: 'var(--blue)'   },
  money:  { bg: 'var(--amber-bg)',  text: 'var(--amber-text)',  dot: 'var(--amber)'  },
  create: { bg: 'var(--purple-bg)', text: 'var(--purple-text)', dot: 'var(--purple)' },
  body:   { bg: 'var(--teal-bg)',   text: 'var(--teal-text)',   dot: 'var(--teal)'   },
  cook:   { bg: 'var(--coral-bg)',  text: 'var(--coral-text)',  dot: 'var(--coral)'  },
  social: { bg: 'var(--rose-bg)',   text: 'var(--rose-text)',   dot: 'var(--rose)'   },
}

function TaskItem({ task, done, onToggle }) {
  const c = CAT[task.cat] || CAT.learn
  return (
    <div onClick={onToggle} style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      background: 'var(--white)', border: '1px solid var(--border-soft)',
      borderLeft: `3px solid ${done ? 'var(--teal)' : c.dot}`,
      borderRadius: 'var(--radius)', padding: '12px 16px',
      cursor: 'pointer', opacity: done ? 0.55 : 1,
      boxShadow: 'var(--shadow)', transition: 'opacity 0.15s',
      WebkitTapHighlightColor: 'transparent'
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        border: done ? 'none' : '1.5px solid var(--ink-faint)',
        background: done ? 'var(--teal)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
      }}>
        {done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: done ? 'var(--ink-muted)' : 'var(--ink)', textDecoration: done ? 'line-through' : 'none', margin: 0 }}>
            {task.title}
          </p>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: c.bg, color: c.text }}>
            {task.badge}
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-faint)', lineHeight: 1.5, margin: 0 }}>{task.detail}</p>
      </div>
    </div>
  )
}

function ProgressBar({ done, total, winAt }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  const won = done >= winAt
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 500 }}>
          {done} of {total} {won ? '🎉 Day won!' : `— win at ${winAt}`}
        </span>
        <span style={{ fontSize: 12, color: won ? 'var(--teal)' : 'var(--ink-faint)', fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct + '%', background: won ? 'var(--teal)' : 'var(--blue)', borderRadius: 99, transition: 'width 0.3s' }} />
      </div>
    </div>
  )
}

export default function Checklist() {
  const [tab, setTab] = useState('work')
  const [tasks, setTasks] = useState(() => loadTasks())
  const [checked, setChecked] = useState(() => loadChecklist(todayKey()))
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const t = loadTasks()
    setTasks(t)
    setStreak(loadStreak(t))
  }, [])

  useEffect(() => {
    saveChecklist(todayKey(), checked)
  }, [checked])

  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }))
  const list = tab === 'work' ? tasks.work : tasks.home
  const winAt = tab === 'work' ? tasks.workWin : tasks.homeWin
  const done = list.filter(t => checked[t.id]).length
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--ink-faint)', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>{today}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)', lineHeight: 1.1, marginBottom: 4 }}>Today's checklist</h1>
          </div>
          {streak > 0 && (
            <div style={{ textAlign: 'center', background: 'var(--amber-bg)', borderRadius: 'var(--radius)', padding: '8px 12px', flexShrink: 0 }}>
              <p style={{ fontSize: 20, margin: 0 }}>🔥</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber-text)', margin: 0 }}>{streak} day{streak !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink-muted)', margin: 0 }}>Win the day with just {Math.min(tasks.workWin, tasks.homeWin)} tasks. Edit in Settings.</p>
      </div>

      {/* Tab toggle */}
      <div style={{
        display: 'inline-flex', gap: 3, background: 'var(--white)',
        border: '1px solid var(--border)', borderRadius: 99,
        padding: 3, marginBottom: 16, boxShadow: 'var(--shadow)'
      }}>
        {[['work', '💼 At Work'], ['home', '🏠 At Home']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            fontSize: 13, fontWeight: 500, padding: '6px 16px', borderRadius: 99, border: 'none',
            background: tab === key ? 'var(--ink)' : 'transparent',
            color: tab === key ? 'var(--white)' : 'var(--ink-muted)',
            transition: 'all 0.15s'
          }}>{label}</button>
        ))}
      </div>

      <ProgressBar done={done} total={list.length} winAt={winAt} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {list.map(t => (
          <TaskItem key={t.id} task={t} done={!!checked[t.id]} onToggle={() => toggle(t.id)} />
        ))}
      </div>

      <div style={{ marginTop: 16, padding: '12px 16px', borderLeft: '3px solid var(--teal)', borderRadius: '0 var(--radius) var(--radius) 0', background: 'var(--teal-bg)', fontSize: 13, color: 'var(--teal-text)' }}>
        <strong>Anti-burnout rule:</strong> {winAt} tasks = a winning day. Checks reset each morning automatically.
      </div>
    </div>
  )
}
