export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

export interface Conversation {
  id: string
  participantIds: string[]
  listingId?: string
  lastMessage?: Message
  createdAt: string
}
