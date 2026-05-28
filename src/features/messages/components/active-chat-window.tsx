'use client';

import { Conversation, Message } from '../types/messages.types';
import { MESSAGES_UI_TEXT } from '../constants/messages.constants';
import { ChatMessageBubble } from './chat-message-bubble';
import { ChatInputFooter } from './chat-input-footer';

interface ActiveChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
}

export const ActiveChatWindow = ({ conversation, messages, currentUserId, onSendMessage }: ActiveChatWindowProps) => {
  const otherParticipant = conversation.participants.find(p => p.profileId !== currentUserId);
  const profile = otherParticipant?.profile;

  return (
    <div className="flex-1 hidden md:flex flex-col bg-gray-50 border-l border-gray-200 h-full">
      {/* Header Info */}
      <div className="h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-10 h-10 rounded-full object-cover border border-gray-200" 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold border border-gray-200">
              {profile?.name?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <h2 className="font-semibold text-gray-900 leading-tight">
              {profile?.name || MESSAGES_UI_TEXT.chat.unknownUser}
            </h2>
            {/* Si quisieras agregar un estado 'en línea', iría aquí. Hardcodeamos un texto simple por ahora */}
            <span className="text-xs text-green-600 font-medium">Disponible</span>
          </div>
        </div>

        {/* Acciones extra irían aquí (Opciones, Reportar, etc). Por ahora un icono de "Más opciones" */}
        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Message List Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar flex flex-col">
        {messages.length === 0 ? (
           <div className="m-auto text-center p-4">
              <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-xs font-medium">
                Inicia la conversación
              </span>
           </div>
        ) : (
          messages.map((message) => (
            <ChatMessageBubble 
              key={message.id} 
              message={message} 
              currentUserId={currentUserId} 
            />
          ))
        )}
      </div>

      {/* Input Footer Area */}
      <ChatInputFooter onSendMessage={onSendMessage} />
    </div>
  );
};
