import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/app/layout/app-shell'
import { championshipRoutes, playerRoutes, routes, teamRoutes } from './route-paths'
import { ProtectedRoute } from '@/features/auth/protected-route'
import { PublicOnlyRoute } from '@/features/auth/public-only-route'
import { AuthLayout } from '@/pages/auth/auth-layout'
import { LoginPage } from '@/pages/auth/login-page'
import { RegisterPage } from '@/pages/auth/register-page'
import { DashboardPage } from '@/pages/dashboard/dashboard-page'
import { ChampionshipFormPage } from '@/pages/championships/championship-form-page'
import { ChampionshipsPage } from '@/pages/championships/championships-page'
import { ChampionshipTeamsPage } from '@/pages/championships/championship-teams-page'
import { TeamFormPage } from '@/pages/teams/team-form-page'
import { TeamsPage } from '@/pages/teams/teams-page'
import { PlayerFormPage } from '@/pages/players/player-form-page'
import { PlayersPage } from '@/pages/players/players-page'
import { MatchesPage } from '@/pages/matches/matches-page'
import { StandingsPage } from '@/pages/standings/standings-page'
import { StatisticsPage } from '@/pages/statistics/statistics-page'
import { ProfilePage } from '@/pages/profile/profile-page'
import { NotFoundPage } from '@/pages/not-found/not-found-page'
const router = createBrowserRouter([
  { element: <PublicOnlyRoute />, children: [{ element: <AuthLayout />, children: [{ path: routes.login, element: <LoginPage /> }, { path: routes.register, element: <RegisterPage /> }] }] },
  { element: <ProtectedRoute />, children: [{ element: <AppShell />, children: [
    { path: routes.dashboard, element: <DashboardPage /> },
    { path: routes.championships, element: <ChampionshipsPage /> },
    { path: championshipRoutes.create, element: <ChampionshipFormPage /> },
    { path: '/campeonatos/:id/editar', element: <ChampionshipFormPage /> },
    { path: '/campeonatos/:id/times', element: <ChampionshipTeamsPage /> },
    { path: routes.teams, element: <TeamsPage /> },
    { path: teamRoutes.create, element: <TeamFormPage /> },
    { path: '/times/:id/editar', element: <TeamFormPage /> },
    { path: routes.players, element: <PlayersPage /> },
    { path: playerRoutes.create, element: <PlayerFormPage /> },
    { path: '/jogadores/:id/editar', element: <PlayerFormPage /> },
    { path: routes.matches, element: <MatchesPage /> },
    { path: routes.standings, element: <StandingsPage /> },
    { path: routes.statistics, element: <StatisticsPage /> },
    { path: routes.profile, element: <ProfilePage /> },
  ] }] },
  { path: '*', element: <NotFoundPage /> },
])
export function AppRouter() { return <RouterProvider router={router} /> }
