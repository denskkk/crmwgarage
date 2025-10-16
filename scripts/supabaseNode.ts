import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE env: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for Node scripts');
  process.exit(1);
}

export const supa = createClient(url, serviceKey, {
  auth: { persistSession: false },
});
