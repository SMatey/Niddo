'use client'
import { useState } from 'react'
export function useMatching() {
  const [isLoading, setIsLoading] = useState(false)
  return { isLoading }
}
