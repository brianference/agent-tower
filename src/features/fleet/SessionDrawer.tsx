import type { AgentSession } from '../../data/sessions'

export type SessionDrawerProps = { session: AgentSession; onClose: () => void }

function suggestionFor(status: AgentSession['status']): string {
  if (status === 'danger') return 'Pause or lower max tokens immediately.'
  if (status === 'warning') return 'Watch burn rate; consider a cheaper model.'
  if (status === 'active') return 'Healthy — keep monitoring.'
  return 'Idle — no action required.'
}

export function SessionDrawer({ session, onClose }: SessionDrawerProps) {
  return (
    <div className="drawer" role="dialog" aria-label={`Session ${session.name}`}>
      <h2>{session.name}</h2>
      <p className="lede">
        Status <strong className={`status status--${session.status}`}>{session.status}</strong> · model {session.model}
      </p>
      <ul className="check-list">
        <li>
          Tokens in/out: {session.tokensIn.toLocaleString()} / {session.tokensOut.toLocaleString()}
        </li>
        <li>Cost: ${session.costUsd.toFixed(2)}</li>
        <li>Context: {session.contextPct}%</li>
        <li>Suggested: {suggestionFor(session.status)}</li>
      </ul>
      <button type="button" className="btn btn-ghost" onClick={onClose}>
        Close
      </button>
    </div>
  )
}
