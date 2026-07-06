import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { routes } from '@/app/route-paths'
import { useAuth } from './use-auth'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  if (isLoading) return <div className="grid min-h-svh place-items-center text-sm text-slate-500">Carregando...</div>
  if (!isAuthenticated) return <Navigate to={routes.login} replace state={{ from: location }} />
  return <Outlet />
}
