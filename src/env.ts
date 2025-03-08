// This file is used to handle environment variables during build time
// For GitHub Pages deployment, we need to hardcode the environment variables
// In a real production environment, you would use a proper environment variable system

export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcucidwtnhlsouvjfpqt.supabase.co',
  // Note: In a real production app, you would NOT hardcode the anon key like this
  // This is only for demonstration purposes
  // The actual key will be provided by GitHub Secrets during the build process
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY_WILL_BE_INJECTED_BY_GITHUB_ACTIONS',
}; 