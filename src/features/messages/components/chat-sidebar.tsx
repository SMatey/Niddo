'use client';

import { useState } from 'react';
import { MESSAGES_UI_TEXT } from '../constants/messages.constants';
import { Conversation } from '../types/messages.types';
import { SearchInput } from './search-input';
import { ChatListItem } from './chat-list-item';

interface ChatSidebarProps {
  currentUserId: string;
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
}

export const ChatSidebar = ({ currentUserId, conversations, activeConversationId, onSelectConversation }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtro de conversaciones basado en el nombre del otro usuario
  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = conv.participants.find(p => p.profileId !== currentUserId);
    if (!otherParticipant?.profile?.name) return false;
    
    return otherParticipant.profile.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <aside className="w-full md:w-[340px] lg:w-[380px] h-full flex flex-col bg-white border-r border-gray-200">
      {/* Cabecera del Panel */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          {MESSAGES_UI_TEXT.emptyState.title}
        </h2>
      </div>

      {/* Buscador */}
      <SearchInput value={searchQuery} onChange={setSearchQuery} />

      {/* Lista scrolleable de chats */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <ChatListItem
              key={conv.id}
              conversation={conv}
              currentUserId={currentUserId}
              isActive={conv.id === activeConversationId}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
               </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              {searchQuery ? MESSAGES_UI_TEXT.emptyState.noResults : MESSAGES_UI_TEXT.emptyState.noChats}
            </h3>
            <p className="text-xs text-gray-500 max-w-[250px]">
              {searchQuery 
                ? 'Intenta buscar con otro nombre.' 
                : MESSAGES_UI_TEXT.emptyState.noChatsDescription}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
