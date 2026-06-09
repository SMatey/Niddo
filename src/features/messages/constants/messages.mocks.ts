import { Conversation, Message, ProfileSnippet } from '../types/messages.types';

const MOCK_PROFILES: Record<string, ProfileSnippet> = {
  'me': {
    id: 'me',
    name: 'Mi Cuenta',
    avatar: 'https://i.pravatar.cc/150?u=me',
    isVerified: true,
    status: 'online'
  },
  'user-1': {
    id: 'user-1',
    name: 'Ana Gómez',
    avatar: 'https://i.pravatar.cc/150?u=user1',
    isVerified: true,
    status: 'online'
  },
  'user-2': {
    id: 'user-2',
    name: 'Carlos Ruiz',
    avatar: 'https://i.pravatar.cc/150?u=user2',
    isVerified: false,
    status: 'offline'
  },
  'user-3': {
    id: 'user-3',
    name: 'Laura Martínez',
    avatar: 'https://i.pravatar.cc/150?u=user3',
    isVerified: true,
    status: 'online'
  },
  'user-4': {
    id: 'user-4',
    name: 'Roberto Sánchez',
    avatar: 'https://i.pravatar.cc/150?u=user4',
    isVerified: true,
    status: 'offline'
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
    id: 'conv-3',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    participants: [
      { conversationId: 'conv-3', profileId: 'me', unreadCount: 5, profile: MOCK_PROFILES['me'] },
      { conversationId: 'conv-3', profileId: 'user-3', unreadCount: 0, profile: MOCK_PROFILES['user-3'] }
    ],
    lastMessage: {
      id: 'msg-5',
      conversationId: 'conv-3',
      senderId: 'user-3',
      receiverId: 'me',
      content: '¡Hola! Te envié los documentos que me pediste anoche, confírmame si los pudiste revisar. Quedo atenta, muchísimas gracias por el tiempo.',
      read: false,
      type: 'text',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    }
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
    id: 'conv-4',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    participants: [
      { conversationId: 'conv-4', profileId: 'me', unreadCount: 0, profile: MOCK_PROFILES['me'] },
      { conversationId: 'conv-4', profileId: 'user-4', unreadCount: 0, profile: MOCK_PROFILES['user-4'] }
    ],
    lastMessage: {
      id: 'msg-6',
      conversationId: 'conv-4',
      senderId: 'user-4',
      receiverId: 'me',
      content: 'Lamentablemente ya alquilé el apartamento. Suerte en tu búsqueda.',
      read: true,
      type: 'text',
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    }
  }
];
