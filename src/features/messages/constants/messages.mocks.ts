import { Conversation, Message, ProfileSnippet } from '../types/messages.types';

const MOCK_PROFILES: Record<string, ProfileSnippet> = {
  'me': {
    id: 'me',
    name: 'Mi Cuenta',
    avatar: 'https://i.pravatar.cc/150?u=me',
    isVerified: true
  },
  'user-1': {
    id: 'user-1',
    name: 'Ana Gómez',
    avatar: 'https://i.pravatar.cc/150?u=user1',
    isVerified: true
  },
  'user-2': {
    id: 'user-2',
    name: 'Carlos Ruiz',
    avatar: 'https://i.pravatar.cc/150?u=user2',
    isVerified: false
  },
  'user-3': {
    id: 'user-3',
    name: 'Laura Martínez',
    avatar: 'https://i.pravatar.cc/150?u=user3',
    isVerified: true
  },
};

export const MOCK_MESSAGES_CONV_1: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-1',
    receiverId: 'me',
    content: '¡Hola! Vi tu anuncio de la habitación, ¿sigue disponible?',
    read: true,
    type: 'text',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'me',
    receiverId: 'user-1',
    content: 'Hola Ana, ¡sí claro! ¿Cuándo te gustaría venir a verla?',
    read: true,
    type: 'text',
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-1',
    receiverId: 'me',
    content: '¿Te parece bien el jueves por la tarde? Tipo 6pm.',
    read: false,
    type: 'text',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    participants: [
      { conversationId: 'conv-1', profileId: 'me', unreadCount: 1, profile: MOCK_PROFILES['me'] },
      { conversationId: 'conv-1', profileId: 'user-1', unreadCount: 0, profile: MOCK_PROFILES['user-1'] }
    ],
    lastMessage: MOCK_MESSAGES_CONV_1[2]
  },
  {
    id: 'conv-2',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    participants: [
      { conversationId: 'conv-2', profileId: 'me', unreadCount: 0, profile: MOCK_PROFILES['me'] },
      { conversationId: 'conv-2', profileId: 'user-2', unreadCount: 0, profile: MOCK_PROFILES['user-2'] }
    ],
    lastMessage: {
      id: 'msg-4',
      conversationId: 'conv-2',
      senderId: 'me',
      receiverId: 'user-2',
      content: 'Perfecto, te aviso si hay algún cambio. ¡Gracias!',
      read: true,
      type: 'text',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    }
  },
  {
    id: 'conv-3',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    participants: [
      { conversationId: 'conv-3', profileId: 'me', unreadCount: 0, profile: MOCK_PROFILES['me'] },
      { conversationId: 'conv-3', profileId: 'user-3', unreadCount: 0, profile: MOCK_PROFILES['user-3'] }
    ],
    lastMessage: {
      id: 'msg-5',
      conversationId: 'conv-3',
      senderId: 'user-3',
      receiverId: 'me',
      content: 'Entendido, lo reviso y te comento.',
      read: true,
      type: 'text',
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    }
  }
];
