import { useSupabase } from './useSupabase';
import { useUser } from '@clerk/clerk-react';
import { useCallback } from 'react';

export const useDatabase = () => {
  const supabase = useSupabase();
  const { user } = useUser();

  // Login Check
  const checkLogin = useCallback(async (clerkUserId: string) => {
    try {
      console.log("Checking clerk user id:", clerkUserId);
      const { data, error } = await supabase
        .from("user_login_credentials")
        .select("*")
        .eq("clerk_user_id", clerkUserId);
        
      if (error) {
        console.error("Error checking user:", error);
        return false;
      }
      
      console.log("Data found:", data);
      return data && data.length > 0;
    } catch (error) {
      console.error("Login check failed:", error);
      return false;
    }
  }, [supabase]);

  // Login Insert
  const insertLogin = useCallback(async (
    clerkUserId: string, 
    emailAddress: string, 
    fullName: string, 
    userName: string
  ) => {
    try {
      const { data, error } = await supabase
        .from("user_login_credentials")
        .insert([{
          clerk_user_id: clerkUserId,
          email_address: emailAddress,
          fullname: fullName,
          username: userName
        }]);
        
      if (error) {
        console.error("Login credentials insert error:", error);
        return false;
      } else {
        console.log("Successful login credentials insert:", data);
        return true;
      }
    } catch (error) {
      console.error("Login insert failed:", error);
      return false;
    }
  }, [supabase]);

  // Onboarding Check
  const checkOnboarding = useCallback(async (
    clerkUserId: string,
    learningGoal: string,
    timeCommitment: string,
    experienceLevel: string
  ): Promise<boolean> => {
    try {
      console.log("Checking clerkUserId in onboarding_data:", clerkUserId);

      const { data, error } = await supabase
        .from("onboarding_data")
        .select("*")
        .eq("clerk_user_id", clerkUserId)
        .maybeSingle();

      if (error) {
        console.error("Unexpected error while fetching onboarding data:", error);
        return false;
      }

      if (!data) {
        console.log("User not found in onboarding_data, needs insert.");
        return false;
      }

      console.log("Existing onboarding data:", data);

      const shouldUpdate =
        (data.learning_goal !== null && data.learning_goal !== learningGoal) ||
        (data.time_commitment !== null && data.time_commitment !== timeCommitment) ||
        (data.experience_level !== null && data.experience_level !== experienceLevel);

      if (shouldUpdate) {
        const { error: updateError } = await supabase
          .from("onboarding_data")
          .update({
            learning_goal: learningGoal,
            time_commitment: timeCommitment,
            experience_level: experienceLevel,
          })
          .eq("clerk_user_id", clerkUserId);

        if (updateError) {
          console.error("Error updating onboarding data:", updateError);
          return false;
        } else {
          console.log("Successfully updated onboarding data.");
          return true;
        }
      } else {
        console.log("No update needed — data already matches or fields are null.");
        return true;
      }
    } catch (error) {
      console.error("Onboarding check failed:", error);
      return false;
    }
  }, [supabase]);

  // Onboarding Insert
  const insertOnboarding = useCallback(async (
    clerkUserId: string,
    learningGoal: string,
    timeCommitment: string,
    experienceLevel: string
  ) => {
    try {
      const { data, error } = await supabase
        .from("onboarding_data")
        .insert([{
          clerk_user_id: clerkUserId,
          learning_goal: learningGoal,
          time_commitment: timeCommitment,
          experience_level: experienceLevel
        }]);
        
      if (error) {
        console.error("Onboarding data insert error:", error);
        return false;
      } else {
        console.log("Successful onboarding data insert:", data);
        return true;
      }
    } catch (error) {
      console.error("Onboarding insert failed:", error);
      return false;
    }
  }, [supabase]);

  // Generic Progress Functions
  const checkProgress = useCallback(async (tableName: string, clerkUserId: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("clerk_user_id", clerkUserId);

      if (error) {
        console.error("Fetch failed:", error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Progress check failed:", error);
      return [];
    }
  }, [supabase]);

  const insertProgress = useCallback(async (
    tableName: string,
    clerkUserId: string,
    learningGoal: string,
    currentCourse: string,
    currentModule: string,
    totalModulesInCourse: number,
    isCompleted: boolean,
    moduleId: number
  ) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert([{
          clerk_user_id: clerkUserId,
          learning_goal: learningGoal,
          current_course: currentCourse,
          current_module: currentModule,
          total_modules_in_course: totalModulesInCourse,
          is_completed: isCompleted,
          module_id: moduleId
        }]);

      if (error) {
        console.error("Insert error:", error.message);
        return false;
      } else {
        console.log("Data inserted:", data);
        return true;
      }
    } catch (error) {
      console.error("Progress insert failed:", error);
      return false;
    }
  }, [supabase]);

  const deleteProgress = useCallback(async (
    tableName: string,
    moduleId: number,
    clerkUserId: string,
    currentCourse: string,
    currentModule: string
  ) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("module_id", moduleId)
        .eq("clerk_user_id", clerkUserId)
        .eq("current_course", currentCourse)
        .eq("current_module", currentModule);

      if (error) {
        console.error("Delete failed:", error.message);
        return false;
      } else {
        console.log("Successful delete");
        return true;
      }
    } catch (error) {
      console.error("Progress delete failed:", error);
      return false;
    }
  }, [supabase]);

  // Helper functions for specific commitment levels
  const getProgressTableName = useCallback((timeCommitment: string): string => {
    const tableMap: Record<string, string> = {
      minimal: 'minimal_user_progress',
      moderate: 'moderate_user_progress', 
      significant: 'significant_user_progress',
      intensive: 'intensive_user_progress'
    };
    return tableMap[timeCommitment] || 'moderate_user_progress';
  }, []);

  return {
    // Auth functions
    checkLogin,
    insertLogin,
    
    // Onboarding functions
    checkOnboarding,
    insertOnboarding,
    
    // Progress functions
    checkProgress,
    insertProgress,
    deleteProgress,
    getProgressTableName,
    
    // Direct supabase access if needed
    supabase,
    
    // Current user
    currentUser: user
  };
};