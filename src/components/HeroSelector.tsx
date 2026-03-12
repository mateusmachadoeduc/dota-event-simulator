import type { DotaHero } from '../types/dota'

type HeroSelectorProps = {
  heroes: DotaHero[]
  selectedHeroId: number | null
  isLoading: boolean
  error: string
  onSelectHero: (heroId: number) => void
}

export function HeroSelector({
  heroes,
  selectedHeroId,
  isLoading,
  error,
  onSelectHero,
}: HeroSelectorProps) {
  return (
    <section className="card compact-card">
      <div className="section-title-row">
        <h2>Herói</h2>
        <span className="section-caption">Dados vindos da API</span>
      </div>

      {isLoading ? (
        <div className="empty-state compact">Carregando heróis...</div>
      ) : error ? (
        <div className="input-error">{error}</div>
      ) : (
        <div className="hero-selector-block">
          <select
            className="hero-select"
            value={selectedHeroId ?? ''}
            onChange={(e) => onSelectHero(Number(e.target.value))}
          >
            <option value="" disabled>
              Selecione um herói
            </option>

            {heroes.map((hero) => (
              <option key={hero.id} value={hero.id}>
                {hero.localized_name}
              </option>
            ))}
          </select>
        </div>
      )}
    </section>
  )
}