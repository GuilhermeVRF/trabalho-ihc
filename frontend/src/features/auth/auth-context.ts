import { createContext } from 'react'
import type { AuthSession, Credentials, RegisterData, User } from './auth.types'

export interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: Credentials) => Promise<AuthSession>
  register: (data: RegisterData) => Promise<AuthSession>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
