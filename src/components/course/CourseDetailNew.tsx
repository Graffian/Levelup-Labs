import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import {
  AlertCircle,
  Clock,
  BookOpen,
  Check,
  Youtube,
  ArrowLeft,
  Users,
  Award,
  Star,
  Play,
  Code2,
  Palette,
  Brain,
  PlayCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Import course data
import { htmlCssMastery } from '@/data/courses/htmlCssMastery';
import { javascriptEssentials } from '@/data/courses/javascriptEssentials';
import { reactCompleteGuide } from '@/data/courses/reactCompleteGuide';
import {
  typescriptReact,
  nodejsExpress,
  databaseSql,
  designPrinciples,
  pythonDataScience
} from '@/data/courses/additionalCourses';
import {
  uxDesign,
  figmaCourse,
  adobeSuite,
  statisticsProbability,
  mlFundamentals,
  deepLearningTensorflow
} from '@/data/courses/remainingCourses';
import { timeCommitmentConfig } from '@/data/timeCommitment';
import { playlistsByTimeCommitment } from '@/data/courses/playlists';

// Import types
import type { 
  CourseData, 
  TimeCommitmentLevel, 
  ProgressFunctions, 
  ProgressRecord 
} from '@/types/course';

// Import hooks
import { useSimpleOnboardingData } from '@/hooks/useSimpleOnboardingData';

// Import progress components from their actual locations
import { MinimalProgressCheck, MinimalProgressDelete, MinimalProgressInsert, MinimalProgressUpdate } from '../database/progress/MinimalProgress';
import {
  ModerateProgressCheck,
  ModerateProgressDelete,
  ModerateProgressInsert
} from '@/components/database/progress/ModerateProgress';
import {
  SignificantProgressCheck,
  SignificantProgressDelete,
  SignificantProgressInsert
} from '@/components/database/progress/SignificantProgress';
import {
  IntensiveProgressCheck,
  IntensiveProgressDelete,
  IntensiveProgressInsert
} from '@/components/database/progress/IntensiveProgress';

// Define the progress functions interface with proper return types
interface ProgressFunctions {
  check: (params: { userId: string }) => Promise<any[]>;
  delete: (params: { 
    moduleId: number; 
    userId: string; 
    currentCourse: string; 
    currentModule: string;
  }) => Promise<{ success: boolean; error?: string }>;
  insert: (params: {
    userId: string;
    learningGoal: string;
    currentCourse: string;
    currentModule: string;
    totalModulesInCourse: number;
    isCompleted: boolean;
    moduleId: number;
  }) => Promise<{ success: boolean; error?: string; data?: any }>;
  update: (params: {
    userId: string;
    moduleId: number;
    video_id: number;
    current_video: string;
    isCompleted: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
}

// Map time commitment levels to their progress functions
const progressFunctions: Record<TimeCommitmentLevel, ProgressFunctions> = {
  minimal: {
    check: async (params: { userId: string }) => {
      const result = await MinimalProgressCheck(params.userId);
      return result || [];
    },
    delete: async (params: { 
      moduleId: number; 
      userId: string; 
      currentCourse: string; 
      currentModule: string;
    }) => {
      return await MinimalProgressDelete(
        params.moduleId,
        params.userId,
        params.currentCourse,
        params.currentModule
      );
    },
    insert: async (params: {
      userId: string;
      learningGoal: string;
      currentCourse: string;
      currentModule: string;
      totalModulesInCourse: number;
      isCompleted: boolean;
      moduleId: number;
    }) => {
      return await MinimalProgressInsert(
        params.userId,
        params.learningGoal,
        params.currentCourse,
        params.currentModule,
        params.totalModulesInCourse,
        params.isCompleted,
        params.moduleId
      );
    },
    update: async (params: {
      userId: string;
      moduleId: number;
      video_id: number;
      current_video: string;
      isCompleted: boolean;
    }) => {
      return await MinimalProgressUpdate({
        userId: params.userId,
        moduleId: params.moduleId,
        video_id: params.video_id,
        current_video: params.current_video,
        isCompleted: params.isCompleted
      });
    }
  },
  moderate: {
    check: async (params: { userId: string }) => {
      const result = await ModerateProgressCheck(params.userId);
      return result || [];
    },
    delete: async (params: { 
      moduleId: number; 
      userId: string; 
      currentCourse: string; 
      currentModule: string;
    }) => {
      return await ModerateProgressDelete(
        params.moduleId,
        params.userId,
        params.currentCourse,
        params.currentModule
      );
    },
    insert: async (params: {
      userId: string;
      learningGoal: string;
      currentCourse: string;
      currentModule: string;
      totalModulesInCourse: number;
      isCompleted: boolean;
      moduleId: number;
    }) => {
      return await ModerateProgressInsert(
        params.userId,
        params.learningGoal,
        params.currentCourse,
        params.currentModule,
        params.totalModulesInCourse,
        params.isCompleted,
        params.moduleId
      );
    },
    update: async (params: {
      userId: string;
      moduleId: number;
      video_id: number;
      current_video: string;
      isCompleted: boolean;
    }) => {
      // Use MinimalProgressUpdate for moderate level as well
      return await MinimalProgressUpdate({
        userId: params.userId,
        moduleId: params.moduleId,
        video_id: params.video_id,
        current_video: params.current_video,
        isCompleted: params.isCompleted
      });
    }
  },
  significant: {
    check: async (params: { userId: string }) => {
      const result = await SignificantProgressCheck(params.userId);
      return result || [];
    },
    delete: async (params: { 
      moduleId: number; 
      userId: string; 
      currentCourse: string; 
      currentModule: string;
    }) => {
      return await SignificantProgressDelete(
        params.moduleId,
        params.userId,
        params.currentCourse,
        params.currentModule
      );
    },
    insert: async (params: {
      userId: string;
      learningGoal: string;
      currentCourse: string;
      currentModule: string;
      totalModulesInCourse: number;
      isCompleted: boolean;
      moduleId: number;
    }) => {
      return await SignificantProgressInsert(
        params.userId,
        params.learningGoal,
        params.currentCourse,
        params.currentModule,
        params.totalModulesInCourse,
        params.isCompleted,
        params.moduleId
      );
    },
    update: async (params: {
      userId: string;
      moduleId: number;
      video_id: number;
      current_video: string;
      isCompleted: boolean;
    }) => {
      // Use MinimalProgressUpdate for significant level as well
      return await MinimalProgressUpdate({
        userId: params.userId,
        moduleId: params.moduleId,
        video_id: params.video_id,
        current_video: params.current_video,
        isCompleted: params.isCompleted
      });
    }
  },
  intensive: {
    check: async (params: { userId: string }) => {
      const result = await IntensiveProgressCheck(params.userId);
      return result || [];
    },
    delete: async (params: { 
      moduleId: number; 
      userId: string; 
      currentCourse: string; 
      currentModule: string;
    }) => {
      return await IntensiveProgressDelete(
        params.moduleId,
        params.userId,
        params.currentCourse,
        params.currentModule
      );
    },
    insert: async (params: {
      userId: string;
      learningGoal: string;
      currentCourse: string;
      currentModule: string;
      totalModulesInCourse: number;
      isCompleted: boolean;
      moduleId: number;
    }) => {
      return await IntensiveProgressInsert(
        params.userId,
        params.learningGoal,
        params.currentCourse,
        params.currentModule,
        params.totalModulesInCourse,
        params.isCompleted,
        params.moduleId
      );
    },
    update: async (params: {
      userId: string;
      moduleId: number;
      video_id: number;
      current_video: string;
      isCompleted: boolean;
    }) => {
      // Use MinimalProgressUpdate for intensive level as well
      return await MinimalProgressUpdate({
        userId: params.userId,
        moduleId: params.moduleId,
        video_id: params.video_id,
        current_video: params.current_video,
        isCompleted: params.isCompleted
      });
    }
  },
};

// Course data mapping
const courseDataMap: Record<string, CourseData> = {
  'html-css-mastery': htmlCssMastery,
  'javascript-essentials': javascriptEssentials,
  'react-complete-guide': reactCompleteGuide,
  'typescript-react': typescriptReact,
  'nodejs-express': nodejsExpress,
  'database-sql': databaseSql,
  'design-principles': designPrinciples,
  'ux-design': uxDesign,
  'figma-course': figmaCourse,
  'adobe-suite': adobeSuite,
  'python-data-science': pythonDataScience,
  'statistics-probability': statisticsProbability,
  'ml-fundamentals': mlFundamentals,
  'deep-learning-tensorflow': deepLearningTensorflow,
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const CourseDetailNew: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const courseId = courseSlug; // Use courseSlug as courseId for consistency
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  // Simple user identification system (no Clerk)
  const [userId, setUserId] = useState<string>('');

  // Initialize user ID on component mount
  useEffect(() => {
    let storedUserId = localStorage.getItem('simple_user_id');
    if (!storedUserId) {
      // Generate a simple unique ID for this user
      storedUserId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('simple_user_id', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  const { data: onboardingData } = useSimpleOnboardingData(userId);

  // Enrollment hooks and logic
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);

  useEffect(() => {
    async function checkEnrollment() {
      if (!userId || !courseId) return;
      // No RLS, so just check by userId and course title
      const { data } = await supabase
        .from('user_course_enrollments')
        .select('clerk_user_id')
        .eq('clerk_user_id', userId)
        .eq('current_course', courseId)
        .maybeSingle();
      setIsEnrolled(!!data);
      if (!data) {
        setCompletedModules(new Set());
        setCompletedVideos(new Set());
        localStorage.removeItem(`courseProgress_${courseId}`);
      }
    }
    if (userId && courseId) checkEnrollment();
  }, [userId, courseId]);

  const handleEnroll = async () => {
    if (!userId || !courseId) return;
    setIsEnrolling(true);
    try {
      const urlParams = new URLSearchParams(location.search);
      const learningGoal = urlParams.get('goal') || onboardingData?.learning_goal || 'General Learning';
      const currentPath = urlParams.get('path') || 'Frontend Fundamentals';
      // No RLS, insert is unrestricted
      const { error } = await supabase
        .from('user_course_enrollments')
        .insert({
          clerk_user_id: userId,
          learning_goal: learningGoal,
          current_path: currentPath,
          current_course: courseId,
          total_modules_in_course: 0,
          course_progress_in_percentage: 0
        });
      if (error) throw error;
      setIsEnrolled(true);
      toast({
        title: 'Enrolled!',
        description: `You are now enrolled in ${courseId}`,
        variant: 'default' as const,
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Could not enroll. Please try again.',
        variant: 'destructive' as const,
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  // Get time commitment from URL or default to 'moderate'
  const timeCommitment = (new URLSearchParams(location.search).get('timeCommitment') || 'moderate') as TimeCommitmentLevel;
  
  const [course, setCourse] = useState<CourseData | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the current time commitment configuration
  const commitmentConfig = timeCommitmentConfig[timeCommitment];
  
    // Get the progress functions for the current time commitment
  const progressFunctionsForCommitment = useMemo(() => {
    const funcs = progressFunctions[timeCommitment];
    return {
      check: (params: { userId: string }) => funcs.check(params),
      delete: (params: { 
        moduleId: number; 
        userId: string; 
        currentCourse: string; 
        currentModule: string;
      }) => funcs.delete(params),
      insert: (params: {
        userId: string;
        learningGoal: string;
        currentCourse: string;
        currentModule: string;
        totalModulesInCourse: number;
        isCompleted: boolean;
        moduleId: number;
      }) => funcs.insert(params),
      update: (params: {
        userId: string;
        moduleId: number;
        video_id: number;
        current_video: string;
        isCompleted: boolean;
      }) => funcs.update(params)
    };
  }, [timeCommitment]);

  // Handle missing course ID
  useEffect(() => {
    if (!courseId) {
      // If no courseId is provided, try to get it from localStorage or use a default
      const savedCourseId = localStorage.getItem('lastVisitedCourseId') || 'html-css-mastery';
      setLoading(true); // Set loading state instead of error
      navigate(`/course/${savedCourseId}`, { replace: true });
      return;
    }

    // Save the current courseId to localStorage for future reference
    localStorage.setItem('lastVisitedCourseId', courseId);
  }, [courseId, navigate]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!courseId) return;

        setLoading(true);

        // Get course data from our mapping
        const courseData = courseDataMap[courseId];
        if (!courseData) {
          throw new Error('Course not found. Redirecting to available courses...');
        }

        // Update module URLs based on time commitment
        const updatedModules = courseData.modules.map(module => {
          const playlistUrl = playlistsByTimeCommitment[timeCommitment]?.[courseId]?.[module.title];
          return {
            ...module,
            playlistUrl: playlistUrl || module.playlistUrl
          };
        });

        setCourse({
          ...courseData,
          modules: updatedModules
        });
        
        // Load completed modules and videos from localStorage as fallback
        const savedProgress = localStorage.getItem(`courseProgress_${courseId}`);
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);

          // Load completed modules
          const completed = new Set<number>();
          progress.modules?.forEach((m: {id: number, completed: boolean}) => {
            if (m.completed) completed.add(m.id);
          });
          setCompletedModules(completed);

          // Load completed videos
          const completedVids = new Set<string>();
          progress.videos?.forEach((v: {id: string, completed: boolean}) => {
            if (v.completed) completedVids.add(v.id);
          });
          setCompletedVideos(completedVids);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course data');
        // Redirect to course dashboard if course is not found
        if (err instanceof Error && err.message.includes('not found')) {
          setTimeout(() => navigate('/course-dashboard'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, timeCommitment, navigate]);

  // Load user's progress from database when userId is available
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!userId || !courseId) return;

      try {
        const userProgress = await progressFunctionsForCommitment.check({ userId });
        const completedModules = new Set<number>();
        const completedVideos = new Set<string>();

        // Process each progress record
        userProgress.forEach((progress: any) => {
          if (progress.current_course === course?.title) {
            // Track completed modules
            if (progress.is_completed) {
              completedModules.add(progress.module_id);
            }
            
            // Track completed videos
            if (Array.isArray(progress.video_ids) && progress.video_ids.length > 0) {
              // For each video ID in the array, construct the full video ID (e.g., 'html-1-1')
              progress.video_ids.forEach((videoNum: number) => {
                // Find the module
                const module = course?.modules.find(m => m.id === progress.module_id);
                if (module) {
                  // Find the video with this number (assuming videoNum is the index + 1)
                  const video = module.videos[videoNum - 1];
                  if (video) {
                    completedVideos.add(video.id);
                  }
                }
              });
            }
          }
        });

        // Update both states
        setCompletedModules(completedModules);
        setCompletedVideos(completedVideos);
        
      } catch (error) {
        console.error('Error loading user progress:', error);
        // Fallback to localStorage if database fails
        const savedProgress = localStorage.getItem(`courseProgress_${courseId}`);
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          const completed = new Set<number>();
          progress.modules?.forEach((m: {id: number, completed: boolean}) => {
            if (m.completed) completed.add(m.id);
          });
          setCompletedModules(completed);
        }
      }
    };

    if (userId && course) {
      loadUserProgress();
    }
  }, [userId, course, progressFunctionsForCommitment, courseId]);

  // Hydrate startedModules from DB/user progress on load
  const [startedModules, setStartedModules] = useState<Record<number, { videoId: number, videoTitle: string, isCompleted: boolean }>>({});

  useEffect(() => {
    if (!userId || !courseId) return;
    const fetchStartedModules = async () => {
      try {
        const userProgress = await progressFunctionsForCommitment.check({ userId });
        const started = {};
        userProgress.forEach(progress => {
          started[progress.module_id] = {
            videoId: progress.video_id ?? 0,
            videoTitle: progress.current_video ?? 'no vids clicked',
            isCompleted: !!progress.is_completed
          };
        });
        setStartedModules(started);
      } catch (e) {
        // fallback: don't hydrate
      }
    };
    fetchStartedModules();
  }, [userId, courseId, progressFunctionsForCommitment]);

  // Add function to start a module
  const handleStartModule = async (moduleId: number) => {
    if (!userId || !courseId || !course) return;
    const currentModule = course.modules.find(m => m.id === moduleId);
    const currentModuleTitle = currentModule?.title || `Module ${moduleId}`;
    const courseTitle = course.title || courseId;
    const urlParams = new URLSearchParams(location.search);
    const learningGoal = urlParams.get('goal') || onboardingData?.learning_goal || 'General Learning';
    const totalModulesInCourse = course.modules.length;
    
    try {
      const insertResult = await progressFunctionsForCommitment.insert({
        userId,
        learningGoal,
        currentCourse: courseTitle,
        currentModule: currentModuleTitle,
        totalModulesInCourse,
        isCompleted: false,
        moduleId
      });
      
      if (insertResult?.success) {
        setStartedModules(prev => ({ 
          ...prev, 
          [moduleId]: { 
            videoId: 0, 
            videoTitle: 'no vids clicked', 
            isCompleted: false 
          } 
        }));
      } else {
        throw new Error(insertResult?.error || 'Failed to start module');
      }
    } catch (error) {
      console.error('Error starting module:', error);
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to start module', 
        variant: 'destructive' 
      });
    }
  };

  const handleVideoClick = async (videoId: string, moduleId: number, videoTitle: string) => {
    if (!userId || !courseId || !course) return;
    
    try {
      // Toggle the video completion state
      const newCompletedVideos = new Set(completedVideos);
      if (newCompletedVideos.has(videoId)) {
        newCompletedVideos.delete(videoId); // Remove if already completed
      } else {
        newCompletedVideos.add(videoId); // Add if not completed
      }
      setCompletedVideos(newCompletedVideos);
    
      const module = course.modules.find(m => m.id === moduleId);
      if (!module) {
        throw new Error('Module not found');
      }
      
      const allCompleted = module.videos.every(v => newCompletedVideos.has(v.id));
      
      // Update progress in the database
      const updateResult = await MinimalProgressUpdate({
        userId,
        moduleId,
        video_id: videoId, // Pass the raw videoId (e.g., 'html-1-1')
        current_video: videoTitle,
        isCompleted: allCompleted
      });
    
      if (updateResult.success) {
        // Calculate and update course progress
        const allVideos = course.modules.flatMap(m => m.videos);
        const totalVideos = allVideos.length;
        const completedCount = Array.from(newCompletedVideos).filter(id => 
          allVideos.some(v => v.id === id)
        ).length;
        
        const newProgress = Math.min(100, Math.round((completedCount / totalVideos) * 100));
    
        // Update course enrollment progress
        const { error: enrollmentError } = await supabase
          .from('user_course_enrollments')
          .update({ 
            course_progress_in_percentage: newProgress
          })
          .eq('clerk_user_id', userId)
          .eq('current_course', courseId);
    
        if (enrollmentError) {
          console.error('Error updating course progress:', enrollmentError);
          throw new Error('Failed to update course progress');
        }
        
        // Update local state to reflect the change
        setStartedModules(prev => ({
          ...prev,
          [moduleId]: {
            ...(prev[moduleId] || {}),
            videoId: parseInt(videoId, 10),
            videoTitle,
            isCompleted: allCompleted,
            completedVideos: Array.from(newCompletedVideos)
          }
        }));
        
        // Show success toast
        toast({
          title: 'Progress saved',
          description: `Watched: ${videoTitle}`,
          variant: 'default'
        });
      } else {
        throw new Error(updateResult.error || 'Failed to update progress');
      }
    } catch (error) {
      console.error('Error in handleVideoClick:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update video progress',
        variant: 'destructive' as const,
      });
    }
  };

  // Calculate progress for a specific module
  const moduleProgress = (moduleId: number): number => {
    if (!course) return 0;
    
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return 0;
    
    // If module has no videos, check if it's marked as completed
    if (!module.videos || module.videos.length === 0) {
      return completedModules.has(moduleId) ? 100 : 0;
    }
    
    // Calculate progress based on completed videos
    const completedVideosCount = module.videos.filter(v => completedVideos.has(v.id)).length;
    return Math.round((completedVideosCount / module.videos.length) * 100);
  };

  // Function to map color to badge variant
  const getBadgeColor = (color: string): 'default' | 'amber' | 'purple' => {
    switch (color) {
      case 'orange':
      case 'default':
        return 'default';
      case 'amber':
      case 'purple':
        return color;
      default:
        return 'default';
    }
  };

  // Calculate progress percentage based on individual video completion
  const progress = useMemo(() => {
    if (!course || course.modules.length === 0) return 0;

    let totalVideos = 0;
    let completedVideoCount = 0;
    let totalModulesWithoutVideos = 0;
    let completedModulesWithoutVideos = 0;

    course.modules.forEach(module => {
      if (module.videos && module.videos.length > 0) {
        totalVideos += module.videos.length;
        const moduleCompletedVideos = module.videos.filter(video => 
          completedVideos.has(video.id)
        ).length;
        completedVideoCount += moduleCompletedVideos;
      } else {
        totalModulesWithoutVideos++;
        if (completedModules.has(module.id)) {
          completedModulesWithoutVideos++;
        }
      }
    });

    // If we have videos, calculate based on video completion
    if (totalVideos > 0) {
      const videoProgress = totalVideos > 0 ? (completedVideoCount / totalVideos) : 0;
      const moduleProgress = totalModulesWithoutVideos > 0 ? (completedModulesWithoutVideos / totalModulesWithoutVideos) : 0;

      // Weighted average: give more weight to videos if most modules have videos
      const videoWeight = totalVideos / (totalVideos + totalModulesWithoutVideos);
      const moduleWeight = 1 - videoWeight;

      return Math.round((videoProgress * videoWeight + moduleProgress * moduleWeight) * 100);
    }

    // Fallback to module-based calculation if no videos
    return Math.round((completedModules.size / course.modules.length) * 100);
  }, [course, completedModules, completedVideos]);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  // Show course not found state
  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Course Not Found</AlertTitle>
          <AlertDescription>
            The requested course could not be found. Please check the URL or return to the courses page.
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => navigate('/courses')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </div>
    );
  }

  const toggleModuleExpansion = (moduleId: number) => {
    setExpandedModules(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(moduleId)) {
        newExpanded.delete(moduleId);
      } else {
        newExpanded.add(moduleId);
      }
      return newExpanded;
    });
  };

  const toggleVideoCompletion = async (videoId: string, moduleId: number) => {
    // Compute new completed videos set
    const newCompletedVideos = new Set(completedVideos);
    if (newCompletedVideos.has(videoId)) {
      newCompletedVideos.delete(videoId);
    } else {
      newCompletedVideos.add(videoId);
    }

    // Update module completion based on video completion
    let newCompletedModules = new Set(completedModules);
    if (course) {
      const module = course.modules.find(m => m.id === moduleId);
      if (module && module.videos) {
        const completedCount = module.videos.filter(video => newCompletedVideos.has(video.id)).length;
        const isModuleComplete = completedCount === module.videos.length;
        if (isModuleComplete) {
          newCompletedModules.add(moduleId);
        } else {
          newCompletedModules.delete(moduleId);
        }
      }
    }

    // Calculate new progress percentage
    let totalVideos = 0;
    let completedVideoCount = 0;
    let totalModulesWithoutVideos = 0;
    let completedModulesWithoutVideos = 0;
    if (course) {
      course.modules.forEach(module => {
        if (module.videos && module.videos.length > 0) {
          totalVideos += module.videos.length;
          const moduleCompletedVideos = module.videos.filter(video => newCompletedVideos.has(video.id)).length;
          completedVideoCount += moduleCompletedVideos;
        } else {
          totalModulesWithoutVideos++;
          if (newCompletedModules.has(module.id)) {
            completedModulesWithoutVideos++;
          }
        }
      });
    }
    let newProgress = 0;
    if (totalVideos > 0) {
      const videoProgress = totalVideos > 0 ? (completedVideoCount / totalVideos) : 0;
      const moduleProgress = totalModulesWithoutVideos > 0 ? (completedModulesWithoutVideos / totalModulesWithoutVideos) : 0;
      const videoWeight = totalVideos / (totalVideos + totalModulesWithoutVideos);
      const moduleWeight = 1 - videoWeight;
      newProgress = Math.round((videoProgress * videoWeight + moduleProgress * moduleWeight) * 100);
    } else if (course) {
      newProgress = Math.round((newCompletedModules.size / course.modules.length) * 100);
    }

    // Update DB first
    await supabase
      .from('user_course_enrollments')
      .update({ course_progress_in_percentage: newProgress })
      .eq('clerk_user_id', userId)
      .eq('current_course', courseId);

    // Now update UI state
    setCompletedVideos(newCompletedVideos);
    setCompletedModules(newCompletedModules);
    const progressData = {
      courseId,
      modules: Array.from(newCompletedModules).map(id => ({ id, completed: true })),
      videos: Array.from(newCompletedVideos).map(id => ({ id, completed: true }))
    };
    localStorage.setItem(`courseProgress_${courseId}`, JSON.stringify(progressData));
  };

  const toggleModuleCompletion = async (moduleId: number) => {
    if (!userId || !courseId || !course) return;
    try {
      const isCurrentlyCompleted = completedModules.has(moduleId);
      const newCompletedModules = new Set(completedModules);
      const currentModule = course.modules.find(m => m.id === moduleId);
      const currentModuleTitle = currentModule?.title || `Module ${moduleId}`;
      const courseTitle = course.title || courseId;
      const urlParams = new URLSearchParams(location.search);
      const learningGoal = urlParams.get('goal') || onboardingData?.learning_goal || 'General Learning';
      if (isCurrentlyCompleted) {
        const deleteResult = await progressFunctionsForCommitment.delete({
          moduleId,
          userId,
          currentCourse: courseTitle,
          currentModule: currentModuleTitle
        });
        if (deleteResult.success) {
          newCompletedModules.delete(moduleId);
        } else {
          throw new Error(deleteResult.error || 'Failed to delete progress');
        }
      } else {
        const insertResult = await progressFunctionsForCommitment.insert({
          userId,
          learningGoal,
          currentCourse: courseTitle,
          currentModule: currentModuleTitle,
          totalModulesInCourse: course.modules.length,
          isCompleted: true,
          moduleId
        });
        if (insertResult.success) {
          newCompletedModules.add(moduleId);
        } else {
          throw new Error(insertResult.error || 'Failed to insert progress');
        }
      }
      // Calculate new progress percentage
      let totalVideos = 0;
      let completedVideoCount = 0;
      let totalModulesWithoutVideos = 0;
      let completedModulesWithoutVideos = 0;
      course.modules.forEach(module => {
        if (module.videos && module.videos.length > 0) {
          totalVideos += module.videos.length;
          const moduleCompletedVideos = module.videos.filter(video => completedVideos.has(video.id)).length;
          completedVideoCount += moduleCompletedVideos;
        } else {
          totalModulesWithoutVideos++;
          if (newCompletedModules.has(module.id)) {
            completedModulesWithoutVideos++;
          }
        }
      });
      let newProgress = 0;
      if (totalVideos > 0) {
        const videoProgress = totalVideos > 0 ? (completedVideoCount / totalVideos) : 0;
        const moduleProgress = totalModulesWithoutVideos > 0 ? (completedModulesWithoutVideos / totalModulesWithoutVideos) : 0;
        const videoWeight = totalVideos / (totalVideos + totalModulesWithoutVideos);
        const moduleWeight = 1 - videoWeight;
        newProgress = Math.round((videoProgress * videoWeight + moduleProgress * moduleWeight) * 100);
      } else {
        newProgress = Math.round((newCompletedModules.size / course.modules.length) * 100);
      }
      // Update DB first
      await supabase
        .from('user_course_enrollments')
        .update({ course_progress_in_percentage: newProgress })
        .eq('clerk_user_id', userId)
        .eq('current_course', courseId);
      // Now update UI state
      setCompletedModules(newCompletedModules);
      const progressData = {
        courseId,
        modules: Array.from(newCompletedModules).map(id => ({ id, completed: true })),
        videos: Array.from(completedVideos).map(id => ({ id, completed: true }))
      };
      localStorage.setItem(`courseProgress_${courseId}`, JSON.stringify(progressData));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update module progress. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-300/20 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative container mx-auto px-4 py-12">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-white hover:bg-white/20 border border-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>

          {/* Course Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Code2 className="h-8 w-8 text-white" />
                </div>
                <Badge variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm">
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                {course.title}
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-2xl leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-medium">{course.modules.length} modules</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">15,000+ students</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">Certificate included</span>
                </div>
              </div>
            </div>

            <div className="lg:text-right">
              <Badge className={`mb-4 bg-gradient-to-r ${
                commitmentConfig.badge.color === 'green' 
                  ? 'from-green-500 to-emerald-500' 
                  : commitmentConfig.badge.color === 'blue' 
                    ? 'from-blue-500 to-cyan-500' 
                    : commitmentConfig.badge.color === 'purple' 
                      ? 'from-purple-500 to-pink-500' 
                      : 'from-amber-500 to-orange-500' // Handle all other cases including 'amber' and 'orange'
              } text-white border-0 px-4 py-2 text-sm font-medium`}>
                {commitmentConfig.name}
              </Badge>

              {/* Progress Circle */}
              <div className="relative w-24 h-24 mx-auto lg:mx-0">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                    className="transition-all duration-500 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{progress}%</span>
                </div>
              </div>
              <p className="text-white/80 text-sm mt-2">Course Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Modules */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Course Curriculum</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Master {course.title.toLowerCase()} through our carefully structured learning modules
          </p>
        </div>

        {!isEnrolled ? (
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Start Learning {course.title}
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Enroll for free to access all course content, track your progress, and earn a certificate upon completion.
              </p>
              <Button 
                onClick={handleEnroll}
                disabled={isEnrolling}
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll for Free'}
              </Button>
              <p className="text-sm text-slate-500 mt-4">
                Join {Math.floor(Math.random() * 5000) + 1000}+ students already enrolled
              </p>
            </div>
          </div>
        ) : (
          <>
            {course?.modules?.length > 0 ? (
              <div className="grid gap-6 max-w-4xl mx-auto">
                {course.modules.map((module, index) => {
                  const isCompleted = completedModules.has(module.id);
                  const isExpanded = expandedModules.has(module.id);
                  const moduleProgressValue = moduleProgress(module.id);
                  const isStarted = startedModules[module.id];

                  return (
                    <Card
                      key={module.id}
                      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4 ${
                        isCompleted
                          ? 'border-l-green-500 bg-gradient-to-r from-green-50 to-white'
                          : 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100'
                      }`}
                    >
                      {/* Module Number Badge */}
                      <div className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}>
                        {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                      </div>

                      <CardHeader className="pb-4 pl-20">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {module.title}
                              </CardTitle>
                              {module.videos && module.videos.length > 0 && (
                                <Collapsible>
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleModuleExpansion(module.id)}
                                      className="p-1 h-6 w-6 rounded-full hover:bg-slate-200"
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </CollapsibleTrigger>
                                </Collapsible>
                              )}
                            </div>
                            <p className="text-slate-600 leading-relaxed mb-2">{module.description}</p>

                            {/* Module Progress Bar */}
                            {module.videos && module.videos.length > 0 && (
                              <div className="mb-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-slate-500">Progress:</span>
                                  <span className="text-xs font-semibold text-slate-700">{moduleProgressValue}%</span>
                                </div>
                                <Progress value={moduleProgressValue} className="h-2 bg-slate-200" />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-slate-500">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm font-medium">{module.duration}</span>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleModuleCompletion(module.id)}
                              className={`h-10 w-10 p-0 rounded-full transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                                  : 'border-2 border-slate-300 hover:border-green-500 hover:bg-green-50'
                              }`}
                            >
                              <Check className={`h-5 w-5 transition-all duration-300 ${
                                isCompleted ? 'text-white' : 'text-slate-400 group-hover:text-green-500'
                              }`} />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pl-20 pt-0">
                        {/* Topics */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {module.topics?.map((topic, topicIndex) => (
                            <Badge
                              key={topicIndex}
                              variant="secondary"
                              className="text-xs px-3 py-1 bg-white/70 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>

                        {/* Start Module Button or Video List */}
                        {!isStarted ? (
                          <Button onClick={() => handleStartModule(module.id)} variant="default">Start Module</Button>
                        ) : (
                          module.videos && module.videos.length > 0 && (
                            <Collapsible open={isExpanded} onOpenChange={() => toggleModuleExpansion(module.id)}>
                              <CollapsibleContent className="space-y-2 mb-4">
                                <div className="bg-slate-50 rounded-lg p-4 border">
                                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                    <PlayCircle className="h-4 w-4" />
                                    Videos in this module ({module.videos.length})
                                  </h4>
                                  <div className="space-y-2">
                                    {module.videos.map((video, videoIndex) => {
                                      const isVideoCompleted = completedVideos.has(video.id);
                                      return (
                                        <div
                                          key={video.id}
                                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                                            isVideoCompleted
                                              ? 'bg-green-50 border-green-200'
                                              : 'bg-white border-slate-200 hover:border-slate-300'
                                          }`}
                                        >
                                          <Checkbox
                                            checked={isVideoCompleted}
                                            onCheckedChange={() => handleVideoClick(video.id, module.id, video.title)}
                                            className="h-4 w-4"
                                          />

                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <span className={`text-sm font-medium ${
                                                isVideoCompleted ? 'text-green-700 line-through' : 'text-slate-900'
                                              }`}>
                                                {videoIndex + 1}. {video.title}
                                              </span>
                                              {isVideoCompleted && (
                                                <Check className="h-4 w-4 text-green-500" />
                                              )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                              <Clock className="h-3 w-3 text-slate-400" />
                                              <span className="text-xs text-slate-500">{video.duration}</span>
                                            </div>
                                          </div>

                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(video.videoUrl, '_blank')}
                                            className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50"
                                          >
                                            <Play className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          )
                        )}
                      </CardContent>

                      {/* Completion indicator line */}
                      {isCompleted && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No modules available</h3>
                <p className="text-slate-600">This course content is being prepared. Check back soon!</p>
              </div>
            )}
          </>
        )}

        {/* Course Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">15,000+</h3>
            <p className="text-slate-600">Students Enrolled</p>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">4.8/5</h3>
            <p className="text-slate-600">Average Rating</p>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">95%</h3>
            <p className="text-slate-600">Completion Rate</p>
          </Card>
        </div>

        {/* Completion Celebration */}
        {progress === 100 && (
          <div className="mt-12 text-center">
            <div className="inline-block p-8 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-2xl text-white mb-6">
              <div className="animate-bounce mb-4">
                <Award className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Congratulations! 🎉</h3>
              <p className="text-lg opacity-90">You've completed {course.title}!</p>
            </div>
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white px-8 py-3">
              <Award className="mr-2 h-5 w-5" />
              Download Certificate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailNew;
