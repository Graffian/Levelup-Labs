import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowRight, BookOpen } from 'lucide-react';

interface CourseEnrollment {
  id: string;
  current_course: string;
  course_progress_in_percentage: number;
  time_commitment: string;
  created_at: string;
  learning_goal: string;
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
          .select('*')
          .eq('clerk_user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEnrollments(data || []);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setError('Failed to load course data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [isLoaded, user]);

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
      // Add more course mappings as needed
    };

    return (
      courseMap[courseName] || {
        title: courseName,
        description: 'Course in progress',
      }
    );
  };

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
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

  if (enrollments.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No courses enrolled yet</h3>
        <p className="mt-1 text-gray-500">Get started by exploring our courses</p>
        <div className="mt-6">
          <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Learning</h2>
        <p className="text-muted-foreground">Track your course progress and continue learning</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment) => {
          const course = getCourseDetails(enrollment.current_course);
          return (
            <Card key={enrollment.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {course.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {enrollment.time_commitment || 'Self-paced'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {Math.round(enrollment.course_progress_in_percentage || 0)}%
                    </span>
                  </div>
                  <Progress
                    value={enrollment.course_progress_in_percentage || 0}
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    {enrollment.learning_goal || 'No specific learning goal set'}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  className="w-full"
                  onClick={() => navigate(`/course/${enrollment.id}`)}
                >
                  {enrollment.course_progress_in_percentage > 0 ? 'Continue' : 'Start'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CourseDashboard;
