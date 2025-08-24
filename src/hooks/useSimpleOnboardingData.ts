import { useState, useEffect } from 'react';
import { supabase } from '@/components/database/progress/SimpleSupabaseClient';

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
        const { data: onboardingData, error: fetchError } = await supabase
          .from('onboarding_data')
          .select('learning_goal, time_commitment, experience_level')
          .eq('clerk_user_id', userId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching onboarding data:', fetchError);
          setError(`Failed to fetch onboarding data: ${fetchError.message}`);
          setData(null);
        } else if (onboardingData) {
          setData(onboardingData);
          setError(null);
        } else {
          // No onboarding data found, set default values
          setData({
            learning_goal: 'General Learning',
            time_commitment: 'moderate',
            experience_level: 'beginner'
          });
          setError(null);
        }
      } catch (err) {
        console.error('Unexpected error fetching onboarding data:', err);
        setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        // Set default values on error
        setData({
          learning_goal: 'General Learning',
          time_commitment: 'moderate', 
          experience_level: 'beginner'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingData();
  }, [userId]);

  return { data, loading, error };
};
