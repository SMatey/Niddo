"use client"
import { useState } from 'react';
import { ChatSidebar, MOCK_CONVERSATIONS, MOCK_MESSAGES_CONV_1, ChatEmptyState, ActiveChatWindow } from '@/features/messages';

export default function Page() {
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  // Para pruebas usando datos dummy, nuestro id en mock es 'me'
  const currentUserId = 'me';

  // Buscar la conversación activa.
  const activeConversation = MOCK_CONVERSATIONS.find(c => c.id === activeConversationId);
  // Para este mockup, si es 'conv-1' mostramos sus mensajes, si no, lo dejamos vacío
  const activeMessages = activeConversationId === 'conv-1' ? MOCK_MESSAGES_CONV_1 : [];

  const handleSendMessage = (content: string) => {
    // Posteriormente aquí se integrará la llamada a supabase para guardar el mensaje.
    console.log('Enviando mensaje:', content, 'a la conversación', activeConversationId);
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] w-full bg-white overflow-hidden">
      {/* Panel Izquierdo / Sidebar */}
      <ChatSidebar 
        currentUserId={currentUserId}
        conversations={MOCK_CONVERSATIONS}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
      />

      {/* Panel Derecho (Ventana de Chat o Empty state) */}
      {!activeConversation ? (
        <ChatEmptyState />
      ) : (
        <ActiveChatWindow 
          conversation={activeConversation}
          messages={activeMessages}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  )
}
