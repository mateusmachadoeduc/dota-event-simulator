import type { DotaHero } from '../types/dota'

const OPENDOTA_BASE_URL = 'https://api.opendota.com/api'
const OPENDOTA_ASSET_BASE_URL = 'https://cdn.cloudflare.steamstatic.com'

export async function fetchHeroes(): Promise<DotaHero[]> {
  const response = await fetch(`${OPENDOTA_BASE_URL}/heroStats`)

  if (!response.ok) {
    throw new Error('Erro ao carregar heróis da OpenDota API')
  }

  const heroes = (await response.json()) as DotaHero[]

  return heroes.sort((a, b) =>
    a.localized_name.localeCompare(b.localized_name),
  )
}

export function getHeroImageUrl(path: string) {
  return `${OPENDOTA_ASSET_BASE_URL}${path}`
}