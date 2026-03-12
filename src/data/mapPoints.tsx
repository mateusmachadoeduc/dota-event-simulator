export type MapPoint = {
  id: string
  label: string
  shortLabel: string
  x: number
  y: number
}

export const DEFAULT_MAP_POINTS: MapPoint[] = [
  { id: 'power-rune-top', label: 'Power Rune Top', shortLabel: 'PR Top', x: 54, y: 42 },
  { id: 'power-rune-bot', label: 'Power Rune Bot', shortLabel: 'PR Bot', x: 46, y: 58 },

  { id: 'bounty-rune-radiant-jungle', label: 'Bounty Rune Radiant Jungle', shortLabel: 'BR RJ', x: 18, y: 67 },
  { id: 'bounty-rune-radiant-core', label: 'Bounty Rune Radiant Core', shortLabel: 'BR RC', x: 30, y: 84 },
  { id: 'bounty-rune-dire-jungle', label: 'Bounty Rune Dire Jungle', shortLabel: 'BR DJ', x: 82, y: 33 },
  { id: 'bounty-rune-dire-core', label: 'Bounty Rune Dire Core', shortLabel: 'BR DC', x: 70, y: 16 },

  { id: 'wisdom-rune-radiant', label: 'Wisdom Rune Radiant', shortLabel: 'WR R', x: 12, y: 82 },
  { id: 'wisdom-rune-dire', label: 'Wisdom Rune Dire', shortLabel: 'WR D', x: 88, y: 18 },

  { id: 'lotus-radiant', label: 'Lotus Pool Radiant', shortLabel: 'Lotus R', x: 26, y: 72 },
  { id: 'lotus-dire', label: 'Lotus Pool Dire', shortLabel: 'Lotus D', x: 74, y: 28 },

  { id: 'tormentor-radiant', label: 'Tormentor Radiant', shortLabel: 'Tor R', x: 18, y: 56 },
  { id: 'tormentor-dire', label: 'Tormentor Dire', shortLabel: 'Tor D', x: 82, y: 44 },

  { id: 'roshan', label: 'Roshan', shortLabel: 'Rosh', x: 57, y: 50 },
]

export const EVENT_POINT_GROUPS: Record<string, string[]> = {
  'power-rune': ['power-rune-top', 'power-rune-bot'],
  'bounty-rune': [
    'bounty-rune-radiant-jungle',
    'bounty-rune-radiant-core',
    'bounty-rune-dire-jungle',
    'bounty-rune-dire-core',
  ],
  'wisdom-rune': ['wisdom-rune-radiant', 'wisdom-rune-dire'],
  'lotus-pool': ['lotus-radiant', 'lotus-dire'],
  tormentor: ['tormentor-radiant', 'tormentor-dire'],
}