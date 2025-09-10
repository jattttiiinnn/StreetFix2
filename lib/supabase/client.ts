import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallback to hardcoded values from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qcshueykyqdkbrlydymr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjc2h1ZXlreXFka2JybHlkeW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NzcyMTIsImV4cCI6MjA3MzA1MzIxMn0.GMo6HbGn_zSPC_mtS7eOGcJf0skY26Ymd9Q0FV4e6K4';

// Debug environment variables
console.log('Supabase URL being used:', supabaseUrl);
console.log('Supabase Anon Key being used:', supabaseAnonKey);

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase Anon Key');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-application-name': 'StreetFix Web App'
      }
    }
  }
);

// Add error logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});
