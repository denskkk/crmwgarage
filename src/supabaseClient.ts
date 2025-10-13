import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';

const supabaseUrl = supabaseConfig.url;
const supabaseAnonKey = supabaseConfig.anonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing. Copy .env.example to .env.local and fill in your project details.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const ORGANIZATION_ID = supabaseConfig.organizationId;

// Helper: get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Helper: get current session
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
