import { createSupabaseClient } from "../SupabaseSetup";

interface OnboardingData {
  clerk_user_id: string;
  learning_goal: string;
  time_commitment: string;
  experience_level: string;
}

interface OnboardingCheckResult {
  exists: boolean;
  needsUpdate?: boolean;
  data?: Partial<OnboardingData>;
  error?: Error;
}

async function OnboardingCheck(
  getToken: () => Promise<string | null>,
  clerkUserId: string,
  learningGoal?: string,
  timeCommitment?: string,
  experienceLevel?: string
): Promise<OnboardingCheckResult> {
  try {
    const getAuthenticatedClient = await createSupabaseClient(getToken);
    const supabaseWithSession = await getAuthenticatedClient();
    
    // First, check if the user has existing onboarding data
    const { data, error } = await supabaseWithSession
      .from("onboarding_data")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // Ignore "not found" errors
      console.error("Error checking onboarding data:", error);
      return { exists: false, error };
    }

    // If no data found, return exists: false
    if (!data) {
      return { exists: false };
    }

    // If checking for specific values, verify if an update is needed
    if (learningGoal !== undefined && timeCommitment !== undefined && experienceLevel !== undefined) {
      const needsUpdate = 
        data.learning_goal !== learningGoal ||
        data.time_commitment !== timeCommitment ||
        data.experience_level !== experienceLevel;

      if (needsUpdate) {
        const { error: updateError } = await supabaseWithSession
          .from("onboarding_data")
          .update({
            learning_goal: learningGoal,
            time_commitment: timeCommitment,
            experience_level: experienceLevel,
          })
          .eq("clerk_user_id", clerkUserId);

        if (updateError) {
          console.error("Error updating onboarding data:", updateError);
          return { 
            exists: true, 
            needsUpdate: true, 
            data: data as OnboardingData,
            error: updateError 
          };
        }

        // Return the updated data
        return { 
          exists: true, 
          needsUpdate: true, 
          data: { 
            ...data, 
            learning_goal: learningGoal,
            time_commitment: timeCommitment,
            experience_level: experienceLevel
          } as OnboardingData
        };
      }
    }

    // Return existing data if no update was needed
    return { 
      exists: true, 
      needsUpdate: false, 
      data: data as OnboardingData 
    };
  } catch (error) {
    console.error("Unexpected error in OnboardingCheck:", error);
    return { 
      exists: false, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
}

export default OnboardingCheck;
