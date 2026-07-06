import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense, useState, type PropsWithChildren } from 'react'
import { ThemeProvider } from './theme-provider'
import { AuthProvider } from '@/features/auth/auth-provider'

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((module) => ({ default: module.ReactQueryDevtools })),
)

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
      mutations: { retry: 0 },
    },
  }))
  return <ThemeProvider><QueryClientProvider client={queryClient}><AuthProvider>{children}</AuthProvider>{import.meta.env.DEV && <Suspense><ReactQueryDevtools initialIsOpen={false} /></Suspense>}</QueryClientProvider></ThemeProvider>
}
