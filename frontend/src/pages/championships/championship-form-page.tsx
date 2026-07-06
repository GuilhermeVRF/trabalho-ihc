import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { routes } from '@/app/route-paths';
import { championshipApi } from '@/features/championships/championship.api';
import {
  championshipSchema,
  type ChampionshipFormData,
  type ChampionshipFormInput,
} from '@/features/championships/championship.schema';
import { FormField } from '@/shared/components/form-field';

const defaultValues: ChampionshipFormData = {
  name: '',
  season: new Date().getFullYear().toString(),
  description: '',
  maxTeams: 8,
  format: 'LEAGUE',
  startDate: '',
  endDate: '',
};

export function ChampionshipFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const championship = useQuery({
    queryKey: ['championship', id],
    queryFn: () => championshipApi.get(id!),
    enabled: isEditing,
  });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChampionshipFormInput, unknown, ChampionshipFormData>({
    resolver: zodResolver(championshipSchema),
    defaultValues,
  });
  useEffect(() => {
    if (championship.data)
      reset({
        name: championship.data.name,
        season: championship.data.season,
        description: championship.data.description ?? '',
        maxTeams: championship.data.maxTeams,
        format: championship.data.format,
        startDate: championship.data.startDate.slice(0, 10),
        endDate: championship.data.endDate.slice(0, 10),
      });
  }, [championship.data, reset]);
  const save = handleSubmit(async (data) => {
    try {
      if (id) await championshipApi.update(id, data);
      else await championshipApi.create(data);
      await queryClient.invalidateQueries({ queryKey: ['championships'] });
      navigate(routes.championships);
    } catch {
      setError('root', { message: 'Ocorreu um erro.' });
    }
  });
  const removeMutation = useMutation({
    mutationFn: () => championshipApi.remove(id!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['championships'] });
      navigate(routes.championships);
    },
  });

  if (isEditing && championship.isLoading)
    return <p className="text-sm text-slate-400">Carregando...</p>;
  if (championship.isError) return <p className="text-sm text-red-500">Ocorreu um erro.</p>;
  return (
    <>
      <Link
        to={routes.championships}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-950 dark:hover:text-white"
      >
        <ArrowLeft size={17} />
        Voltar
      </Link>
      <header className="mt-5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {isEditing ? 'Editar campeonato' : 'Novo campeonato'}
        </h1>
        <p className="mt-2 text-sm text-slate-400">Preencha os dados da competição.</p>
      </header>
      <form onSubmit={save} noValidate className="mt-7 max-w-3xl">
        <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7 dark:bg-slate-900">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField
                id="name"
                label="Nome do campeonato"
                placeholder="Ex.: Copa da Cidade"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>
            <FormField
              id="season"
              label="Temporada"
              placeholder="2026"
              error={errors.season?.message}
              {...register('season')}
            />
            <div>
              <label
                htmlFor="format"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Formato
              </label>
              <select
                id="format"
                className="h-12 w-full rounded-xl border bg-white px-4 text-sm shadow-sm dark:bg-slate-900"
                {...register('format')}
              >
                <option value="LEAGUE">Pontos corridos</option>
                <option value="GROUPS">Grupos</option>
                <option value="KNOCKOUT">Mata-mata</option>
              </select>
            </div>
            <FormField
              id="maxTeams"
              label="Quantidade máxima de times"
              type="number"
              min={2}
              error={errors.maxTeams?.message}
              {...register('maxTeams')}
            />
            <div className="hidden sm:block" />
            <FormField
              id="startDate"
              label="Data de início"
              type="date"
              error={errors.startDate?.message}
              {...register('startDate')}
            />
            <FormField
              id="endDate"
              label="Data de término"
              type="date"
              error={errors.endDate?.message}
              {...register('endDate')}
            />
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Descrição <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 dark:bg-slate-900"
                placeholder="Informações sobre o campeonato"
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
          {errors.root && (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
            >
              {errors.root.message}
            </p>
          )}
        </section>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            disabled={isSubmitting}
            className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            <Save size={17} />
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => removeMutation.mutate()}
              disabled={removeMutation.isPending}
              className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              <Trash2 size={17} />
              Excluir
            </button>
          )}
        </div>
      </form>
    </>
  );
}
