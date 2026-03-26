'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types'
import { INBOX } from '../constants/inbox.constants'

export function useRealtimeChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!conversationId) return
    const channelName = INBOX.CHANNELS.CONVERSATION(conversationId)
    const channel = supabase
      .channel(channelName)
      .on(INBOX.CONFIG.BROADCAST as 'broadcast', { event: INBOX.EVENTS.MESSAGE }, ({ payload }) => {
        setMessages((prev) => [...prev, payload as Message])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [conversationId, supabase])

  return { messages, isLoading }
}
