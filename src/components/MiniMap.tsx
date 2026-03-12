import { useEffect, useMemo, useRef, useState } from 'react'
import minimapImage from '../assets/dota-minimap.png'
import {
  DEFAULT_MAP_POINTS,
  EVENT_POINT_GROUPS,
  type MapPoint,
} from '../data/mapPoints'
import { formatTime } from '../utils/time'

type EventPriority = 'high' | 'medium' | 'low'

type CurrentObjective = {
  name: string
  time: number
  remaining: number
  priority: EventPriority
} | null

type MiniMapProps = {
  visibleEventIds: string[]
  highlightedEventIds: string[]
  eventPriorities: Record<string, EventPriority>
  currentObjective: CurrentObjective
}

const STORAGE_KEY = 'dota-event-simulator-map-points'

function markerPriorityClass(priority: EventPriority | undefined) {
  if (priority === 'high') return 'high'
  if (priority === 'medium') return 'medium'
  return 'low'
}

function priorityLabel(priority: EventPriority) {
  if (priority === 'high') return 'Alta'
  if (priority === 'medium') return 'Média'
  return 'Baixa'
}

function urgencyClass(remaining: number | undefined) {
  if (remaining === undefined) return 'normal'
  if (remaining <= 10) return 'now'
  if (remaining <= 30) return 'soon'
  return 'normal'
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function MiniMap({
  visibleEventIds,
  highlightedEventIds,
  eventPriorities,
  currentObjective,
}: MiniMapProps) {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>(DEFAULT_MAP_POINTS)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return

      const parsed = JSON.parse(saved) as MapPoint[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMapPoints(parsed)
      }
    } catch {
      // ignora erro de storage
    }
  }, [])

  const visiblePointIds = useMemo(
    () =>
      new Set(
        visibleEventIds.flatMap((eventId) => EVENT_POINT_GROUPS[eventId] ?? []),
      ),
    [visibleEventIds],
  )

  const highlightedPointIds = useMemo(
    () =>
      new Set(
        highlightedEventIds.flatMap((eventId) => EVENT_POINT_GROUPS[eventId] ?? []),
      ),
    [highlightedEventIds],
  )

  const editablePoints = useMemo(
    () => mapPoints.filter((point) => visiblePointIds.has(point.id)),
    [mapPoints, visiblePointIds],
  )

  const selectedPoint =
    editablePoints.find((point) => point.id === selectedPointId) ?? null

  const currentUrgency = urgencyClass(currentObjective?.remaining)

  function updatePointPosition(pointId: string, clientX: number, clientY: number) {
    const mapEl = mapRef.current
    if (!mapEl) return

    const rect = mapEl.getBoundingClientRect()
    const x = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100)
    const y = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100)

    setMapPoints((prev) =>
      prev.map((point) => (point.id === pointId ? { ...point, x, y } : point)),
    )
  }

  function adjustSelectedPoint(deltaX: number, deltaY: number) {
    if (!selectedPointId) return

    setMapPoints((prev) =>
      prev.map((point) =>
        point.id === selectedPointId
          ? {
              ...point,
              x: clamp(point.x + deltaX, 0, 100),
              y: clamp(point.y + deltaY, 0, 100),
            }
          : point,
      ),
    )
  }

  function startDragging(pointId: string, startEvent: React.PointerEvent<HTMLDivElement>) {
    if (!isEditing) return

    setSelectedPointId(pointId)
    startEvent.preventDefault()
    ;(startEvent.currentTarget as HTMLDivElement).setPointerCapture(startEvent.pointerId)

    const move = (event: PointerEvent) => {
      updatePointPosition(pointId, event.clientX, event.clientY)
    }

    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  function handleSavePositions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mapPoints))
    setIsEditing(false)
  }

  function handleResetPositions() {
    setMapPoints(DEFAULT_MAP_POINTS)
    setSelectedPointId(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <section className="card compact-card">
      <div className="section-title-row">
        <h2>Mini mapa</h2>
        <span className="section-caption">Objetivos e pontos importantes</span>
      </div>

      <div className="minimap-toolbar">
        <button
          className={`mini-chip ${isEditing ? 'active medium' : ''}`}
          onClick={() => setIsEditing((prev) => !prev)}
          type="button"
        >
          {isEditing ? 'Sair da edição' : 'Editar mapa'}
        </button>

        <button onClick={handleSavePositions} type="button">
          Salvar posições
        </button>

        <button onClick={handleResetPositions} type="button">
          Restaurar padrão
        </button>
      </div>

      {isEditing && (
        <>
          <div className="map-edit-hint">
            Arraste os marcadores ou selecione um item da lista para editar com precisão.
          </div>

          <div className="map-editor-panel">
            <div className="map-editor-list">
              {editablePoints.map((point) => (
                <button
                  key={point.id}
                  type="button"
                  className={`map-editor-item ${selectedPointId === point.id ? 'active' : ''}`}
                  onClick={() => setSelectedPointId(point.id)}
                >
                  <strong>{point.label}</strong>
                  <span>
                    x: {point.x.toFixed(1)}% • y: {point.y.toFixed(1)}%
                  </span>
                </button>
              ))}
            </div>

            <div className="map-editor-selected">
              {selectedPoint ? (
                <>
                  <strong>{selectedPoint.label}</strong>
                  <span>ID: {selectedPoint.id}</span>
                  <span>
                    posição atual: {selectedPoint.x.toFixed(1)}%, {selectedPoint.y.toFixed(1)}%
                  </span>

                  <div className="map-nudge-grid">
                    <button type="button" onClick={() => adjustSelectedPoint(0, -1)}>
                      ↑ Y -1
                    </button>
                    <button type="button" onClick={() => adjustSelectedPoint(0, 1)}>
                      ↓ Y +1
                    </button>
                    <button type="button" onClick={() => adjustSelectedPoint(-1, 0)}>
                      ← X -1
                    </button>
                    <button type="button" onClick={() => adjustSelectedPoint(1, 0)}>
                      → X +1
                    </button>
                    <button type="button" onClick={() => adjustSelectedPoint(-0.2, 0)}>
                      X -0.2
                    </button>
                    <button type="button" onClick={() => adjustSelectedPoint(0.2, 0)}>
                      X +0.2
                    </button>
                    <button type="button" onClick={() => adjustSelectedPoint(0, -0.2)}>
                      Y -0.2
                    </button>
                    <button type="button" onClick={() => adjustSelectedPoint(0, 0.2)}>
                      Y +0.2
                    </button>
                  </div>
                </>
              ) : (
                <span>Selecione um marcador para destacar sua edição.</span>
              )}
            </div>
          </div>
        </>
      )}

      {currentObjective && (
        <div className={`current-objective-banner ${currentUrgency}`}>
          <span className="current-objective-label">Objetivo atual</span>
          <strong>{currentObjective.name}</strong>
          <div className="current-objective-meta">
            <span>em {formatTime(currentObjective.remaining)}</span>
            <span className={`priority-tag ${currentObjective.priority}`}>
              {priorityLabel(currentObjective.priority)}
            </span>
            <span className={`status-badge ${currentUrgency}`}>
              {currentUrgency === 'now'
                ? 'agora'
                : currentUrgency === 'soon'
                ? 'em breve'
                : 'normal'}
            </span>
          </div>
        </div>
      )}

      <div
        ref={mapRef}
        className={`minimap minimap-real ${isEditing ? 'editing' : ''}`}
        style={{ backgroundImage: `url(${minimapImage})` }}
      >
        {editablePoints.map((point) => {
          const baseEventId =
            Object.entries(EVENT_POINT_GROUPS).find(([, ids]) => ids.includes(point.id))?.[0] ??
            ''

          const isHighlighted = highlightedPointIds.has(point.id)
          const isSelected = selectedPointId === point.id

          return (
            <div
              key={point.id}
              className={`map-marker ${markerPriorityClass(
                eventPriorities[baseEventId],
              )} ${isHighlighted ? 'highlighted' : ''} ${
                isEditing ? 'editable' : ''
              } ${currentUrgency} ${isSelected ? 'selected' : ''}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              title={point.label}
              onPointerDown={(event) => startDragging(point.id, event)}
              onClick={() => isEditing && setSelectedPointId(point.id)}
            >
              <span />
              {isEditing && (
                <div className={`map-marker-label ${isSelected ? 'selected' : ''}`}>
                  {point.shortLabel}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="minimap-legend">
        <div className="legend-item">
          <span className="legend-dot high" />
          Alta
        </div>
        <div className="legend-item">
          <span className="legend-dot medium" />
          Média
        </div>
        <div className="legend-item">
          <span className="legend-dot low" />
          Baixa
        </div>
      </div>
    </section>
  )
}