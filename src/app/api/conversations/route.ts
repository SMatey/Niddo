import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Mapea una fila de la tabla messages (snake_case) al tipo del frontend (camelCase)
function mapMessage(row: any) {
  if (!row) return undefined;
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    content: row.content,
    read: row.read,
    type: row.type,
    createdAt: row.created_at,
  };
}

// =============================================================
// GET: devuelve todas las conversaciones del usuario autenticado
// con TODOS los participantes (perfiles) y el último mensaje,
// ordenadas de la más reciente a la más antigua.
//
// Se usa service role porque la política RLS de
// conversation_participants solo deja ver la fila propia, por lo
// que el otro participante (nombre/avatar) nunca llegaría al cliente.
// =============================================================
export async function GET() {
  try {
    // 1. Autenticar al usuario vía cookies de sesión
    const authClient = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const currentUserId = user.id;
    const admin = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Conversaciones en las que participo (con mi unread_count)
    const { data: myParts, error: myErr } = await admin
      .from('conversation_participants')
      .select('conversation_id, unread_count')
      .eq('profile_id', currentUserId);

    if (myErr) throw myErr;

    const conversationIds = (myParts ?? []).map((r) => r.conversation_id);
    console.log('[GET /api/conversations] usuario:', currentUserId, 'conversaciones:', conversationIds.length);

    if (conversationIds.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    const myUnreadByConversation = new Map<string, number>(
      (myParts ?? []).map((r) => [r.conversation_id, r.unread_count ?? 0])
    );

    // 3. En paralelo: datos de las conversaciones, TODOS los participantes
    //    con su perfil, y todos los mensajes (para extraer el último).
    const [
      { data: convsData, error: convsErr },
      { data: partsData, error: partsErr },
      { data: msgsData, error: msgsErr },
    ] = await Promise.all([
      admin
        .from('conversations')
        .select('id, created_at, updated_at')
        .in('id', conversationIds),
      admin
        .from('conversation_participants')
        .select('conversation_id, profile_id, unread_count, profiles ( id, name, avatar, is_verified )')
        .in('conversation_id', conversationIds),
      admin
        .from('messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false }),
    ]);

    if (convsErr) throw convsErr;
    if (partsErr) throw partsErr;
    if (msgsErr) throw msgsErr;

    // 4. Último mensaje por conversación (msgsData ya viene desc por fecha)
    const lastMessageByConversation = new Map<string, any>();
    for (const row of msgsData ?? []) {
      if (!lastMessageByConversation.has(row.conversation_id)) {
        lastMessageByConversation.set(row.conversation_id, row);
      }
    }

    // 5. Agrupar participantes por conversación
    const participantsByConversation = new Map<string, any[]>();
    for (const p of partsData ?? []) {
      const list = participantsByConversation.get(p.conversation_id) ?? [];
      list.push(p);
      participantsByConversation.set(p.conversation_id, list);
    }

    // 6. Armar el arreglo de conversaciones en el shape del frontend
    const conversations = (convsData ?? []).map((conv) => {
      const rawParticipants = participantsByConversation.get(conv.id) ?? [];
      const lastMessageRow = lastMessageByConversation.get(conv.id);

      return {
        id: conv.id,
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
        lastMessage: mapMessage(lastMessageRow),
        participants: rawParticipants.map((p: any) => ({
          conversationId: conv.id,
          profileId: p.profile_id,
          // Solo exponemos mi propio unread_count; el del otro no es relevante para mi UI
          unreadCount:
            p.profile_id === currentUserId
              ? myUnreadByConversation.get(conv.id) ?? p.unread_count ?? 0
              : 0,
          profile: p.profiles
            ? {
                id: p.profiles.id,
                name: p.profiles.name,
                avatar: p.profiles.avatar,
                isVerified: p.profiles.is_verified,
              }
            : undefined,
        })),
      };
    });

    // 7. Ordenar: más reciente primero (por último mensaje, o por updatedAt)
    conversations.sort((a, b) => {
      const aTime = new Date(a.lastMessage?.createdAt ?? a.updatedAt).getTime();
      const bTime = new Date(b.lastMessage?.createdAt ?? b.updatedAt).getTime();
      return bTime - aTime;
    });

    console.log('[GET /api/conversations] devueltas:', conversations.length);
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('[GET /api/conversations] error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

// =============================================================
// POST: crea (o reutiliza) una conversación 1:1 entre el usuario
// autenticado y targetUserId, insertando ambos participantes.
// Es idempotente: nunca crea dos conversaciones para el mismo par.
// =============================================================
export async function POST(request: Request) {
  const step = { current: 'init' };
  try {
    const body = await request.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 });
    }

    // 1. Autenticar al usuario que hace la petición (vía cookies de sesión)
    step.current = 'auth';
    const authClient = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const currentUserId = user.id;
    console.log('[POST /api/conversations] currentUserId:', currentUserId, 'targetUserId:', targetUserId);

    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: 'No puedes iniciar una conversación contigo mismo' },
        { status: 400 }
      );
    }

    // 2. Cliente con service role para deduplicar y crear con ambos participantes
    //    (necesario porque RLS solo deja ver las participaciones propias)
    step.current = 'admin-client';
    const admin = createClient(supabaseUrl, supabaseServiceKey);

    // Validar que AMBOS usuarios tengan perfil (FK constraint en conversation_participants)
    step.current = 'validate-profiles';
    const [{ data: currentProfile, error: currentProfileError }, { data: targetProfile, error: targetError }] =
      await Promise.all([
        admin.from('profiles').select('id').eq('id', currentUserId).maybeSingle(),
        admin.from('profiles').select('id').eq('id', targetUserId).maybeSingle(),
      ]);

    if (currentProfileError) {
      console.error('[POST /api/conversations] error al buscar perfil del usuario actual:', currentProfileError);
      throw currentProfileError;
    }
    if (!currentProfile) {
      console.error('[POST /api/conversations] el usuario autenticado no tiene perfil en profiles:', currentUserId);
      return NextResponse.json(
        { error: 'Tu perfil no está configurado. Completa el registro primero.' },
        { status: 422 }
      );
    }
    if (targetError) {
      console.error('[POST /api/conversations] error al buscar perfil destino:', targetError);
      throw targetError;
    }
    if (!targetProfile) {
      return NextResponse.json({ error: 'El usuario destino no existe' }, { status: 404 });
    }

    // Clave determinística del par (ids ordenados). Identifica de forma
    // única la conversación 1:1 entre estos dos usuarios.
    const participantKey = [currentUserId, targetUserId].sort().join('|');

    // Helper: buscar una conversación ya existente entre AMBOS usuarios.
    // Primero por participant_key (rápido y exacto); si la columna aún no
    // existe (migración no aplicada), se cae al cruce de participantes.
    const findExistingConversationId = async (): Promise<string | null> => {
      // a) Por participant_key
      const byKey = await admin
        .from('conversations')
        .select('id')
        .eq('participant_key', participantKey)
        .maybeSingle();

      if (!byKey.error && byKey.data) return byKey.data.id;

      if (byKey.error) {
        console.log('[POST /api/conversations] participant_key lookup falló (columna probablemente inexistente):', byKey.error.code);
      }

      // b) Fallback por intersección de participantes (no depende de la columna)
      const [{ data: myParts, error: myErr }, { data: targetParts, error: tgtErr }] =
        await Promise.all([
          admin
            .from('conversation_participants')
            .select('conversation_id')
            .eq('profile_id', currentUserId),
          admin
            .from('conversation_participants')
            .select('conversation_id')
            .eq('profile_id', targetUserId),
        ]);

      if (myErr) {
        console.error('[POST /api/conversations] error al buscar participaciones propias:', myErr);
        throw myErr;
      }
      if (tgtErr) {
        console.error('[POST /api/conversations] error al buscar participaciones del destino:', tgtErr);
        throw tgtErr;
      }

      const myConversationIds = new Set((myParts ?? []).map((r) => r.conversation_id));
      const shared = (targetParts ?? []).find((r) =>
        myConversationIds.has(r.conversation_id)
      );

      return shared ? shared.conversation_id : null;
    };

    // 3. Deduplicar: si ya existe, reutilizarla
    step.current = 'find-existing';
    const existingId = await findExistingConversationId();
    if (existingId) {
      console.log('[POST /api/conversations] reutilizando conversación', existingId);
      return NextResponse.json({ conversationId: existingId, existing: true });
    }

    // 4. Crear nueva conversación (con participant_key cuando la columna exista)
    step.current = 'create-conversation';
    const now = new Date().toISOString();

    let newConversation: { id: string } | null = null;
    let convError: any = null;

    ({ data: newConversation, error: convError } = await admin
      .from('conversations')
      .insert({ created_at: now, updated_at: now, participant_key: participantKey })
      .select('id')
      .single());

    if (convError) {
      console.log('[POST /api/conversations] error al insertar conversación (code:', convError.code, '):', convError.message);
      // 23505 = violación de índice único (carrera: otra petición la creó primero)
      if (convError.code === '23505') {
        const racedId = await findExistingConversationId();
        if (racedId) {
          console.log('[POST /api/conversations] carrera resuelta, reutilizando', racedId);
          return NextResponse.json({ conversationId: racedId, existing: true });
        }
      }
      // 42703 = error PostgreSQL de columna inexistente
      // PGRST204 = PostgREST rechaza la columna antes de llegar a PG (schema cache)
      // Ambos significan que la migración participant_key no está aplicada en la BD.
      const isMissingColumn =
        convError.code === '42703' ||
        convError.code === 'PGRST204' ||
        (convError.message ?? '').includes('participant_key');

      if (isMissingColumn) {
        console.log('[POST /api/conversations] reintentando sin participant_key (code:', convError.code, ')...');
        ({ data: newConversation, error: convError } = await admin
          .from('conversations')
          .insert({ created_at: now, updated_at: now })
          .select('id')
          .single());
        if (convError) {
          console.error('[POST /api/conversations] fallo también sin participant_key:', convError);
        }
      }
      if (convError) throw convError;
    }

    const conversationId = newConversation!.id;
    console.log('[POST /api/conversations] conversación creada con id:', conversationId);

    // 5. Agregar AMBOS participantes de forma atómica
    step.current = 'insert-participants';
    const { error: participantsError } = await admin
      .from('conversation_participants')
      .insert([
        { conversation_id: conversationId, profile_id: currentUserId, unread_count: 0 },
        { conversation_id: conversationId, profile_id: targetUserId, unread_count: 0 },
      ]);

    if (participantsError) {
      console.error('[POST /api/conversations] error al insertar participantes:', participantsError);
      // Rollback manual: eliminar la conversación huérfana
      await admin.from('conversations').delete().eq('id', conversationId);
      throw participantsError;
    }

    console.log('[POST /api/conversations] conversación lista', conversationId);
    return NextResponse.json({ conversationId, existing: false });
  } catch (error: any) {
    console.error(`[POST /api/conversations] fallo en paso "${step.current}":`, error);
    const detail = error?.message ?? String(error);
    return NextResponse.json(
      { error: 'Failed to create conversation', step: step.current, detail },
      { status: 500 }
    );
  }
}
