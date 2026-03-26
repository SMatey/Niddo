import { AUTH } from '@/features/auth/constants/auth.constants'

export type UserRole = (typeof AUTH.ROLES)[keyof typeof AUTH.ROLES]

export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  role: UserRole
  isVerified: boolean
  trustScore: number
  createdAt: string
}
