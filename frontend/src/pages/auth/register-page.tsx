import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from '@/app/route-paths'
import { registerSchema, type RegisterFormData } from '@/features/auth/auth.schemas'
import { useAuth } from '@/features/auth/use-auth'
import { FormField } from '@/shared/components/form-field'

export function RegisterPage() {
  const { register: createAccount } = useAuth(); const navigate = useNavigate()
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })
  const submit = handleSubmit(async (data) => { try { await createAccount(data); navigate(routes.dashboard, { replace: true }) } catch { setError('root', { message: 'Ocorreu um erro.' }) } })
  return <><p className="text-sm font-semibold text-brand-700 dark:text-brand-400">Comece agora</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Crie sua conta</h1><p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Leva menos de um minuto.</p><form onSubmit={submit} noValidate className="mt-8 space-y-4"><FormField id="name" label="Nome" autoComplete="name" placeholder="Seu nome" error={errors.name?.message} {...register('name')} /><FormField id="register-email" label="E-mail" type="email" autoComplete="email" placeholder="voce@exemplo.com" error={errors.email?.message} {...register('email')} /><FormField id="register-password" label="Senha" type="password" autoComplete="new-password" placeholder="Mínimo de 8 caracteres" error={errors.password?.message} {...register('password')} />{errors.root && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{errors.root.message}</p>}<button disabled={isSubmitting} className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:opacity-60">{isSubmitting ? 'Criando...' : 'Criar conta'}<ArrowRight size={18} /></button></form><p className="mt-7 text-center text-sm text-slate-500">Já possui uma conta? <Link to={routes.login} className="font-semibold text-brand-700 hover:underline dark:text-brand-400">Entrar</Link></p></>
}
