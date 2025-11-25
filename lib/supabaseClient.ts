
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: The user provided these keys directly.
// In a real-world application, these should NEVER be hardcoded.
// Use environment variables like process.env.NEXT_PUBLIC_SUPABASE_URL.
const supabaseUrl = 'https://dusxggtgjjmmdkeckzvk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1c3hnZ3RnamptbWRrZWNrenZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NzA5NjQsImV4cCI6MjA3OTU0Njk2NH0.vcRyf8jucqriqY9wd8l1SLWGDJ9opo32jkeazE6LHLw';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

console.log('[DEBUG] Initializing Supabase client...');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('[DEBUG] Supabase client initialized.');
