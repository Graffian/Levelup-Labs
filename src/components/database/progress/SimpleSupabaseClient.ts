import { createClient } from "@supabase/supabase-js"

// Simple Supabase client for progress operations (no JWT/auth)
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_PROJECT_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export { supabase }
