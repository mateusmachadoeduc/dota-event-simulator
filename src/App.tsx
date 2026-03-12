import { useEffect, useMemo, useRef, useState } from 'react'
import { CollapsibleSection } from './components/CollapsibleSection'
import { EventFilters } from './components/EventFilters'
import { EventHistory } from './components/EventHistory'
import { EventList } from './components/EventList'
import { EventSelector } from './components/EventSelector'
import { HelpPanel } from './components/HelpPanel'
import { HeroPanel } from './components/HeroPanel'
import { HeroSelector } from './components/HeroSelector'
import { MiniMap } from './components/MiniMap'
import { RoleSelector } from './components/RoleSelector'
import { TimerPanel } from './components/TimerPanel'
import {
  EVENT_CATEGORIES,
  GAME_EVENTS,
  type EventCategory,
  type EventPriority,
} from './data/events'
import { fetchHeroes } from './services/opendota'
import type { DotaHero } from './types/dota'
import { getEventStatus } from './utils/time'

type FilterId = 'all' | EventCategory
type PlayerRole = 'mid' | 'carry' | 'offlane' | 'support4' | 'support5'

type PastEvent = {
  key: string
  id: string
  name: string
  category: string
  occurredAt: number
}

type GameEventState = {
  id: string
  name: string
  every: number
  start: number
  category: EventCategory
  priority: EventPriority
}

type UpcomingEventOccurrence = {
  key: string
  id: string
  name: string
  category: string
  priority: EventPriority
  time: number
  remaining: number
  status: 'normal' | 'soon' | 'now'
}

const UPCOMING_OCCURRENCES_LIMIT = 18

const STORAGE_KEYS = {
  selectedHeroId: 'dota-event-simulator-selected-hero-id',
  selectedRole: 'dota-event-simulator-selected-role',
  activeCategory: 'dota-event-simulator-active-category',
  selectedEventIds: 'dota-event-simulator-selected-event-ids',
  manualPriorityOverrides: 'dota-event-simulator-manual-priority-overrides',
  openSections: 'dota-event-simulator-open-sections',
}

const DEFAULT_OPEN_SECTIONS = {
  heroSelect: true,
  heroPanel: true,
  role: true,
  filters: true,
  events: true,
  help: false,
}

const ROLE_PRIORITY_MODIFIERS: Record<
  PlayerRole,
  Partial<Record<string, EventPriority>>
> = {
  mid: {
    'power-rune': 'high',
    'wisdom-rune': 'high',
    'lotus-pool': 'medium',
    'bounty-rune': 'medium',
    'siege-wave': 'medium',
  },
  carry: {
    'neutral-tier-1': 'high',
    'neutral-tier-2': 'high',
    'neutral-tier-3': 'high',
    'neutral-tier-4': 'medium',
    tormentor: 'high',
    'siege-wave': 'high',
    'power-rune': 'low',
  },
  offlane: {
    'lotus-pool': 'high',
    'siege-wave': 'high',
    tormentor: 'high',
    'bounty-rune': 'medium',
    'power-rune': 'medium',
  },
  support4: {
    'wisdom-rune': 'high',
    'bounty-rune': 'high',
    'lotus-pool': 'high',
    tormentor: 'high',
    'power-rune': 'medium',
  },
  support5: {
    'wisdom-rune': 'high',
    'bounty-rune': 'high',
    'lotus-pool': 'high',
    tormentor: 'medium',
    'siege-wave': 'medium',
  },
}

function priorityWeight(priority: EventPriority) {
  if (priority === 'high') return 3
  if (priority === 'medium') return 2
  return 1
}

function readJsonStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [gameTime, setGameTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const [activeCategory, setActiveCategory] = useState<FilterId>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.activeCategory)
    return (saved as FilterId) || 'all'
  })

  const [selectedRole, setSelectedRole] = useState<PlayerRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.selectedRole)
    return (saved as PlayerRole) || 'mid'
  })

  const [manualPriorityOverrides, setManualPriorityOverrides] = useState<
    Record<string, EventPriority>
  >(() =>
    readJsonStorage<Record<string, EventPriority>>(
      STORAGE_KEYS.manualPriorityOverrides,
      {},
    ),
  )

  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(() =>
    readJsonStorage<string[]>(
      STORAGE_KEYS.selectedEventIds,
      GAME_EVENTS.map((event) => event.id),
    ),
  )

  const [openSections, setOpenSections] = useState(() =>
    readJsonStorage(STORAGE_KEYS.openSections, DEFAULT_OPEN_SECTIONS),
  )

  const [pastEvents, setPastEvents] = useState<PastEvent[]>([])
  const lastProcessedTimeRef = useRef(0)

  const [heroes, setHeroes] = useState<DotaHero[]>([])
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.selectedHeroId)
    return saved ? Number(saved) : null
  })
  const [heroesLoading, setHeroesLoading] = useState(true)
  const [heroesError, setHeroesError] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeCategory, activeCategory)
  }, [activeCategory])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.selectedRole, selectedRole)
  }, [selectedRole])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.manualPriorityOverrides,
      JSON.stringify(manualPriorityOverrides),
    )
  }, [manualPriorityOverrides])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.selectedEventIds,
      JSON.stringify(selectedEventIds),
    )
  }, [selectedEventIds])

  useEffect(() => {
    if (selectedHeroId !== null) {
      localStorage.setItem(STORAGE_KEYS.selectedHeroId, String(selectedHeroId))
    }
  }, [selectedHeroId])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.openSections, JSON.stringify(openSections))
  }, [openSections])

  useEffect(() => {
    let isMounted = true

    async function loadHeroes() {
      try {
        setHeroesLoading(true)
        setHeroesError('')

        const data = await fetchHeroes()

        if (!isMounted) return

        setHeroes(data)

        if (data.length > 0) {
          setSelectedHeroId((current) => current ?? data[0].id)
        }
      } catch (error) {
        if (!isMounted) return

        setHeroesError(
          error instanceof Error ? error.message : 'Erro ao carregar heróis.',
        )
      } finally {
        if (isMounted) {
          setHeroesLoading(false)
        }
      }
    }

    loadHeroes()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isRunning) return

    const interval = window.setInterval(() => {
      setGameTime((prev) => prev + 1)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isRunning])

  const eventStates = useMemo<GameEventState[]>(() => {
    const roleModifiers = ROLE_PRIORITY_MODIFIERS[selectedRole] ?? {}

    return GAME_EVENTS.map((event) => ({
      ...event,
      priority:
        manualPriorityOverrides[event.id] ??
        roleModifiers[event.id] ??
        event.priority,
    }))
  }, [selectedRole, manualPriorityOverrides])

  useEffect(() => {
    const previousTime = lastProcessedTimeRef.current

    if (gameTime <= previousTime) {
      lastProcessedTimeRef.current = gameTime
      return
    }

    const newPastEvents: PastEvent[] = []

    for (const event of eventStates) {
      if (!selectedEventIds.includes(event.id)) continue

      if (event.every >= 999999) {
        if (event.start > previousTime && event.start <= gameTime) {
          newPastEvents.push({
            key: `${event.id}-${event.start}`,
            id: event.id,
            name: event.name,
            category: event.category,
            occurredAt: event.start,
          })
        }
        continue
      }

      let occurrence = event.start

      while (occurrence <= gameTime) {
        if (occurrence > previousTime) {
          newPastEvents.push({
            key: `${event.id}-${occurrence}`,
            id: event.id,
            name: event.name,
            category: event.category,
            occurredAt: occurrence,
          })
        }

        occurrence += event.every
      }
    }

    if (newPastEvents.length > 0) {
      setPastEvents((prev) =>
        [...newPastEvents, ...prev]
          .sort((a, b) => b.occurredAt - a.occurredAt)
          .slice(0, 50),
      )
    }

    lastProcessedTimeRef.current = gameTime
  }, [gameTime, selectedEventIds, eventStates])

  const visibleEvents = useMemo(() => {
    return eventStates.filter((event) => {
      if (!selectedEventIds.includes(event.id)) return false
      if (activeCategory === 'all') return true
      return event.category === activeCategory
    })
  }, [activeCategory, selectedEventIds, eventStates])

  const nextEvents = useMemo(() => {
    const occurrences: UpcomingEventOccurrence[] = []

    for (const event of visibleEvents) {
      if (event.every >= 999999) {
        if (event.start >= gameTime) {
          const remaining = Math.max(0, event.start - gameTime)

          occurrences.push({
            key: `${event.id}-${event.start}`,
            id: event.id,
            name: event.name,
            category: event.category,
            priority: event.priority,
            time: event.start,
            remaining,
            status: getEventStatus(remaining),
          })
        }
        continue
      }

      let nextTime = event.start

      while (nextTime < gameTime) {
        nextTime += event.every
      }

      for (let i = 0; i < 4; i += 1) {
        const occurrenceTime = nextTime + event.every * i
        const remaining = Math.max(0, occurrenceTime - gameTime)

        occurrences.push({
          key: `${event.id}-${occurrenceTime}`,
          id: event.id,
          name: event.name,
          category: event.category,
          priority: event.priority,
          time: occurrenceTime,
          remaining,
          status: getEventStatus(remaining),
        })
      }
    }

    return occurrences
      .sort((a, b) => {
        if (a.remaining !== b.remaining) return a.remaining - b.remaining
        return priorityWeight(b.priority) - priorityWeight(a.priority)
      })
      .slice(0, UPCOMING_OCCURRENCES_LIMIT)
  }, [visibleEvents, gameTime])

  const filteredPastEvents = useMemo(() => {
    return pastEvents.filter((event) => {
      if (!selectedEventIds.includes(event.id)) return false
      if (activeCategory === 'all') return true
      return event.category === activeCategory
    })
  }, [pastEvents, selectedEventIds, activeCategory])

  const selectedHero =
    heroes.find((hero) => hero.id === selectedHeroId) ?? null

  const minimapVisibleEventIds = visibleEvents.map((event) => event.id)
  const minimapHighlightedEventIds = nextEvents.slice(0, 3).map((event) => event.id)
  const minimapPriorities = Object.fromEntries(
    visibleEvents.map((event) => [event.id, event.priority]),
  ) as Record<string, EventPriority>

  const currentObjective = nextEvents[0] ?? null

  function handleAdjustTime(amount: number) {
    setGameTime((prev) => Math.max(0, prev + amount))
  }

  function handleReset() {
    setGameTime(0)
    setIsRunning(false)
    setPastEvents([])
    lastProcessedTimeRef.current = 0
  }

  function handleSetTime(seconds: number) {
    setGameTime(Math.max(0, seconds))
  }

  function handleToggleEvent(eventId: string) {
    setSelectedEventIds((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId],
    )
  }

  function handleSelectAll() {
    setSelectedEventIds(eventStates.map((event) => event.id))
  }

  function handleClearAll() {
    setSelectedEventIds([])
  }

  function handleChangePriority(eventId: string, priority: EventPriority) {
    setManualPriorityOverrides((prev) => ({
      ...prev,
      [eventId]: priority,
    }))
  }

  function toggleSection(section: keyof typeof openSections) {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="app app-four-column">
      <aside className="preferences-sidebar">
        <div className="sidebar-content">
          <CollapsibleSection
            title="Herói"
            subtitle="Dados vindos da API"
            isOpen={openSections.heroSelect}
            onToggle={() => toggleSection('heroSelect')}
          >
            <HeroSelector
              heroes={heroes}
              selectedHeroId={selectedHeroId}
              isLoading={heroesLoading}
              error={heroesError}
              onSelectHero={setSelectedHeroId}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Painel do herói"
            subtitle="Informações rápidas"
            isOpen={openSections.heroPanel}
            onToggle={() => toggleSection('heroPanel')}
          >
            <HeroPanel hero={selectedHero} />
          </CollapsibleSection>

          <CollapsibleSection
            title="Rota"
            subtitle="Prioridade automática sugerida"
            isOpen={openSections.role}
            onToggle={() => toggleSection('role')}
          >
            <RoleSelector
              selectedRole={selectedRole}
              onSelectRole={setSelectedRole}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Filtros"
            subtitle="Eventos visíveis"
            isOpen={openSections.filters}
            onToggle={() => toggleSection('filters')}
          >
            <EventFilters
              activeCategory={activeCategory}
              onChangeCategory={setActiveCategory}
              categories={EVENT_CATEGORIES}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Eventos"
            subtitle="Seleção e prioridade"
            isOpen={openSections.events}
            onToggle={() => toggleSection('events')}
          >
            <EventSelector
              events={eventStates.map((event) => ({
                id: event.id,
                name: event.name,
                category: event.category,
                priority: event.priority,
              }))}
              selectedEventIds={selectedEventIds}
              onToggleEvent={handleToggleEvent}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
              onChangePriority={handleChangePriority}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Ajuda"
            subtitle="Como usar as ferramentas"
            isOpen={openSections.help}
            onToggle={() => toggleSection('help')}
          >
            <HelpPanel />
          </CollapsibleSection>
        </div>
      </aside>

      <section className="main-timer-column">
        <TimerPanel
          gameTime={gameTime}
          isRunning={isRunning}
          onToggleRunning={() => setIsRunning((prev) => !prev)}
          onReset={handleReset}
          onAdjustTime={handleAdjustTime}
          onSetTime={handleSetTime}
        />
      </section>

      <section className="main-events-column">
        <EventList events={nextEvents} />
      </section>

      <section className="main-map-column">
        <MiniMap
          visibleEventIds={minimapVisibleEventIds}
          highlightedEventIds={minimapHighlightedEventIds}
          eventPriorities={minimapPriorities}
          currentObjective={currentObjective}
        />

        <EventHistory events={filteredPastEvents} />
      </section>
    </div>
  )
}