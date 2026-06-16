'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useMessages } from '@/features/messages/hooks/use-messages';
import { useConversations } from '@/features/messages/hooks/use-conversations';
import { sendMessage as sendMessageService } from '@/features/messages/lib/supabase-messages';
import { ChatSidebar, ChatEmptyState, ActiveChatWindow } from '@/features/messages';
import { Conversation } from '@/features/messages/types/messages.types';

export default function Page() {
  const searchParams = useSearchParams();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState<{ name: string; avatar?: string } | null>(null);
  const [newConversationMessage, setNewConversationMessage] = useState('');

  const supabase = createClient();

  // Obtener el usuario actual de la sesión de autenticación
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user?.id) {
          setCurrentUserId(session.user.id);
          setAuthError(null);
        } else {
          setAuthError('No hay sesión de usuario activa');
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        setAuthError('Error al verificar la sesión');
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, [supabase]);

  // Usar el hook de conversaciones para obtener dinámicamente
  const {
    data: conversations = [],
    isLoading: isLoadingConversations,
    error: conversationsError,
    refresh: refreshConversations
  } = useConversations();

  // Manejar el parámetro de conversation de la URL
  useEffect(() => {
    const conversationParam = searchParams.get('conversation');
    if (conversationParam && conversations.length > 0) {
      // Verificar si la conversación existe en la lista
      const conversationExists = conversations.find(c => c.id === conversationParam);
      if (conversationExists) {
        setActiveConversationId(conversationParam);
      }
    }
  }, [searchParams, conversations]);

  // Manejar el parámetro de user de la URL: si ya existe una conversación
  // con ese usuario, abrir ese hilo directamente; si no, preparar una nueva.
  useEffect(() => {
    const userParam = searchParams.get('user');
    if (!userParam || !currentUserId) return;

    // Esperar a que carguen las conversaciones para decidir sin parpadeo
    if (isLoadingConversations) return;

    // ¿Ya existe una conversación con este usuario?
    const existing = conversations.find(
      (c) =>
        c.participants.some((p) => p.profileId === userParam) &&
        c.participants.some((p) => p.profileId === currentUserId)
    );

    if (existing) {
      console.log('[mensajes] hilo existente con', userParam, '->', existing.id);
      setActiveConversationId(existing.id);
      setTargetUserId(null);
      return;
    }

    // No existe: preparar nueva conversación y traer datos del usuario destino
    console.log('[mensajes] sin hilo previo con', userParam, '- nueva conversación');
    setTargetUserId(userParam);

    const fetchTargetUser = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, avatar')
        .eq('id', userParam)
        .single();

      if (!error && data) {
        setTargetUser(data);
      }
    };

    fetchTargetUser();
  }, [searchParams, currentUserId, conversations, isLoadingConversations, supabase]);

  // Usar el hook de mensajes para la conversación activa
  const {
    messages,
    isLoading: isLoadingMessages,
    error: messagesError,
    addLocalMessage
  } = useMessages(activeConversationId);

  // Encontrar la conversación activa
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Estado de carga global. Solo bloqueamos a pantalla completa en la carga
  // inicial; los refrescos posteriores no deben mostrar el spinner global.
  const isLoading =
    isLoadingUser || (isLoadingConversations && conversations.length === 0);

  // Manejador de envío de mensajes
  const handleSendMessage = async (content: string) => {
    if (!currentUserId) {
      console.error('Usuario no disponible');
      return;
    }

    if (!content.trim()) return;

    try {
      let conversationId: string | null = activeConversationId;
      let receiverId: string | null = null;
      let isNewConversation = false;

      if (activeConversation) {
        // Conversación existente: el receptor es el otro participante
        const otherParticipant = activeConversation.participants.find(
          p => p.profileId !== currentUserId
        );
        receiverId = otherParticipant?.profileId ?? targetUserId;
      } else if (targetUserId) {
        // Nueva conversación: crear (o reutilizar si ya existe) vía API route.
        // El route autentica al usuario, deduplica e inserta ambos participantes.
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetUserId })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'No se pudo crear la conversación');
        }

        const { conversationId: newConversationId } = await response.json();
        conversationId = newConversationId;
        receiverId = targetUserId;
        isNewConversation = true;
      } else {
        console.error('No hay conversación activa ni usuario destino');
        return;
      }

      if (!conversationId || !receiverId) {
        throw new Error('Faltan datos para enviar el mensaje');
      }

      // Enviar el mensaje directamente con el conversationId ya resuelto.
      // Esto evita el bug de closure obsoleto del hook (que descartaba el
      // primer mensaje de una conversación nueva porque su conversationId
      // todavía era null en el render actual).
      const sent = await sendMessageService({ conversationId, receiverId, content: content.trim() });

      // Append optimista en el chat activo: el mensaje propio aparece de
      // inmediato sin depender del realtime. La conversación nueva se llenará
      // con el fetch inicial de useMessages al activarse.
      if (!isNewConversation) {
        addLocalMessage(sent);
      }

      // Refrescar la lista de conversaciones para que la nueva (o la
      // actualizada) aparezca con su último mensaje, y activarla.
      await refreshConversations();

      if (isNewConversation) {
        setActiveConversationId(conversationId);
        setTargetUserId(null);
      }
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      alert('Error al enviar el mensaje: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  // Manejador para nueva conversación
  const handleNewConversationMessage = async () => {
    if (!newConversationMessage.trim() || !targetUserId) return;

    try {
      await handleSendMessage(newConversationMessage);
      setNewConversationMessage('');
    } catch (error) {
      console.error('Error detallado al enviar mensaje:', error);
      alert('Error al enviar el mensaje: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  // Mostrar pantalla de carga
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] w-full bg-white overflow-hidden items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si el usuario no está autenticado
  if (!currentUserId) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] w-full bg-white overflow-hidden items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Debes iniciar sesión para acceder a los mensajes</p>
          <p className="text-sm text-gray-500 mt-2">{authError}</p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay problemas cargando conversaciones
  if (conversationsError) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] w-full bg-white overflow-hidden items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error al cargar las conversaciones</p>
          <p className="text-sm text-gray-500 mt-2">{conversationsError.message}</p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay problemas cargando mensajes de conversación activa
  if (messagesError && activeConversationId) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] w-full bg-white overflow-hidden flex-col gap-4 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error al cargar los mensajes</p>
          <p className="text-sm text-gray-500 mt-2">{messagesError}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] w-full bg-white overflow-hidden">
      {/* Panel Izquierdo / Sidebar */}
      <ChatSidebar
        currentUserId={currentUserId}
        conversations={conversations}
        activeConversationId={activeConversationId || undefined}
        onSelectConversation={(id) => setActiveConversationId(id)}
      />

      {/* Panel Derecho (Ventana de Chat o Empty state o Nueva conversación) */}
      {!activeConversation ? (
        targetUserId ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-2xl">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Nueva conversación</h2>
                  {targetUser && (
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {targetUser.avatar && (
                        <img
                          src={targetUser.avatar}
                          alt={targetUser.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <p className="text-gray-600">Enviando mensaje a <span className="font-semibold text-gray-900">{targetUser.name}</span></p>
                    </div>
                  )}
                  <p className="text-gray-600 text-sm">Envía un mensaje para iniciar la conversación</p>
                </div>
                <div className="border rounded-lg p-4">
                  <textarea
                    value={newConversationMessage}
                    onChange={(e) => setNewConversationMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="w-full min-h-[120px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleNewConversationMessage();
                      }
                    }}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleNewConversationMessage}
                      disabled={!newConversationMessage.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Enviar mensaje
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Presiona Enter para enviar, Shift+Enter para nueva línea
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ChatEmptyState />
        )
      ) : (
        <ActiveChatWindow
          conversation={activeConversation}
          messages={messages}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}
