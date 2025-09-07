import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Brain, 
  Target, 
  Rocket,
  Code2,
  Palette,
  BarChart3,
  CheckCircle
} from 'lucide-react';

const PersonalizingLoader = () => {
  const { goalId, timeId, experienceId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // Personalization steps based on the selected goal
  const getPersonalizationSteps = () => {
    const baseSteps = [
      { text: "Analyzing your learning goals...", icon: Target },
      { text: "Optimizing for your time commitment...", icon: Sparkles },
      { text: "Customizing difficulty level...", icon: Brain },
    ];

    let goalSpecificSteps = [];
    
    if (goalId === 'coding') {
      goalSpecificSteps = [
        { text: "Setting up coding environment...", icon: Code2 },
        { text: "Preparing interactive coding challenges...", icon: Rocket },
      ];
    } else if (goalId === 'design') {
      goalSpecificSteps = [
        { text: "Curating design resources...", icon: Palette },
        { text: "Preparing creative projects...", icon: Sparkles },
      ];
    } else if (goalId === 'data') {
      goalSpecificSteps = [
        { text: "Loading datasets and tools...", icon: BarChart3 },
        { text: "Configuring analytics environment...", icon: Brain },
      ];
    }

    return [
      ...baseSteps,
      ...goalSpecificSteps,
      { text: "Your personalized course is ready!", icon: CheckCircle }
    ];
  };

  const steps = getPersonalizationSteps();

  useEffect(() => {
    const totalDuration = 4000; // 4 seconds total
    const stepDuration = totalDuration / steps.length;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / steps.length);
        
        // Update current step
        const newStep = Math.floor(newProgress / (100 / steps.length));
        setCurrentStep(Math.min(newStep, steps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          // Navigate to the actual learning path after completion
          setTimeout(() => {
            navigate(`/learning-path/${goalId}/${timeId}/${experienceId}`);
          }, 500);
        }
        
        return Math.min(newProgress, 100);
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [goalId, timeId, experienceId, navigate, steps.length]);

  const getGoalTitle = () => {
    switch (goalId) {
      case 'coding': return 'Web Development';
      case 'design': return 'UI/UX Design';
      case 'data': return 'Data Science';
      default: return 'Learning';
    }
  };

  const getGoalIcon = () => {
    switch (goalId) {
      case 'coding': return Code2;
      case 'design': return Palette;
      case 'data': return BarChart3;
      default: return Target;
    }
  };

  const GoalIcon = getGoalIcon();
  const CurrentStepIcon = steps[currentStep]?.icon || Sparkles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Goal Icon */}
        <div className="mb-8">
          <div className="relative mx-auto w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <GoalIcon className="w-10 h-10 text-white" />
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Personalizing Your
          <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
            {getGoalTitle()} Course
          </span>
        </h1>

        <p className="text-xl text-slate-300 mb-12">
          We're customizing your learning experience based on your preferences...
        </p>

        {/* Progress Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          {/* Current Step */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-4 text-white">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                <CurrentStepIcon className="w-4 h-4" />
              </div>
              <span className="text-lg font-medium">
                {steps[currentStep]?.text || "Getting ready..."}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress 
              value={progress} 
              className="h-3 bg-white/20" 
            />
            <div className="flex justify-between text-sm text-slate-300 mt-2">
              <span>Setting up...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Steps Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {steps.slice(0, -1).map((step, index) => (
              <div 
                key={index}
                className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                  index <= currentStep 
                    ? 'text-green-400 bg-green-400/10' 
                    : 'text-slate-400'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-green-400' : 'bg-slate-600'
                }`}>
                  {index <= currentStep && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className="truncate">{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Animation */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>

        <p className="text-slate-400 text-sm mt-4">
          This will only take a few seconds...
        </p>
      </div>
    </div>
  );
};

export default PersonalizingLoader;
