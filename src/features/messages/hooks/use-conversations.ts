import { useState, useEffect, useCallback, useMemo } from 'react';
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

export function useConversations(): UseConversationsResult {
  const [data, setData] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Instanciamos el cliente usando useMemo para evitar recreaciones innecesarias
  const supabase = useMemo(() => createClient(), []);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) throw new Error('Usuario no autenticado');

      const { data: participantsData, error: fetchError } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          unread_count,
          conversations (
            id,
            created_at,
            updated_at
          )
        `)
        .eq('profile_id', userId);

      if (fetchError) throw fetchError;

      const formattedConversations: Conversation[] = (participantsData || []).map((row: any) => ({
        id: row.conversation_id,
        createdAt: row.conversations.created_at,
        updatedAt: row.conversations.updated_at,
        participants: [
          {
            conversationId: row.conversation_id,
            profileId: userId,
            unreadCount: row.unread_count,
          }
        ],
      }));

      setData(formattedConversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;
    let currentUserId: string | undefined;

    const setupRealtime = async () => {
      // 1. Obtenemos el ID del usuario con la sintaxis correcta de Supabase v2
      const { data: sessionData } = await supabase.auth.getSession();
      currentUserId = sessionData.session?.user.id;

      // 2. Ejecutamos la carga inicial
      await refresh();

      if (!currentUserId) return;

      // 3. Establecemos la suscripción
      channel = supabase
        .channel('global_conversations_listener')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: MESSAGES_DB.TABLE,
          },
          (payload) => {
            const newMessage = mapSupabaseMessage(payload.new);
            
            setData((prevConversations) => {
              const conversationExists = prevConversations.find(c => c.id === newMessage.conversationId);

              if (conversationExists) {
                const updatedConversations = prevConversations.map(conv => {
                  if (conv.id === newMessage.conversationId) {
                    const isForMe = newMessage.receiverId === currentUserId;
                    const myParticipant = conv.participants[0]; 
                    
                    return {
                      ...conv,
                      lastMessage: newMessage,
                      updatedAt: newMessage.createdAt,
                      participants: [
                        {
                          ...myParticipant,
                          unreadCount: isForMe ? myParticipant.unreadCount + 1 : myParticipant.unreadCount
                        }
                      ]
                    };
                  }
                  return conv;
                });

                return updatedConversations.sort(
                  (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
              } else {
                refresh();
                return prevConversations;
              }
            });
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [refresh, supabase]);

  return {
    data,
    isLoading,
    error,
    refresh,
  };
}