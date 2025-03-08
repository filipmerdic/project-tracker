import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';

// Use our env file for environment variables
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log the URL (but not the key for security reasons)
console.log('Initializing Supabase client with URL:', supabaseUrl);
console.log('Supabase key available:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 