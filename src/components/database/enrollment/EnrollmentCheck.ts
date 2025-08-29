import { createSupabaseClient } from '@/components/database/SupabaseSetup'

export interface EnrollmentCheckResult {
  enrolled: boolean
  error?: Error
}

async function EnrollmentCheck(getToken: () => Promise<string | null>, clerkUserId: string): Promise<EnrollmentCheckResult> {
  try {
    const getAuthenticatedClient = await createSupabaseClient(getToken)
    const supabaseWithSession = await getAuthenticatedClient()

    const { data, error } = await supabaseWithSession
      .from('user_course_enrollments')
      .select('clerk_user_id')
      .eq('clerk_user_id', clerkUserId)
      .limit(1)

    if (error) {
      return { enrolled: false, error }
    }

    return { enrolled: !!data && data.length > 0 }
  } catch (error) {
    return { enrolled: false, error: error as Error }
  }
}

export default EnrollmentCheck
