import type { ChampionshipFormat } from '@/features/championships/championship.types'

export interface Standing {
  id: string; position: number; played: number; wins: number; draws: number; losses: number
  goalsFor: number; goalsAgainst: number; goalDifference: number; points: number
  team: { id: string; name: string; crestUrl: string | null }
}

export interface StandingsResponse {
  championship: { id: string; name: string; season: string; format: ChampionshipFormat }
  standings: Standing[]
}
