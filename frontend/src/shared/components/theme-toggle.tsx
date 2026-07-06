import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/shared/hooks/use-theme'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  return <button type="button" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'} className="grid size-10 cursor-pointer place-items-center rounded-xl border bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 dark:bg-slate-900 dark:text-slate-300">{isDark ? <Sun aria-hidden="true" size={19} /> : <Moon aria-hidden="true" size={19} />}</button>
}
