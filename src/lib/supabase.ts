import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Required environment variables are missing:', {
    url: !supabaseUrl ? 'VITE_SUPABASE_URL is missing' : 'OK',
    key: !supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY is missing' : 'OK'
  });
  throw new Error('Supabase configuration is incomplete. Please check your environment variables.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: window.localStorage,
      storageKey: 'sb-auth-token',
      debug: import.meta.env.DEV
    },
    global: {
      headers: {
        'x-application-name': 'ai-sales-coach',
      },
    },
  }
);

// Export a function to check if Supabase is properly initialized
export const isSupabaseInitialized = () => {
  return Boolean(supabase?.config?.supabaseUrl && supabase?.config?.supabaseKey);
};