import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { routes } from '@/app/route-paths'
import { loginSchema, type LoginFormData } from '@/features/auth/auth.schemas'
import { useAuth } from '@/features/auth/use-auth'
import { FormField } from '@/shared/components/form-field'

export function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation()
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })
  const submit = handleSubmit(async (data) => { try { await login(data); const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname; navigate(from || routes.dashboard, { replace: true }) } catch { setError('root', { message: 'Ocorreu um erro.' }) } })
  return <><p className="text-sm font-semibold text-brand-700 dark:text-brand-400">Bem-vindo de volta</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Entre na sua conta</h1><p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Acompanhe tudo que acontece nos seus campeonatos.</p><form onSubmit={submit} noValidate className="mt-8 space-y-5"><FormField id="email" label="E-mail" type="email" autoComplete="email" placeholder="voce@exemplo.com" error={errors.email?.message} {...register('email')} /><FormField id="password" label="Senha" type="password" autoComplete="current-password" placeholder="Sua senha" error={errors.password?.message} {...register('password')} />{errors.root && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{errors.root.message}</p>}<button disabled={isSubmitting} className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Entrando...' : 'Entrar'}<ArrowRight size={18} /></button></form><p className="mt-7 text-center text-sm text-slate-500">Ainda não possui uma conta? <Link to={routes.register} className="font-semibold text-brand-700 hover:underline dark:text-brand-400">Cadastre-se</Link></p></>
}
