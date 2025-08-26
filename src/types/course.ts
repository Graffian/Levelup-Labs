import { LucideIcon } from "lucide-react";

export interface Video {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  playlistUrl: string;
  completed: boolean;
  videos?: Video[];
}

export interface CourseData {
  title: string;
  description: string;
  duration: string;
  level: string;
  icon: LucideIcon;
  gradient: string;
  totalModules: number;
  modules: Module[];
}

export interface TimeCommitmentConfig {
  [key: string]: {
    name: string;
    badge: {
      color: string;
      text: string;
    };
    description: string;
    sessionLength: string;
    gradient: string;
    bgColor: string;
    intensity: string;
  };
}

export interface PlaylistData {
  [courseId: string]: {
    [moduleTitle: string]: string;
  };
}

export interface PlaylistsByTimeCommitment {
  [timeCommitment: string]: PlaylistData;
}

export type TimeCommitmentLevel = 'minimal' | 'moderate' | 'significant' | 'intensive';

export interface ProgressRecord {
  module_id: number;
  current_course: string;
  learning_goal: string;
  is_completed: boolean;
  // Add other fields that might be in the progress record
}

// Progress function signatures based on actual database module implementations
type ProgressCheckFunction = (clerkUserId: string) => Promise<Array<{ module_id: number }>>;
type ProgressDeleteFunction = (moduleId: number, clerkUserId: string, currentCourse: string, currentModule: string) => Promise<void>;
type ProgressInsertFunction = (
  clerkUserId: string,
  learningGoal: string,
  currentCourse: string,
  currentModule: string,
  totalModulesInCourse: number,
  isCompleted: boolean,
  moduleId: number
) => Promise<void>;

export interface ProgressFunctions {
  check: (params: { userId: string }) => Promise<Array<{ module_id: number }>>;
  delete: (params: { moduleId: number; userId: string; currentCourse: string; currentModule: string }) => Promise<void>;
  insert: (params: {
    userId: string;
    learningGoal: string;
    currentCourse: string;
    currentModule: string;
    totalModulesInCourse: number;
    isCompleted: boolean;
    moduleId: number;
  }) => Promise<void>;
  getCompleted?: (userId: string) => Promise<Array<{ module_id: number }>>;
}

export interface ProgressComponents {
  MinimalProgressCheck: ProgressCheckFunction;
  MinimalProgressDelete: ProgressDeleteFunction;
  MinimalProgressInsert: ProgressInsertFunction;
  ModerateProgressCheck: ProgressCheckFunction;
  ModerateProgressDelete: ProgressDeleteFunction;
  ModerateProgressInsert: ProgressInsertFunction;
  SignificantProgressCheck: ProgressCheckFunction;
  SignificantProgressDelete: ProgressDeleteFunction;
  SignificantProgressInsert: ProgressInsertFunction;
  IntensiveProgressCheck: ProgressCheckFunction;
  IntensiveProgressDelete: ProgressDeleteFunction;
  IntensiveProgressInsert: ProgressInsertFunction;
}
