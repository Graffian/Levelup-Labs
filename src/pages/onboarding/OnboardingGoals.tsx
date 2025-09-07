import React, { useEffect } from "react";
import { useOnboarding } from "./OnboardingLayout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/clerk-react";
import {
  Code2,
  Palette,
  Brain,
  Gamepad2,
  Video,
  Heart,
  Target,
} from "lucide-react";

const learningGoals = [
  {
    id: "coding",
    title: "Programming & Web Development",
    description:
      "Master modern web technologies, build applications, and create digital solutions",
    icon: Code2,
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
  },
  {
    id: "design",
    title: "Design & Creativity",
    description:
      "Craft beautiful user experiences, visual designs, and creative digital art",
    icon: Palette,
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    iconColor: "text-pink-500",
  },
  {
    id: "data",
    title: "Data Science & AI",
    description:
      "Analyze data, build intelligent systems, and unlock insights with AI",
    icon: Brain,
    gradient: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    iconColor: "text-purple-500",
  },
  {
    id: "gaming",
    title: "Game Development",
    description:
      "Create immersive games and interactive experiences across platforms",
    icon: Gamepad2,
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-500",
  },
  {
    id: "media",
    title: "Digital Media & Content",
    description: "Produce engaging videos, podcasts, and multimedia content",
    icon: Video,
    gradient: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    iconColor: "text-orange-500",
  },
  {
    id: "personal",
    title: "Personal Development",
    description: "Build soft skills, leadership abilities, and personal growth",
    icon: Heart,
    gradient: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    iconColor: "text-teal-500",
  },
];

const OnboardingGoals = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-200 text-slate-700 text-sm font-semibold mb-3">
          <Target className="w-4 h-4 mr-2 text-blue-500" />
          Choose Your Path
        </div>
        <p className="text-lg text-slate-700 leading-relaxed max-w-xl mx-auto">
          What field excites you most? Select the area where you'd like to focus
          your learning energy.
        </p>
      </div>

      <RadioGroup
        value={onboardingData.learning_goal || ""}
        onValueChange={(value) => updateOnboardingData("learning_goal", value)}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {learningGoals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = onboardingData.learning_goal === goal.id;

          return (
            <div key={goal.id} className="relative group">
              <RadioGroupItem
                value={goal.id}
                id={goal.id}
                className="sr-only"
              />
              <Label htmlFor={goal.id} className="cursor-pointer block">
                <div
                  onClick={() => updateOnboardingData("learning_goal", goal.id)}
                  className={`
                    relative p-4 h-full bg-white border-2 rounded-xl transition-all duration-300 transform
                    hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg cursor-pointer
                    ${
                      isSelected
                        ? `${goal.bgColor} ${goal.borderColor} shadow-xl ring-4 ring-blue-100`
                        : "border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl"
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                      p-3 rounded-xl transition-all duration-300 border
                      ${
                        isSelected
                          ? `bg-gradient-to-br ${goal.gradient} text-white border-transparent shadow-lg`
                          : `${goal.bgColor} ${goal.borderColor} ${goal.iconColor}`
                      }
                    `}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-lg mb-2 transition-colors duration-300 ${
                          isSelected ? "text-slate-900" : "text-slate-800"
                        }`}
                      >
                        {goal.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed transition-colors duration-300 ${
                          isSelected ? "text-slate-700" : "text-slate-600"
                        }`}
                      >
                        {goal.description}
                      </p>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subtle glow effect on hover */}
                  <div
                    className={`
                    absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300
                    bg-gradient-to-br ${goal.gradient} -z-10
                  `}
                    style={{ filter: "blur(10px)" }}
                  />
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      <div className="text-center pt-4">
        <p className="text-slate-500 text-sm">
          Don't worry, you can always explore other areas later ✨
        </p>
      </div>
    </div>
  );
};

export default OnboardingGoals;
