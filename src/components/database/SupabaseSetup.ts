import { createClient } from "@supabase/supabase-js"

// Create a regular Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
            }
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
