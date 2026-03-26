'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types'
import { INBOX } from '@/features/inbox/constants/inbox.constants'

export function useRealtimeChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!conversationId) return
    const channel = supabase
      .channel(`${INBOX.REALTIME.CHANNEL_PREFIX}${conversationId}`)
      .on(INBOX.REALTIME.EVENT_TYPE, { event: INBOX.REALTIME.MESSAGE_EVENT }, ({ payload }) => {
        setMessages((prev) => [...prev, payload as Message])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [conversationId, supabase])

  return { messages, isLoading }
}
