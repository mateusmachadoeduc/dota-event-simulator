import type { ReactNode } from 'react'

type CollapsibleSectionProps = {
  title: string
  subtitle?: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}

export function CollapsibleSection({
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <section className="card compact-card collapsible-card">
      <button className="collapsible-header" onClick={onToggle} type="button">
        <div className="section-title-row">
          <h2>{title}</h2>
          {subtitle ? <span className="section-caption">{subtitle}</span> : null}
        </div>

        <span className={`collapse-icon ${isOpen ? 'open' : ''}`}>⌄</span>
      </button>

      {isOpen && <div className="collapsible-content">{children}</div>}
    </section>
  )
}