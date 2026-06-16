import { createClient } from '@/lib/supabase/client';

export async function createConversation(otherUserId: string) {
  const supabase = createClient();

  try {
    // Obtener el usuario actual
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      throw new Error('Usuario no autenticado');
    }

    const currentUserId = session.user.id;

    // Verificar que no sea el mismo usuario
    if (currentUserId === otherUserId) {
      throw new Error('No puedes enviar un mensaje a ti mismo');
    }

    // Verificar si ya existe una conversación entre estos usuarios.
    // Obtenemos TODAS las conversaciones del usuario actual (no solo la primera)
    // y buscamos cuál de ellas también incluye al otro usuario.
    const { data: myParticipations, error: participantsError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('profile_id', currentUserId);

    if (participantsError) throw participantsError;

    const myConversationIds = (myParticipations ?? []).map((p) => p.conversation_id);

    if (myConversationIds.length > 0) {
      // Buscar una conversación compartida donde el otro usuario también participe
      const { data: sharedParticipation, error: sharedError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('profile_id', otherUserId)
        .in('conversation_id', myConversationIds)
        .maybeSingle();

      if (sharedError) throw sharedError;

      if (sharedParticipation) {
        // Ya existe una conversación entre ambos, retornar su ID
        return sharedParticipation.conversation_id;
      }
    }

    // Crear nueva conversación
    const { data: newConversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (conversationError) throw conversationError;

    // Agregar ambos usuarios como participantes
    const { error: insertError } = await supabase
      .from('conversation_participants')
      .insert([
        {
          conversation_id: newConversation.id,
          profile_id: currentUserId,
          unread_count: 0
        },
        {
          conversation_id: newConversation.id,
          profile_id: otherUserId,
          unread_count: 0
        }
      ]);

    if (insertError) throw insertError;

    return newConversation.id;

  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}
