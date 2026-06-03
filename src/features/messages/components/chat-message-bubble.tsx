import { Message } from '../types/messages.types';
import { ChatMessageBubbleProps } from '../types/components.types';

export const ChatMessageBubble = ({ message, currentUserId }: ChatMessageBubbleProps) => {
  const isSentByMe = message.senderId === currentUserId;

  // Formato simple de hora (P.e. "2:30 PM")
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex w-full mb-4 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[75%] px-4 py-2.5 flex flex-col ${
          isSentByMe 
            ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' 
            : 'bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-sm shadow-sm'
        }`}
      >
        <span className="text-sm leading-relaxed whitespace-pre-wrap word-break">
          {message.content}
        </span>
        
        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
          isSentByMe ? 'text-blue-100' : 'text-gray-400'
        }`}>
          <span>{formatTime(message.createdAt)}</span>
          {isSentByMe && (
            <svg 
              className={`w-3.5 h-3.5 ${message.read ? 'text-blue-200' : 'text-blue-400 opacity-50'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              {message.read ? (
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              )}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
