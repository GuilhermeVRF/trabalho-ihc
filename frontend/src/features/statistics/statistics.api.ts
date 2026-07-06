import { httpClient } from '@/shared/api/http-client'
import type { Statistics } from './statistics.types'
export const statisticsApi = { get: async (championshipId: string) => (await httpClient.get<Statistics>('/statistics', { params: { championshipId } })).data }
