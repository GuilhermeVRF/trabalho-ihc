import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email(),
  password: z.string().refine((value) => value.length === 0 || value.length >= 8),
})

export type ProfileFormData = z.infer<typeof profileSchema>
