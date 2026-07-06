import { useQuery } from '@tanstack/react-query'
import { CalendarDays, Shield, Trophy, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { routes } from '@/app/route-paths'
import { dashboardApi } from '@/features/dashboard/dashboard.api'
import type { Match } from '@/features/matches/match.types'

export function DashboardPage() {
  const query = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.get }); const data = query.data
  const stats = [
    { label: 'Campeonatos', value: data?.counts.championships ?? 0, icon: Trophy, to: routes.championships, tone: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
    { label: 'Times', value: data?.counts.teams ?? 0, icon: Shield, to: routes.teams, tone: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' },
    { label: 'Jogadores', value: data?.counts.players ?? 0, icon: Users, to: routes.players, tone: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300' },
    { label: 'Próximos jogos', value: data?.counts.upcomingMatches ?? 0, icon: CalendarDays, to: routes.matches, tone: 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300' },
  ]
  if (query.isError) return <p className="text-sm text-red-500">Ocorreu um erro.</p>
  return <><header><p className="text-sm font-medium text-brand-700 dark:text-brand-400">Visão geral</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1><p className="mt-2 text-sm text-slate-400">Acompanhe seus campeonatos em um só lugar.</p></header><section className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-5">{stats.map(({ label, value, icon: Icon, tone, to }) => <Link to={to} key={label} className="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:p-5 dark:bg-slate-900"><div className={`grid size-10 place-items-center rounded-xl ${tone}`}><Icon size={20} /></div><p className="mt-5 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-400 sm:text-sm">{label}</p></Link>)}</section><section className="mt-6 grid gap-5 xl:grid-cols-2"><MatchPanel title="Próximos jogos" matches={data?.upcomingMatches ?? []} results={false} /><MatchPanel title="Últimos resultados" matches={data?.latestResults ?? []} results /></section></>
}

function MatchPanel({ title, matches, results }: { title: string; matches: Match[]; results: boolean }) {
  return <article className="min-h-64 rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900"><div className="flex items-center justify-between"><h2 className="font-bold">{title}</h2><Link to={routes.matches} className="text-xs font-semibold text-brand-700 dark:text-brand-400">Ver jogos</Link></div>{matches.length === 0 ? <div className="grid h-48 place-items-center text-center"><div><CalendarDays className="mx-auto text-slate-300 dark:text-slate-700" size={34} /><p className="mt-3 text-sm text-slate-400">Nenhum jogo para exibir.</p></div></div> : <div className="mt-4 divide-y">{matches.map((match) => <div key={match.id} className="py-3"><div className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 flex-1 truncate text-right font-medium">{match.homeTeam.name}</span><span className={`shrink-0 rounded-lg px-2.5 py-1 font-bold ${results ? 'bg-slate-100 dark:bg-slate-800' : 'text-slate-400'}`}>{results ? `${match.homeScore} × ${match.awayScore}` : '×'}</span><span className="min-w-0 flex-1 truncate font-medium">{match.awayTeam.name}</span></div><p className="mt-1.5 text-center text-[11px] text-slate-400">{match.championship.name} · {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(match.scheduledAt))}</p></div>)}</div>}</article>
}
