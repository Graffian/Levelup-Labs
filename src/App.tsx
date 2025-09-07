import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import OnboardingLayout from "./pages/onboarding/OnboardingLayout";
import OnboardingGoals from "./pages/onboarding/OnboardingGoals";
import OnboardingTime from "./pages/onboarding/OnboardingTime";
import OnboardingExperience from "./pages/onboarding/OnboardingExperience";
import PersonalizingLoader from "./pages/onboarding/PersonalizingLoader";
import CourseDashboard from "./pages/course/CourseDashboard";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { useState, useEffect } from "react";
import SignInPage from "./routes/sign-in";
import SignUpPage from "./routes/sign-up";

// Import specific course components
import WebDevCourse from "./pages/courses/WebDevCourse";
import LearningPath from "./pages/course/LearningPath";
import CourseDetailNew from "./components/course/CourseDetailNew";


/**
 * App Component - Root component that sets up the application structure
 *
 * Sets up:
 * - QueryClient for data fetching with proper error handling
 * - Global UI providers (tooltip, toast notifications)
 * - Routing with error boundaries for fault isolation
 */
const App = () => {

  // Create and configure the QueryClient with robust error handling
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1, // Limit retries to prevent excessive network traffic on failure
        refetchOnWindowFocus: false, // Disable auto-refetch for better performance
        staleTime: 5 * 60 * 1000, // 5 minutes of cache validity
        gcTime: 10 * 60 * 1000, // Garbage collection after 10 minutes
        meta: {
          // Handle errors at the query level
          onError: (error: unknown) => {
            // Log errors for monitoring
            console.error('Query error:', error);
          }
        }
      },
      mutations: {
        meta: {
          // Handle errors at the mutation level
          onError: (error: unknown) => {
            // Log mutation errors for monitoring
            console.error('Mutation error:', error);
          }
        }
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/sign-up/sso-callback" element={<SignUpPage />} />

              {/* Onboarding flow */}
              <Route path="/onboarding" element={<OnboardingLayout />}>
                <Route index element={<OnboardingGoals />} />
                <Route path="time" element={<OnboardingTime />} />
                <Route path="experience" element={<OnboardingExperience />} />
              </Route>

              {/* Other routes */}
              <Route path="/personalizing/:goalId/:timeId/:experienceId" element={<PersonalizingLoader />} />
              <Route path="/learning-path/:goalId/:timeId/:experienceId" element={<LearningPath />} />
              <Route path="/course/:courseSlug" element={<CourseDetailNew />} />
              <Route path="/course-dashboard" element={<CourseDashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resources" element={<Resources />} />

              {/* Course routes */}
              <Route path="/courses/coding" element={<WebDevCourse courseId="coding" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/design" element={<WebDevCourse courseId="design" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/marketing" element={<WebDevCourse courseId="marketing" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/business" element={<WebDevCourse courseId="business" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/data-science" element={<WebDevCourse courseId="data-science" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/ai" element={<WebDevCourse courseId="ai" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/cybersecurity" element={<WebDevCourse courseId="cybersecurity" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/cloud-computing" element={<WebDevCourse courseId="cloud-computing" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/mobile-dev" element={<WebDevCourse courseId="mobile-dev" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/game-dev" element={<WebDevCourse courseId="game-dev" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/devops" element={<WebDevCourse courseId="devops" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/blockchain" element={<WebDevCourse courseId="blockchain" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/iot" element={<WebDevCourse courseId="iot" timeCommitment="moderate" experienceLevel="beginner" />} />
              <Route path="/courses/ar-vr" element={<WebDevCourse courseId="ar-vr" timeCommitment="moderate" experienceLevel="beginner" />} />

              {/* 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
