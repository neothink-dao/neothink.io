'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'; // Corrected import path
import { Award, Star, TrendingUp } from 'lucide-react'; // Example icons

export type GamificationStatsData = {
  points: number | null | undefined;
  role: string | null | undefined;
  streak: number | null | undefined;
  lastActive?: string | null | undefined; // Optional last active date
};

interface GamificationStatsProps {
  stats: GamificationStatsData | null;
  isLoading?: boolean;
  error?: string | null;
}

export const GamificationStats: React.FC<GamificationStatsProps> = ({
  stats,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading stats...</p>
          {/* TODO: Add Skeleton Loader */}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No gamification data available.</p>
        </CardContent>
      </Card>
    );
  }

  // Format role for display
  const displayRole = stats.role
    ? stats.role.charAt(0).toUpperCase() + stats.role.slice(1)
    : 'N/A';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-lg">
          <Award className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Points</p>
            <p className="text-lg font-semibold">{stats.points ?? 0}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-lg">
          <Star className="h-6 w-6 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p className="text-lg font-semibold">{displayRole}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-lg">
          <TrendingUp className="h-6 w-6 text-green-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
            <p className="text-lg font-semibold">{stats.streak ?? 0} days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 