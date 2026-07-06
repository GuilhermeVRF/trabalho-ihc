import { z } from 'zod'

export const playerSchema = z.object({
  teamId: z.uuid(),
  name: z.string().trim().min(2).max(120),
  number: z.number().int().min(1).max(99),
  position: z.enum(['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD']),
  birthDate: z.string().min(1),
  isCaptain: z.boolean(),
})

export type PlayerFormData = z.infer<typeof playerSchema>
