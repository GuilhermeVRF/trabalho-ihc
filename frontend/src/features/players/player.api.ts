import { httpClient } from '@/shared/api/http-client'
import type { Player, PlayerList, PlayerPayload } from './player.types'

export const playerApi = {
  list: async (params: { search?: string; teamId?: string; position?: string; page: number }) => (await httpClient.get<PlayerList>('/players', { params })).data,
  get: async (id: string) => (await httpClient.get<Player>(`/players/${id}`)).data,
  create: async (payload: PlayerPayload) => (await httpClient.post<Player>('/players', payload)).data,
  update: async (id: string, payload: PlayerPayload) => (await httpClient.patch<Player>(`/players/${id}`, payload)).data,
  uploadPhoto: async (id: string, file: File) => { const body = new FormData(); body.append('file', file); return (await httpClient.post<Player>(`/players/${id}/photo`, body, { headers: { 'Content-Type': undefined } })).data },
  remove: async (id: string) => { await httpClient.delete(`/players/${id}`) },
}
