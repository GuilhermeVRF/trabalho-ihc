export type MatchStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'POSTPONED' | 'CANCELLED'
export interface Match {
  id: string; championshipId: string; round: number; groupName: string | null; scheduledAt: string; venue: string
  homeScore: number | null; awayScore: number | null; status: MatchStatus
  championship: { id: string; name: string; season: string }
  homeTeam: { id: string; name: string; crestUrl: string | null }
  awayTeam: { id: string; name: string; crestUrl: string | null }
}
export interface MatchList { data: Match[]; meta: { page: number; pageSize: number; total: number; totalPages: number } }
