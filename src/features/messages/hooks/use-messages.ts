import { useState, useEffect, useCallback, useRef } from 'react';
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
  const supabaseRef = useRef(createClient());

  // Agrega un mensaje al estado local evitando duplicados (por id).
  // Lo usamos tanto para el realtime como para el "append optimista" del
  // mensaje que el propio usuario acaba de enviar.
  const addLocalMessage = useCallback(
    (msg: Message) => {
      // Solo nos interesa la conversación activa
      if (!conversationId || msg.conversationId !== conversationId) return;
      setMessages((current) =>
        current.some((m) => m.id === msg.id) ? current : [...current, msg]
      );
    },
    [conversationId]
  );

  const sendMessage = useCallback(
    async (receiverId: string, content: string, type?: MessageType) => {
      if (!conversationId) return;
      try {
        const sent = await sendMessageService({
          conversationId,
          receiverId,
          content,
          type,
        });
        // Append optimista: se ve de inmediato sin esperar al realtime
        addLocalMessage(sent);
      } catch (err) {
        console.error('Error in useMessages:', err);
        throw err;
      }
    },
    [conversationId, addLocalMessage]
  );

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    let channel: ReturnType<typeof supabaseRef.current.channel> | null = null;
    const supabase = supabaseRef.current;

    const setupMessages = async () => {
      setIsLoading(true);

      try {
        // Fetch inicial de mensajes
        const { data, error: fetchError } = await supabase
          .from(MESSAGES_DB.TABLE)
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(100);

        if (fetchError) throw fetchError;
        if (cancelled) return;

        setMessages((data || []).map(mapSupabaseMessage));
        setError(null);

        // Realtime: nos suscribimos SIN filtro (igual que el sidebar, que sí
        // funciona) y filtramos por conversación en el cliente. Así evitamos
        // los problemas del filtro de postgres_changes por conversation_id.
        const channelName = `chat_room_${conversationId}`;

        // Limpiar cualquier canal previo con el mismo nombre (evita duplicados
        // en re-montajes, p. ej. StrictMode en desarrollo)
        const existing = supabase.getChannels().find((ch) => ch.topic === channelName);
        if (existing) {
          await supabase.removeChannel(existing);
        }

        channel = supabase.channel(channelName);

        channel.on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: MESSAGES_DB.TABLE,
          },
          (payload) => {
            const incoming = mapSupabaseMessage(payload.new);

            // Ignorar mensajes de otras conversaciones
            if (incoming.conversationId !== conversationId) return;

            console.log('[useMessages] mensaje en tiempo real:', incoming.id);

            setMessages((current) =>
              current.some((m) => m.id === incoming.id) ? current : [...current, incoming]
            );
          }
        );

        channel.subscribe((status) => {
          console.log(`[useMessages] canal ${channelName}:`, status);
        });
      } catch (err) {
        console.error('Error in useMessages:', err);
        if (!cancelled) setError(MESSAGES_ERRORS.FETCH_FAILED);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    setupMessages();

    return () => {
      cancelled = true;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [conversationId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    addLocalMessage,
  };
}
