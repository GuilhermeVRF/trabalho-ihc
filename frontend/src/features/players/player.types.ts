export type PlayerPosition = 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'FORWARD'

export interface Player {
  id: string
  teamId: string
  name: string
  number: number
  position: PlayerPosition
  birthDate: string
  photoUrl: string | null
  isCaptain: boolean
  team: { id: string; name: string; crestUrl: string | null }
  _count?: { goals: number }
}

export interface PlayerPayload {
  teamId: string
  name: string
  number: number
  position: PlayerPosition
  birthDate: string
  isCaptain: boolean
}

export interface PlayerList {
  data: Player[]
  meta: { page: number; pageSize: number; total: number; totalPages: number }
}
