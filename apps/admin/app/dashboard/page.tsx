import React from 'react';
import { useRealtimeEvents } from '@neothink/gamification-utils/useRealtimeEvents';
import { KPIs } from './KPIs';

export default function DashboardPage() {
  const events = useRealtimeEvents({ tables: [
    'xp_events',
    'badge_events',
    'fibonacci_token_rewards',
    'census_snapshots',
  ] });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-white">Live Event Feed & KPIs</h2>
      <KPIs />
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg mt-8">
        <h3 className="text-xl font-semibold mb-4 text-white">Recent Events</h3>
        <ul className="space-y-3">
          {events.length === 0 && <li className="text-slate-400">No recent events.</li>}
          {events.map((event, idx) => (
            <li key={idx} className="p-3 rounded bg-gradient-to-r from-zinc-700 via-slate-700 to-gray-800 text-white">
              <strong className="capitalize">{event.table.replace('_', ' ')}:</strong> {event.event}
              <pre className="text-xs mt-1 text-slate-300 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(event.payload, null, 2)}</pre>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
