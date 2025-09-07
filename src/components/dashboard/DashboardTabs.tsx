
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, BookOpen, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import CoursesList from './CoursesList';
import SkillsCard from './SkillsCard';

interface DashboardTabsProps {
  courses: any[];
  skills: { name: string; level: number }[];
  userProfile: any;
  userStats?: { current_level?: number };
}

const DashboardTabs = ({ courses, skills }: { courses: any[]; skills: any[] }) => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-secondary p-1 text-secondary-foreground mx-auto">
        <TabsTrigger value="overview" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="courses" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">
          <BookOpen className="h-4 w-4 mr-2" />
          Courses
        </TabsTrigger>

      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        
        <div className="grid grid-cols-1 gap-6">
          <CoursesList courses={courses} userProfile={userProfile} />
        </div>
      </TabsContent>
      
      <TabsContent value="courses">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Choose Your Learning Path</h2>
            <p className="text-muted-foreground">Start your personalized learning journey by selecting a course</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
        <BookOpen className="w-4 h-4 text-blue-600" />
      </div>
      Web Development
    </CardTitle>
    <CardDescription>
      Learn HTML, CSS, JavaScript, and modern frameworks
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-2 mb-4">
      <p className="text-sm text-muted-foreground">• Frontend Development</p>
      <p className="text-sm text-muted-foreground">• React & Modern JS</p>
      <p className="text-sm text-muted-foreground">• Responsive Design</p>
    </div>
    <Link to="/onboarding">
      <Button className="w-full">Start Learning</Button>
    </Link>
  </CardContent>
</Card>



          </div>
          
          <CoursesList courses={courses} detailed={true} />
        </div>
      </TabsContent>
      

    </Tabs>
  );
};

export default DashboardTabs;
