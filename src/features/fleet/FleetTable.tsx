import type { AgentSession } from '../../data/sessions'

export type FleetTableProps = { sessions: readonly AgentSession[] }

export function FleetTable({ sessions }: FleetTableProps) {
  return (
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
          {sessions.map((session) => (
            <tr key={session.id}>
              <td>{session.name}</td>
              <td>
                <span className={`status status--${session.status}`}>{session.status}</span>
              </td>
              <td>${session.costUsd.toFixed(2)}</td>
              <td>{session.contextPct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
