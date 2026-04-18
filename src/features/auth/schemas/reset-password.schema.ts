import { z } from 'zod'
import { AUTH } from '@/features/auth/constants/auth.constants'

export const resetPasswordSchema = z
  .object({
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

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
