
import React from 'react';
import { useOnboarding } from './OnboardingLayout';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, Coffee, Calendar, ClockIcon } from 'lucide-react';

const timeOptions = [
  { 
    id: 'minimal', 
    title: '3 months', 
    description: 'Just dipping my toes in, casual learning',
    icon: Coffee
  },
  { 
    id: 'moderate', 
    title: '6 months', 
    description: 'Committed to progress at a steady pace',
    icon: Clock
  },
  { 
    id: 'significant', 
    title: '12 months', 
    description: 'Dedicated to making substantial progress',
    icon: Calendar
  },
  { 
    id: 'intensive', 
    title: '24 months', 
    description: 'Immersive learning is my priority',
    icon: ClockIcon
  },
];

const OnboardingTime = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  
  return (
    <div className="space-y-6">
      <p className="text-lg">
        How much time can you dedicate to learning each week?
      </p>
      
      <RadioGroup
        value={onboardingData.timeCommitment || ''}
        onValueChange={(value) => updateOnboardingData('time_commitment', value)}
        className="grid grid-cols-1 gap-4"
      >
        {timeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = onboardingData.time_commitment === option.id;
          return (
            <div key={option.id} className="relative">
              <RadioGroupItem
                value={option.id}
                id={option.id}
                className="sr-only"
              />
              <Label htmlFor={option.id} className="cursor-pointer">
                <Card className={`p-6 border-2 transition-all hover:border-primary hover:shadow-md flex items-center gap-4 ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary'
                }`}>
                  <div className={`p-2 rounded-full ${
                    isSelected ? 'bg-primary/20' : 'bg-primary/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isSelected ? 'text-primary' : 'text-primary'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </Card>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default OnboardingTime;
