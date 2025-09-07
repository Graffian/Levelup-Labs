import { supabase } from './SimpleSupabaseClient'

async function MinimalProgressDelete(moduleId: number, userId: string, currentCourse: string, currentModule: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase.from("minimal_user_progress")
                                       .delete()
                                       .eq("module_id", moduleId)
                                       .eq("clerk_user_id", userId)
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

async function MinimalProgressCheck(userId: string): Promise<any[]> {
    try {
        const { data, error } = await supabase.from("minimal_user_progress")
                                             .select("*")
                                             .eq("clerk_user_id", userId)

        if (error) {
            console.error("Fetch failed:", error.message)
            return []
        }

        return data || []
    } catch (error) {
        console.error('Error checking progress:', error);
        return [];
    }
}

async function MinimalProgressInsert(
    userId: string,
    learningGoal: string,
    currentCourse: string,
    currentModule: string,
    totalModulesInCourse: number,
    isCompleted: boolean,
    moduleId: number
): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
        const { data, error } = await supabase.from("minimal_user_progress")
                                             .insert([
                                                {
                                                    clerk_user_id: userId,
                                                    learning_goal: learningGoal,
                                                    current_course: currentCourse,
                                                    current_module: currentModule,
                                                    total_modules_in_course: totalModulesInCourse,
                                                    is_completed: isCompleted,
                                                    module_id: moduleId,
                                                    video_ids: [] // Initialize as empty array
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

async function MinimalProgressUpdate({
    userId,
    moduleId,
    video_id,
    current_video,
    isCompleted
}: {
    userId: string;
    moduleId: number;
    video_id: string | number;
    current_video: string;
    isCompleted: boolean;
}): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
        // Get existing progress
        const { data: progress, error: fetchError } = await supabase
            .from("minimal_user_progress")
            .select("*")
            .eq("clerk_user_id", userId)
            .eq("module_id", moduleId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }

        // Log the input values for debugging
        console.log('MinimalProgressUpdate called with:', {
            userId,
            moduleId,
            video_id,
            current_video,
            isCompleted,
            existingVideoIds: progress?.video_ids
        });

        // Ensure video_ids is properly initialized as an array of numbers
        let currentVideoIds: number[] = [];
        if (Array.isArray(progress?.video_ids)) {
            // Filter out any non-number values and ensure they're proper numbers
            currentVideoIds = progress.video_ids
                .map(id => typeof id === 'number' ? Math.floor(id) : 0)
                .filter(id => !isNaN(id) && id > 0);
        }
        
        // Extract video ID parts (expecting format like 'html-1-1' or similar)
        let videoIdNum: number = 1; // Default to 1 if we can't determine
        
        if (typeof video_id === 'string') {
            // For format like 'html-1-1' or '1-1' or '1'
            const parts = video_id.split('-');
            
            // Try to get the last number in the ID
            for (let i = parts.length - 1; i >= 0; i--) {
                const num = parseInt(parts[i], 10);
                if (!isNaN(num)) {
                    videoIdNum = num;
                    break;
                }
            }
        } else if (typeof video_id === 'number') {
            videoIdNum = Math.max(1, Math.floor(video_id));
        }
        
        console.log('Processed video ID:', { input: video_id, output: videoIdNum });
        
        // Toggle video ID in the array
        console.log('Current video IDs before update:', currentVideoIds);
        
        const videoIndex = currentVideoIds.indexOf(videoIdNum);
        let updatedVideoIds: number[];
        
        if (videoIndex === -1) {
            // Add the video ID if it's not in the array
            updatedVideoIds = [...currentVideoIds, videoIdNum];
            console.log('Adding video ID:', videoIdNum);
        } else {
            // Remove the video ID if it's already in the array
            updatedVideoIds = currentVideoIds.filter(id => id !== videoIdNum);
            console.log('Removing video ID:', videoIdNum);
        }
        
        // Sort and remove duplicates
        const sanitizedVideoIds = [...new Set(updatedVideoIds)].sort((a, b) => a - b);
        console.log('Final video IDs to store:', sanitizedVideoIds);

        // Update the record
        const { error } = await supabase
            .from("minimal_user_progress")
            .update({
                video_ids: sanitizedVideoIds,
                current_video: current_video,
                is_completed: isCompleted
            })
            .eq("clerk_user_id", userId)
            .eq("module_id", moduleId);

        if (error) throw error;

        return { 
            success: true,
            data: {
                video_ids: sanitizedVideoIds,
                current_video: current_video
            }
        };
    } catch (error) {
        console.error("Update error:", error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

export {
    MinimalProgressCheck,
    MinimalProgressDelete,
    MinimalProgressInsert,
    MinimalProgressUpdate
}