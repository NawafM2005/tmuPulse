import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.db_url
const supabaseAnonKey = process.env.db_key

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Error initializing Supabase: Missing environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
