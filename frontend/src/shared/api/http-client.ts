import axios from 'axios'
import { env } from '@/shared/config/env'
import { tokenStorage } from './token-storage'

export const httpClient = axios.create({ baseURL: env.VITE_API_URL, timeout: 15_000, headers: { 'Content-Type': 'application/json' } })
httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
httpClient.interceptors.response.use((response) => response, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401) tokenStorage.clear()
  return Promise.reject(error)
})
