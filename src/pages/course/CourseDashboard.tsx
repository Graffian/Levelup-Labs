
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import RouterHeader from '@/components/layout/RouterHeader';
import Footer from '@/components/layout/Footer';
import CourseModule, { CourseModuleProps } from '@/components/course/CourseModule';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
// UI-only: Remove useUserData and useCourseProgress, use local state instead
import { 
  ChevronLeft, 
  PlayCircle, 
  BookOpen, 
  BarChart3, 
  BookMarked,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle,
  Check 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

const getCourseModules = (learningGoal: string) => {
  switch (learningGoal) {
    case 'coding':
      return [
        {
          id: 'module-1',
          title: 'Module 1: Basics of Web Development',
          subtitle: '(3 subtopics)',
          tags: ['Frontend'],
          subModules: [
            {
              id: 'sub-1',
              title: 'Introduction to HTML',
              videos: [
                {
                  id: 'video-1',
                  title: 'HTML Document Structure',
                  duration: '10:25',
                  videoUrl: 'https://example.com/videos/html-structure',
                },
                {
                  id: 'video-2',
                  title: 'Working with Tags and Elements',
                  duration: '15:40',
                  videoUrl: 'https://example.com/videos/html-tags',
                },
              ],
            },
            {
              id: 'sub-2',
              title: 'Introduction to CSS',
              videos: [
                {
                  id: 'video-3',
                  title: 'CSS Selectors and Properties',
                  duration: '12:15',
                  videoUrl: 'https://example.com/videos/css-selectors',
                },
                {
                  id: 'video-4',
                  title: 'Box Model and Layout',
                  duration: '14:30',
                  videoUrl: 'https://example.com/videos/css-boxmodel',
                },
              ],
            },
          ],
        },
        {
          id: 'module-2',
          title: 'Module 2: JavaScript Fundamentals',
          subtitle: '(4 subtopics)',
          tags: ['Frontend', 'Programming'],
          subModules: [
            {
              id: 'sub-3',
              title: 'JavaScript Basics',
              videos: [
                {
                  id: 'video-5',
                  title: 'Variables and Data Types',
                  duration: '11:05',
                  videoUrl: 'https://example.com/videos/js-datatypes',
                },
                {
                  id: 'video-6',
                  title: 'Functions and Scope',
                  duration: '16:20',
                  videoUrl: 'https://example.com/videos/js-functions',
                },
              ],
            },
            {
              id: 'sub-4',
              title: 'DOM Manipulation',
              videos: [
                {
                  id: 'video-7',
                  title: 'Selecting and Modifying Elements',
                  duration: '13:45',
                  videoUrl: 'https://example.com/videos/js-dom',
                },
                {
                  id: 'video-8',
                  title: 'Event Handling',
                  duration: '12:30',
                  videoUrl: 'https://example.com/videos/js-events',
                },
              ],
            },
          ],
        },
      ];
    case 'design':
      return [
        {
          id: 'module-1',
          title: 'Module 1: Principles of UI/UX Design',
          subtitle: '(3 subtopics)',
          tags: ['Design'],
          subModules: [
            {
              id: 'sub-1',
              title: 'Design Fundamentals',
              videos: [
                {
                  id: 'video-1',
                  title: 'Color Theory and Typography',
                  duration: '14:20',
                  videoUrl: 'https://example.com/videos/design-color',
                },
                {
                  id: 'video-2',
                  title: 'Layout and Composition',
                  duration: '16:15',
                  videoUrl: 'https://example.com/videos/design-layout',
                },
              ],
            },
          ],
        },
      ];
    case 'data':
      return [
        {
          id: 'module-1',
          title: 'Module 1: Basics of Data Science',
          subtitle: '(3 subtopics)',
          tags: ['Data Science'],
          subModules: [
            {
              id: 'sub-1',
              title: 'Introduction to Data Analysis',
              videos: [
                {
                  id: 'video-1',
                  title: 'Statistical Foundations',
                  duration: '18:10',
                  videoUrl: 'https://example.com/videos/stats-basics',
                },
                {
                  id: 'video-2',
                  title: 'Working with Pandas',
                  duration: '22:05',
                  videoUrl: 'https://example.com/videos/pandas-intro',
                },
              ],
            },
          ],
        },
      ];
    default:
      return [
        {
          id: 'module-1',
          title: 'Module 1: Getting Started',
          subtitle: '(3 subtopics)',
          tags: ['Basics'],
          subModules: [
            {
              id: 'sub-1',
              title: 'Introduction to Learning',
              videos: [
                {
                  id: 'video-1',
                  title: 'How to Learn Effectively',
                  duration: '10:30',
                  videoUrl: 'https://example.com/videos/effective-learning',
                },
                {
                  id: 'video-2',
                  title: 'Setting Goals and Objectives',
                  duration: '12:45',
                  videoUrl: 'https://example.com/videos/goal-setting',
                },
              ],
            },
          ],
        },
      ];
  }
};

const CourseDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const { userProfile } = useUserData();
  const { markVideoComplete, enrollInCourse, getCompletedVideos, isVideoCompleted, courseProgress } = useCourseProgress();
  
  const [learningGoal, setLearningGoal] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  
  useEffect(() => {
    // First try to get from location state (direct navigation)
    if (location.state?.learningGoal) {
      setLearningGoal(location.state.learningGoal);
      setExperienceLevel(location.state.experienceLevel || 'beginner');
    }
    // Then try to get from user profile (returning user)
    else if (userProfile?.learning_goal) {
      setLearningGoal(userProfile.learning_goal);
      setExperienceLevel(userProfile.experience_level || 'beginner');
    }
    // If neither available and user exists, try to extract from URL params
    else if (user) {
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length >= 3 && pathParts[1] === 'courses') {
        setLearningGoal(pathParts[2]); // courses/design/minimal/beginner -> 'design'
        setExperienceLevel(pathParts[4] || 'beginner');
      } else {
        // Only redirect to onboarding if user has no profile and no state
        if (!userProfile?.learning_goal) {
          toast({
            title: "Missing learning preferences",
            description: "Please complete the onboarding process first.",
            variant: "destructive",
          });
          navigate('/onboarding');
        }
      }
    }
  }, [location.state, userProfile, user, navigate, toast]);
  
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>('');
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
  
  const modules = getCourseModules(learningGoal);
  const completedVideos = getCompletedVideos();
  
  // Calculate total videos for skill points
  const totalVideos = modules.reduce((total, module) => {
    return total + module.subModules.reduce((subTotal, subModule) => {
      return subTotal + subModule.videos.length;
    }, 0);
  }, 0);
  
  const calculateOverallProgress = () => {
    if (!modules || modules.length === 0) return 0;
    
    let totalVideos = 0;
    modules.forEach(module => {
      module.subModules.forEach(subModule => {
        totalVideos += subModule.videos.length;
      });
    });
    
    return totalVideos > 0 ? Math.round((completedVideos.length / totalVideos) * 100) : 0;
  };
  
  const [overallProgress, setOverallProgress] = useState<number>(0);
  
  useEffect(() => {
    setOverallProgress(calculateOverallProgress());
  }, [completedVideos, modules]);

  // Enroll in course when component mounts
  useEffect(() => {
    if (user && learningGoal) {
      const courseIdMap: { [key: string]: string } = {
        'coding': '1',
        'design': '2',
        'data': '3'
      };
      
      const courseId = courseIdMap[learningGoal];
      if (courseId && userProfile?.time_commitment && experienceLevel) {
        enrollInCourse(courseId, userProfile.time_commitment, experienceLevel);
      }
    }
  }, [user, learningGoal, enrollInCourse, userProfile, experienceLevel]);
  
  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
    
    for (const module of modules) {
      for (const subModule of module.subModules) {
        const video = subModule.videos.find(v => v.id === videoId);
        if (video) {
          setCurrentVideoTitle(video.title);
          break;
        }
      }
    }
  };
  
  const handleToggleComplete = async (videoId: string) => {
    if (!user) return;

    const isCompleted = isVideoCompleted(videoId);
    
    if (!isCompleted) {
      // Find the module and course for this video
      let courseId = '';
      let moduleId = '';
      
      for (const module of modules) {
        for (const subModule of module.subModules) {
          if (subModule.videos.some(v => v.id === videoId)) {
            moduleId = module.id;
            courseId = learningGoal === 'coding' ? '1' : learningGoal === 'design' ? '2' : '3';
            break;
          }
        }
      }

      await markVideoComplete(videoId, courseId, moduleId);
      
      toast({
        title: "Lesson completed!",
        description: "Great job! Keep up the good work.",
      });
    } else {
      toast({
        title: "Lesson marked as incomplete",
        description: "You can revisit this lesson anytime.",
      });
    }
  };
  
  const getCourseTitleByGoal = (goal: string) => {
    switch (goal) {
      case 'coding':
        return 'Web Development Fundamentals';
      case 'design':
        return 'UI/UX Design Essentials';
      case 'data':
        return 'Data Science and Analysis';
      case 'gaming':
        return 'Game Development Basics';
      case 'media':
        return 'Digital Media Production';
      case 'personal':
        return 'Personal Growth and Development';
      default:
        return 'Your Learning Path';
    }
  };

  if (!learningGoal) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <RouterHeader />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading your course...</h2>
            <p className="text-muted-foreground mt-2">Please wait while we prepare your personalized learning content.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <RouterHeader />
      <main className="flex-1 pt-24 pb-16 bg-gradient-to-b from-background to-background/80">
        <div className="bg-gradient-to-r from-primary/90 to-accent/80 text-white mb-8">
          <div className="container px-4 py-6 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium">Back to Dashboard</span>
                </div>
                <h1 className="text-3xl font-bold">{getCourseTitleByGoal(learningGoal)}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {experienceLevel && (
                    <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">
                      {experienceLevel} level
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">
                    <Users className="mr-1 h-3 w-3" />
                    2,145 enrolled
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">
                    <Calendar className="mr-1 h-3 w-3" />
                    Updated 2 weeks ago
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{overallProgress}%</div>
                  <div className="text-xs text-white/80">Completed</div>
                </div>
                <div className="flex-1 max-w-[120px]">
                  <Progress value={overallProgress} className="h-2 bg-white/20" />
                  <div className="flex justify-between mt-1 text-xs text-white/80">
                    <span>Progress</span>
                    <span>{modules.length > 0 ? `${modules[0].id}/${modules.length}` : "0/0"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-lg border shadow-sm p-4 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Modules</div>
                <div className="text-2xl font-semibold">{modules.length}</div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border shadow-sm p-4 flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-2xl font-semibold">
                  {Math.round(modules.length * (overallProgress / 100))} / {modules.length}
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border shadow-sm p-4 flex items-center gap-4">
              <div className="bg-secondary/30 p-3 rounded-full">
                <BookMarked className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Estimated Time</div>
                <div className="text-2xl font-semibold">8h 45m</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              
              <div className="bg-card rounded-lg border shadow-sm p-4 mb-4 sticky top-24">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Course Modules
                </h2>
                
                <div className="space-y-2">
                  {modules.map((module, index) => (
                    <CourseModule 
                      key={module.id}
                      {...module}
                      expanded={index === currentModuleIndex}
                      onSelect={handleVideoSelect}
                      completedVideos={completedVideos}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <Button 
                    className="w-full gap-2"
                    onClick={async () => {
                      if (user) {
                        toast({
                          title: "Certification completed!",
                          description: "Congratulations on completing the certification exam!",
                        });
                      }
                    }}
                  >
                    Certification Exam
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                {selectedVideoId ? (
                  <div>
                    <div className="aspect-video bg-black flex items-center justify-center relative group">
                      <div className="text-center p-8 z-10 relative">
                        <PlayCircle className="w-16 h-16 text-primary mx-auto mb-4 cursor-pointer transition-transform group-hover:scale-110" />
                        <div className="backdrop-blur-sm bg-black/30 p-2 rounded-lg inline-block">
                          <p className="text-white">{currentVideoTitle}</p>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-medium">{currentVideoTitle}</h2>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant={completedVideos.includes(selectedVideoId) ? "default" : "outline"} 
                            size="sm" 
                            onClick={() => handleToggleComplete(selectedVideoId)}
                            className="gap-2"
                          >
                            <Check className="h-4 w-4" />
                            {completedVideos.includes(selectedVideoId) ? "Completed" : "Mark Complete"}
                          </Button>
                          <Button variant="outline" size="sm">
                            Notes
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mt-2 mb-4">
                        This comprehensive lesson covers key concepts and practical applications. Watch the video and follow along with the exercises to master the material.
                      </p>
                      
                      <div className="bg-secondary/30 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Learning Objectives</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Understand core principles of {currentVideoTitle}</li>
                          <li>Apply techniques in real-world scenarios</li>
                          <li>Build practical skills through guided examples</li>
                          <li>Complete the challenge project to test your knowledge</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="bg-primary/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <PlayCircle className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium">Select a video to start learning</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      Choose a module and video from the course outline to begin your learning journey
                    </p>
                    <Button className="mt-6" onClick={() => handleVideoSelect(modules[0]?.subModules[0]?.videos[0]?.id || '')}>
                      Start First Lesson
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDashboard;
