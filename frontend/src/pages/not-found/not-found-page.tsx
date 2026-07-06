import { Link } from 'react-router-dom'
import { routes } from '@/app/route-paths'
export function NotFoundPage() { return <main className="grid min-h-svh place-items-center px-5 text-center"><div><p className="text-sm font-bold text-brand-600">404</p><h1 className="mt-2 text-3xl font-bold">Página não encontrada</h1><Link className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700" to={routes.dashboard}>Voltar ao início</Link></div></main> }
