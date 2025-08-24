import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useDatabase } from './useDatabase';

type OnboardingData = {
  learning_goal: string;
  time_commitment: string;
  experience_level: string;
};

export const useOnboarding = () => {
  const { userId } = useAuth();
  const { query, insert, update } = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getOnboardingData = useCallback(async () => {
    if (!userId) {
      const err = new Error('No user ID available');
      setError(err);
      return { data: null, error: err };
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await query('user_profiles', {
        where: { clerk_user_id: userId },
        single: true
      });

      if (queryError) throw queryError;
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching onboarding data:', err);
      setError(err as Error);
      return { data: null, error: err as Error };
    } finally {
      setLoading(false);
    }
  }, [userId, query]);

  const saveOnboarding = useCallback(async (data: OnboardingData) => {
    if (!userId) {
      const err = new Error('No user ID available');
      setError(err);
      return { error: err };
    }

    setLoading(true);
    setError(null);

    try {
      // Check if profile exists
      const { data: existingProfile } = await query('user_profiles', {
        where: { clerk_user_id: userId },
        single: true
      });

      let result;
      if (existingProfile) {
        // Update existing profile
        result = await update('user_profiles', existingProfile.id, data);
      } else {
        // Create new profile
        result = await insert('user_profiles', {
          ...data,
          clerk_user_id: userId
        });
      }

      return result;
    } catch (err) {
      console.error('Error saving onboarding data:', err);
      setError(err as Error);
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  }, [userId, query, insert, update]);

  return {
    getOnboardingData,
    saveOnboarding,
    loading,
    error
  };
};
