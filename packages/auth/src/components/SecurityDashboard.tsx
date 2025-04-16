"use client";

import React, { useEffect, useState } from 'react';
import { createPlatformClient } from '@neothink/database';
import { SecurityLog, SecurityEventSeverity } from '@neothink/database';

/**
 * Security Dashboard Component
 * 
 * Displays recent security events with filtering options
 * This is an admin-only component and should be protected by authentication
 */
export default function SecurityDashboard({ platformSlug, limit = 100 }: { platformSlug: string; limit?: number }) {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    severity?: SecurityEventSeverity;
    event?: string;
    ip?: string;
  }>({});

  // Fetch security logs
  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createPlatformClient(platformSlug as any);
        
        let query = supabase
          .from('security_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        // Apply filters
        if (filter.severity) {
          query = query.eq('severity', filter.severity);
        }
        
        if (filter.event) {
          query = query.eq('event', filter.event);
        }
        
        if (filter.ip) {
          query = query.eq('ip_address', filter.ip);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setLogs(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch security logs');
        console.error('Error fetching security logs:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLogs();
  }, [platformSlug, limit, filter]);
  
  // Get unique event types for filter
  const eventTypes = [...new Set(logs.map(log => log.event))];
  
  // Get unique IP addresses for filter
  const ipAddresses = [...new Set(logs.map(log => log.ip_address).filter(Boolean))];

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Security Dashboard</h1>
      
      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={filter.severity || ''}
            onChange={(e) => setFilter(prev => ({
              ...prev,
              severity: e.target.value as SecurityEventSeverity || undefined
            }))}
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={filter.event || ''}
            onChange={(e) => setFilter(prev => ({
              ...prev,
              event: e.target.value || undefined
            }))}
          >
            <option value="">All Events</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IP Address
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={filter.ip || ''}
            onChange={(e) => setFilter(prev => ({
              ...prev,
              ip: e.target.value || undefined
            }))}
          >
            <option value="">All IP Addresses</option>
            {ipAddresses.map(ip => ip && (
              <option key={ip} value={ip}>{ip}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Loading and error states */}
      {loading && <div className="text-center py-4">Loading security logs...</div>}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      
      {/* Results table */}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No security logs found matching the current filters.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.event}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${log.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                          log.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          log.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ip_address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                        {log.request_path}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => alert(JSON.stringify({ context: log.context, details: log.details }, null, 2))}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Showing {logs.length} of {logs.length} results
          </div>
        </>
      )}
    </div>
  );
} 