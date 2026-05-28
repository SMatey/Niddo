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
  const myParticipantInfo = conversation.participants.find(p => p.profileId === currentUserId);
  const profile = otherParticipant?.profile;
  const unreadCount = myParticipantInfo?.unreadCount || 0;

  // Utilidad simple para mostrar "Hoy", "Ayer" o la fecha
  const formatTime = (dateString: string) => {
    const defaultDate = new Date(dateString);
    return defaultDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Eliminar chat', conversation.id);
  };

  const handleBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Bloquear usuario', profile?.id);
  };

  return (
    <div
      onClick={onClick}
      className={`group w-full flex items-center gap-3 p-4 border-b border-gray-100 text-left transition-colors duration-200 cursor-pointer
        ${isActive ? 'bg-blue-50/50' : 'bg-white hover:bg-gray-50'}
      `}
    >
      {/* Avatar e indicador de status (online/offline) en vez de unread general acá */}
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
        
        {/* Indicador de estado Online (opcional visualmente si se requiere acá) */}
        {profile?.status === 'online' && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      {/* Contenido (Nombre, Fecha y Último Mensaje) */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className={`text-base truncate ${unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
            {profile?.name || MESSAGES_UI_TEXT.chat.unknownUser}
          </h3>
        </div>
        
        {conversation.lastMessage && (
          <p className={`text-sm truncate pr-2 ${unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
            {conversation.lastMessage.content}
          </p>
        )}
      </div>

      {/* Acciones de la derecha: Fecha, Menu Opciones y Badge Unread */}
      <div className="flex flex-col items-end flex-shrink-0 gap-1.5 ml-2">
        <div className="flex items-center gap-2">
          {conversation.lastMessage && (
            <span className={`text-xs whitespace-nowrap ${unreadCount > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
              {formatTime(conversation.lastMessage.createdAt)}
            </span>
          )}

          {/* Menú de 3 puntos (Oculto por defecto, visible en Hover via CSS) */}
          <div className="relative isolate hidden md:block">
            <button 
              onClick={(e) => { e.stopPropagation(); /* lógica de abrir dropdown si fuese por estado */ }} 
              className="peer p-1 -mr-1 text-gray-400 hover:text-gray-700 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
               </svg>
            </button>
            
            {/* Dropdown CSS-Only */}
            <div className="hidden peer-focus:block hover:block absolute right-0 top-full bg-white border border-gray-100 shadow-xl rounded-md py-1 z-20 w-40">
               <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                 {MESSAGES_UI_TEXT.actions.deleteChat}
               </button>
               <button onClick={handleBlock} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                 {MESSAGES_UI_TEXT.actions.block}
               </button>
            </div>
          </div>
        </div>

        {/* Badge de contador de mensajes no leídos */}
        {unreadCount > 0 && (
           <span className="bg-blue-500 text-white text-[11px] leading-none font-bold px-2 py-0.5 rounded-full inline-flex items-center justify-center min-w-[20px] h-[20px]">
             {unreadCount > 99 ? '99+' : unreadCount}
           </span>
        )}
      </div>
    </div>
  );
};
