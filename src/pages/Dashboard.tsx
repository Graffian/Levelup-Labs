
import React, { Suspense, ErrorInfo, useState } from 'react';
import DashboardComponent from '@/components/dashboard/Dashboard';
import RouterHeader from '@/components/layout/RouterHeader';
import Footer from '@/components/layout/Footer';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

/**
 * Dashboard Page Component - Main user dashboard
 * 
 * Features:
 * - Error boundary for fault isolation
 * - Suspense for loading state
 * - Error logging and reporting
 */
const Dashboard = () => {
  const [hasError, setHasError] = useState(false);
  
  /**
   * Handle dashboard component errors
   */
  const handleError = (error: Error, info: ErrorInfo) => {
    console.error("Dashboard error:", error);
    console.error("Component stack:", info.componentStack);
    
    // Show user-friendly toast notification
    toast({
      title: "Something went wrong",
      description: "We're working on fixing this issue. Please try again later.",
      variant: "destructive",
    });
    
    setHasError(true);
  };
  
  /**
   * Reset error state to attempt recovery
   */
  const handleRetry = () => {
    setHasError(false);
  };
  
  /**
   * Loading fallback for Suspense
   */
  const LoadingFallback = () => (
    <div className="container px-4 py-8 max-w-6xl">
      <div className="space-y-4">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-[300px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[150px]" />
          <Skeleton className="h-[150px]" />
          <Skeleton className="h-[150px]" />
        </div>
      </div>
    </div>
  );

  /**
   * Error fallback when dashboard fails to load
   */
  const ErrorFallback = () => (
    <div className="container px-4 py-8 max-w-6xl">
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Failed to load dashboard</AlertTitle>
        <AlertDescription>
          We encountered an error while loading your dashboard.
        </AlertDescription>
      </Alert>
      <button 
        onClick={handleRetry}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background bg-hero-pattern">
      <RouterHeader />
      <main className="flex-1 pt-24">
        <ErrorBoundary fallback={<ErrorFallback />}>
          <Suspense fallback={<LoadingFallback />}>
            {!hasError && <DashboardComponent />}
            {hasError && <ErrorFallback />}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
