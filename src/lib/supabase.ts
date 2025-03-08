import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';

// Use our env file for environment variables
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log the URL (but not the key for security reasons)
if (typeof window === 'undefined') { // Only log on server-side
  console.log('Initializing Supabase client with URL:', supabaseUrl);
  console.log('Supabase key available:', !!supabaseAnonKey);
}

// Create a dummy client if credentials are missing (for build process)
let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing, creating mock client');
  
  // Mock Supabase client for build process
  const mockClient = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
      eq: () => ({ select: () => Promise.resolve({ data: [], error: null }) })
    })
  };
  
  // @ts-ignore - This is a mock client
  supabase = mockClient;
} else {
  // Create real Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase }; 