/**
 * Supabase Client for Server Components
 * Creates a server-side Supabase client using the standard client
 */

import { createClient } from "@supabase/supabase-js"

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env.local file."
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

