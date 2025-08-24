import { useAuth } from '@clerk/clerk-react';
import { createClerkSupabaseClient } from '@/components/database/SupabaseSetup';
import { useMemo } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const useSupabase = (): SupabaseClient => {
  const { getToken } = useAuth();
  
  const supabase = useMemo(() => {
    if (!getToken) {
      // Fallback to regular supabase client if not authenticated
      return createClient(
        import.meta.env.VITE_SUPABASE_PROJECT_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
    }
    return createClerkSupabaseClient(getToken);
  }, [getToken]);
  
  return supabase;
};