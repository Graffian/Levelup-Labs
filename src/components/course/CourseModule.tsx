
import React from 'react';
import { ChevronDown, ChevronRight, Play, Check } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ErrorBoundary from '@/components/common/ErrorBoundary';

/**
 * Video object representing a course lesson
 */
export type ModuleVideo = {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed?: boolean;
};

/**
 * SubModule representing a section within a course module
 */
export type CourseSubModule = {
  id: string;
  title: string;
  videos: ModuleVideo[];
};

/**
 * Props for the CourseModule component
 */
export type CourseModuleProps = {
  id: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  subModules: CourseSubModule[];
  expanded?: boolean;
  onSelect?: (videoId: string) => void;
  completedVideos?: string[];
  onToggleComplete?: (videoId: string) => void;
};

/**
 * CourseModule Component - Displays an expandable module with video lessons
 * 
 * Features:
 * - Expandable/collapsible module sections
 * - Video listing with completion status
 * - Completion tracking and toggling
 * - Error boundary for fault isolation
 */
const CourseModule = ({ 
  id, 
  title, 
  subtitle, 
  tags = [], 
  subModules, 
  expanded = false,
  onSelect,
  completedVideos = [],
  onToggleComplete
}: CourseModuleProps) => {

  /**
   * Safely handles video selection with error catching
   */
  const handleVideoSelect = (videoId: string, event: React.MouseEvent) => {
    try {
      event.preventDefault();
      if (onSelect) onSelect(videoId);
    } catch (error) {
      console.error("Error selecting video:", error);
      // Could show a toast notification here
    }
  };

  /**
   * Safely handles completion toggling with error catching
   */
  const handleToggleComplete = (videoId: string, event: React.MouseEvent) => {
    try {
      event.stopPropagation(); // Prevent triggering the parent click handler
      event.preventDefault();
      if (onToggleComplete){
        onToggleComplete(videoId);
      }
    } catch (error) {
      console.error("Error toggling completion status:", error);
      // Could show a toast notification here
    }
  };

  // Verify we have valid data before rendering
  if (!id || !subModules) {
    console.warn("CourseModule received invalid props:", { id, subModules });
    return (
      <div className="p-4 border border-amber-200 bg-amber-50 rounded-md">
        <p className="text-amber-800">This module could not be displayed correctly.</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Accordion 
        type="single" 
        collapsible 
        defaultValue={expanded ? id : undefined}
        className="border-b"
      >
        <AccordionItem value={id} className="border-0">
          <AccordionTrigger className="py-4 px-2 hover:no-underline">
            <div className="flex items-center gap-2 text-left">
              <div>
                <h3 className="font-medium text-base">{title}</h3>
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-2 space-y-1">
              {tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {subModules?.map((subModule) => (
                <div key={subModule.id} className="mb-6 last:mb-0">
                  <h4 className="font-medium text-sm mb-2">{subModule.title}</h4>
                  <div className="space-y-2">
                    {subModule.videos?.map((video) => {
                      const isCompleted = completedVideos?.includes(video.id);
                      return (
                        <div key={video.id} className="flex items-center">
                          <Button
                            variant="ghost"
                            className={`w-full justify-start text-left p-2 h-auto gap-2 ${isCompleted ? 'text-muted-foreground' : ''}`}
                            onClick={(e) => handleVideoSelect(video.id, e)}
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Play className="w-4 h-4 text-blue-500" />
                            )}
                            <div className="flex-1">
                              <p className={`text-sm ${isCompleted ? 'line-through' : ''}`}>
                                {video.title}
                              </p>
                              <p className="text-xs text-muted-foreground">{video.duration}</p>
                            </div>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => handleToggleComplete(video.id, e)}
                          >
                            <Check className={`h-5 w-5 transition-colors duration-150 ${isCompleted ? 'text-green-500' : 'text-gray-300'}`} />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ErrorBoundary>
  );
};

export default CourseModule;