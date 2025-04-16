import React from 'react';
import { platformColors } from '@neothink/ui';
import { PointsCircle } from '@neothink/ui';
import { Card, CardHeader, CardTitle, CardContent } from '@neothink/ui';
import { FeedbackDialog } from '@neothink/ui/components/feedback/FeedbackDialog';
// Assume other necessary imports

// Example User Data
const MOCK_USER = {
  id: 'user001',
  name: 'Hub User',
  totalPoints: 1000, // Example aggregate points
};

// Example Zoom Data
const MOCK_ZOOMS = [
    { id: 'zoom1', day: 'Sunday', topic: 'Weekly Sync', points: 351 }, // Points from instruction example
    { id: 'zoom2', day: 'Wednesday', topic: 'Mid-week Check-in', points: 100 },
];

export default function HubDashboardPage() {
  // Fetch user data, zoom schedule, etc.

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Neothink+ Hub Dashboard</h1>

      <div className="mb-8 flex items-center gap-4">
         {/* Display aggregate points or LUCK points? */}
         <PointsCircle points={MOCK_USER.totalPoints} platformColor={platformColors.luck} size={50} />
         <p>Welcome, {MOCK_USER.name}!</p>
      </div>

      {/* Zooms Section */}
      <h2 className="text-2xl font-semibold mb-4">Upcoming Zooms</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {MOCK_ZOOMS.map(zoom => (
            <Card key={zoom.id} style={{ borderColor: platformColors.luck }}>
                <CardHeader>
                    <CardTitle>{zoom.topic} ({zoom.day})</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Attend for <span className="font-bold" style={{color: platformColors.luck}}>{zoom.points} Points!</span> (Synergy Boost Applies)</p>
                    {/* Add join button/link */}
                </CardContent>
            </Card>
         ))}
      </div>

      {/* Add other Hub sections: Platform switching links, overall stats, etc. */}

      {/* Feedback Button for Continuous Improvement */}
      <div className="flex justify-end mt-8">
        <FeedbackDialog />
      </div>

    </div>
  );
} 