import { BarChart3, CalendarDays, LayoutDashboard, LogOut, Shield, TrendingUp, Trophy, UserRound, Users } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { routes } from '@/app/route-paths'
import { useAuth } from '@/features/auth/use-auth'
import { cn } from '@/shared/lib/cn'
import { ThemeToggle } from '@/shared/components/theme-toggle'

const primaryNavigation = [
  { label: 'Dashboard', to: routes.dashboard, icon: LayoutDashboard },
  { label: 'Campeonatos', to: routes.championships, icon: Trophy },
  { label: 'Times', to: routes.teams, icon: Shield },
  { label: 'Jogadores', to: routes.players, icon: Users },
  { label: 'Jogos', to: routes.matches, icon: CalendarDays },
  { label: 'Classificação', to: routes.standings, icon: BarChart3 },
  { label: 'Estatísticas', to: routes.statistics, icon: TrendingUp },
]

const mobileNavigation = [primaryNavigation[0], primaryNavigation[1], primaryNavigation[2], primaryNavigation[4], { label: 'Perfil', to: routes.profile, icon: UserRound }]

function Brand() { return <div className="flex items-center gap-3 px-2"><span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/20"><Trophy size={21} /></span><span className="text-lg font-bold">ChampManager</span></div> }

export function AppShell() {
  const { user, logout } = useAuth(); const navigate = useNavigate()
  const signOut = async () => { await logout(); navigate(routes.login, { replace: true }) }
  return <div className="min-h-svh bg-slate-50 dark:bg-slate-950">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-white px-4 py-5 lg:flex dark:bg-slate-900"><Brand /><nav className="mt-9 flex-1 space-y-1" aria-label="Navegação principal">{primaryNavigation.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} end={to === routes.dashboard} className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white', isActive && 'bg-brand-50 text-brand-800 dark:bg-brand-950/70 dark:text-brand-300')}><Icon size={19} />{label}</NavLink>)}</nav><div className="border-t pt-4"><NavLink to={routes.profile} className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><span className="grid size-9 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">{user?.name.charAt(0).toUpperCase()}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{user?.name}</span><span className="block truncate text-xs text-slate-400">{user?.email}</span></span></NavLink><button onClick={signOut} className="mt-2 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"><LogOut size={18} />Sair</button></div></aside>
    <div className="lg:pl-64"><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/90 px-5 backdrop-blur lg:px-8 dark:bg-slate-900/90"><div className="lg:hidden"><Brand /></div><div className="hidden lg:block"><p className="text-sm text-slate-400">Olá,</p><p className="font-semibold">{user?.name.split(' ')[0]}</p></div><ThemeToggle /></header><main className="mx-auto max-w-7xl px-5 py-6 pb-28 sm:px-7 lg:px-8 lg:py-8 lg:pb-8"><Outlet /></main></div>
    <nav className="fixed right-0 bottom-0 left-0 z-30 grid h-18 grid-cols-5 border-t bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden dark:bg-slate-900/95" aria-label="Navegação mobile">{mobileNavigation.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} end={to === routes.dashboard} aria-label={label} title={label} className={({ isActive }) => cn('grid place-items-center text-slate-400 transition', isActive && 'text-brand-600 dark:text-brand-400')}><Icon size={23} /></NavLink>)}</nav>
  </div>
}
