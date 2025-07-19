// src/utils/useSupabase.js
import { createClient } from '@supabase/supabase-js'
import { useSession } from '@clerk/clerk-react'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export default function useSupabase() {
  const { session } = useSession()

  // each request will call this to get the latest Clerk JWT
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    // new v2 API: provide a token‐getter
    accessToken: async () => {
      return (await session?.getToken()) ?? null
    },

    // optional—but recommended—auth settings
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: true,
    },
  })

  return supabase
}
