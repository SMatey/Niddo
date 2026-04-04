import { z } from 'zod'
import { AUTH } from '@/features/auth/constants/auth.constants'

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(AUTH.MIN_NAME_LENGTH, AUTH.VALIDATION.NAME_TOO_SHORT),
  email: z.string().email(AUTH.VALIDATION.EMAIL_INVALID),
  password: z
    .string()
    .min(AUTH.MIN_PASSWORD_LENGTH, AUTH.VALIDATION.PASSWORD_MIN),
})

export type RegisterValues = z.infer<typeof registerSchema>
