import { z } from 'zod'
import { AUTH } from '@/features/auth/constants/auth.constants'

export const registerSchema = z
  .object({
    fullName: z.string().min(2, AUTH.VALIDATION.NAME_MIN),
    email: z.string().email(AUTH.VALIDATION.EMAIL_INVALID),
    password: z
      .string()
      .min(AUTH.MIN_PASSWORD_LENGTH, AUTH.VALIDATION.PASSWORD_MIN),
    confirmPassword: z
      .string()
      .min(AUTH.MIN_PASSWORD_LENGTH, AUTH.VALIDATION.PASSWORD_MIN),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: AUTH.VALIDATION.PASSWORDS_DO_NOT_MATCH,
  })

export type RegisterValues = z.infer<typeof registerSchema>
