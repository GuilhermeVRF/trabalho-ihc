import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { routes } from '@/app/route-paths'
import { championshipApi } from '@/features/championships/championship.api'
import { teamApi } from '@/features/teams/team.api'
import { assetUrl } from '@/shared/api/asset-url'

export function ChampionshipTeamsPage() {
  const { id = '' } = useParams(); const navigate = useNavigate(); const queryClient = useQueryClient(); const [selected, setSelected] = useState<string[]>([])
  const championship = useQuery({ queryKey: ['championship', id], queryFn: () => championshipApi.get(id) })
  const memberships = useQuery({ queryKey: ['championship', id, 'teams'], queryFn: () => championshipApi.listTeams(id) })
  const teams = useQuery({ queryKey: ['teams', 'options'], queryFn: () => teamApi.list({ page: 1, pageSize: 50 }) })
  useEffect(() => { if (memberships.data) setSelected(memberships.data.map((item) => item.teamId)) }, [memberships.data])
  const save = useMutation({ mutationFn: () => championshipApi.setTeams(id, selected), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['championships'] }); navigate(routes.championships) } })
  const toggle = (teamId: string) => setSelected((current) => current.includes(teamId) ? current.filter((value) => value !== teamId) : current.length < (championship.data?.maxTeams ?? 0) ? [...current, teamId] : current)
  if (championship.isLoading || memberships.isLoading || teams.isLoading) return <p className="text-sm text-slate-400">Carregando...</p>
  if (championship.isError || memberships.isError || teams.isError) return <p className="text-sm text-red-500">Ocorreu um erro.</p>

  return <><Link to={routes.championships} className="inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft size={17} />Voltar</Link><header className="mt-5"><h1 className="text-2xl font-bold sm:text-3xl">Participantes</h1><p className="mt-2 text-sm text-slate-400">{championship.data?.name} · {selected.length}/{championship.data?.maxTeams} times</p></header><section className="mt-7 max-w-3xl rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900">{teams.data?.data.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">Nenhum time cadastrado.</p> : <div className="grid gap-3 sm:grid-cols-2">{teams.data?.data.map((team) => { const checked = selected.includes(team.id); const crest = assetUrl(team.crestUrl); return <label key={team.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${checked ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}><input type="checkbox" checked={checked} onChange={() => toggle(team.id)} className="size-4 accent-brand-600" />{crest ? <img src={crest} alt="" className="size-9 rounded-lg object-cover" /> : <span className="grid size-9 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800"><Shield size={17} /></span>}<span className="min-w-0"><span className="block truncate text-sm font-semibold">{team.name}</span><span className="text-xs text-slate-400">{team.city} — {team.state}</span></span></label> })}</div>}{save.isError && <p className="mt-4 text-sm text-red-500">Ocorreu um erro.</p>}</section><button onClick={() => save.mutate()} disabled={save.isPending} className="mt-5 flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white disabled:opacity-60"><Save size={17} />Salvar</button></>
}
