import { Navigate, Outlet } from 'react-router-dom'
import { routes } from '@/app/route-paths'
import { useAuth } from './use-auth'

export function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  return isAuthenticated ? <Navigate to={routes.dashboard} replace /> : <Outlet />
}
