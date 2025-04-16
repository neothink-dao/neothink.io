"use client";
import React from "react";
import { useRealtimeEvents, EventTable, RealtimeEvent } from "@neothink/gamification-utils/useRealtimeEvents";

const TABLE_LABELS: Record<EventTable, string> = {
  xp_events: "XP Events",
  badge_events: "Badge Events",
  fibonacci_token_rewards: "Fibonacci Rewards",
  census_snapshots: "Census Snapshots",
};

function formatEvent(event: RealtimeEvent) {
  switch (event.table) {
    case "xp_events":
      return (
        <>
          <b>User:</b> {event.payload.user_id} &nbsp;
          <b>XP:</b> {event.payload.xp_amount} &nbsp;
          <b>Type:</b> {event.payload.event_type}
        </>
      );
    case "badge_events":
      return (
        <>
          <b>User:</b> {event.payload.user_id} &nbsp;
          <b>Badge:</b> {event.payload.badge_id} &nbsp;
          <b>Earned:</b> {String(event.payload.earned)}
        </>
      );
    case "fibonacci_token_rewards":
      return (
        <>
          <b>User:</b> {event.payload.user_id} &nbsp;
          <b>Level:</b> {event.payload.level} &nbsp;
          <b>Tokens:</b> {event.payload.tokens}
        </>
      );
    case "census_snapshots":
      return (
        <>
          <b>Scope:</b> {event.payload.scope} &nbsp;
          <b>Population:</b> {event.payload.population} &nbsp;
          <b>Activity:</b> {event.payload.activity_count}
        </>
      );
    default:
      return JSON.stringify(event.payload);
  }
}

export default function EventStream() {
  const events = useRealtimeEvents({
    tables: [
      "xp_events",
      "badge_events",
      "fibonacci_token_rewards",
      "census_snapshots",
    ],
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Live Event Stream</h2>
      <div className="max-h-96 overflow-y-auto">
        {events.length === 0 && <div className="text-gray-400">No events yet.</div>}
        <ul className="space-y-2">
          {events.slice(-50).reverse().map((event, idx) => (
            <li key={idx} className="border-b pb-1 text-sm">
              <span className="font-semibold text-indigo-600">{TABLE_LABELS[event.table]}:</span> {formatEvent(event)}
              <span className="ml-2 text-gray-400">({event.event})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
