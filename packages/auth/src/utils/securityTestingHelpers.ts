/**
 * Security Testing Helpers
 * 
 * This file contains utilities to help test the security features of the application.
 * DO NOT include this in production builds!
 */

import type { SecurityEvent, SecurityEventSeverity, SecurityEventType, SecurityLog, PlatformSlug } from '@neothink/database';
import { createPlatformClient } from '@neothink/database';

/**
 * Get recent security logs for testing and development
 */
export async function getRecentSecurityLogs(
  platformSlug: PlatformSlug = 'hub',
  limit = 100
) {
  const supabase = createPlatformClient(platformSlug);
  
  const { data, error } = await supabase
    .from('security_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Failed to get security logs:', error);
    return [];
  }
  
  return data;
}

/**
 * Get rate limit records for testing
 */
export async function getRateLimitRecords(
  identifier: string,
  platformSlug: PlatformSlug = 'hub'
) {
  const supabase = createPlatformClient(platformSlug);
  
  const { data, error } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('identifier', identifier)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Failed to get rate limit records:', error);
    return [];
  }
  
  return data;
}

/**
 * Generate test security logs for development and testing
 */
export async function generateTestSecurityLogs(
  count = 10,
  platformSlug: PlatformSlug = 'hub'
) {
  if (process.env.NODE_ENV === 'production') {
    console.error('Cannot generate test logs in production');
    return;
  }
  
  const supabase = createPlatformClient(platformSlug);
  const severities: SecurityEventSeverity[] = ['low', 'medium', 'high', 'critical'];
  const events = [
    'login_attempt',
    'login_success',
    'login_failure',
    'password_reset',
    'suspicious_activity',
    'rate_limit_exceeded',
    'access_denied'
  ];
  
  const ips = [
    '192.168.1.1',
    '10.0.0.1',
    '172.16.0.1',
    '127.0.0.1'
  ];
  
  const logs = Array.from({ length: count }, () => ({
    event: events[Math.floor(Math.random() * events.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    platform_slug: platformSlug,
    ip_address: ips[Math.floor(Math.random() * ips.length)],
    user_agent: 'Testing Agent',
    request_path: '/test/path',
    context: { test: true },
    details: { test: true }
  }));
  
  const { error } = await supabase.from('security_logs').insert(logs);
  
  if (error) {
    console.error('Failed to insert test logs:', error);
    return;
  }
  
  console.log(`Successfully inserted ${count} test security logs`);
}

/**
 * Clear test security logs (for cleanup)
 */
export async function clearTestSecurityLogs(platformSlug: PlatformSlug = 'hub') {
  if (process.env.NODE_ENV === 'production') {
    console.error('Cannot clear logs in production');
    return;
  }
  
  const supabase = createPlatformClient(platformSlug);
  
  const { error } = await supabase
    .from('security_logs')
    .delete()
    .eq('context->test', 'true');
    
  if (error) {
    console.error('Failed to clear test logs:', error);
    return;
  }
  
  console.log('Successfully cleared test security logs');
} 