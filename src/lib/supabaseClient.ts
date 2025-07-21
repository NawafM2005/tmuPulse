import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://znvxemmeltezycyzfobo.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudnhlbW1lbHRlenljeXpmb2JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDMwMTMsImV4cCI6MjA2ODM3OTAxM30.kXxs3NepH3BwnbD87JXEqoNJNGXU-q2tyciC0Vgy1Gw"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
