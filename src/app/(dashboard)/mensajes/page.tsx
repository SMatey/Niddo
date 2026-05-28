"use client"
import { useState } from 'react';
import { ChatSidebar, MOCK_CONVERSATIONS } from '@/features/messages';

export default function Page() {
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  // Para pruebas usando datos dummy, nuestro id en mock es 'me'
  const currentUserId = 'me';

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] w-full bg-white overflow-hidden">
      {/* Panel Izquierdo / Sidebar */}
      <ChatSidebar 
        currentUserId={currentUserId}
        conversations={MOCK_CONVERSATIONS}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
      />

      {/* Panel Derecho (Placeholder por ahora) */}
      <div className="flex-1 hidden md:flex flex-col bg-gray-50 border-l border-gray-200 justify-center items-center">
        {!activeConversationId ? (
          <div className="text-center">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
             </div>
             <h2 className="text-xl font-bold text-gray-900 mb-2">Tus Mensajes</h2>
             <p className="text-gray-500">Selecciona una conversación para leer y enviar mensajes.</p>
          </div>
        ) : (
          <div className="text-center">
             <h2 className="text-xl text-gray-700">Conversación {activeConversationId} seleccionada</h2>
             <p className="text-gray-500 text-sm mt-2">(Aquí construiremos la ventana del chat paso a paso)</p>
          </div>
        )}
      </div>
    </div>
  )
}
