import { supabase, isSupabaseConfigured } from './supabase';

// ─── DB Row types ─────────────────────────────────────────────────────────────

export interface DbProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  sports: string[];
  level: string;
  bio: string;
  goals: string[];
  availability: string[];
  time_preference: string[];
  verified: boolean;
  reliability_score: number;
  avatar: string;
  photos: string[];
  location: string;
  training_style: string;
  sessions_completed: number;
  onboarding_complete: boolean;
}

export interface DbMatch {
  id: string;
  user_id: string;
  matched_user_id: string;
  matched_at: string;
  conversation_id: string;
}

export interface DbConversation {
  id: string;
  user_id: string;
  matched_user_id: string;
  unread_count: number;
  created_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<DbProfile | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data as DbProfile;
}

export async function upsertProfile(userId: string, profile: Partial<DbProfile>): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase
    .from('profiles')
    .upsert({ id: userId, ...profile }, { onConflict: 'id' });
}

// ─── Swipes ───────────────────────────────────────────────────────────────────

export async function getSwipedUserIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from('swipes')
    .select('target_user_id')
    .eq('user_id', userId);
  return (data ?? []).map((r: { target_user_id: string }) => r.target_user_id);
}

export async function saveSwipe(
  userId: string,
  targetUserId: string,
  direction: 'left' | 'right',
): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase
    .from('swipes')
    .upsert({ user_id: userId, target_user_id: targetUserId, direction }, { onConflict: 'user_id,target_user_id' });
}

// ─── Matches ──────────────────────────────────────────────────────────────────

export async function getMatches(userId: string): Promise<DbMatch[]> {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from('matches')
    .select('*')
    .eq('user_id', userId)
    .order('matched_at', { ascending: false });
  return (data ?? []) as DbMatch[];
}

export async function saveMatch(
  userId: string,
  matchedUserId: string,
  conversationId: string,
): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('matches').insert({
    user_id: userId,
    matched_user_id: matchedUserId,
    matched_at: new Date().toISOString(),
    conversation_id: conversationId,
  });
}

// ─── Conversations ────────────────────────────────────────────────────────────

export async function getConversations(userId: string): Promise<DbConversation[]> {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return (data ?? []) as DbConversation[];
}

export async function createConversation(
  userId: string,
  matchedUserId: string,
  conversationId: string,
): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('conversations').insert({
    id: conversationId,
    user_id: userId,
    matched_user_id: matchedUserId,
    unread_count: 0,
  });
}

export async function markConversationRead(conversationId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase
    .from('conversations')
    .update({ unread_count: 0 })
    .eq('id', conversationId);
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function getMessages(conversationId: string): Promise<DbMessage[]> {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  return (data ?? []) as DbMessage[];
}

export async function saveMessage(
  conversationId: string,
  senderId: string,
  text: string,
): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: senderId,
    text,
  });
}

export function subscribeToMessages(
  conversationId: string,
  onNewMessage: (msg: DbMessage) => void,
) {
  if (!isSupabaseConfigured) return { unsubscribe: () => {} };
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onNewMessage(payload.new as DbMessage),
    )
    .subscribe();
  return {
    unsubscribe: () => supabase.removeChannel(channel),
  };
}
