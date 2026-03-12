import { formatTime } from '../utils/time'

type PastEvent = {
  key: string
  id: string
  name: string
  category: string
  occurredAt: number
}

type EventHistoryProps = {
  events: PastEvent[]
}

export function EventHistory({ events }: EventHistoryProps) {
  return (
    <section className="card compact-card">
      <div className="section-title-row">
        <h2>Log recente</h2>
        <span className="section-caption">Últimos eventos</span>
      </div>

      {events.length === 0 ? (
        <div className="empty-state compact">Nenhum evento registrado ainda.</div>
      ) : (
        <div className="history-list compact-history">
          {events.slice(0, 8).map((event) => (
            <div key={event.key} className="history-item compact">
              <div>
                <strong>{event.name}</strong>
                <span>
                  {event.category} • {formatTime(event.occurredAt)}
                </span>
              </div>

              <div className="history-time">{formatTime(event.occurredAt)}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}