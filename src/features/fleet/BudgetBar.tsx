export type BudgetBarProps = { totalUsd: number; budgetUsd: number }

export function BudgetBar({ totalUsd, budgetUsd }: BudgetBarProps) {
  const pct = Math.min(100, Math.round((totalUsd / budgetUsd) * 100))
  return (
    <>
      <p className="lede">
        Sample daily burn <strong>${totalUsd.toFixed(2)}</strong> of ${budgetUsd.toFixed(2)} budget ({pct}%).
      </p>
      <div className="score-bar" style={{ maxWidth: 360, height: 10, marginBottom: 16 }} aria-label="Budget used">
        <span style={{ width: `${pct}%`, background: pct > 80 ? 'var(--danger)' : undefined }} />
      </div>
    </>
  )
}
