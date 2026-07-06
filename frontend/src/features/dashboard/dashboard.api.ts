import { httpClient } from '@/shared/api/http-client'
import type { DashboardData } from './dashboard.types'
export const dashboardApi = { get: async () => (await httpClient.get<DashboardData>('/dashboard')).data }
