
import React from 'react';
import { cn } from '../../lib/utils';

interface SkillBadgeProps {
  name: string;
  level: number;
  maxLevel?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SkillBadge = ({
  name,
  level,
  maxLevel = 5,
  className,
  size = 'md',
}: SkillBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-1.5 px-3',
    lg: 'text-base py-2 px-4',
  };
  
  const renderLevelIndicator = () => {
    return (
      <div className="flex gap-0.5 mt-1">
        {Array.from({ length: maxLevel }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 rounded-full",
              i < level ? "bg-primary" : "bg-primary/20"
            )}
            style={{ width: `${100 / maxLevel}%` }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div
      className={cn(
        "rounded-lg bg-secondary flex flex-col",
        sizeClasses[size],
        className
      )}
    >
      <span className="font-medium">{name}</span>
      {renderLevelIndicator()}
    </div>
  );
};

export default SkillBadge;
