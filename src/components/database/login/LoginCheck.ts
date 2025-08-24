import { supabase } from "../SupabaseSetup"

interface LoginCheckResult {
  exists: boolean;
  data?: any;
  error?: Error;
}

async function LoginCheck(clerkUserId: string): Promise<LoginCheckResult> {
    try {
        const { data, error } = await supabase
            .from("user_login_credentials")
            .select("*")
            .eq("clerk_user_id", clerkUserId)
            .single()
            
        if (error && error.code !== 'PGRST116') { // Ignore "not found" errors
            console.error("Error checking user:", error)
            return { exists: false, error: error as Error }
        }
        
        return { 
            exists: !!data, 
            data: data || null 
        }
    } catch (error) {
        console.error("Error in LoginCheck:", error)
        return { 
            exists: false, 
            error: error as Error 
        }
    }
}

export default LoginCheck