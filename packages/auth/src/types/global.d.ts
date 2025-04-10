// Type declarations for modules without type definitions
declare module '@neothink/database' {
  import { SupabaseClient } from '@supabase/supabase-js';
  import { PlatformSlug } from '@neothink/database/src/types/models';
  
  export function createClient(platformSlug: PlatformSlug): SupabaseClient;
}

declare module '@neothink/database/src/types/models' {
  export type PlatformSlug = 'hub' | 'ascenders' | 'immortals' | 'neothinkers';
}

// Properly define Next.js types
declare module 'next/server' {
  import { NextResponse as OriginalNextResponse, NextRequest as OriginalNextRequest } from 'next/server';
  export { NextResponse, NextRequest };
  export type NextResponse = OriginalNextResponse;
  export type NextRequest = OriginalNextRequest;
} 