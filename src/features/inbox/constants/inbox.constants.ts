export const INBOX = {
  CHANNELS: {
    CONVERSATION: (id: string) => `conversation:${id}`,
  },
  EVENTS: {
    MESSAGE: 'message',
  },
  CONFIG: {
    BROADCAST: 'broadcast',
  },
} as const
