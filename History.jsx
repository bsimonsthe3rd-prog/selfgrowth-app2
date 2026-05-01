import { useState, useEffect } from 'react'
import { loadHistory, loadTasks } from './storage.js'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (dateStr === today.toISOString().slice(0,10)) return 'Today'
  if (dateStr === yesterday.toISOString().slice(0,10)) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

function DayCard({ entry, tasks }) {
  const [open, setOpen] = useState(false)
  const allTasks = [...tasks.work, ...tasks.home]
  const checkedIds = Object.keys(entry.data).filter(k => entry.data[k])
  const done = checkedIds.length
  const total = allTasks.length
  const winAt = Math.min(tasks.workWin, tasks.homeWin)
  const won = done >= winAt
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <div style={{
      background: 'var(--white)', border: '1px solid var(--border-soft)',
      borderLeft: `3px solid ${won ? 'var(--teal)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden'
    }}>
      <div onClick={() => setOpen(o => !o)} style={{
        padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
        WebkitTapHighlightColor: 'transparent'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>{formatDate(entry.dateStr)}</p>
            {won
              ? <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'var(--teal-bg)', color: 'var(--teal-text)' }}>✓ Won</span>
              : <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'var(--border)', color: 'var(--ink-faint)' }}>{done}/{winAt} needed</span>
            }
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: pct + '%', background: won ? 'var(--teal)' : 'var(--blue)', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--ink-faint)', minWidth: 40 }}>{done}/{total}</span>
          </div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--ink-faint)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border-soft)', padding: '10px 16px 12px' }}>
          {allTasks.map(t => {
            const checked = !!entry.data[t.id]
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  background: checked ? 'var(--teal)' : 'transparent',
                  border: checked ? 'none' : '1.5px solid var(--ink-faint)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {checked && <svg width="8" height="6" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize: 13, color: checked ? 'var(--ink)' : 'var(--ink-faint)', textDecoration: checked ? 'none' : 'line-through' }}>{t.title}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function History() {
  const [history, setHistory] = useState([])
  const [tasks, setTasks] = useState(null)

  useEffect(() => {
    setTasks(loadTasks())
    setHistory(loadHistory())
  }, [])

  if (!tasks) return null

  const wins = history.filter(e => {
    const done = Object.values(e.data).filter(Boolean).length
    return done >= Math.min(tasks.workWin, tasks.homeWin)
  }).length

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)', marginBottom: 4 }}>History</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-muted)', margin: 0 }}>Look back at your past days. Tap any day to see the details.</p>
      </div>

      {history.length > 0 && (
        <div style={{
          display: 'flex', gap: 10, marginBottom: 24
        }}>
          <div style={{ flex: 1, background: 'var(--white)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius)', padding: '14px 16px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <p style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>{wins}</p>
            <p style={{ fontSize: 12, color: 'var(--ink-faint)', margin: 0 }}>Days won</p>
          </div>
          <div style={{ flex: 1, background: 'var(--white)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius)', padding: '14px 16px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <p style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{history.length}</p>
            <p style={{ fontSize: 12, color: 'var(--ink-faint)', margin: 0 }}>Days tracked</p>
          </div>
          <div style={{ flex: 1, background: 'var(--white)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius)', padding: '14px 16px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <p style={{ fontSize: 26, fontWeight: 700, color: 'var(--amber)', margin: 0 }}>{history.length ? Math.round((wins / history.length) * 100) : 0}%</p>
            <p style={{ fontSize: 12, color: 'var(--ink-faint)', margin: 0 }}>Win rate</p>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--ink-faint)' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>📅</p>
          <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 6 }}>No history yet</p>
          <p style={{ fontSize: 13 }}>Complete some tasks today and come back tomorrow — your history will show up here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.map(e => <DayCard key={e.dateStr} entry={e} tasks={tasks} />)}
        </div>
      )}
    </div>
  )
}
