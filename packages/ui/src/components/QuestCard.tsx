import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card'; // Corrected path
import { Button } from '../ui/button'; // Corrected path
import { cn } from '../utils';

// Define color mapping based on instructions
const platformColors = {
  live: '#f97316', // Orange
  love: '#d97706', // Amber
  life: '#ef4444', // Red
  luck: '#eab308', // Yellow
  flow: '#3b82f6', // Blue
  'mark-hamilton': '#22c55e', // Green
  'project-life': '#a855f7', // Purple
  default: '#71717a', // Zinc neutral
};

type PlatformColorKey = keyof typeof platformColors;

interface QuestCardProps {
  title: string;
  description: string;
  points: number;
  actionText: string; // e.g., "Read", "Execute"
  platform: PlatformColorKey;
  questType: 'read' | 'write' | 'execute' | 'superachiever' | 'trial' | 'zoom'; // Determines size and potential styling
  isTrialUser?: boolean;
  onActionClick?: () => void;
  className?: string;
}

// Simple Fibonacci size mapping (adjust values as needed)
const fibonacciSizes = {
  read: 'w-64', // Smallest
  write: 'w-80',
  execute: 'w-96', // Larger
  superachiever: 'w-[500px]', // Largest
  trial: 'w-64', // Same as read for trial
  zoom: 'w-80',
};

const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  points,
  actionText,
  platform,
  questType,
  isTrialUser = false,
  onActionClick,
  className,
}) => {
  const basePoints = isTrialUser ? 1 : points;
  const color = platformColors[platform] || platformColors.default;
  const sizeClass = fibonacciSizes[questType] || fibonacciSizes.read;

  return (
    <Card className={cn('overflow-hidden', sizeClass, className)} style={{ borderColor: color }}>
      <CardHeader className="p-4" style={{ backgroundColor: `${color}20` }}> {/* Slight tint */}
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {/* Can add quest-specific content here */}
        <p className="text-xs text-muted-foreground">Quest Type: {questType}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 bg-muted/50">
        <span className="font-bold" style={{ color: color }}>
          {basePoints} Point{basePoints !== 1 ? 's' : ''}
        </span>
        <Button
           variant="outline"
           size="sm"
           onClick={onActionClick}
           disabled={isTrialUser && questType !== 'read'} // Allow only read action for trial users? Adjust as needed.
           style={{ borderColor: color, color: color }}
           className="hover:bg-accent hover:text-accent-foreground"
        >
          {actionText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { QuestCard, platformColors }; // Export colors for reuse 