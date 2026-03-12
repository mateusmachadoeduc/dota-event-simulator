export type EventCategory = 'rune' | 'resource' | 'objective' | 'economy' | 'map'
export type EventPriority = 'high' | 'medium' | 'low'

export type GameEvent = {
  id: string
  name: string
  every: number
  start: number
  category: EventCategory
  priority: EventPriority
}

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'lotus-pool',
    name: 'Lotus Pool',
    every: 180,
    start: 180,
    category: 'resource',
    priority: 'medium',
  },
  {
    id: 'bounty-rune',
    name: 'Bounty Rune',
    every: 240,
    start: 240,
    category: 'rune',
    priority: 'medium',
  },
  {
    id: 'power-rune',
    name: 'Power Rune',
    every: 120,
    start: 360,
    category: 'rune',
    priority: 'high',
  },
  {
    id: 'wisdom-rune',
    name: 'Wisdom Rune',
    every: 420,
    start: 420,
    category: 'rune',
    priority: 'high',
  },
  {
    id: 'siege-wave',
    name: 'Siege Wave',
    every: 300,
    start: 300,
    category: 'economy',
    priority: 'high',
  },
  {
    id: 'night-cycle',
    name: 'Night Starts',
    every: 600,
    start: 300,
    category: 'map',
    priority: 'low',
  },
  {
    id: 'day-cycle',
    name: 'Day Starts',
    every: 600,
    start: 600,
    category: 'map',
    priority: 'low',
  },
  {
    id: 'neutral-tier-1',
    name: 'Neutral Items T1',
    every: 999999,
    start: 420,
    category: 'resource',
    priority: 'medium',
  },
  {
    id: 'neutral-tier-2',
    name: 'Neutral Items T2',
    every: 999999,
    start: 1020,
    category: 'resource',
    priority: 'medium',
  },
  {
    id: 'neutral-tier-3',
    name: 'Neutral Items T3',
    every: 999999,
    start: 1620,
    category: 'resource',
    priority: 'medium',
  },
  {
    id: 'neutral-tier-4',
    name: 'Neutral Items T4',
    every: 999999,
    start: 2220,
    category: 'resource',
    priority: 'medium',
  },
  {
    id: 'tormentor',
    name: 'Tormentor',
    every: 600,
    start: 1200,
    category: 'objective',
    priority: 'high',
  },
]

export const EVENT_CATEGORIES: Array<{ id: 'all' | EventCategory; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'rune', label: 'Runas' },
  { id: 'objective', label: 'Objetivos' },
  { id: 'resource', label: 'Recursos' },
  { id: 'map', label: 'Mapa' },
  { id: 'economy', label: 'Economia' },
]