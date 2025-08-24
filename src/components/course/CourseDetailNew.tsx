import React, { useState, useEffect, useCallback } from 'react';
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
  ExternalLink
} from 'lucide-react';

// Import course data
import { htmlCssMastery } from '@/data/courses/htmlCssMastery';
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
import { useOnboardingData } from '@/hooks/useOnboardingData';

// Import progress components from their actual locations
import { 
  MinimalProgressCheck, 
  MinimalProgressDelete, 
  MinimalProgressInsert 
} from '@/components/database/progress/MinimalProgress';
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

// Map time commitment levels to their progress functions
const progressFunctions: Record<TimeCommitmentLevel, Omit<ProgressFunctions, 'getCompleted'>> = {
  minimal: {
    check: async (params: any) => {
      const result = await MinimalProgressCheck(params.userId);
      return result || [];
    },
    delete: async (params: any) => {
      return await MinimalProgressDelete(
        params.moduleId,
        params.userId,
        params.currentCourse,
        params.currentModule
      );
    },
    insert: async (params: any) => {
      return await MinimalProgressInsert(
        params.userId,
        params.learningGoal,
        params.currentCourse,
        params.currentModule,
        params.totalModulesInCourse,
        params.isCompleted,
        params.moduleId
      );
    }
  },
  moderate: {
    check: async (params: any) => {
      const result = await ModerateProgressCheck(params.userId);
      return result || [];
    },
    delete: async (params: any) => {
      return await ModerateProgressDelete(
        params.moduleId,
        params.userId,
        params.currentCourse,
        params.currentModule
      );
    },
    insert: async (params: any) => {
      return await ModerateProgressInsert(
        params.userId,
        params.learningGoal,
        params.currentCourse,
        params.currentModule,
        params.totalModulesInCourse,
        params.isCompleted,
        params.moduleId
      );
    }
  },
  significant: {
    check: async (params: any) => {
      const result = await SignificantProgressCheck(params.userId);
      return result || [];
    },
    delete: async (params: any) => {
      return await SignificantProgressDelete(
        params.moduleId,
        params.userId,
        params.currentCourse,
        params.currentModule
      );
    },
    insert: async (params: any) => {
      return await SignificantProgressInsert(
        params.userId,
        params.learningGoal,
        params.currentCourse,
        params.currentModule,
        params.totalModulesInCourse,
        params.isCompleted,
        params.moduleId
      );
    }
  },
  intensive: {
    check: async (params: any) => {
      const result = await IntensiveProgressCheck(params.userId);
      return result || [];
    },
    delete: async (params: any) => {
      return await IntensiveProgressDelete(
        params.moduleId,
        params.userId,
        params.currentCourse,
        params.currentModule
      );
    },
    insert: async (params: any) => {
      return await IntensiveProgressInsert(
        params.userId,
        params.learningGoal,
        params.currentCourse,
        params.currentModule,
        params.totalModulesInCourse,
        params.isCompleted,
        params.moduleId
      );
    }
  },
};

// Course data mapping
const courseDataMap: Record<string, CourseData> = {
  'html-css-mastery': htmlCssMastery,
  // Add other courses here when they're created
};

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
  
  // Get time commitment from URL or default to 'moderate'
  const timeCommitment = (new URLSearchParams(location.search).get('timeCommitment') || 'moderate') as TimeCommitmentLevel;
  
  const [course, setCourse] = useState<CourseData | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the current time commitment configuration
  const commitmentConfig = timeCommitmentConfig[timeCommitment];
  
  // Get the progress functions for the current time commitment
  // Get the progress functions for the current time commitment
  const progressFunctionsForCommitment = progressFunctions[timeCommitment];

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
        
        // Load completed modules from localStorage as fallback
        const savedProgress = localStorage.getItem(`courseProgress_${courseId}`);
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          const completed = new Set<number>();
          progress.modules?.forEach((m: {id: number, completed: boolean}) => {
            if (m.completed) completed.add(m.id);
          });
          setCompletedModules(completed);
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
        const completed = new Set<number>();

        userProgress.forEach((progress: any) => {
          if (progress.is_completed && progress.current_course === course?.title) {
            completed.add(progress.module_id);
          }
        });

        setCompletedModules(completed);
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
  }, [userId, course, progressFunctionsForCommitment]);

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

  const toggleModuleCompletion = async (moduleId: number) => {
    if (!userId || !courseId || !course) return;

    try {
      const isCurrentlyCompleted = completedModules.has(moduleId);
      const newCompletedModules = new Set(completedModules);
      const currentModule = course.modules.find(m => m.id === moduleId);

      // Prepare common parameters
      const currentModuleTitle = currentModule?.title || `Module ${moduleId}`;
      const courseTitle = course.title || courseId;
      const learningGoal = onboardingData?.learning_goal || 'General Learning';

      if (isCurrentlyCompleted) {
        // Delete the progress record for this module
        const deleteResult = await progressFunctionsForCommitment.delete({
          moduleId,
          userId,
          currentCourse: courseTitle,
          currentModule: currentModuleTitle
        });

        if (deleteResult.success) {
          newCompletedModules.delete(moduleId);
          console.log(`Module ${moduleId} unmarked as completed`);
        } else {
          throw new Error(deleteResult.error || 'Failed to delete progress');
        }
      } else {
        // Insert new progress record
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
          console.log(`Module ${moduleId} marked as completed`);
        } else {
          throw new Error(insertResult.error || 'Failed to insert progress');
        }
      }

      // Update the UI state
      setCompletedModules(newCompletedModules);

      // Save progress to localStorage as backup
      const progressData = {
        courseId,
        modules: Array.from(newCompletedModules).map(id => ({ id, completed: true }))
      };
      localStorage.setItem(`courseProgress_${courseId}`, JSON.stringify(progressData));

    } catch (error) {
      console.error('Error in toggleModuleCompletion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update module progress. Please try again.',
        variant: 'destructive'
      });
      // Don't revert UI state on error - let user try again
    }
  };

  // Calculate progress percentage
  const progress = course.modules.length > 0 
    ? Math.round((completedModules.size / course.modules.length) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground mt-2">{course.description}</p>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {course.duration}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpen className="mr-1 h-4 w-4" />
              {course.modules.length} modules
            </div>
            <Badge variant="secondary">{course.level}</Badge>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Badge variant="outline" className={`bg-${commitmentConfig.bgColor} border-${commitmentConfig.badge.color}-200`}>
            {commitmentConfig.name}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Course Progress</span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Course Modules */}
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Course Modules</h2>
        {course?.modules?.length > 0 ? (
          <div className="space-y-4">
            {course.modules.map((module) => {
              const isCompleted = completedModules.has(module.id);
              
              return (
                <Card key={module.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{module.duration}</span>
                        <Button
                          variant={isCompleted ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleModuleCompletion(module.id)}
                          className={`h-8 w-8 p-0 rounded-full transition-colors ${
                            isCompleted
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'border-2 border-gray-300 hover:border-green-500'
                          }`}
                        >
                          <Check className={`h-4 w-4 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {module.topics?.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    
                    {module.playlistUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => window.open(module.playlistUrl, '_blank')}
                      >
                        <Youtube className="mr-2 h-4 w-4" />
                        Watch on YouTube
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No modules available for this course.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailNew;
