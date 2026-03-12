import { formatTime } from '../utils/time'

type HighlightEvent = {
  key: string
  name: string
  time: number
  remaining: number
  status: 'normal' | 'soon' | 'now'
  priority: 'high' | 'medium' | 'low'
}

type EventAlertsPanelProps = {
  events: HighlightEvent[]
}

function priorityLabel(priority: HighlightEvent['priority']) {
  if (priority === 'high') return 'Alta'
  if (priority === 'medium') return 'Média'
  return 'Baixa'
}

export function EventAlertsPanel({ events }: EventAlertsPanelProps) {
  return (
    <section className="card compact-card alerts-panel-card">
      <div className="section-title-row">
        <h2>Próximos eventos</h2>
        <span className="section-caption">Ordenados por tempo e prioridade</span>
      </div>

      {events.length === 0 ? (
        <div className="empty-state compact">Nenhum evento visível selecionado.</div>
      ) : (
        <div className="alerts-list">
          {events.map((event) => (
            <div key={event.key} className={`alert-card ${event.status}`}>
              <div className="alert-main">
                <strong>{event.name}</strong>
                <span>
                  em {formatTime(event.remaining)} • tempo {formatTime(event.time)}
                </span>
              </div>

              <div className="alert-side">
                <span className={`priority-tag ${event.priority}`}>
                  {priorityLabel(event.priority)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}