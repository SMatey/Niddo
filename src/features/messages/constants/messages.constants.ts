export const MESSAGES_UI_TEXT = {
  emptyState: {
    title: 'Tus Mensajes',
    description: 'Selecciona una conversación o inicia un nuevo chat para conectarte con posibles roomies o dueños.',
    noChats: 'Aún no tienes mensajes',
    noChatsDescription: 'Cuando contactes a un roomie o dueño de apartamento, tus conversaciones aparecerán aquí.',
    noResults: 'No se encontraron conversaciones',
    startConversation: 'Inicia la conversación',
    tryAnotherName: 'Intenta buscar con otro nombre.'
  },
  chat: {
    placeholder: 'Escribe un mensaje...',
    searchPlaceholder: 'Buscar conversación...',
    sendLabel: 'Enviar',
    loading: 'Cargando mensajes...',
    today: 'Hoy',
    yesterday: 'Ayer',
    read: 'Leído',
    unread: 'No leído',
    unknownUser: 'Usuario desconocido',
    online: 'Disponible',
    offline: 'Desconectado'
  },
  errors: {
    loadFailed: 'No pudimos cargar tus mensajes. Por favor, intenta de nuevo.',
    sendFailed: 'Error al enviar el mensaje. Revisa tu conexión.',
    unauthorized: 'Debes iniciar sesión para enviar o leer mensajes.',
    imageUploadFailed: 'No se pudo cargar la imagen. El formato o tamaño no es válido.'
  },
  actions: {
    report: 'Reportar usuario',
    block: 'Bloquear usuario',
    viewProfile: 'Ver perfil',
    deleteChat: 'Eliminar conversación'
  }
} as const;

export const MESSAGES_DB = {
  TABLE: 'messages',
  CONVERSATIONS_TABLE: 'conversations',
} as const;

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
} as const;

export const MESSAGES_ERRORS = {
  SEND_FAILED: 'No se pudo enviar el mensaje. Intenta nuevamente.',
  FETCH_FAILED: 'Error al cargar el historial de mensajes.',
  UNAUTHORIZED: 'Debes iniciar sesión para acceder al chat.',
  MISSING_FIELDS: 'Faltan datos requeridos para enviar el mensaje.',
} as const;