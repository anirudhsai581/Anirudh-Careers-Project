import { createClient } from '@supabase/supabase-js'
import { useSession } from '@clerk/clerk-react'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Returns a Supabase client that injects the Clerk token into each request.
 */
export default function useSupabase() {
  const { session } = useSession()

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      // Override fetch to add Authorization header
      fetch: async (url, options = {}) => {
        const token = await session?.getToken()
        const headers = new Headers(options.headers)
        if (token) headers.set('Authorization', `Bearer ${token}`)

        return fetch(url, { ...options, headers })
      }
    }
  })

  return supabase;
}
