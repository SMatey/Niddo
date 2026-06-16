-- Fix RLS policies for conversations and conversation_participants tables

-- Drop existing policies for conversations
DROP POLICY IF EXISTS "Participants can view conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;

-- Create new policies for conversations
CREATE POLICY "Users can create conversations" ON conversations 
  FOR INSERT 
  WITH CHECK (auth.uid()::TEXT IS NOT NULL);

CREATE POLICY "Users can view conversations they participate in" ON conversations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = conversations.id 
      AND profile_id = auth.uid()::TEXT
    )
  );

-- Drop existing policies for conversation_participants
DROP POLICY IF EXISTS "Users can view their conversation participations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can join conversations" ON conversation_participants;

-- Create new policies for conversation_participants
CREATE POLICY "Users can view their conversation participations" ON conversation_participants 
  FOR SELECT 
  USING (auth.uid()::TEXT = profile_id);

CREATE POLICY "Users can join conversations" ON conversation_participants 
  FOR INSERT 
  WITH CHECK (auth.uid()::TEXT = profile_id);

CREATE POLICY "Users can update their participation" ON conversation_participants 
  FOR UPDATE 
  USING (auth.uid()::TEXT = profile_id);

CREATE POLICY "Users can delete their participation" ON conversation_participants 
  FOR DELETE 
  USING (auth.uid()::TEXT = profile_id);
