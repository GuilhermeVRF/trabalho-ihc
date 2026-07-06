import type { LucideIcon } from 'lucide-react'

export function SectionPlaceholderPage({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return <><header><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1><p className="mt-2 text-sm text-slate-400">{description}</p></header><section className="mt-7 grid min-h-80 place-items-center rounded-2xl border border-dashed bg-white p-8 text-center dark:bg-slate-900"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"><Icon size={26} /></span><h2 className="mt-5 font-bold">Tudo pronto para começar</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">Esta tela receberá seus dados e ações na etapa de funcionalidades.</p></div></section></>
}
