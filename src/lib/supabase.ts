import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
// You'll get these values when you create a new project in Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Log the URL (but not the key for security reasons)
console.log('Initializing Supabase client with URL:', supabaseUrl);
console.log('Supabase key available:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 