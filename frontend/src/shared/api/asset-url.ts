import { env } from '@/shared/config/env'

export function assetUrl(path: string | null) {
  if (!path) return null
  if (/^https?:\/\//.test(path)) return path
  return `${env.VITE_API_URL.replace(/\/api\/?$/, '')}${path}`
}
