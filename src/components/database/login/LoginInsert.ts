import { supabase } from "../SupabaseSetup"

interface UserData {
    clerk_user_id: string;
    email_address: string;
    fullname?: string | null;
    username?: string | null;
}

interface LoginInsertResult {
    success: boolean;
    data?: any;
    error?: Error;
}

async function LoginInsert(userData: UserData): Promise<LoginInsertResult> {
    try {
        const { data, error } = await supabase
            .from("user_login_credentials")
            .insert([{
                clerk_user_id: userData.clerk_user_id,
                email_address: userData.email_address,
                fullname: userData.fullname || '',
                username: userData.username || userData.email_address.split('@')[0]
            }])
            .select()
            .single()

        if (error) {
            console.error("Error inserting user:", error)
            return { 
                success: false, 
                error: error as Error 
            }
        }

        return { 
            success: true, 
            data 
        }
    } catch (error) {
        console.error("Error in LoginInsert:", error)
        return { 
            success: false, 
            error: error as Error 
        }
    }
}

export default LoginInsert