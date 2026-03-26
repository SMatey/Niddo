import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Nombre demasiado corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export type RegisterValues = z.infer<typeof registerSchema>
