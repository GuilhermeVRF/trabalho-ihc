import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Plus,
  Search,
  Shield,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { championshipRoutes } from '@/app/route-paths';
import { championshipApi } from '@/features/championships/championship.api';
import type { Championship, ChampionshipStatus } from '@/features/championships/championship.types';
import { matchApi } from '@/features/matches/match.api';

const statusLabels: Record<ChampionshipStatus, string> = {
  DRAFT: 'Rascunho',
  SCHEDULED: 'Agendado',
  IN_PROGRESS: 'Em andamento',
  FINISHED: 'Finalizado',
};
const formatLabels = { LEAGUE: 'Pontos corridos', GROUPS: 'Grupos', KNOCKOUT: 'Mata-mata' };

export function ChampionshipsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ['championships', { search, page, sortOrder }],
    queryFn: () =>
      championshipApi.list({ search: search || undefined, page, sortBy: 'createdAt', sortOrder }),
  });
  const removeMutation = useMutation({
    mutationFn: championshipApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['championships'] }),
  });
  const generateMutation = useMutation({
    mutationFn: matchApi.generate,
    onSuccess: () => {
      setOpenMenu(null);
      queryClient.invalidateQueries({ queryKey: ['championships'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
  const championships = query.data?.data ?? [];
  const meta = query.data?.meta;

  return (
    <>
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Campeonatos</h1>
          <p className="mt-2 text-sm text-slate-400">Organize todas as suas competições.</p>
        </div>
        <Link
          to={championshipRoutes.create}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Novo campeonato</span>
          <span className="sm:hidden">Novo</span>
        </Link>
      </header>
      <section className="mt-7 rounded-2xl border bg-white shadow-sm dark:bg-slate-900">
        <div className="flex items-center justify-between border-b p-4">
          <label className="relative block w-40">
            <span className="sr-only">Pesquisar campeonatos</span>
            <Search
              className="absolute top-1/2 left-2.5 -translate-y-1/2 text-slate-400"
              size={14}
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Buscar"
              className="h-8 w-full rounded-lg border bg-transparent pr-3 pl-8 text-xs placeholder:text-slate-400"
            />
          </label>
          <p className="text-xs text-slate-400">{meta?.total ?? 0} campeonato(s)</p>
        </div>
        {query.isError || generateMutation.isError ? (
          <div className="grid min-h-72 place-items-center text-sm text-red-500">
            Ocorreu um erro.
          </div>
        ) : championships.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left">
              <thead>
                <tr className="border-b text-xs text-slate-400">
                  <th
                    onClick={() => setSortOrder((value) => (value === 'asc' ? 'desc' : 'asc'))}
                    className="cursor-pointer px-5 py-3 font-medium"
                  >
                    Campeonato
                  </th>
                  <th className="px-4 py-3 font-medium">Formato</th>
                  <th className="px-4 py-3 font-medium">Período</th>
                  <th className="px-4 py-3 font-medium">Times</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="w-12 px-4 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {championships.map((item) => (
                  <ChampionshipRow
                    key={item.id}
                    item={item}
                    menuOpen={openMenu === item.id}
                    toggleMenu={() => setOpenMenu(openMenu === item.id ? null : item.id)}
                    remove={() => removeMutation.mutate(item.id)}
                    generate={() => generateMutation.mutate(item.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {meta && meta.totalPages > 1 && (
          <footer className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-xs text-slate-400">
              Página {meta.page} de {meta.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                aria-label="Página anterior"
                disabled={page === 1}
                onClick={() => setPage((value) => value - 1)}
                className="grid size-8 place-items-center rounded-lg border disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                aria-label="Próxima página"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((value) => value + 1)}
                className="grid size-8 place-items-center rounded-lg border disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </footer>
        )}
      </section>
    </>
  );
}

function ChampionshipRow({
  item,
  menuOpen,
  toggleMenu,
  remove,
  generate,
}: {
  item: Championship;
  menuOpen: boolean;
  toggleMenu: () => void;
  remove: () => void;
  generate: () => void;
}) {
  const date = (value: string) =>
    new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(value));
  return (
    <tr className="border-b last:border-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
      <td className="px-5 py-4">
        <Link to={championshipRoutes.edit(item.id)} className="font-semibold hover:text-brand-700">
          {item.name}
        </Link>
        <p className="mt-1 text-xs text-slate-400">Temporada {item.season}</p>
      </td>
      <td className="px-4 py-4 text-sm text-slate-500">{formatLabels[item.format]}</td>
      <td className="px-4 py-4 text-xs text-slate-400">
        {date(item.startDate)} — {date(item.endDate)}
      </td>
      <td className="px-4 py-4">
        <span className="inline-flex items-center gap-1.5 text-sm">
          <Shield size={14} className="text-slate-400" />
          {item._count.teams}/{item.maxTeams}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium dark:bg-slate-800">
          {statusLabels[item.status]}
        </span>
      </td>
      <td className="relative px-4 py-4">
        <button
          aria-label={`Ações de ${item.name}`}
          onClick={toggleMenu}
          className="grid size-8 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <EllipsisVertical size={17} />
        </button>
        {menuOpen && (
          <div className="absolute top-12 right-4 z-10 w-40 rounded-xl border bg-white p-1.5 text-sm shadow-xl dark:bg-slate-900">
            <Link
              to={championshipRoutes.edit(item.id)}
              className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Editar
            </Link>
            <Link
              to={championshipRoutes.teams(item.id)}
              className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Participantes
            </Link>
            <button
              onClick={generate}
              className="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Gerar tabela
            </button>
            <button
              onClick={remove}
              className="block w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              Excluir
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="grid min-h-72 place-items-center p-8 text-center">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          <Trophy size={26} />
        </span>
        <h2 className="mt-4 font-bold">Nenhum campeonato</h2>
        <p className="mt-2 text-sm text-slate-400">Crie sua primeira competição para começar.</p>
        <Link
          to={championshipRoutes.create}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <CalendarDays size={17} />
          Criar campeonato
        </Link>
      </div>
    </div>
  );
}
