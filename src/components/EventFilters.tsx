import type { EventCategory } from '../data/events'

type FilterId = 'all' | EventCategory

type EventFiltersProps = {
  activeCategory: FilterId
  onChangeCategory: (category: FilterId) => void
  categories: Array<{ id: FilterId; label: string }>
}

export function EventFilters({
  activeCategory,
  onChangeCategory,
  categories,
}: EventFiltersProps) {
  return (
    <section className="card compact-card">
      <div className="section-title-row">
        <h2>Filtros</h2>
        <span className="section-caption">Escolha rápida</span>
      </div>

      <div className="chip-group">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`chip ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => onChangeCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </section>
  )
}