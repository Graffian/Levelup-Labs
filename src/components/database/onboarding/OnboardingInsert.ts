import { createSupabaseClient } from "../SupabaseSetup";

interface OnboardingData {
  clerk_user_id: string;
  learning_goal: string;
  time_commitment: string;
  experience_level: string;
}

interface OnboardingInsertResult {
  success: boolean;
  data?: any;
  error?: Error;
}

async function OnboardingInsert(
  getToken: () => Promise<string | null>,
  onboardingData: Omit<OnboardingData, 'clerk_user_id'> & { clerk_user_id: string }
): Promise<OnboardingInsertResult> {
  try {
    const getAuthenticatedClient = await createSupabaseClient(getToken);
    const supabaseWithSession = await getAuthenticatedClient();
    
    const { data, error } = await supabaseWithSession
      .from("onboarding_data")
      .insert([{
        clerk_user_id: onboardingData.clerk_user_id,
        learning_goal: onboardingData.learning_goal,
        time_commitment: onboardingData.time_commitment,
        experience_level: onboardingData.experience_level
      }])
      .select()
      .single();

    if (error) {
      console.error("Error inserting onboarding data:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error in OnboardingInsert:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
}

export default OnboardingInsert;