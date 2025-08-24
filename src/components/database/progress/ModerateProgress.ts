import {createClient} from "@supabase/supabase-js"

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_PROJECT_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
)
async function ModerateProgressDelete(moduleId , clerkUserId , currentCourse , currentModule){
    const {error} = await supabase.from("moderate_user_progress")
                                   .delete()
                                   .eq("module_id" , moduleId)
                                   .eq("clerk_user_id" , clerkUserId)
                                   .eq("current_course" , currentCourse)
                                   .eq("current_module" , currentModule)

    if (error){
        console.error("delete failed" , error.message)
    }else{
        console.log("Successfull delete")
    }
}



async function ModerateProgressCheck(clerkUserId){
    const {data , error} = await supabase.from("moderate_user_progress")
                                         .select("*")
                                         .eq("clerk_user_id" , clerkUserId)

    if (error){
        console.error("Fetch failed" , error.message);
        return []
    }

    return data
}



async function ModerateProgressInsert(clerkUserId , learningGoal , currentCourse , currentModule , totalModulesInCourse ,isCompleted , moduleId){
    const {data , error} = await supabase.from("moderate_user_progress")
                                         .insert([
                                            {
                                                clerk_user_id : clerkUserId,
                                                learning_goal : learningGoal,
                                                current_course : currentCourse,
                                                current_module : currentModule,
                                                total_modules_in_course : totalModulesInCourse,
                                                is_completed : isCompleted,
                                                module_id : moduleId
                                            }
                                         ])
    
    if (error){
        console.error("Insert error" , error.message)
    }else{
        console.log("data inserted" , data)
    }
}


export {
    ModerateProgressCheck,
    ModerateProgressDelete,
    ModerateProgressInsert
}