'use client'

import { useParams } from 'next/navigation'
import { ReviewFormPage } from '@/features/reviews'

export default function UserReviewPage() {
  const params = useParams()

  return <ReviewFormPage targetId={params.id as string} targetType="profile" />
}
