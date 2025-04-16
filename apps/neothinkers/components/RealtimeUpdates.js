'use client';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@neothink/core';
import { analytics } from '@neothink/analytics';
/**
 * Component that demonstrates Supabase real-time broadcast functionality
 * with enhanced error handling and performance monitoring for the Neothinkers platform
 *
 * @see SUPABASE.md#realtime-database-broadcast - Broadcast implementation details
 */
export function RealtimeUpdates() {
    const [updates, setUpdates] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [error, setError] = useState(null);
    const [reconnectCount, setReconnectCount] = useState(0);
    // Use a ref to track the subscription to avoid memory leaks
    const channelRef = useRef(null);
    const lastMessageTimeRef = useRef(Date.now());
    // Performance tracking
    const [latency, setLatency] = useState(null);
    useEffect(() => {
        // Reset state
        setUpdates([]);
        setConnectionStatus('connecting');
        setError(null);
        setReconnectCount(0);
        let reconnectTimer = null;
        // Track subscription start in analytics
        analytics.track('realtime_subscription_start', {
            platform: 'neothinkers',
            timestamp: new Date().toISOString()
        }).catch(e => console.warn('Failed to track subscription start:', e));
        // Set up realtime subscription for achievement updates
        // This uses the Database Broadcast feature from Supabase Launch Week 14
        try {
            const channel = supabase
                .channel(`achievements-updates-neothinkers`, {
                config: {
                    broadcast: { self: true }, // Include own changes
                    presence: { key: 'anonymous' }, // Enable presence
                }
            })
                .on('postgres_changes', {
                event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
                schema: 'public',
                table: 'achievements',
                filter: `platform=eq.neothinkers` // Platform-specific filter
            }, (payload) => {
                // Measure latency
                const receivedTime = Date.now();
                const eventLatency = receivedTime - lastMessageTimeRef.current;
                lastMessageTimeRef.current = receivedTime;
                setLatency(eventLatency);
                // Add the update to our list with a timestamp
                const update = Object.assign(Object.assign({}, payload), { received_at: new Date().toISOString() });
                setUpdates(prev => [update, ...prev].slice(0, 5)); // Keep only the most recent 5 updates
                // Track the event in analytics
                analytics.track('realtime_event_received', {
                    platform: 'neothinkers',
                    event_type: payload.eventType,
                    latency: eventLatency,
                }).catch(e => console.warn('Failed to track realtime event:', e));
            })
                .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                console.log('Presence state:', state);
            })
                .on('system', { event: 'disconnect' }, () => {
                setConnectionStatus('disconnected');
                setError('Connection lost. Attempting to reconnect...');
                // Attempt to reconnect after a delay
                if (reconnectTimer)
                    clearTimeout(reconnectTimer);
                reconnectTimer = setTimeout(() => {
                    setReconnectCount(prev => prev + 1);
                    channel.subscribe();
                }, 3000);
            })
                .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    setConnectionStatus('connected');
                    setError(null);
                }
                else if (status === 'CHANNEL_ERROR') {
                    setConnectionStatus('error');
                    setError((err === null || err === void 0 ? void 0 : err.message) || 'Connection error');
                }
                else {
                    setConnectionStatus('connecting');
                }
            });
            // Store channel ref for cleanup
            channelRef.current = channel;
        }
        catch (err) {
            console.error('Error setting up real-time subscription:', err);
            setError(err instanceof Error ? err.message : 'Failed to set up real-time subscription');
            setConnectionStatus('error');
        }
        // Cleanup function to remove the subscription
        return () => {
            if (reconnectTimer)
                clearTimeout(reconnectTimer);
            if (channelRef.current) {
                channelRef.current.unsubscribe();
                // Track subscription end in analytics
                analytics.track('realtime_subscription_end', {
                    platform: 'neothinkers',
                    duration_seconds: Math.floor((Date.now() - lastMessageTimeRef.current) / 1000),
                    reconnect_count: reconnectCount,
                }).catch(e => console.warn('Failed to track subscription end:', e));
            }
        };
    }, [reconnectCount]);
    return (<div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Realtime Updates</h2>
        <div className="flex items-center">
          <span className={`h-2 w-2 rounded-full mr-2 ${connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
          <span className="text-xs text-gray-500">
            {connectionStatus === 'connected' ? 'Connected' :
            connectionStatus === 'error' ? 'Connection Error' : 'Connecting...'}
          </span>
        </div>
      </div>

      {error && (<div className="mb-4 p-2 text-sm bg-red-50 text-red-600 rounded border border-red-200">
          {error}
          {reconnectCount > 0 && <span> (Attempt {reconnectCount})</span>}
        </div>)}

      {latency !== null && (<div className="mb-4 text-xs text-gray-500">
          Last event latency: {latency}ms
        </div>)}

      {updates.length === 0 ? (<p className="text-sm text-gray-500 italic">
          No updates yet. Changes to achievements will appear here in real-time.
        </p>) : (<div className="space-y-2">
          {updates.map((update, index) => (<div key={index} className="text-sm p-2 rounded border border-gray-100">
              <div className="flex justify-between mb-1">
                <span className={`font-medium ${update.eventType === 'INSERT' ? 'text-green-600' :
                    update.eventType === 'UPDATE' ? 'text-blue-600' : 'text-red-600'}`}>
                  {update.eventType === 'INSERT'
                    ? 'New achievement added'
                    : update.eventType === 'UPDATE'
                        ? 'Achievement updated'
                        : 'Achievement removed'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(update.received_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {update.eventType === 'DELETE'
                    ? `ID: ${update.old.id}`
                    : `"${update.new.name}" (ID: ${update.new.id})`}
              </p>
            </div>))}
        </div>)}

      <div className="mt-4 text-center text-xs text-gray-500">
        Using Supabase Realtime Broadcast for Neothinkers achievement updates
        {reconnectCount > 0 && ` (Reconnected ${reconnectCount} times)`}
      </div>
    </div>);
}
//# sourceMappingURL=RealtimeUpdates.js.map