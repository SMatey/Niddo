import { Conversation } from '../types/messages.types';
import { MESSAGES_UI_TEXT } from '../constants/messages.constants';

interface ChatListItemProps {
  conversation: Conversation;
  currentUserId: string;
  isActive: boolean;
  onClick: () => void;
}

export const ChatListItem = ({ conversation, currentUserId, isActive, onClick }: ChatListItemProps) => {
  // Encontrar al otro participante del chat
  const otherParticipant = conversation.participants.find(p => p.profileId !== currentUserId);
  const profile = otherParticipant?.profile;
  const unreadCount = otherParticipant?.unreadCount || 0;

  // Utilidad simple para mostrar "Hoy", "Ayer" o la fecha (se puede mover a útilidades luego)
  const formatTime = (dateString: string) => {
    const defaultDate = new Date(dateString);
    return defaultDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 border-b border-gray-100 text-left transition-colors duration-200 
        ${isActive ? 'bg-blue-50/50' : 'bg-white hover:bg-gray-50'}
      `}
    >
      {/* Avatar e indicador de no leído */}
      <div className="relative flex-shrink-0">
        {profile?.avatar ? (
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            className="w-12 h-12 rounded-full object-cover border border-gray-200" 
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-lg border border-gray-200">
            {profile?.name?.charAt(0) || '?'}
          </div>
        )}
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      {/* Contenido (Nombre, Fecha y Último Mensaje) */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className={`text-base truncate ${unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
            {profile?.name || MESSAGES_UI_TEXT.chat.unknownUser}
          </h3>
          
          {conversation.lastMessage && (
            <span className={`text-xs whitespace-nowrap ml-2 ${unreadCount > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
              {formatTime(conversation.lastMessage.createdAt)}
            </span>
          )}
        </div>
        
        {conversation.lastMessage && (
          <p className={`text-sm truncate ${unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
            {conversation.lastMessage.content}
          </p>
        )}
      </div>
      
      {/* Badge de contador de mensajes no leídos (Opcional visualmente) */}
      {unreadCount > 0 && (
         <div className="flex-shrink-0 ml-2">
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
         </div>
      )}
    </button>
  );
};
