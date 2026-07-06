import { httpClient } from '@/shared/api/http-client'
import type { Championship, ChampionshipList, ChampionshipPayload } from './championship.types'
import type { Team } from '@/features/teams/team.types'

export const championshipApi = {
  list: async (params: { search?: string; page: number; pageSize?: number; sortBy?: string; sortOrder?: string }) => (await httpClient.get<ChampionshipList>('/championships', { params })).data,
  get: async (id: string) => (await httpClient.get<Championship>(`/championships/${id}`)).data,
  create: async (payload: ChampionshipPayload) => (await httpClient.post<Championship>('/championships', payload)).data,
  update: async (id: string, payload: ChampionshipPayload) => (await httpClient.patch<Championship>(`/championships/${id}`, payload)).data,
  remove: async (id: string) => { await httpClient.delete(`/championships/${id}`) },
  listTeams: async (id: string) => (await httpClient.get<Array<{ championshipId: string; teamId: string; groupName: string | null; team: Team }>>(`/championships/${id}/teams`)).data,
  setTeams: async (id: string, teamIds: string[]) => (await httpClient.patch(`/championships/${id}/teams`, { teamIds })).data,
}
