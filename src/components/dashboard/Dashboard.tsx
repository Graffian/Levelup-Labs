
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import DashboardHeader from './DashboardHeader';
import DashboardTabs from './DashboardTabs';
// Removed broken imports for UI-only mode
import { Star, Award, Calendar } from 'lucide-react';

// Move this helper function to the top, before any usage
const getTotalVideosForCourse = (courseId: string) => {
  const courseTotalVideos: { [key: string]: number } = {
    '1': 8, // webdev (from migration: 2 modules, 4+4 videos = 8)
    '2': 4, // design (from migration: 2 modules, 3+1 videos = 4)
    '3': 2, // data (from migration: 2 modules, 1+1 videos = 2)
    // Add more as needed
  };
  return courseTotalVideos[courseId] || 0;
};

// Define which modules belong to each course (text IDs)
const courseModulesMap: { [key: string]: string[] } = {
  '1': ['module-1', 'module-2'], // Web Dev
  '2': ['module-3'],            // Design
  '3': ['module-4'],            // Data Science
  // Add more as needed
};

// Helper to get all videos for a set of modules
const getVideosForModules = (moduleIds: string[]) => {
  // You need to fetch all videos from the DB and pass them here, or keep them in state
  // For now, assume you have a 'videos' array in scope
  return (window.allVideos || []).filter((v: any) => moduleIds.includes(v.module_id));
};

// Helper to get completed videos for a set of modules
const getCompletedVideosForModules = (moduleIds: string[]) => {
  return videoProgress.filter((v) => v.completed && moduleIds.includes(v.module_id));
};

const Dashboard = () => {
  const { user } = useUser();
  const { userStats, userSkills, userBadges, userProfile, loading: userLoading } = useUserData();
  const { courseProgress, loading: progressLoading, videoProgress } = useCourseProgress();

  // Calculate overall progress (DB-driven)
  const totalVideos = courseProgress.reduce((sum, course) => sum + getTotalVideosForCourse(course.course_id), 0);
  const completedVideosAll = videoProgress.filter(v => v.completed).length;
  const overallProgress = totalVideos > 0 ? Math.round((completedVideosAll / totalVideos) * 100) : 0;

  if (!user || userLoading || progressLoading || !userProfile) {
    return (
      <div className="container px-4 py-8 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Helper to get completed videos for a course
  // No longer needed, logic inlined below with correct type

  // Convert database data to component format
  const courses = courseProgress.map(progress => {
    const alias = progress.courseId || progress.course_id || progress.id || '1';
    // Only use user_progress (videoProgress) for counting videos
    const videosForCourse = videoProgress.filter(v => v.course_id === alias);
    const uniqueVideoIds = Array.from(new Set(videosForCourse.map(v => v.video_id)));
    const totalVideos = uniqueVideoIds.length;
    const completedVideos = videosForCourse.filter(v => v.completed).length;
    const percent = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
    return {
      id: alias,
      courseId: alias,
      title: getCourseTitle(alias),
      progress: percent,
      totalModules: totalVideos,
      completedModules: completedVideos,
      lastAccessed: formatLastAccessed(progress.last_accessed_at),
      learning_goal: getCourseGoal(alias),
      time_commitment: progress.time_commitment,
      experience_level: progress.experience_level
    };
  });

  const skills = userSkills.map(skill => ({
    name: skill.skill_name,
    level: skill.skill_level
  })); // No skill points

  return (
    <div className="container px-4 py-8 max-w-6xl">
      <DashboardHeader />
      <DashboardTabs 
        courses={courses} 
        skills={skills} 
        userProfile={userProfile} // Pass userProfile for deep linking
        userStats={userStats} // Pass userStats to SkillsCard
        overallProgress={overallProgress} // Pass to OverviewCards
      />
    </div>
  );
};

// Helper functions
const getCourseTitle = (courseId: string) => {
  const titleMap: { [key: string]: string } = {
    '1': 'Web Development Fundamentals',
    '2': 'UI/UX Design Essentials',
    '3': 'Data Science and Analysis'
  };
  return titleMap[courseId] || 'Unknown Course';
};

const getCourseGoal = (courseId: string) => {
  const goalMap: { [key: string]: string } = {
    '1': 'coding',
    '2': 'design', 
    '3': 'data'
  };
  return goalMap[courseId] || 'coding';
};

const getTotalModulesForCourse = (courseId: string) => {
  const moduleMap: { [key: string]: number } = {
    '1': 2, // Web dev has 2 modules
    '2': 1, // Design has 1 module
    '3': 1  // Data has 1 module
  };
  return moduleMap[courseId] || 1;
};

const formatLastAccessed = (dateString: string | null) => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
};

const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'star': <Star className="h-5 w-5 text-yellow-500" />,
    'award': <Award className="h-5 w-5 text-primary" />,
    'calendar': <Calendar className="h-5 w-5 text-green-500" />,
    'check-circle': <Award className="h-5 w-5 text-green-500" />
  };
  return iconMap[iconName] || <Star className="h-5 w-5 text-primary" />;
};

export default Dashboard;
