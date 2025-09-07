/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext, useState, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import RouterHeader from "@/components/layout/RouterHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles, Trophy, Target } from "lucide-react";
import { useUser, useAuth } from "@clerk/clerk-react";
import OnboardingCheck from "@/components/database/onboarding/OnboardingCheck";
import OnboardingInsert from "@/components/database/onboarding/OnboardingInsert";

// Define the onboarding steps in order
const ONBOARDING_STEPS = [
  {
    path: "/onboarding",
    label: "Learning Goals",
    dataKey: "learning_goal",
    icon: Target,
    description: "What excites you to learn?",
  },
  {
    path: "/onboarding/time",
    label: "Time Commitment",
    dataKey: "time_commitment",
    icon: Sparkles,
    description: "How much time can you invest?",
  },
  {
    path: "/onboarding/experience",
    label: "Experience Level",
    dataKey: "experience_level",
    icon: Trophy,
    description: "Where are you starting from?",
  },
];

// Create a context to store and share onboarding data
type OnboardingContextType = {
  onboardingData: Record<string, any>;
  updateOnboardingData: (key: string, value: any) => void;
  currentStepIndex: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  canContinue: boolean;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

type OnboardingLayoutProps = {};

const OnboardingLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { isSignedIn, userId, getToken } = useAuth();

  const [onboardingData, setOnboardingData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine current step index
  const currentStepIndex = ONBOARDING_STEPS.findIndex(
    (step) => step.path === location.pathname,
  );
  const isLastStep = currentStepIndex === ONBOARDING_STEPS.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Check if current step has required data
  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const canContinue = currentStep
    ? !!onboardingData[currentStep.dataKey]
    : false;

  const updateOnboardingData = (key: string, value: any) => {
    setOnboardingData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveOnboardingData = useCallback(async () => {
    if (!userId || !isSignedIn) {
      setError("User not authenticated");
      return false;
    }

    const { learning_goal, time_commitment, experience_level } = onboardingData;

    try {
      setIsLoading(true);
      setError(null);

      // First check if the user already has onboarding data
      const checkResult = await OnboardingCheck(
        getToken,
        userId,
        learning_goal,
        time_commitment,
        experience_level
      );

      if (checkResult.error) {
        throw checkResult.error;
      }

      if (!checkResult.exists) {
        // If no existing data, insert new record
        const insertResult = await OnboardingInsert(getToken, {
          clerk_user_id: userId,
          learning_goal,
          time_commitment,
          experience_level,
        });

        if (!insertResult.success) {
          throw insertResult.error || new Error("Failed to save onboarding data");
        }
      } else if (checkResult.needsUpdate) {
        // Data exists and was updated, we can use checkResult.data
        console.log("Onboarding data updated");
      } else {
        // Data exists and is up to date
        console.log("Onboarding data is up to date");
      }

      return true;
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [onboardingData, userId, isSignedIn, getToken]);

  const goToNextStep = useCallback(async () => {
    if (!canContinue) return;

    if (isLastStep) {
      // On the last step, save the data before proceeding
      const success = await handleSaveOnboardingData();
      if (success) {
        navigate(`/personalizing/${onboardingData.learning_goal}/${onboardingData.time_commitment}/${onboardingData.experience_level}`);
      }
    } else {
      const nextStep = ONBOARDING_STEPS[currentStepIndex + 1];
      if (nextStep) {
        navigate(nextStep.path);
      }
    }
  }, [canContinue, currentStepIndex, isLastStep, navigate, onboardingData, handleSaveOnboardingData]);

  const goToPreviousStep = useCallback(() => {
    if (isFirstStep) return;
    const prevStep = ONBOARDING_STEPS[currentStepIndex - 1];
    if (prevStep) {
      navigate(prevStep.path);
    }
  }, [currentStepIndex, isFirstStep, navigate]);

  const progress = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateOnboardingData,
        currentStepIndex,
        goToNextStep,
        goToPreviousStep,
        isLastStep,
        isFirstStep,
        canContinue,
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <RouterHeader />
        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {ONBOARDING_STEPS.map((step, index) => (
                  <React.Fragment key={step.path}>
                    <div
                      className={`flex flex-col items-center ${
                        index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          index <= currentStepIndex
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span className="mt-2 text-sm font-medium">{step.label}</span>
                    </div>
                    {index < ONBOARDING_STEPS.length - 1 && (
                      <div className="h-0.5 flex-1 bg-border mx-2" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Current step content */}
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <Outlet />
            </div>

            {/* Navigation buttons */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isFirstStep || isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <Button
                onClick={goToNextStep}
                disabled={!canContinue || isLoading}
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}
          </div>
        </main>
      </div>
    </OnboardingContext.Provider>
  );
};

export default OnboardingLayout;
