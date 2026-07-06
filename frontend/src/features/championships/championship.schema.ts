import { z } from 'zod'

export const championshipSchema = z.object({
  name: z.string().trim().min(3).max(120),
  season: z.string().trim().min(2).max(30),
  description: z.string().max(1000).optional(),
  maxTeams: z.coerce.number().int().min(2).max(100),
  format: z.enum(['LEAGUE', 'GROUPS', 'KNOCKOUT']),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
}).refine((data) => data.endDate >= data.startDate, { path: ['endDate'], message: 'Data inválida.' })

export type ChampionshipFormData = z.infer<typeof championshipSchema>
export type ChampionshipFormInput = z.input<typeof championshipSchema>
