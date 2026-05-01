import { useState } from 'react'
import { loadTasks, saveTasks, DEFAULT_WORK_TASKS, DEFAULT_HOME_TASKS } from './storage.js'

const CATS = ['learn', 'money', 'create', 'body', 'cook', 'social']
const CAT_COLOR = {
  learn:  { bg: 'var(--blue-bg)',   text: 'var(--blue-text)'   },
  money:  { bg: 'var(--amber-bg)',  text: 'var(--amber-text)'  },
  create: { bg: 'var(--purple-bg)', text: 'var(--purple-text)' },
  body:   { bg: 'var(--teal-bg)',   text: 'var(--teal-text)'   },
  cook:   { bg: 'var(--coral-bg)',  text: 'var(--coral-text)'  },
  social: { bg: 'var(--rose-bg)',   text: 'var(--rose-text)'   },
}

function uid() {
  return Math.random().toString(36).slice(2, 8)
}

function TaskEditor({ task, onChange, onDelete }) {
  const [open, setOpen] = useState(false)
  const c = CAT_COLOR[task.cat] || CAT_COLOR.learn

  return (
    <div style={{
      background: 'var(--white)', border: '1px solid var(--border-soft)',
      borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden'
    }}>
      <div onClick={() => setOpen(o => !o)} style={{
        padding: '11px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
        WebkitTapHighlightColor: 'transparent'
      }}>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: c.bg, color: c.text, flexShrink: 0 }}>{task.cat}</span>
        <p style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--ink)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</p>
        <span style={{ fontSize: 12, color: 'var(--ink-faint)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>▾</span>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border-soft)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Title</label>
            <input value={task.title} onChange={e => onChange({ ...task, title: e.target.value })}
              style={{ width: '100%', fontSize: 13, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--cream)', color: 'var(--ink)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Description</label>
            <textarea value={task.detail} onChange={e => onChange({ ...task, detail: e.target.value })}
              style={{ width: '100%', fontSize: 13, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--cream)', color: 'var(--ink)', outline: 'none', resize: 'vertical', minHeight: 56 }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Badge</label>
              <input value={task.badge} onChange={e => onChange({ ...task, badge: e.target.value })}
                style={{ width: '100%', fontSize: 13, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--cream)', color: 'var(--ink)', outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Category</label>
              <select value={task.cat} onChange={e => onChange({ ...task, cat: e.target.value })}
                style={{ width: '100%', fontSize: 13, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--cream)', color: 'var(--ink)', outline: 'none' }}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button onClick={onDelete} style={{
            fontSize: 12, fontWeight: 600, color: 'var(--coral-text)', background: 'var(--coral-bg)',
            border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px', cursor: 'pointer'
          }}>🗑 Remove this task</button>
        </div>
      )}
    </div>
  )
}

export default function Settings() {
  const [tasks, setTasks] = useState(() => loadTasks())
  const [saved, setSaved] = useState(false)
  const [showReset, setShowReset] = useState(false)

  const persist = (next) => {
    setTasks(next)
    saveTasks(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const updateTask = (list, id, updated) =>
    list.map(t => t.id === id ? updated : t)

  const removeTask = (list, id) =>
    list.filter(t => t.id !== id)

  const addTask = (list) => [
    ...list,
    { id: uid(), title: 'New task', detail: 'Tap to edit this task', badge: '~', cat: 'learn' }
  ]

  const reset = () => {
    persist({ work: DEFAULT_WORK_TASKS, home: DEFAULT_HOME_TASKS, workWin: 3, homeWin: 3 })
    setShowReset(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)', marginBottom: 4 }}>Settings</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-muted)', margin: 0 }}>Customize your tasks and win conditions.</p>
        </div>
        {saved && <span style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600, paddingTop: 6 }}>✓ Saved</span>}
      </div>

      {/* Win conditions */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 24, boxShadow: 'var(--shadow)' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 14 }}>Win conditions — tasks needed to win the day</p>
        <div style={{ display: 'flex', gap: 16 }}>
          {[['workWin', '💼 At Work'], ['homeWin', '🏠 At Home']].map(([key, label]) => (
            <div key={key} style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
              <div style={{ display: 'flex', gap: 5 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => persist({ ...tasks, [key]: n })} style={{
                    width: 36, height: 36, borderRadius: 8, border: '1px solid',
                    borderColor: tasks[key] === n ? 'var(--teal)' : 'var(--border)',
                    background: tasks[key] === n ? 'var(--teal-bg)' : 'transparent',
                    color: tasks[key] === n ? 'var(--teal-text)' : 'var(--ink-faint)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer'
                  }}>{n}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work tasks */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>💼 Work tasks ({tasks.work.length})</p>
          <button onClick={() => persist({ ...tasks, work: addTask(tasks.work) })} style={{
            fontSize: 12, fontWeight: 600, color: 'var(--teal-text)', background: 'var(--teal-bg)',
            border: 'none', borderRadius: 99, padding: '5px 12px', cursor: 'pointer'
          }}>+ Add task</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tasks.work.map(t => (
            <TaskEditor key={t.id} task={t}
              onChange={updated => persist({ ...tasks, work: updateTask(tasks.work, t.id, updated) })}
              onDelete={() => persist({ ...tasks, work: removeTask(tasks.work, t.id) })} />
          ))}
        </div>
      </div>

      {/* Home tasks */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>🏠 Home tasks ({tasks.home.length})</p>
          <button onClick={() => persist({ ...tasks, home: addTask(tasks.home) })} style={{
            fontSize: 12, fontWeight: 600, color: 'var(--teal-text)', background: 'var(--teal-bg)',
            border: 'none', borderRadius: 99, padding: '5px 12px', cursor: 'pointer'
          }}>+ Add task</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tasks.home.map(t => (
            <TaskEditor key={t.id} task={t}
              onChange={updated => persist({ ...tasks, home: updateTask(tasks.home, t.id, updated) })}
              onDelete={() => persist({ ...tasks, home: removeTask(tasks.home, t.id) })} />
          ))}
        </div>
      </div>

      {/* Reset */}
      {!showReset
        ? <button onClick={() => setShowReset(true)} style={{ fontSize: 12, color: 'var(--ink-faint)', background: 'none', border: '1px solid var(--border)', borderRadius: 99, padding: '6px 14px', cursor: 'pointer' }}>Reset to defaults</button>
        : (
          <div style={{ background: 'var(--coral-bg)', border: '1px solid var(--coral)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--coral-text)', marginBottom: 10 }}>Reset all tasks to the original defaults? This can't be undone.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={reset} style={{ fontSize: 13, fontWeight: 600, background: 'var(--coral)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', cursor: 'pointer' }}>Yes, reset</button>
              <button onClick={() => setShowReset(false)} style={{ fontSize: 13, background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )
      }
    </div>
  )
}
