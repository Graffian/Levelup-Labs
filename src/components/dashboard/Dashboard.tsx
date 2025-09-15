import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { createSupabaseClient } from '@/components/database/SupabaseSetup';
import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseEnrollment {
  clerk_user_id: string;
  current_course: string;
  course_progress_in_percentage: number;
  enrolled_at: string;
  learning_goal?: string;
  current_path?: string;
  total_modules_in_course?: number;
}

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get authenticated Supabase client
  const getSupabaseClient = React.useCallback(async () => {
    const supabaseClient = createSupabaseClient(getToken);
    return await supabaseClient();
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded || !user) {
      console.log('User not loaded or not authenticated:', { isLoaded, user });
      return;
    }

    const fetchEnrollments = async () => {
      try {
        console.log('Fetching enrollments for user:', user.id);
        const supabaseClient = await getSupabaseClient();
        const { data, error } = await supabaseClient
          .from('user_course_enrollments')
          .select('clerk_user_id, current_course, course_progress_in_percentage, enrolled_at, learning_goal, current_path, total_modules_in_course')
          .eq('clerk_user_id', user.id)
          .order('enrolled_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        console.log('Fetched enrollments:', data);
        setEnrollments(data || []);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [isLoaded, user, getSupabaseClient]);

  const getCourseDetails = (courseName: string) => {
    const courseMap: Record<string, { title: string; description: string }> = {
      'Frontend Fundamentals': {
        title: 'Frontend Fundamentals',
        description: 'Master the basics of HTML, CSS, and JavaScript',
      },
      'React Complete Guide': {
        title: 'React Complete Guide',
        description: 'Build modern web applications with React',
      },
      'JavaScript Essentials': {
        title: 'JavaScript Essentials',
        description: 'Deep dive into modern JavaScript features',
      },
    };

    return (
      courseMap[courseName] || {
        title: courseName,
        description: 'Course in progress',
      }
    );
  };

  console.log('Dashboard render state:', { isLoaded, loading, enrollments, error });

  if (!isLoaded) {
    console.log('Clerk not loaded yet');
    return (
      <div className="container px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.course_progress_in_percentage >= 100).length;
  const inProgressCourses = totalCourses - completedCourses;
  const averageProgress = totalCourses > 0 
    ? Math.round(enrollments.reduce((sum, e) => sum + e.course_progress_in_percentage, 0) / totalCourses) 
    : 0;

  return (
    <div className="container px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's your learning progress at a glance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground mt-1">Enrolled in total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressCourses}</div>
              <p className="text-xs text-muted-foreground mt-1">Active courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageProgress}%</div>
              <Progress value={averageProgress} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">My Courses</h2>
          {enrollments.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No courses enrolled yet</h3>
              <p className="mt-1 text-muted-foreground">Get started by exploring our courses</p>
              <div className="mt-6">
                <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {enrollments.map((enrollment) => {
                const course = getCourseDetails(enrollment.current_course);
                const progress = Math.round(enrollment.course_progress_in_percentage || 0);
                
                return (
                  <Card key={enrollment.current_course} className="hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Current Course: {enrollment.current_course}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Progress: {progress}% Complete
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate({
                              pathname: `/course/${enrollment.current_course}`,
                              search: `?timeCommitment=${enrollment.learning_goal || 'minimal'}&goal=${enrollment.learning_goal || 'coding'}&experience=${enrollment.learning_goal || 'beginner'}`
                            })}
                          >
                            Go to Course
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              // Mock implementation for learning path
                              console.log('Navigating to learning path for', enrollment.current_course);
                            }}
                          >
                            Learning Path
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Your Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
