import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_PROJECT_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && key && /^https?:\/\//.test(url))

const safeFetch: typeof fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const f = (globalThis.fetch || window.fetch).bind(globalThis) as typeof fetch
  const res = await f(input, init)
  try {
    return res.clone()
  } catch {
    return res
  }
}

// Simple Supabase client for progress operations (no JWT/auth)
const supabase = createClient(
    url || '',
    key || '',
    { global: { fetch: safeFetch } }
)

export { supabase }
