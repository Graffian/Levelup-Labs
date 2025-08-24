import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Users, 
  Award, 
  Star, 
  BookOpen, 
  Play, 
  CheckCircle, 
  ArrowRight,
  Target,
  TrendingUp,
  DollarSign,
  Calendar,
  Briefcase,
  Code2,
  Palette,
  Brain,
  Gamepad2,
  Video,
  Heart
} from 'lucide-react';

// Learning path data based on onboarding selections
const learningPaths = {
  coding: {
    title: 'Web Development',
    subtitle: 'Full-Stack Developer Learning Path',
    description: 'Master modern web development from frontend to backend, building real-world applications',
    icon: Code2,
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    totalDuration: '180h',
    estimatedTime: '6-8 Months',
    averageSalary: '$85,000',
    sections: [
      {
        title: 'Frontend Fundamentals',
        color: 'purple',
        courses: [
          {
            title: 'HTML & CSS Mastery',
            duration: '12h 30m',
            level: 'Beginner',
            topics: ['HTML5 Semantics', 'CSS Grid & Flexbox', 'Responsive Design', 'CSS Animations'],
            completed: false
          },
          {
            title: 'JavaScript Essentials',
            duration: '18h 45m',
            level: 'Beginner',
            topics: ['ES6+ Features', 'DOM Manipulation', 'Async Programming', 'APIs'],
            completed: false
          }
        ]
      },
      {
        title: 'Modern Frontend Frameworks',
        color: 'blue',
        courses: [
          {
            title: 'React.js Complete Guide',
            duration: '25h 15m',
            level: 'Intermediate',
            topics: ['Components & Hooks', 'State Management', 'Routing', 'Testing'],
            completed: false,
            recommended: true
          },
          {
            title: 'TypeScript for React',
            duration: '8h 30m',
            level: 'Intermediate',
            topics: ['Type Safety', 'Interfaces', 'Generics', 'Advanced Types'],
            completed: false
          }
        ]
      },
      {
        title: 'Backend Development',
        color: 'green',
        courses: [
          {
            title: 'Node.js & Express',
            duration: '20h 0m',
            level: 'Intermediate',
            topics: ['Server Setup', 'REST APIs', 'Authentication', 'Database Integration'],
            completed: false
          },
          {
            title: 'Database Design & SQL',
            duration: '15h 45m',
            level: 'Beginner',
            topics: ['Relational Databases', 'SQL Queries', 'Database Optimization', 'NoSQL Basics'],
            completed: false
          }
        ]
      }
    ]
  },
  design: {
    title: 'UI/UX Design',
    subtitle: 'Digital Designer Learning Path',
    description: 'Create beautiful and intuitive user experiences through design thinking and modern tools',
    icon: Palette,
    gradient: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    totalDuration: '120h',
    estimatedTime: '4-6 Months',
    averageSalary: '$75,000',
    sections: [
      {
        title: 'Design Fundamentals',
        color: 'pink',
        courses: [
          {
            title: 'Design Principles & Theory',
            duration: '10h 30m',
            level: 'Beginner',
            topics: ['Color Theory', 'Typography', 'Layout & Composition', 'Visual Hierarchy'],
            completed: false
          },
          {
            title: 'User Experience Design',
            duration: '15h 45m',
            level: 'Beginner',
            topics: ['User Research', 'Personas', 'User Journey Mapping', 'Wireframing'],
            completed: false
          }
        ]
      },
      {
        title: 'Design Tools Mastery',
        color: 'purple',
        courses: [
          {
            title: 'Figma Complete Course',
            duration: '12h 15m',
            level: 'Beginner',
            topics: ['Interface Design', 'Prototyping', 'Component Systems', 'Collaboration'],
            completed: false,
            recommended: true
          },
          {
            title: 'Adobe Creative Suite',
            duration: '18h 30m',
            level: 'Intermediate',
            topics: ['Photoshop', 'Illustrator', 'After Effects', 'InDesign'],
            completed: false
          }
        ]
      }
    ]
  },
  data: {
    title: 'Data Science & AI',
    subtitle: 'Data Scientist Learning Path',
    description: 'Extract insights from data and build intelligent systems using machine learning',
    icon: Brain,
    gradient: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
    totalDuration: '200h',
    estimatedTime: '8-10 Months',
    averageSalary: '$110,000',
    sections: [
      {
        title: 'Data Science Foundations',
        color: 'indigo',
        courses: [
          {
            title: 'Python for Data Science',
            duration: '20h 30m',
            level: 'Beginner',
            topics: ['Pandas', 'NumPy', 'Data Manipulation', 'Visualization'],
            completed: false
          },
          {
            title: 'Statistics & Probability',
            duration: '15h 45m',
            level: 'Beginner',
            topics: ['Descriptive Statistics', 'Probability Theory', 'Hypothesis Testing', 'Regression'],
            completed: false
          }
        ]
      },
      {
        title: 'Machine Learning',
        color: 'purple',
        courses: [
          {
            title: 'Machine Learning Fundamentals',
            duration: '25h 15m',
            level: 'Intermediate',
            topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Feature Engineering'],
            completed: false,
            recommended: true
          },
          {
            title: 'Deep Learning with TensorFlow',
            duration: '30h 30m',
            level: 'Advanced',
            topics: ['Neural Networks', 'CNNs', 'RNNs', 'Transfer Learning'],
            completed: false
          }
        ]
      }
    ]
  }
};

