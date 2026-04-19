import { z } from 'zod'
import { AUTH } from '@/features/auth/constants/auth.constants'

export const loginSchema = z.object({
  email: z.string().email(AUTH.VALIDATION.EMAIL_INVALID),
  password: z
    .string()
    .min(AUTH.MIN_PASSWORD_LENGTH, AUTH.VALIDATION.PASSWORD_MIN),
})

export type LoginValues = z.infer<typeof loginSchema>
