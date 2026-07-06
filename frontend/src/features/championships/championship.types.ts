export type ChampionshipFormat = 'LEAGUE' | 'GROUPS' | 'KNOCKOUT'
export type ChampionshipStatus = 'DRAFT' | 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED'

export interface Championship {
  id: string
  name: string
  season: string
  description: string | null
  maxTeams: number
  format: ChampionshipFormat
  status: ChampionshipStatus
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  _count: { teams: number; matches: number }
}

export interface ChampionshipPayload {
  name: string
  season: string
  description?: string
  maxTeams: number
  format: ChampionshipFormat
  startDate: string
  endDate: string
}

export interface ChampionshipList {
  data: Championship[]
  meta: { page: number; pageSize: number; total: number; totalPages: number }
}
