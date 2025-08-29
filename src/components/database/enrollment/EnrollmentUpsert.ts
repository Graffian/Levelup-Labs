import { createSupabaseClient } from '@/components/database/SupabaseSetup'

export interface EnrollmentPayload {
  clerk_user_id: string
  learning_goal: string
  current_path: string
  current_course: string
  total_modules_in_course: number
}

export interface EnrollmentUpsertResult {
  success: boolean
  error?: Error
}

async function EnrollmentUpsert(getToken: () => Promise<string | null>, payload: EnrollmentPayload): Promise<EnrollmentUpsertResult> {
  try {
    const getAuthenticatedClient = await createSupabaseClient(getToken)
    const supabaseWithSession = await getAuthenticatedClient()

    const { error } = await supabaseWithSession
      .from('user_course_enrollments')
      .upsert(payload, { onConflict: 'clerk_user_id' })

    if (error) {
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

export default EnrollmentUpsert
