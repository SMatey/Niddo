'use client'

import { useState, useEffect } from 'react'
import { Message } from '../types/messages.types'

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      return
    }
    setIsLoading(false)
  }, [conversationId])

  return { messages, isLoading }
}
