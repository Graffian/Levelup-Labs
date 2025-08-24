import { supabase } from "./SimpleSupabaseClient"
async function SignificantProgressDelete(moduleId: number, userId: string, currentCourse: string, currentModule: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase.from("significant_user_progress")
                                       .delete()
                                       .eq("module_id", moduleId)
                                       .eq("user_id", userId)
                                       .eq("current_course", currentCourse)
                                       .eq("current_module", currentModule)

        if (error) {
            console.error("Delete failed:", error.message)
            return { success: false, error: error.message }
        }

        console.log("Successfully deleted progress")
        return { success: true }
    } catch (error) {
        console.error("Delete error:", error)
        return { success: false, error: "Failed to delete progress" }
    }
}



async function SignificantProgressCheck(userId: string): Promise<any[]> {
    try {
        const { data, error } = await supabase.from("significant_user_progress")
                                             .select("*")
                                             .eq("user_id", userId)

        if (error) {
            console.error("Fetch failed:", error.message)
            return []
        }

        return data || []
    } catch (error) {
        console.error("Check error:", error)
        return []
    }
}



async function SignificantProgressInsert(
    userId: string,
    learningGoal: string,
    currentCourse: string,
    currentModule: string,
    totalModulesInCourse: number,
    isCompleted: boolean,
    moduleId: number
): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
        const { data, error } = await supabase.from("significant_user_progress")
                                             .insert([
                                                {
                                                    user_id: userId,
                                                    learning_goal: learningGoal,
                                                    current_course: currentCourse,
                                                    current_module: currentModule,
                                                    total_modules_in_course: totalModulesInCourse,
                                                    is_completed: isCompleted,
                                                    module_id: moduleId
                                                }
                                             ])
                                             .select()

        if (error) {
            console.error("Insert error:", error.message)
            return { success: false, error: error.message }
        }

        console.log("Data inserted:", data)
        return { success: true, data }
    } catch (error) {
        console.error("Insert error:", error)
        return { success: false, error: "Failed to insert progress" }
    }
}


export {
    SignificantProgressCheck,
    SignificantProgressDelete,
    SignificantProgressInsert
}
