import { httpClient } from '@/shared/api/http-client'
import type { User } from '@/features/auth/auth.types'
export const profileApi = { update: async (data: { name: string; email: string; password?: string }) => (await httpClient.patch<User>('/profile', data)).data }
