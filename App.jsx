import { useState } from 'react'
import Checklist from './Checklist.jsx'
import WeeklyReview from './WeeklyReview.jsx'

export default function App() {
  const [tab, setTab] = useState('checklist')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--white)',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{
          maxWidth: 680, margin: '0 auto', padding: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 56
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink)' }}>Daily Growth</span>
            <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>by you</span>
          </div>
          <nav style={{ display: 'flex', gap: 4 }}>
            {[['checklist', 'Today'], ['review', 'Week Review']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                fontSize: 13, fontWeight: 500, padding: '6px 14px', borderRadius: 99,
                border: tab === key ? '1px solid var(--ink)' : '1px solid transparent',
                background: tab === key ? 'var(--ink)' : 'transparent',
                color: tab === key ? 'var(--white)' : 'var(--ink-muted)',
                transition: 'all 0.15s'
              }}>{label}</button>
            ))}
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px 80px' }}>
        {tab === 'checklist' ? <Checklist /> : <WeeklyReview />}
      </main>
    </div>
  )
}
