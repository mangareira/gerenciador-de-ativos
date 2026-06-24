import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({ message: 'O email é obrigatório' }),
  password: z
    .string()
    .nonempty({ message: 'A senha é obrigatória' })
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
})

export type Login = z.infer<typeof loginSchema>