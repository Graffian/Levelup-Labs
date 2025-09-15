import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/components/database/SupabaseSetup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowRight, BookOpen, CheckCircle, Clock } from 'lucide-react';
import RouterHeader from '@/components/layout/RouterHeader';
import Footer from '@/components/layout/Footer';

interface CourseEnrollment {
  id: string;
  current_course: string;
  course_progress_in_percentage: number;
  enrolled_at: string;
  clerk_user_id: string;
}

const CourseDashboard = () => {
  const { user, isLoaded } = useUser();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchEnrollments = async () => {
      try {
        const { data, error } = await supabase
          .from('user_course_enrollments')
          .select('id, current_course, course_progress_in_percentage, enrolled_at, clerk_user_id')
          .eq('clerk_user_id', user.id)
          .order('enrolled_at', { ascending: false });

        if (error) throw error;
        setEnrollments(data || []);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [isLoaded, user]);

  const getCourseDetails = (courseName: string) => {
    const courseMap: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
      'Frontend Fundamentals': {
        title: 'Frontend Fundamentals',
        description: 'Master the basics of HTML, CSS, and JavaScript',
        icon: <BookOpen className="h-5 w-5 text-blue-500" />
      },
      'React Complete Guide': {
        title: 'React Complete Guide',
        description: 'Build modern web applications with React',
        icon: <CheckCircle className="h-5 w-5 text-purple-500" />
      },
      'JavaScript Essentials': {
        title: 'JavaScript Essentials',
        description: 'Deep dive into modern JavaScript features',
        icon: <CheckCircle className="h-5 w-5 text-yellow-500" />
      },
      'Web Development': {
        title: 'Web Development',
        description: 'Full-stack web development from scratch',
        icon: <BookOpen className="h-5 w-5 text-green-500" />
      },
      'Advanced CSS & Sass': {
        title: 'Advanced CSS & Sass',
        description: 'Master modern CSS and Sass techniques',
        icon: <CheckCircle className="h-5 w-5 text-pink-500" />
      },
    };

    return (
      courseMap[courseName] || {
        title: courseName,
        description: 'Course in progress',
        icon: <BookOpen className="h-5 w-5 text-gray-500" />
      }
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <RouterHeader />
        <main className="flex-1 container py-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <RouterHeader />
        <main className="flex-1 container py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <RouterHeader />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
            <p className="text-muted-foreground mt-2">
              Track your learning progress and continue where you left off
            </p>
          </div>

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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment) => {
                const course = getCourseDetails(enrollment.current_course);
                const progress = Math.round(enrollment.course_progress_in_percentage || 0);
                const isCompleted = progress >= 100;
                
                return (
                  <Card key={enrollment.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {course.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>Enrolled on {formatDate(enrollment.enrolled_at)}</span>
                            </div>
                          </div>
                        </div>
                        {isCompleted && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Completed
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground mb-4">
                        {course.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button 
                        className="w-full group"
                        onClick={() => navigate(`/course/${enrollment.id}`)}
                      >
                        {isCompleted ? 'View Course' : progress > 0 ? 'Continue' : 'Start'}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDashboard;
