import { httpClient } from '@/shared/api/http-client'
import type { StandingsResponse } from './standing.types'

export const standingApi = {
  list: async (championshipId: string) => (await httpClient.get<StandingsResponse>('/standings', { params: { championshipId } })).data,
}
