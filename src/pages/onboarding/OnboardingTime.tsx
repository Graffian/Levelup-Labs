import React from "react";
import { useOnboarding } from "./OnboardingLayout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Coffee, Clock, Calendar, Zap, Timer } from "lucide-react";

const timeOptions = [
  {
    id: "minimal",
    title: "1-2 hours per week",
    description:
      "Perfect for busy schedules, learn at your own pace with bite-sized sessions",
    icon: Coffee,
    timeDetail: "15-30 min sessions",
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    intensity: "Casual Explorer",
  },
  {
    id: "moderate",
    title: "3-5 hours per week",
    description:
      "Steady progress with dedicated learning sessions throughout the week",
    icon: Clock,
    timeDetail: "30-60 min sessions",
    gradient: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    intensity: "Consistent Learner",
  },
  {
    id: "significant",
    title: "5-10 hours per week",
    description:
      "Accelerated learning with substantial time investment for faster results",
    icon: Calendar,
    timeDetail: "1-2 hour sessions",
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    intensity: "Dedicated Student",
  },
  {
    id: "intensive",
    title: "10+ hours per week",
    description:
      "Immersive experience for rapid skill development and career transition",
    icon: Zap,
    timeDetail: "2+ hour sessions",
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    intensity: "Power Learner",
  },
];

const OnboardingTime = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-600/10 border border-green-200 text-slate-700 text-sm font-semibold mb-6">
          <Timer className="w-4 h-4 mr-2 text-green-500" />
          Time Investment
        </div>
        <p className="text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto">
          How much time can you realistically dedicate to learning each week?
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Be honest with yourself - consistency beats intensity 💪
        </p>
      </div>

      <RadioGroup
        value={onboardingData.time_commitment || ""}
        onValueChange={(value) =>
          updateOnboardingData("time_commitment", value)
        }
        className="grid grid-cols-1 gap-4"
      >
        {timeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = onboardingData.time_commitment === option.id;

          return (
            <div key={option.id} className="relative group">
              <RadioGroupItem
                value={option.id}
                id={option.id}
                className="sr-only"
              />
              <Label htmlFor={option.id} className="cursor-pointer block">
                <div
                  onClick={() =>
                    updateOnboardingData("time_commitment", option.id)
                  }
                  className={`
                    relative p-4 bg-white border-2 rounded-xl transition-all duration-300 transform
                    hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg cursor-pointer
                    ${
                      isSelected
                        ? `${option.bgColor} ${option.borderColor} shadow-xl ring-4 ring-blue-100`
                        : "border-slate-200 hover:border-slate-300 shadow-lg"
                    }
                  `}
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`
                      p-4 rounded-xl transition-all duration-300 flex-shrink-0 border
                      ${
                        isSelected
                          ? `bg-gradient-to-br ${option.gradient} text-white border-transparent shadow-lg`
                          : `${option.bgColor} ${option.borderColor} text-slate-600`
                      }
                    `}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className={`font-semibold text-xl transition-colors duration-300 ${
                            isSelected ? "text-slate-900" : "text-slate-800"
                          }`}
                        >
                          {option.title}
                        </h3>
                        <span
                          className={`
                          px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 border
                          ${
                            isSelected
                              ? "bg-white/50 text-slate-800 border-slate-300"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }
                        `}
                        >
                          {option.intensity}
                        </span>
                      </div>

                      <p
                        className={`text-sm leading-relaxed mb-3 transition-colors duration-300 ${
                          isSelected ? "text-slate-700" : "text-slate-600"
                        }`}
                      >
                        {option.description}
                      </p>

                      <div
                        className={`text-xs font-medium transition-colors duration-300 ${
                          isSelected ? "text-slate-600" : "text-slate-500"
                        }`}
                      >
                        💡 Recommended: {option.timeDetail}
                      </div>
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
                    bg-gradient-to-r ${option.gradient} -z-10
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
          You can always adjust your schedule later as your routine evolves ⚡
        </p>
      </div>
    </div>
  );
};

export default OnboardingTime;
