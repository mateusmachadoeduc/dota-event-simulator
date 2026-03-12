import { formatTime } from '../utils/time'

type EventItem = {
  key: string
  id: string
  name: string
  category: string
  priority: 'high' | 'medium' | 'low'
  time: number
  remaining: number
  status: 'normal' | 'soon' | 'now'
}

type EventListProps = {
  events: EventItem[]
}

function priorityLabel(priority: EventItem['priority']) {
  if (priority === 'high') return 'alta'
  if (priority === 'medium') return 'média'
  return 'baixa'
}

function statusLabel(status: EventItem['status']) {
  if (status === 'now') return 'agora'
  if (status === 'soon') return 'em breve'
  return 'normal'
}

export function EventList({ events }: EventListProps) {
  return (
    <section className="card">
      <div className="section-title-row">
        <h2>Próximos objetivos</h2>
        <span className="section-caption">Alertas por urgência</span>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">Nenhum evento visível com o filtro atual.</div>
      ) : (
        <div className="event-list enhanced-event-list">
          {events.map((event) => (
            <div
              key={event.key}
              className={`event-item enhanced-event-item ${event.status}`}
            >
              <div className="event-main">
                <strong>{event.name}</strong>
                <span>
                  {event.category} • prioridade {priorityLabel(event.priority)} • acontece em{' '}
                  {formatTime(event.time)}
                </span>
              </div>

              <div className="event-badges">
                <div className={`status-badge ${event.status}`}>
                  {statusLabel(event.status)}
                </div>

                <div className={`priority-badge ${event.priority}`}>
                  {priorityLabel(event.priority)}
                </div>

                <div className={`pill ${event.status}`}>
                  {event.status === 'now'
                    ? 'acontecendo agora'
                    : `faltam ${formatTime(event.remaining)}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}