// Course slug mapping for navigation
const courseSlugMap: { [key: string]: string } = {
  'HTML & CSS Mastery': 'html-css-mastery',
  'JavaScript Essentials': 'javascript-essentials',
  'React.js Complete Guide': 'react-complete-guide',
  'TypeScript for React': 'typescript-react',
  'Node.js & Express': 'nodejs-express',
  'Database Design & SQL': 'database-sql',
  'Design Principles & Theory': 'design-principles',
  'User Experience Design': 'ux-design',
  'Figma Complete Course': 'figma-course',
  'Adobe Creative Suite': 'adobe-suite',
  'Python for Data Science': 'python-data-science',
  'Statistics & Probability': 'statistics-probability',
  'Machine Learning Fundamentals': 'ml-fundamentals',
  'Deep Learning with TensorFlow': 'deep-learning-tensorflow'
};

const LearningPath = () => {
  const { goalId, timeId, experienceId } = useParams();
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState('2');
  
  const pathData = learningPaths[goalId as keyof typeof learningPaths];
  
  if (!pathData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Learning Path Not Found</h1>
          <p className="text-slate-600">The requested learning path doesn't exist.</p>
        </div>
      </div>
    );
  }

  const Icon = pathData.icon;
  const totalCourses = pathData.sections.reduce((acc, section) => acc + section.courses.length, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-8">
            <Icon className="w-5 h-5 mr-3 text-cyan-400" />
            Learning Path
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 text-white tracking-tight">
            {pathData.title}
            <span className={`block text-transparent bg-gradient-to-r ${pathData.gradient} bg-clip-text mt-2`}>
              Mastery
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-10 leading-relaxed">
            {pathData.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
            <div className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span className="font-medium">{pathData.totalDuration}</span>
            </div>
            <div className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <BookOpen className="w-5 h-5 text-green-400" />
              <span className="font-medium">{totalCourses} Courses</span>
            </div>
            <div className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">Certificate</span>
            </div>
            <div className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Users className="w-5 h-5 text-pink-400" />
              <span className="font-medium">50,000+ Students</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className={`bg-gradient-to-r ${pathData.gradient} hover:opacity-90 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300`}>
              <Play className="w-6 h-6 mr-3" />
              Start Learning Path
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-10 py-4 text-lg font-semibold rounded-full backdrop-blur-sm">
              <Calendar className="w-6 h-6 mr-3" />
              View Schedule
            </Button>
          </div>
        </div>
      </section>

      {/* Learning Path Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Learning Journey</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Follow this structured path to master {pathData.title.toLowerCase()} step by step
            </p>
          </div>

          <div className="space-y-12">
            {pathData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="relative">
                {/* Section Header */}
                <div className="flex items-center mb-6">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                    ${section.color === 'purple' ? 'bg-purple-500' : 
                      section.color === 'blue' ? 'bg-blue-500' :
                      section.color === 'green' ? 'bg-green-500' :
                      section.color === 'pink' ? 'bg-pink-500' :
                      section.color === 'indigo' ? 'bg-indigo-500' : 'bg-gray-500'}
                  `}>
                    {sectionIndex + 1}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-slate-900">{section.title}</h3>
                    <p className="text-slate-600">{section.courses.length} courses in this section</p>
                  </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-16">
                  {section.courses.map((course, courseIndex) => (
                    <Card key={courseIndex} className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 ${
                      course.completed ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50'
                    }`}>
                      {/* Gradient border effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${
                        course.completed ? 'from-green-400 to-emerald-500' :
                        section.color === 'purple' ? 'from-purple-400 to-pink-500' :
                        section.color === 'blue' ? 'from-blue-400 to-cyan-500' :
                        section.color === 'green' ? 'from-green-400 to-emerald-500' :
                        section.color === 'pink' ? 'from-pink-400 to-rose-500' :
                        'from-indigo-400 to-purple-500'
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} style={{ padding: '2px' }}>
                        <div className="w-full h-full bg-white rounded-lg"></div>
                      </div>

                      <div className="relative z-10 p-6">
                        <CardHeader className="p-0 pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  course.completed ? 'bg-green-500' : `bg-${section.color}-500`
                                } text-white`}>
                                  {course.completed ? <CheckCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {course.title}
                                </CardTitle>
                              </div>

                              <div className="flex items-center gap-4 mb-3">
                                {course.recommended && (
                                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg">
                                    <Star className="w-3 h-3 mr-1" />
                                    Recommended
                                  </Badge>
                                )}
                                <Badge variant="outline" className={`border-2 font-medium ${
                                  course.level === 'Beginner' ? 'border-green-300 text-green-700 bg-green-50' :
                                  course.level === 'Intermediate' ? 'border-blue-300 text-blue-700 bg-blue-50' :
                                  'border-red-300 text-red-700 bg-red-50'
                                }`}>
                                  {course.level}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2 text-slate-600 mb-4">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{course.duration}</span>
                              </div>
                            </div>

                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              course.completed ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400 group-hover:bg-blue-500 group-hover:text-white'
                            }`}>
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-0">
                          <div className="flex flex-wrap gap-2 mb-6">
                            {course.topics.map((topic, topicIndex) => (
                              <Badge key={topicIndex} variant="secondary" className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                                {topic}
                              </Badge>
                            ))}
                          </div>

                          <Button
                            className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 ${
                              course.completed
                                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl'
                            }`}
                            disabled={course.completed}
                            onClick={() => {
                              if (!course.completed) {
                                const courseSlug = courseSlugMap[course.title];
                                if (courseSlug) {
                                  navigate(`/course/${courseSlug}?timeCommitment=${timeId}&goal=${goalId}&experience=${experienceId}`);
                                }
                              }
                            }}
                          >
                            {course.completed ? (
                              <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Completed
                              </>
                            ) : (
                              <>
                                <Play className="w-5 h-5 mr-2" />
                                Start Course
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </div>

                      {/* Progress indicator */}
                      {course.completed && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                      )}
                    </Card>
                  ))}
                </div>

                {/* Connecting Line */}
                {sectionIndex < pathData.sections.length - 1 && (
                  <div className="absolute left-6 top-20 w-0.5 h-16 bg-slate-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Time Estimation Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">How Long Will This Take?</h2>
          
          <Tabs value={selectedTime} onValueChange={setSelectedTime} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto mb-8">
              <TabsTrigger value="1">1h/day</TabsTrigger>
              <TabsTrigger value="2">2h/day</TabsTrigger>
              <TabsTrigger value="4">4h/day</TabsTrigger>
              <TabsTrigger value="8">8h/day</TabsTrigger>
            </TabsList>
            
            <TabsContent value="1" className="space-y-4">
              <div className="text-4xl font-bold text-slate-900">≈ 6 Months</div>
              <p className="text-slate-600">Perfect for learning alongside your current commitments</p>
            </TabsContent>
            
            <TabsContent value="2" className="space-y-4">
              <div className="text-4xl font-bold text-slate-900">≈ {pathData.estimatedTime}</div>
              <p className="text-slate-600">Ideal pace for consistent progress and retention</p>
            </TabsContent>
            
            <TabsContent value="4" className="space-y-4">
              <div className="text-4xl font-bold text-slate-900">≈ 2 Months</div>
              <p className="text-slate-600">Accelerated learning for dedicated students</p>
            </TabsContent>
            
            <TabsContent value="8" className="space-y-4">
              <div className="text-4xl font-bold text-slate-900">≈ 1 Month</div>
              <p className="text-slate-600">Intensive bootcamp-style learning</p>
            </TabsContent>
          </Tabs>
          
          <p className="text-sm text-slate-500 mt-6">
            * This is based on averages from our students and may vary depending on your prior experience
          </p>
        </div>
      </section>

      {/* Career Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* What You'll Do */}
            <Card className="p-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                  <Briefcase className="w-6 h-6 mr-3 text-blue-500" />
                  What You'll Do Daily
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {goalId === 'coding' && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Build responsive web applications</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Write clean, maintainable code</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Collaborate with design teams</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Deploy and maintain applications</span>
                      </div>
                    </>
                  )}
                  {goalId === 'design' && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span>Design user interfaces and experiences</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span>Conduct user research and testing</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span>Create design systems and prototypes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span>Collaborate with development teams</span>
                      </div>
                    </>
                  )}
                  {goalId === 'data' && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Analyze large datasets for insights</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Build machine learning models</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Create data visualizations</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Present findings to stakeholders</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Salary Information */}
            <Card className="p-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                  <DollarSign className="w-6 h-6 mr-3 text-green-500" />
                  Career Outlook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">{pathData.averageSalary}</div>
                  <div className="text-slate-600">Average Salary</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Entry Level</span>
                    <span className="font-semibold">$45,000 - $65,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Mid Level</span>
                    <span className="font-semibold">$65,000 - $95,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Senior Level</span>
                    <span className="font-semibold">$95,000 - $150,000+</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>15% job growth expected over next 10 years</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r ${pathData.gradient}`}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who have transformed their careers with our learning paths
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
              <Play className="w-5 h-5 mr-2" />
              Start Free Course
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Calendar className="w-5 h-5 mr-2" />
              View Full Curriculum
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningPath;
