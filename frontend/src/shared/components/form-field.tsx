import type { InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string }
export function FormField({ label, error, id, className, ...props }: FormFieldProps) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label><input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={cn('h-12 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 dark:bg-slate-900', error && 'border-red-500', className)} {...props} />{error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}</div>
}
