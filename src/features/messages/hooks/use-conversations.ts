import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MESSAGES_DB } from '../constants/messages.constants';
import type { Conversation, Message, UseConversationsResult } from '../types/messages.types';

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

// Ordena conversaciones de la más reciente a la más antigua (por último
// mensaje, o por updatedAt si todavía no hay mensajes).
const sortByRecency = (list: Conversation[]): Conversation[] =>
  [...list].sort((a, b) => {
    const aTime = new Date(a.lastMessage?.createdAt ?? a.updatedAt).getTime();
    const bTime = new Date(b.lastMessage?.createdAt ?? b.updatedAt).getTime();
    return bTime - aTime;
  });

export function useConversations(): UseConversationsResult {
  const [data, setData] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // Usamos ref para poder llamar refresh desde dentro del canal
  // sin que el closure quede stale
  const refreshRef = useRef<() => Promise<void>>(async () => {});

  const refresh = useCallback(async () => {
    try {
      setError(null);

      // Obtenemos las conversaciones desde el endpoint del servidor, que usa
      // service role para incluir a TODOS los participantes (con su perfil) y
      // el último mensaje. La query directa con el cliente no sirve aquí porque
      // la RLS de conversation_participants solo deja ver la fila propia.
      const response = await fetch('/api/conversations', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'No se pudieron cargar las conversaciones');
      }

      const { conversations } = await response.json();
      console.log('[useConversations] conversaciones recibidas:', conversations?.length ?? 0);

      setData(sortByRecency(conversations ?? []));
    } catch (err) {
      console.error('[useConversations] error al cargar conversaciones:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mantenemos el ref sincronizado con la versión más reciente de refresh
  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setup = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id ?? null;

      // Carga inicial
      await refreshRef.current();

      // Si el efecto fue cancelado mientras esperábamos, no suscribimos
      if (cancelled || !userId) return;

      const channelName = `conversations_rt_${userId}`;

      // Limpiar canal previo con el mismo nombre si existe
      const existing = supabase.getChannels().find(ch => ch.topic === channelName);
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
          if (cancelled) return;

          const newMessage = mapSupabaseMessage(payload.new);
          console.log('[useConversations] nuevo mensaje en tiempo real:', newMessage.conversationId);

          setData((prevConversations) => {
            const conversationExists = prevConversations.find(
              c => c.id === newMessage.conversationId
            );

            if (conversationExists) {
              // Actualizamos lastMessage + unreadCount y reordenamos
              const updated = prevConversations.map(conv => {
                if (conv.id !== newMessage.conversationId) return conv;

                const isForMe = newMessage.receiverId === userId;

                return {
                  ...conv,
                  lastMessage: newMessage,
                  updatedAt: newMessage.createdAt,
                  // Preservamos TODOS los participantes, solo actualizamos unreadCount del actual
                  participants: conv.participants.map(p =>
                    p.profileId === userId
                      ? { ...p, unreadCount: isForMe ? p.unreadCount + 1 : p.unreadCount }
                      : p
                  ),
                };
              });

              return sortByRecency(updated);
            } else {
              // Conversación nueva: refetch completo desde el servidor
              refreshRef.current();
              return prevConversations;
            }
          });
        }
      );

      await channel.subscribe();
    };

    setup().catch(err => console.error('[useConversations] error en setup:', err));

    return () => {
      cancelled = true;
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    };
  // Solo se ejecuta una vez al montar; refresh se accede por ref
  }, [supabase]);

  return { data, isLoading, error, refresh };
}
