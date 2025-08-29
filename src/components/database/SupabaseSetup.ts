import { createClient } from "@supabase/supabase-js"

// Create a regular Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && /^https?:\/\//.test(String(supabaseUrl)))

const safeFetch: typeof fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const f = (globalThis.fetch || window.fetch).bind(globalThis) as typeof fetch
  const res = await f(input, init)
  try {
    return res.clone()
  } catch {
    return res
  }
}

export const supabase = createClient(String(supabaseUrl || ''), String(supabaseAnonKey || ''), {
  global: {
    fetch: safeFetch
  }
})

// Create a function that returns a function to get Supabase client with Clerk session
export const createSupabaseClient = (getToken: () => Promise<string | null>) => {
  return async () => {
    try {
      const token = await getToken()
      
      if (!token) {
        console.error('No token available')
        return supabase
      }

      return createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`
            },
            fetch: safeFetch
          }
        }
      )
    } catch (error) {
      console.error('Error creating Supabase client:', error)
      return supabase
    }
  }
}

export default supabase
