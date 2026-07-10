import type { AgentSession } from '../../data/sessions'

export type FleetGridProps = {
  sessions: readonly AgentSession[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function FleetGrid({ sessions, selectedId, onSelect }: FleetGridProps) {
  return (
    <div className="fleet-grid">
      {sessions.map((session) => (
        <button
          key={session.id}
          type="button"
          className={`card fleet-card${selectedId === session.id ? ' is-active' : ''}`}
          onClick={() => onSelect(session.id)}
        >
          <div className="chips">
            <span className={`status status--${session.status}`}>{session.status}</span>
          </div>
          <h3 style={{ marginTop: 8 }}>{session.name}</h3>
          <p className="meta">{session.model}</p>
          <p className="meta">
            ${session.costUsd.toFixed(2)} · {(session.tokensIn + session.tokensOut).toLocaleString()} tok
          </p>
          <div className="ctx-bar" title={`Context ${session.contextPct}%`}>
            <span style={{ width: `${session.contextPct}%` }} />
          </div>
        </button>
      ))}
    </div>
  )
}
