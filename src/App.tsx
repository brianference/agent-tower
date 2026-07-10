import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import './styles.css'
import { initTheme, toggleTheme, getTheme } from './theme'
import { ChatDock } from './ChatDock'
import { seedContext } from './seedContext'
import { SESSIONS } from './data'

const FEATURES = [
  { t: 'Session grid', d: 'Active / idle / warning / danger from metric thresholds.' },
  { t: 'Token economics', d: 'Per-agent burn and daily budget progress.' },
  { t: 'Detail drawer', d: 'Inspect one session without leaving the fleet view.' },
  { t: 'Ops chat', d: 'Ask which agent is expensive — answers use the metrics table only.' },
  { t: 'Status filters', d: 'Focus on danger or warning agents in one click.' },
  { t: 'Dark ops UI', d: 'Light & dark themes for long on-call glances.' },
]
const BUDGET = 20

function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme())
  return (
    <button type="button" className="theme-toggle" aria-label="Toggle theme" onClick={() => setTheme(toggleTheme())}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false)
  return (
    <div className={`shell${chatOpen ? ' shell--chat' : ''}`}>
      <header className="topbar">
        <Link to="/" className="brand">
          Agent Tower
        </Link>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/app">Fleet</NavLink>
          <NavLink to="/features">Features</NavLink>
        </nav>
        <ThemeToggle />
      </header>
      <main>{children}</main>
      <ChatDock open={chatOpen} onOpenChange={setChatOpen} context={seedContext()} product="agent-tower" />
      <footer className="footer">
        <p>
          Agent Tower · demo telemetry ·{' '}
          <a href="https://github.com/brianference/agent-tower" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </p>
        <p className="fine">Wire a real gateway next — UI is built for live session JSON.</p>
      </footer>
    </div>
  )
}

function Home() {
  return (
    <Shell>
      <section className="hero">
        <p className="kicker">Agent Tower · observability for AI fleets</p>
        <h1>See every agent session. Cost, tokens, risk — in one tower.</h1>
        <p className="lede">Filter by health, open a session drawer, and ask the ops chat which agent is burning budget.</p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/app">
            Open fleet
          </Link>
          <Link className="btn btn-ghost" to="/features">
            Features
          </Link>
        </div>
      </section>
      <section className="grid-3">
        {FEATURES.slice(0, 3).map((f) => (
          <article key={f.t} className="card">
            <h3>{f.t}</h3>
            <p>{f.d}</p>
          </article>
        ))}
      </section>
    </Shell>
  )
}

function FeaturesPage() {
  return (
    <Shell>
      <section className="panel">
        <h1>Features</h1>
        <div className="grid-2">
          {FEATURES.map((f) => (
            <article key={f.t} className="card">
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  )
}

function ProductApp() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)
  const total = SESSIONS.reduce((a, s) => a + s.costUsd, 0)
  const budgetPct = Math.min(100, Math.round((total / BUDGET) * 100))
  const rows = useMemo(
    () => SESSIONS.filter((s) => filter === 'all' || s.status === filter),
    [filter],
  )
  const active = SESSIONS.find((s) => s.id === selected) || null

  return (
    <section className="panel">
      <div className="chips" style={{ marginBottom: 12 }}>
        <span className="badge-live">Demo telemetry</span>
      </div>
      <h1>Fleet overview</h1>
      <p className="lede">
        Sample daily burn <strong>${total.toFixed(2)}</strong> of ${BUDGET.toFixed(2)} budget ({budgetPct}%).
      </p>
      <div className="score-bar" style={{ maxWidth: 360, height: 10, marginBottom: 16 }} aria-label="Budget used">
        <span style={{ width: `${budgetPct}%`, background: budgetPct > 80 ? 'var(--danger)' : undefined }} />
      </div>

      <div className="filters">
        {['all', 'active', 'warning', 'danger', 'idle'].map((f) => (
          <button key={f} type="button" className={`tab${filter === f ? ' is-active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="fleet-grid">
        {rows.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`card fleet-card${selected === s.id ? ' is-active' : ''}`}
            onClick={() => setSelected(s.id)}
          >
            <div className="chips">
              <span className={`status status--${s.status}`}>{s.status}</span>
            </div>
            <h3 style={{ marginTop: 8 }}>{s.name}</h3>
            <p className="meta">{s.model}</p>
            <p className="meta">${s.costUsd.toFixed(2)} · {(s.tokensIn + s.tokensOut).toLocaleString()} tok</p>
            <div className="ctx-bar" title={`Context ${s.contextPct}%`}>
              <span style={{ width: `${s.contextPct}%` }} />
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="drawer" role="dialog" aria-label={`Session ${active.name}`}>
          <h2>{active.name}</h2>
          <p className="lede">
            Status <strong className={`status status--${active.status}`}>{active.status}</strong> · model {active.model}
          </p>
          <ul className="check-list">
            <li>
              Tokens in/out: {active.tokensIn.toLocaleString()} / {active.tokensOut.toLocaleString()}
            </li>
            <li>Cost: ${active.costUsd.toFixed(2)}</li>
            <li>Context: {active.contextPct}%</li>
            <li>
              Suggested:{' '}
              {active.status === 'danger'
                ? 'Pause or lower max tokens immediately.'
                : active.status === 'warning'
                  ? 'Watch burn rate; consider a cheaper model.'
                  : active.status === 'active'
                    ? 'Healthy — keep monitoring.'
                    : 'Idle — no action required.'}
            </li>
          </ul>
          <button type="button" className="btn btn-ghost" onClick={() => setSelected(null)}>
            Close
          </button>
        </div>
      )}

      <div className="table-wrap" style={{ marginTop: 20 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Agent</th>
              <th>Status</th>
              <th>Cost</th>
              <th>Context</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>
                  <span className={`status status--${s.status}`}>{s.status}</span>
                </td>
                <td>${s.costUsd.toFixed(2)}</td>
                <td>{s.contextPct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function AppPage() {
  return (
    <Shell>
      <ProductApp />
    </Shell>
  )
}

export default function App() {
  useEffect(() => {
    initTheme()
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Routes>
    </BrowserRouter>
  )
}
