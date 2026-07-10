import { useMemo, useState } from 'react'
import type { SiteConfig } from '../config/site'
import { Shell } from '../components/Shell'
import { SESSIONS, DAILY_BUDGET_USD } from '../data/sessions'
import { FleetFilters } from '../features/fleet/FleetFilters'
import { FleetGrid } from '../features/fleet/FleetGrid'
import { SessionDrawer } from '../features/fleet/SessionDrawer'
import { FleetTable } from '../features/fleet/FleetTable'
import { BudgetBar } from '../features/fleet/BudgetBar'

export type ProductPageProps = { config: SiteConfig }

/** Fleet workspace — state here, UI in features/fleet. */
export function ProductPage({ config }: ProductPageProps) {
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const totalCost = useMemo(() => SESSIONS.reduce((sum, s) => sum + s.costUsd, 0), [])
  const rows = useMemo(() => SESSIONS.filter((s) => filter === 'all' || s.status === filter), [filter])
  const selected = SESSIONS.find((s) => s.id === selectedId) ?? null

  return (
    <Shell config={config}>
      <section className="panel">
        <div className="chips" style={{ marginBottom: 12 }}>
          <span className="badge-live">Demo telemetry</span>
        </div>
        <h1>Fleet overview</h1>
        <BudgetBar totalUsd={totalCost} budgetUsd={DAILY_BUDGET_USD} />
        <FleetFilters value={filter} onChange={setFilter} />
        <FleetGrid sessions={rows} selectedId={selectedId} onSelect={setSelectedId} />
        {selected ? <SessionDrawer session={selected} onClose={() => setSelectedId(null)} /> : null}
        <FleetTable sessions={rows} />
      </section>
    </Shell>
  )
}
