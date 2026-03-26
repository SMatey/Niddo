import { VERIFICATION_STATUS } from '@/features/verification/constants/verification.constants'

export type VerificationStatus = (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS]

export interface VerificationRequest {
  id: string
  userId: string
  status: VerificationStatus
  type: 'identity' | 'university'
  documentUrl: string
  createdAt: string
}
