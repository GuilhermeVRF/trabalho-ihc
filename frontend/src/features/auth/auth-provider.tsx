import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { tokenStorage } from '@/shared/api/token-storage'
import { authApi } from './auth.api'
import { AuthContext } from './auth-context'
import type { AuthSession } from './auth.types'

const AUTH_QUERY_KEY = ['auth', 'me'] as const

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const sessionQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.me,
    enabled: Boolean(tokenStorage.get()),
    retry: false,
  })

  const persistSession = (session: AuthSession) => {
    tokenStorage.set(session.accessToken)
    queryClient.setQueryData(AUTH_QUERY_KEY, session.user)
    return session
  }
  const loginMutation = useMutation({ mutationFn: authApi.login, onSuccess: persistSession })
  const registerMutation = useMutation({ mutationFn: authApi.register, onSuccess: persistSession })

  const logout = async () => {
    try { await authApi.logout() } finally {
      tokenStorage.clear()
      queryClient.setQueryData(AUTH_QUERY_KEY, null)
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY })
    }
  }

  const value = {
    user: sessionQuery.data ?? null,
    isLoading: sessionQuery.isLoading && Boolean(tokenStorage.get()),
    isAuthenticated: Boolean(sessionQuery.data),
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
