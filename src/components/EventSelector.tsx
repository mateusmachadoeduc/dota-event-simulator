type SelectableEvent = {
  id: string
  name: string
  category: string
  priority: 'high' | 'medium' | 'low'
}

type EventSelectorProps = {
  events: SelectableEvent[]
  selectedEventIds: string[]
  onToggleEvent: (eventId: string) => void
  onSelectAll: () => void
  onClearAll: () => void
  onChangePriority: (eventId: string, priority: 'high' | 'medium' | 'low') => void
}

function priorityLabel(priority: SelectableEvent['priority']) {
  if (priority === 'high') return 'Alta'
  if (priority === 'medium') return 'Média'
  return 'Baixa'
}

export function EventSelector({
  events,
  selectedEventIds,
  onToggleEvent,
  onSelectAll,
  onClearAll,
  onChangePriority,
}: EventSelectorProps) {
  return (
    <section className="card compact-card">
      <div className="section-header">
        <div className="section-title-row">
          <h2>Configuração de eventos</h2>
          <span className="section-caption">Seleção e prioridade</span>
        </div>

        <div className="inline-actions">
          <button onClick={onSelectAll}>Todos</button>
          <button onClick={onClearAll}>Limpar</button>
        </div>
      </div>

      <div className="config-grid">
        {events.map((event) => {
          const checked = selectedEventIds.includes(event.id)

          return (
            <div
              key={event.id}
              className={`event-config-card ${checked ? 'selected' : ''}`}
            >
              <button
                type="button"
                className="event-config-toggle"
                onClick={() => onToggleEvent(event.id)}
              >
                <div className="event-config-top">
                  <div className={`toggle-dot ${checked ? 'on' : 'off'}`} />
                  <strong>{event.name}</strong>
                </div>

                <div className="event-config-meta">
                  <span className="meta-tag">{event.category}</span>
                  <span className={`priority-tag ${event.priority}`}>
                    {priorityLabel(event.priority)}
                  </span>
                </div>
              </button>

              <div className="priority-editor">
                <span className="priority-editor-label">Prioridade:</span>

                <div className="priority-editor-actions">
                  <button
                    type="button"
                    className={`mini-chip ${event.priority === 'high' ? 'active high' : ''}`}
                    onClick={() => onChangePriority(event.id, 'high')}
                  >
                    Alta
                  </button>

                  <button
                    type="button"
                    className={`mini-chip ${event.priority === 'medium' ? 'active medium' : ''}`}
                    onClick={() => onChangePriority(event.id, 'medium')}
                  >
                    Média
                  </button>

                  <button
                    type="button"
                    className={`mini-chip ${event.priority === 'low' ? 'active low' : ''}`}
                    onClick={() => onChangePriority(event.id, 'low')}
                  >
                    Baixa
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}