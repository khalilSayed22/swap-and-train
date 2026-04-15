import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isSupabaseConfigured =
  !!supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  !!supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

// Always create a client — even with dummy values so imports don't crash.
// Guards in database.ts check isSupabaseConfigured before any real call.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
);

export type SupabaseUser = Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'];
