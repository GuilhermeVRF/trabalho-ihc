import { httpClient } from '@/shared/api/http-client'
import type { Match, MatchList } from './match.types'

export const matchApi = {
  list: async (params: { championshipId?: string; status?: string; page: number }) => (await httpClient.get<MatchList>('/matches', { params })).data,
  generate: async (championshipId: string) => (await httpClient.post<{ created: number }>(`/matches/generate/${championshipId}`)).data,
  update: async (id: string, data: { scheduledAt: string; venue: string }) => (await httpClient.patch<Match>(`/matches/${id}`, data)).data,
  result: async (id: string, data: { homeScore: number; awayScore: number }) => (await httpClient.patch<Match>(`/matches/${id}/result`, data)).data,
}
