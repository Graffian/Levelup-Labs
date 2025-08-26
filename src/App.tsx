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
import useUserCredentials from "./hooks/useUser";


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
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <ErrorBoundary>
                  <Index />
                </ErrorBoundary>
              } />
              <Route path="/signin/*" element={
                <ErrorBoundary>
                  <SignInPage />
                </ErrorBoundary>
              } />
              <Route path="/signup/*" element={
                <ErrorBoundary>
                  <SignUpPage />
                </ErrorBoundary>
              } />

              {/* Onboarding flow */}
              <Route path="/onboarding" element={
                <ErrorBoundary>
                  <OnboardingLayout />
                </ErrorBoundary>
              }>
                <Route index element={<OnboardingGoals />} />
                <Route path="time" element={<OnboardingTime />} />
                <Route path="experience" element={<OnboardingExperience />} />
              </Route>

              {/* Learning Path Page */}
              <Route path="/learning-path/:goalId/:timeId/:experienceId" element={
                <ErrorBoundary>
                  <LearningPath />
                </ErrorBoundary>
              } />

              {/* Course Detail Page */}
              <Route path="/course/:courseSlug" element={
                <ErrorBoundary>
                  <CourseDetailNew />
                </ErrorBoundary>
              } />

              {/* Main application routes */}
              <Route path="/course-dashboard" element={
                <ErrorBoundary>
                  <CourseDashboard />
                </ErrorBoundary>
              } />
              <Route path="/dashboard" element={
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              } />
              <Route path="/resources" element={
                <ErrorBoundary>
                  <Resources />
                </ErrorBoundary>
              } />

              {/* Specific course routes based on combinations */}
              {/* Web Development Courses */}
              <Route path="/courses/coding" element={
                <ErrorBoundary>
                  <WebDevCourse courseId="e6904d1a-5748-4524-9535-7955a368e5cb" timeCommitment="moderate" experienceLevel="beginner" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding" element={
                <ErrorBoundary>
                  <WebDevCourse courseId="e6904d1a-5748-4524-9535-7955a368e5cb" timeCommitment="moderate" experienceLevel="beginner" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/minimal/beginner" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="minimal" experienceLevel="beginner" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/minimal/novice" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="minimal" experienceLevel="novice" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/minimal/intermediate" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="minimal" experienceLevel="intermediate" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/minimal/advanced" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="minimal" experienceLevel="advanced" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/moderate/beginner" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="moderate" experienceLevel="beginner" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/moderate/novice" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="moderate" experienceLevel="novice" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/moderate/intermediate" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="moderate" experienceLevel="intermediate" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/moderate/advanced" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="moderate" experienceLevel="advanced" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/significant/beginner" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="significant" experienceLevel="beginner" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/significant/novice" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="significant" experienceLevel="novice" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/significant/intermediate" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="significant" experienceLevel="intermediate" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/significant/advanced" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="significant" experienceLevel="advanced" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/intensive/beginner" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="intensive" experienceLevel="beginner" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/intensive/novice" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="intensive" experienceLevel="novice" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/intensive/intermediate" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="intensive" experienceLevel="intermediate" />
                </ErrorBoundary>
              } />
              <Route path="/courses/coding/intensive/advanced" element={
                <ErrorBoundary>
                  <WebDevCourse timeCommitment="intensive" experienceLevel="advanced" />
                </ErrorBoundary>
              } />

              {/* 404 catch-all route */}
              <Route path="*" element={
                <ErrorBoundary>
                  <NotFound />
                </ErrorBoundary>
              } />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
