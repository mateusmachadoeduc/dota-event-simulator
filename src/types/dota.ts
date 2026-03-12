export type DotaHero = {
  id: number
  name: string
  localized_name: string
  primary_attr: 'str' | 'agi' | 'int' | 'all'
  attack_type: 'Melee' | 'Ranged'
  roles: string[]
  img: string
  icon: string
  base_health: number
  base_mana: number
  base_armor: number
  base_attack_min: number
  base_attack_max: number
  move_speed: number
}