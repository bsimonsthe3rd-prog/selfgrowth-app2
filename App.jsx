import { useState } from 'react'
import Checklist from './Checklist.jsx'
import WeeklyReview from './WeeklyReview.jsx'
import History from './History.jsx'
import Settings from './Settings.jsx'

const TABS = [
  { key: 'checklist', label: 'Today',   icon: '✓' },
  { key: 'history',   label: 'History', icon: '📅' },
  { key: 'review',    label: 'Review',  icon: '📊' },
  { key: 'settings',  label: 'Settings',icon: '⚙️' },
]

export default function App() {
  const [tab, setTab] = useState('checklist')

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', background: 'var(--cream)', paddingBottom: 80 }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--white)',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{
          maxWidth: 680, margin: '0 auto', padding: '0 20px',
          display: 'flex', alignItems: 'center', height: 52
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink)' }}>Daily Growth</span>
          <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: 8 }}>by you</span>
        </div>
      </header>

      {/* Page content */}
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px 40px' }}>
        {tab === 'checklist' && <Checklist />}
        {tab === 'history'   && <History />}
        {tab === 'review'    && <WeeklyReview />}
        {tab === 'settings'  && <Settings />}
      </main>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--white)', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        height: 64, paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)', zIndex: 50
      }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            background: 'none', border: 'none', padding: '6px 16px',
            color: tab === t.key ? 'var(--teal)' : 'var(--ink-faint)',
            fontWeight: tab === t.key ? 600 : 400,
            transition: 'color 0.15s'
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 11, letterSpacing: '0.02em' }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
