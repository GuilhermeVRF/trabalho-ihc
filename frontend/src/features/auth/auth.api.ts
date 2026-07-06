import { httpClient } from '@/shared/api/http-client'
import type { AuthSession, Credentials, RegisterData, User } from './auth.types'

export const authApi = {
  login: async (data: Credentials) => (await httpClient.post<AuthSession>('/auth/login', data)).data,
  register: async (data: RegisterData) => (await httpClient.post<AuthSession>('/auth/register', data)).data,
  me: async () => (await httpClient.get<{ user: User }>('/auth/me')).data.user,
  logout: async () => { await httpClient.post('/auth/logout') },
}
