import { Trophy } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/shared/components/theme-toggle'

export function AuthLayout() {
  return <main className="grid min-h-svh lg:grid-cols-2">
    <section className="relative hidden overflow-hidden bg-brand-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div aria-hidden="true" className="absolute -top-32 -right-32 size-96 rounded-full bg-brand-400/30 blur-3xl" />
      <div className="relative flex items-center gap-3 text-xl font-bold"><span className="grid size-11 place-items-center rounded-xl bg-white/15"><Trophy size={23} /></span>ChampManager</div>
      <div className="relative max-w-lg"><p className="text-4xl font-bold leading-tight">Seu campeonato.<br />Do seu jeito.</p><p className="mt-5 text-lg leading-8 text-brand-100">Organize equipes, jogadores, partidas e resultados em um só lugar.</p></div>
      <p className="relative text-sm text-brand-200">Futebol amador levado a sério.</p>
    </section>
    <section className="relative flex min-h-svh items-center justify-center px-5 py-10 sm:px-10">
      <div className="absolute top-5 right-5"><ThemeToggle /></div>
      <div className="w-full max-w-md"><div className="mb-9 flex items-center gap-3 lg:hidden"><span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-white"><Trophy size={21} /></span><span className="text-lg font-bold">ChampManager</span></div><Outlet /></div>
    </section>
  </main>
}
