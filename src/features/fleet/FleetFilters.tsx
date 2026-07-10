const FILTERS = ['all', 'active', 'warning', 'danger', 'idle'] as const

export type FleetFiltersProps = { value: string; onChange: (value: string) => void }

export function FleetFilters({ value, onChange }: FleetFiltersProps) {
  return (
    <div className="filters" role="toolbar" aria-label="Status filters">
      {FILTERS.map((filter) => (
        <button key={filter} type="button" className={`tab${value === filter ? ' is-active' : ''}`} onClick={() => onChange(filter)}>
          {filter}
        </button>
      ))}
    </div>
  )
}
