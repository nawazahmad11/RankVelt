import { createClient } from '@supabase/supabase-js';

// Hum variables ke wahi naam use kar rahe hain jo .env mein hain
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);