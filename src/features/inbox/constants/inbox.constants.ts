export const INBOX = {
  MAX_MESSAGE_LENGTH: 1000,
  REALTIME: {
    CHANNEL_PREFIX: 'conversation:',
    EVENT_TYPE: 'broadcast',
    MESSAGE_EVENT: 'message',
  },
} as const
