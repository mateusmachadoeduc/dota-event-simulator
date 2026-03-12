import { getHeroImageUrl } from '../services/opendota'
import type { DotaHero } from '../types/dota'

type HeroPanelProps = {
  hero: DotaHero | null
}

function attrLabel(attr: DotaHero['primary_attr']) {
  if (attr === 'str') return 'Força'
  if (attr === 'agi') return 'Agilidade'
  if (attr === 'int') return 'Inteligência'
  return 'Universal'
}

export function HeroPanel({ hero }: HeroPanelProps) {
  if (!hero) {
    return (
      <section className="card compact-card">
        <div className="section-title-row">
          <h2>Painel do herói</h2>
          <span className="section-caption">Informações rápidas</span>
        </div>

        <div className="empty-state compact">
          Selecione um herói para ver atributos e funções.
        </div>
      </section>
    )
  }

  return (
    <section className="card compact-card">
      <div className="section-title-row">
        <h2>Painel do herói</h2>
        <span className="section-caption">Informações rápidas</span>
      </div>

      <div className="hero-panel">
        <div className="hero-header">
          <img
            className="hero-image"
            src={getHeroImageUrl(hero.img)}
            alt={hero.localized_name}
          />

          <div>
            <h3>{hero.localized_name}</h3>
            <div className="hero-tags">
              <span className="meta-tag">{attrLabel(hero.primary_attr)}</span>
              <span className="meta-tag">{hero.attack_type}</span>
            </div>
          </div>
        </div>

        <div className="hero-stats-grid">
          <div className="hero-stat-card">
            <span>Vida base</span>
            <strong>{hero.base_health}</strong>
          </div>

          <div className="hero-stat-card">
            <span>Mana base</span>
            <strong>{hero.base_mana}</strong>
          </div>

          <div className="hero-stat-card">
            <span>Armadura base</span>
            <strong>{hero.base_armor}</strong>
          </div>

          <div className="hero-stat-card">
            <span>Movimento</span>
            <strong>{hero.move_speed}</strong>
          </div>

          <div className="hero-stat-card">
            <span>Ataque base</span>
            <strong>
              {hero.base_attack_min} - {hero.base_attack_max}
            </strong>
          </div>
        </div>

        <div className="hero-roles">
          {hero.roles.map((role) => (
            <span key={role} className="role-tag">
              {role}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}