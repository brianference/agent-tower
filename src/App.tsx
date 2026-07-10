import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import './styles.css'
import { initTheme, toggleTheme, getTheme } from './theme'
import { ChatDock } from './ChatDock'
import { seedContext } from './seedContext'
import { SESSIONS } from './data'

const FEATURES = [{"t": "Session grid", "d": "Active / idle / warning / danger from real metric thresholds."}, {"t": "Token economics", "d": "Per-agent burn rate and daily budget progress."}, {"t": "Ops chat", "d": "Ask which agent is expensive \u2014 answers use the metrics table only."}, {"t": "Dark ops UI", "d": "Light & dark themes built for long on-call glances."}, {"t": "Rate-limit aware API", "d": "Cloudflare Functions with health + chat endpoints."}, {"t": "Zero-account demo", "d": "Explore with seeded fleet data; wire your gateway next."}] as { t: string; d: string }[]
const INTEGRATIONS = [{"t": "OpenAI / Anthropic metrics", "d": "Normalize token + cost across providers"}, {"t": "OpenClaw / gateway hooks", "d": "Pull session lists from your agent runtime"}, {"t": "Webhooks", "d": "Slack/Telegram alerts on burn-rate spikes"}, {"t": "CSV/JSON export", "d": "Finance-friendly cost dumps"}] as { t: string; d: string }[]
const RECRUITER = ["Platform mindset: multi-agent observability & cost control", "Security: secrets server-side, rate limits, CSP headers", "Data viz: burn rates, status chips, live-style refresh", "AI ops: grounded assistant over structured telemetry"] as string[]
const QUICK = ["Connect real OpenClaw/CLI session JSON feed", "Budget caps with hard stop webhooks", "Per-model pricing table (editable)", "Anomaly detection on sudden token spikes"] as string[]

function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme())
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Toggle light and dark mode"
      onClick={() => setTheme(toggleTheme())}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false)
  return (
    <div className={`shell${chatOpen ? ' shell--chat' : ''}`}>
      <header className="topbar">
        <Link to="/" className="brand">Agent Tower</Link>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/app">App</NavLink>
          <NavLink to="/features">Features</NavLink>
        </nav>
        <ThemeToggle />
      </header>
      <main>{children}</main>
      <ChatDock open={chatOpen} onOpenChange={setChatOpen} context={seedContext()} product="agent-tower" />
      <footer className="footer">
        <p>
          Agent Tower · public portfolio product ·{' '}
          <a href="https://github.com/brianference/agent-tower" target="_blank" rel="noreferrer">GitHub</a>
        </p>
        <p className="fine">Built for real use and for hiring conversations — stack, constraints, and integrations included.</p>
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
        <p className="lede">Real-time control tower for AI agents: session health, token burn, budget alerts, and an ops chat grounded on live metrics.</p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/app">Open the app</Link>
          <Link className="btn btn-ghost" to="/features">See features</Link>
        </div>
        <ul className="hero-points">
          <li>Light & dark mode</li>
          <li>Grounded AI chat</li>
          <li>No account required</li>
          <li>Cloudflare Pages ready</li>
        </ul>
      </section>
      <section className="grid-3">
        {FEATURES.slice(0, 3).map((f) => (
          <article key={f.t} className="card">
            <h3>{f.t}</h3>
            <p>{f.d}</p>
          </article>
        ))}
      </section>
      <section className="panel">
        <h2>Integrations</h2>
        <div className="grid-2">
          {INTEGRATIONS.map((i) => (
            <div key={i.t} className="card card-slim">
              <h3>{i.t}</h3>
              <p>{i.d}</p>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  )
}

function FeaturesPage() {
  return (
    <Shell>
      <section className="panel">
        <h1>Features</h1>
        <p className="lede">Product depth first — the same signals recruiters and technical founders look for.</p>
        <div className="grid-2">
          {FEATURES.map((f) => (
            <article key={f.t} className="card">
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="panel subtle">
        <h2>Engineering signals</h2>
        <ul className="check-list">
          {RECRUITER.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h2>Quick wins next</h2>
        <ul className="check-list">
          {QUICK.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>
    </Shell>
  )
}

function AppPage() {
  return (
    <Shell>
      <ProductApp />
    </Shell>
  )
}


function ProductApp() {
  const total = SESSIONS.reduce((a, s) => a + s.costUsd, 0)
  return (
    <section className="panel">
      <h1>Fleet overview</h1>
      <p className="lede">Demo sessions with realistic token/cost fields. Ops chat answers from this table only. Daily burn sample: <strong>${total.toFixed(2)}</strong></p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Agent</th><th>Model</th><th>Status</th><th>Tokens</th><th>Cost</th><th>Context</th></tr>
          </thead>
          <tbody>
            {SESSIONS.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.model}</td>
                <td><span className={`status status--${s.status}`}>{s.status}</span></td>
                <td>{(s.tokensIn + s.tokensOut).toLocaleString()}</td>
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
