import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Without these env vars the site still renders; only checkout and saved
// progress are disabled. Set them in Netlify to turn those features on.
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(
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
) : null;

// Export a function to check if Supabase is properly initialized
export const isSupabaseInitialized = () => {
  return Boolean(supabase?.config?.supabaseUrl && supabase?.config?.supabaseKey);
};