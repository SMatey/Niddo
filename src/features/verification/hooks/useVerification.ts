'use client'
import { useState } from 'react'
export function useVerification() {
  const [isLoading, setIsLoading] = useState(false)
  return { isLoading }
}
