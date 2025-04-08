'use client';

import React from 'react';
import { useTheme } from '../context/theme-context';
import { Badge } from './ui/badge';

export function PlatformIndicator() {
  const { platform } = useTheme();
  
  const platformColors = {
    hub: 'bg-blue-500 hover:bg-blue-600',
    ascenders: 'bg-green-500 hover:bg-green-600',
    neothinkers: 'bg-purple-500 hover:bg-purple-600',
    immortals: 'bg-red-500 hover:bg-red-600'
  };
  
  const platformNames = {
    hub: 'Neothink+',
    ascenders: 'Ascenders',
    neothinkers: 'Neothinkers',
    immortals: 'Immortals'
  };
  
  return (
    <Badge
      className={`${platformColors[platform]} text-white`}
      variant="secondary"
    >
      {platformNames[platform]}
    </Badge>
  );
} 