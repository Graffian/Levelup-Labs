import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, Clock, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ResourceProps {
  id: number;
  title: string;
  description: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  provider: string;
  url: string;
}


interface ResourceCardProps {
  resource: ResourceProps;
  className?: string;
}


const ResourceCard = ({ resource, className }: ResourceCardProps) => {
  // Map difficulty to color classes
  const difficultyColors: Record<ResourceProps['difficulty'], string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-purple-100 text-purple-800'
  };

  return (
    <Card className={cn("overflow-hidden card-hover h-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="line-clamp-1">{resource.title}</CardTitle>
            <CardDescription className="mt-1">
              {resource.provider}
            </CardDescription>
          </div>
          <Badge variant="secondary" className={difficultyColors[resource.difficulty]}>
            {resource.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4.5rem]">
          {resource.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {resource.tags.slice(0, 3).map((tag, i) => (
            <Badge key={i} variant="outline" className="bg-secondary/50">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="outline" className="bg-secondary/50">
              +{resource.tags.length - 3}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{resource.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{resource.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex gap-2">
          <Button className="w-1/2 flex gap-2 items-center">
            <BookOpen className="h-4 w-4" />
            <span>Save</span>
          </Button>
          <Button variant="outline" className="w-1/2 flex gap-2 items-center" asChild>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span>Visit</span>
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}


export default ResourceCard;
