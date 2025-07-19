// src/hooks/use-fetch.js
import { useSession } from "@clerk/clerk-react"
import { useState, useMemo, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export default function useFetch(cb, options = {}) {
  const { session } = useSession()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  // 1) Memoize the Supabase client until Clerk's session changes
  const supabase = useMemo(() => {
    return createClient(URL, KEY, {
      accessToken: async () => (await session?.getToken()) ?? null,
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: true,
      },
    })
  }, [session])

  // 2) Stable fetch function
  const fn = useCallback(async (...args) => {
    setLoading(true)
    setError(null)

    try {
      const result = await cb(supabase, options, ...args)
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [supabase, cb, JSON.stringify(options)])

  return { data, loading, error, fn }
}
