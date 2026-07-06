import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
  password: z.string().min(8, 'A senha deve possuir pelo menos 8 caracteres.'),
})

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, 'Informe seu nome.').max(120),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
