'use client'

import { useState } from 'react'

export function useMenuToggle() {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    setIsOpen,
  }
}
