import { z } from 'zod'
import { AUTH } from '@/features/auth/constants/auth.constants'

export const forgotPasswordSchema = z.object({
  email: z.string().email(AUTH.VALIDATION.EMAIL_INVALID),
})

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
