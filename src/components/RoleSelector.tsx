type PlayerRole = 'mid' | 'carry' | 'offlane' | 'support4' | 'support5'

type RoleSelectorProps = {
  selectedRole: PlayerRole
  onSelectRole: (role: PlayerRole) => void
}

const ROLES: Array<{ id: PlayerRole; label: string }> = [
  { id: 'mid', label: 'Mid' },
  { id: 'carry', label: 'HC / Carry' },
  { id: 'offlane', label: 'Offlane' },
  { id: 'support4', label: 'Sup 4' },
  { id: 'support5', label: 'Sup 5' },
]

export function RoleSelector({
  selectedRole,
  onSelectRole,
}: RoleSelectorProps) {
  return (
    <section className="card compact-card">
      <div className="section-title-row">
        <h2>Rota</h2>
        <span className="section-caption">Prioridade automática sugerida</span>
      </div>

      <div className="chip-group">
        {ROLES.map((role) => (
          <button
            key={role.id}
            className={`chip ${selectedRole === role.id ? 'active' : ''}`}
            onClick={() => onSelectRole(role.id)}
          >
            {role.label}
          </button>
        ))}
      </div>
    </section>
  )
}