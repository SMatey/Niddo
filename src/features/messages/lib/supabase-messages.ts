import { createClient } from '@/lib/supabase/client';
import { MESSAGES_DB, MESSAGES_ERRORS, MESSAGE_TYPES } from '../constants/messages.constants';
import { SendMessagePayload } from '../types/messages.types'

export async function sendMessage(payload: SendMessagePayload) {
  const supabase = createClient();

  // 1. Verificación de seguridad local
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (authError || !session) {
    throw new Error(MESSAGES_ERRORS.UNAUTHORIZED);
  }

  if (!payload.conversationId || !payload.receiverId || !payload.content) {
    throw new Error(MESSAGES_ERRORS.MISSING_FIELDS);
  }

  // 2. Inserción directa en la base de datos
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

  return data;
}