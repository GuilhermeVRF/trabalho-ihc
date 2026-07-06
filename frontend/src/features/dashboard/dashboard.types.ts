import type { Match } from '@/features/matches/match.types'

export interface DashboardData {
  counts: { championships: number; teams: number; players: number; upcomingMatches: number }
  upcomingMatches: Match[]
  latestResults: Match[]
}
