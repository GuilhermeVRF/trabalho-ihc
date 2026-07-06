import { httpClient } from '@/shared/api/http-client'
import type { Team, TeamList, TeamPayload } from './team.types'

export const teamApi = {
  list: async (params: { search?: string; page: number; pageSize?: number }) => (await httpClient.get<TeamList>('/teams', { params })).data,
  get: async (id: string) => (await httpClient.get<Team>(`/teams/${id}`)).data,
  create: async (payload: TeamPayload) => (await httpClient.post<Team>('/teams', payload)).data,
  update: async (id: string, payload: TeamPayload) => (await httpClient.patch<Team>(`/teams/${id}`, payload)).data,
  uploadCrest: async (id: string, file: File) => {
    const body = new FormData(); body.append('file', file)
    return (await httpClient.post<Team>(`/teams/${id}/crest`, body, { headers: { 'Content-Type': undefined } })).data
  },
  remove: async (id: string) => { await httpClient.delete(`/teams/${id}`) },
}
