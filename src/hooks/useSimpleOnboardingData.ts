import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/components/database/progress/SimpleSupabaseClient';

interface OnboardingData {
  learning_goal: string | null;
  time_commitment: string | null;
  experience_level: string | null;
}

export const useSimpleOnboardingData = (userId: string | null) => {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOnboardingData = async () => {
      // Read from URL parameters first
      const urlParams = new URLSearchParams(window.location.search);
      const goalFromUrl = urlParams.get('goal');
      const timeCommitmentFromUrl = urlParams.get('timeCommitment');
      const experienceFromUrl = urlParams.get('experience');

      if (!userId) {
        // If no userId, still set data from URL parameters
        setData({
          learning_goal: goalFromUrl || 'General Learning',
          time_commitment: timeCommitmentFromUrl || 'moderate',
          experience_level: experienceFromUrl || 'beginner'
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        if (!isSupabaseConfigured) {
          setData({
            learning_goal: goalFromUrl || 'General Learning',
            time_commitment: timeCommitmentFromUrl || 'moderate',
            experience_level: experienceFromUrl || 'beginner'
          });
          setError(null);
          return;
        }
        const { data: onboardingData, error: fetchError } = await supabase
          .from('onboarding_data')
          .select('learning_goal, time_commitment, experience_level')
          .eq('clerk_user_id', userId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching onboarding data:', { message: fetchError.message, code: (fetchError as any).code, details: (fetchError as any).details });
          setError(`Failed to fetch onboarding data: ${fetchError.message}`);
          // Use URL parameters as fallback on error
          setData({
            learning_goal: goalFromUrl || 'General Learning',
            time_commitment: timeCommitmentFromUrl || 'moderate',
            experience_level: experienceFromUrl || 'beginner'
          });
        } else if (onboardingData) {
          // Prioritize URL parameters over database data
          setData({
            learning_goal: goalFromUrl || onboardingData.learning_goal || 'General Learning',
            time_commitment: timeCommitmentFromUrl || onboardingData.time_commitment || 'moderate',
            experience_level: experienceFromUrl || onboardingData.experience_level || 'beginner'
          });
          setError(null);
        } else {
          // No onboarding data found, use URL parameters or defaults
          setData({
            learning_goal: goalFromUrl || 'General Learning',
            time_commitment: timeCommitmentFromUrl || 'moderate',
            experience_level: experienceFromUrl || 'beginner'
          });
          setError(null);
        }
      } catch (err) {
        console.error('Unexpected error fetching onboarding data:', err);
        setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        // Set values from URL parameters or defaults on error
        setData({
          learning_goal: goalFromUrl || 'General Learning',
          time_commitment: timeCommitmentFromUrl || 'moderate',
          experience_level: experienceFromUrl || 'beginner'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingData();
  }, [userId]);

  return { data, loading, error };
};
