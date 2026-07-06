export interface TeamHighlight { team: { id: string; name: string; crestUrl: string | null }; goals: number }
export interface Statistics {
  championship: { id: string; name: string; season: string }
  finishedMatches: number; totalGoals: number; averageGoals: number
  bestAttack: TeamHighlight | null; bestDefense: TeamHighlight | null
  topScorer: { player: { id: string; name: string; photoUrl: string | null; team: { name: string } }; goals: number } | null
}
