import { Conversation, Message } from './messages.types';

export interface ActiveChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
}

export interface ChatInputFooterProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export interface ChatListItemProps {
  conversation: Conversation;
  currentUserId: string;
  isActive: boolean;
  onClick: () => void;
}

export interface ChatMessageBubbleProps {
  message: Message;
  currentUserId: string;
}

export interface ChatSidebarProps {
  currentUserId: string;
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}
