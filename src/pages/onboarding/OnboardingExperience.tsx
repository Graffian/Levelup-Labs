import React from "react";
import { useOnboarding } from "./OnboardingLayout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sprout, Compass, Rocket, Crown, TrendingUp } from "lucide-react";

const experienceLevels = [
  {
    id: "beginner",
    title: "Complete Beginner",
    description:
      "Starting fresh with no prior experience - and that's perfectly exciting!",
    icon: Sprout,
    gradient: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    journey: "Your learning adventure begins here",
    timeToNext: "2-3 months of consistent learning",
    skills: ["Basic concepts", "Fundamentals", "First projects"],
  },
  {
    id: "novice",
    title: "Curious Novice",
    description:
      "You've dabbled a bit and want to build a solid foundation with proper guidance",
    icon: Compass,
    gradient: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    journey: "Ready to structure your knowledge",
    timeToNext: "3-4 months of focused practice",
    skills: ["Structured learning", "Best practices", "Real projects"],
  },
  {
    id: "intermediate",
    title: "Growing Intermediate",
    description:
      "You have some experience and can build things, now ready to level up significantly",
    icon: Rocket,
    gradient: "from-purple-400 to-indigo-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    journey: "Accelerating toward expertise",
    timeToNext: "4-6 months of advanced practice",
    skills: ["Advanced concepts", "Complex projects", "Industry standards"],
  },
  {
    id: "advanced",
    title: "Advanced Practitioner",
    description:
      "Substantial experience under your belt, seeking mastery and cutting-edge skills",
    icon: Crown,
    gradient: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    journey: "Mastering expert-level concepts",
    timeToNext: "Continuous growth and specialization",
    skills: ["Expert techniques", "Leadership", "Innovation"],
  },
];

const OnboardingExperience = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-200 text-slate-700 text-sm font-semibold mb-6">
          <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
          Your Starting Point
        </div>
        <p className="text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto">
          Where are you in your learning journey? This helps us tailor the
          perfect path for you.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Every expert was once a beginner - we'll meet you exactly where you
          are 🌱
        </p>
      </div>

      <RadioGroup
        value={onboardingData.experience_level || ""}
        onValueChange={(value) =>
          updateOnboardingData("experience_level", value)
        }
        className="grid grid-cols-1 gap-5"
      >
        {experienceLevels.map((level) => {
          const Icon = level.icon;
          const isSelected = onboardingData.experience_level === level.id;

          return (
            <div key={level.id} className="relative group">
              <RadioGroupItem
                value={level.id}
                id={level.id}
                className="sr-only"
              />
              <Label htmlFor={level.id} className="cursor-pointer block">
                <div
                  onClick={() =>
                    updateOnboardingData("experience_level", level.id)
                  }
                  className={`
                    relative p-4 bg-white border-2 rounded-xl transition-all duration-300 transform
                    hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg cursor-pointer
                    ${
                      isSelected
                        ? `${level.bgColor} ${level.borderColor} shadow-xl ring-4 ring-blue-100`
                        : "border-slate-200 hover:border-slate-300 shadow-lg"
                    }
                  `}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className={`
                      p-4 rounded-xl transition-all duration-300 flex-shrink-0 border
                      ${
                        isSelected
                          ? `bg-gradient-to-br ${level.gradient} text-white border-transparent shadow-lg`
                          : `${level.bgColor} ${level.borderColor} text-slate-600`
                      }
                    `}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-xl mb-2 transition-colors duration-300 ${
                          isSelected ? "text-slate-900" : "text-slate-800"
                        }`}
                      >
                        {level.title}
                      </h3>

                      <p
                        className={`text-sm leading-relaxed mb-3 transition-colors duration-300 ${
                          isSelected ? "text-slate-700" : "text-slate-600"
                        }`}
                      >
                        {level.description}
                      </p>

                      <div
                        className={`text-xs font-medium mb-3 transition-colors duration-300 ${
                          isSelected ? "text-slate-600" : "text-slate-500"
                        }`}
                      >
                        🎯 {level.journey}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {level.skills.map((skill, index) => (
                          <span
                            key={index}
                            className={`
                              px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 border
                              ${
                                isSelected
                                  ? "bg-white/60 text-slate-800 border-slate-300"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }
                            `}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div
                        className={`text-xs transition-colors duration-300 ${
                          isSelected ? "text-slate-600" : "text-slate-500"
                        }`}
                      >
                        ⏱️ {level.timeToNext}
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="flex-shrink-0 self-start">
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
                    bg-gradient-to-br ${level.gradient} -z-10
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
          Remember: growth happens outside your comfort zone, but learning
          happens within it 💫
        </p>
      </div>
    </div>
  );
}

export default OnboardingExperience;
