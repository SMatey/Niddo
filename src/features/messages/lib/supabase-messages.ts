import { createClient } from '@/lib/supabase/client';
import { MESSAGES_DB, MESSAGES_ERRORS, MESSAGE_TYPES } from '../constants/messages.constants';
import type { SendMessagePayload, Message } from '../types/messages.types';

const mapSupabaseMessage = (row: any): Message => ({
  id: row.id,
  conversationId: row.conversation_id,
  senderId: row.sender_id,
  receiverId: row.receiver_id,
  content: row.content,
  read: row.read,
  type: row.type,
  createdAt: row.created_at,
});

export async function sendMessage(payload: SendMessagePayload): Promise<Message> {
  const supabase = createClient();

  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (authError || !session) {
    throw new Error(MESSAGES_ERRORS.UNAUTHORIZED);
  }

  if (!payload.conversationId || !payload.receiverId || !payload.content) {
    throw new Error(MESSAGES_ERRORS.MISSING_FIELDS);
  }

  const { data, error } = await supabase
    .from(MESSAGES_DB.TABLE)
    .insert({
      conversation_id: payload.conversationId,
      sender_id: session.user.id,
      receiver_id: payload.receiverId,
      content: payload.content,
      type: payload.type || MESSAGE_TYPES.TEXT,
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw new Error(MESSAGES_ERRORS.SEND_FAILED);
  }

  return mapSupabaseMessage(data);
}