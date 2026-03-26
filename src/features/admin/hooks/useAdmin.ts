'use client'
import { useState } from 'react'
export function useAdmin() {
  const [isLoading, setIsLoading] = useState(false)
  return { isLoading }
}
