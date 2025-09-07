import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import supabase from '@/components/database/SupabaseSetup';

interface OnboardingData {
  learning_goal: string | null;
  time_commitment: string | null;
  experience_level: string | null;
}

export const useOnboardingData = () => {
  const { userId } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOnboardingData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('onboarding_data')
          .select('learning_goal, time_commitment, experience_level')
          .eq('clerk_user_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching onboarding data:', error);
          setError(error.message);
        } else if (data) {
          setOnboardingData(data);
        } else {
          setOnboardingData(null);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Failed to fetch onboarding data');
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingData();
  }, [userId]);

  return { onboardingData, loading, error };
};
