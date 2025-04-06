import { 
  hubMiddleware, 
  standardMatcherConfig 
} from '../lib/middleware/unified-middleware';
import type { NextRequest } from 'next/server';

/**
 * Authentication middleware for the Hub platform
 * Uses the unified middleware implementation for consistency across all platforms
 */
export async function middleware(request: NextRequest) {
  // Using the platform-specific middleware from the unified implementation
  return await hubMiddleware(request);
}

/**
 * Standard matcher configuration to prevent middleware from running on static assets
 */
export const config = standardMatcherConfig;

