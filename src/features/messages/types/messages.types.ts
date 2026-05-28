export type MessageType = 'text' | 'image';

export interface ProfileSnippet {
  id: string;
  name: string;
  avatar: string | null;
  isVerified: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  type: MessageType;
  createdAt: string;
}

export interface ConversationParticipant {
  conversationId: string;
  profileId: string;
  unreadCount: number;
  profile?: ProfileSnippet;
}

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
}

// Interfaces para los Custom Hooks (Data Fetching & Mutations)
export interface UseConversationsResult {
  data: Conversation[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export interface UseMessagesResult {
  data: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string, type?: MessageType) => Promise<void>;
  markAsRead: () => Promise<void>;
}
