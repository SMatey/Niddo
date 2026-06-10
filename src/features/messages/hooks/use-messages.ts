import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MESSAGES_DB, MESSAGES_ERRORS } from '../constants/messages.constants';
import { sendMessage as sendMessageService } from '../lib/supabase-messages';
import type { Message, MessageType } from '../types/messages.types';

// Función adaptadora: Traduce de la Base de Datos (snake_case) al Frontend (camelCase)
const mapSupabaseMessage = (row: any): Message => ({
  id: row.id,
  conversationId: row.conversation_id,
  senderId: row.sender_id,
  receiverId: row.receiver_id,
  content: row.content,
  read: row.read,
  type: row.type,
  createdAt: row.created_at,
});

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (receiverId: string, content: string, type?: MessageType) => {
      if (!conversationId) return;
      try {
        await sendMessageService({
          conversationId,
          receiverId,
          content,
          type,
        });
      } catch (err) {
        console.error('Error in useMessages:', err);
        throw err; 
      }
    },
    [conversationId]
  );

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    const fetchInitialMessages = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from(MESSAGES_DB.TABLE)
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true }); 

        if (fetchError) throw fetchError;
        
        // Pasamos los datos crudos por nuestro traductor antes de guardarlos en el estado
        setMessages((data || []).map(mapSupabaseMessage));
      } catch (err) {
        console.error(err);
        setError(MESSAGES_ERRORS.FETCH_FAILED);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMessages();

    const channel = supabase
      .channel(`chat_room_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT', 
          schema: 'public',
          table: MESSAGES_DB.TABLE,
          filter: `conversation_id=eq.${conversationId}`, 
        },
        (payload) => {
          // Traducimos el payload.new antes de inyectarlo en pantalla
          setMessages((currentMessages) => [...currentMessages, mapSupabaseMessage(payload.new)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]); 

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}