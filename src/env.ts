// This file is used to handle environment variables during build time
// For GitHub Pages deployment, we need to handle environment variables properly

// Log environment variables for debugging (without exposing sensitive values)
if (typeof window === 'undefined') { // Only log on server-side
  console.log('Environment variables check:');
  console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export const env = {
  // Use environment variables with fallbacks
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcucidwtnhlsouvjfpqt.supabase.co',
  // Note: In a real production app, you would NOT hardcode the anon key like this
  // This is only for demonstration purposes
  // The actual key will be provided by GitHub Secrets during the build process
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
}; 