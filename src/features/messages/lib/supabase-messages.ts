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

  // Validación mejorada de campos requeridos
  if (!payload.conversationId?.trim()) {
    throw new Error('ID de conversación requerido');
  }

  if (!payload.receiverId?.trim()) {
    throw new Error('ID del receptor requerido');
  }

  if (!payload.content?.trim()) {
    throw new Error('El contenido del mensaje no puede estar vacío');
  }

  // Validar longitud del contenido
  const MAX_MESSAGE_LENGTH = 5000;
  if (payload.content.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres`);
  }

  // Prevenir auto-envío
  if (payload.receiverId === session.user.id) {
    throw new Error('No puedes enviar un mensaje a ti mismo');
  }

  const { data, error } = await supabase
    .from(MESSAGES_DB.TABLE)
    .insert({
      conversation_id: payload.conversationId,
      sender_id: session.user.id,
      receiver_id: payload.receiverId,
      content: payload.content.trim(),
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