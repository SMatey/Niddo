'use client'

import { useState, useEffect } from 'react'

export interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  read: boolean
}

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
