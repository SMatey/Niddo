'use client'
import { useState } from 'react'
export function useReviews() {
  const [isLoading, setIsLoading] = useState(false)
  return { isLoading }
}
