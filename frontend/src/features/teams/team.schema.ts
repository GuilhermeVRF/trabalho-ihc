import { z } from 'zod'

export const teamSchema = z.object({
  name: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().length(2).transform((value) => value.toUpperCase()),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  coach: z.string().trim().min(2).max(120),
})

export type TeamFormData = z.infer<typeof teamSchema>
