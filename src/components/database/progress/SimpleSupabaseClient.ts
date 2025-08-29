import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_PROJECT_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && key && /^https?:\/\//.test(url))

// Simple Supabase client for progress operations (no JWT/auth)
const supabase = createClient(
    url || '',
    key || ''
)

export { supabase }
