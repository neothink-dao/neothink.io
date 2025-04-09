# Neothink Platform Examples

This document provides an overview of the example API routes and React components that demonstrate how to work with the Supabase database and analytics package across all Neothink platforms.

## Overview

These examples demonstrate:
- Fetching platform-specific data with Row Level Security (RLS) applied
- Inserting and querying analytics events from the shared analytics events table
- Using the analytics hooks for tracking user interactions
- Working with the Supabase client from `@neothink/core`

## Table of Contents

- [Hub Platform Examples](#hub-platform)
- [Ascenders Platform Examples](#ascenders-platform)
- [Neothinkers Platform Examples](#neothinkers-platform)
- [Immortals Platform Examples](#immortals-platform)

## Hub Platform

Located in `go.neothink.io/examples/`

### API Routes

- `hub-data.ts`: API route that demonstrates:
  - Authentication with a user token
  - Fetching platform-specific content from the `content` table
  - Fetching user progress data
  - Tracking API calls with analytics
  - Working with RLS-protected data

### React Components

- `HubAnalyticsExample.tsx`: React component that demonstrates:
  - Using the `usePageView` hook to track page views
  - Using the `useContentView` hook to track content interactions
  - Using the `useProgressTracker` hook to track user progress
  - Fetching content data from Supabase
  - Handling user authentication state

## Ascenders Platform

Located in `joinascenders/examples/`

### API Routes

- `ascenders-data.ts`: API route that demonstrates:
  - Authentication with a user token
  - Fetching Ascenders-specific content
  - Fetching user achievements
  - Fetching user profile data
  - Tracking API calls with analytics

### React Components

- `AscendersAnalyticsExample.tsx`: React component that demonstrates:
  - Using the `usePageView` hook to track page views
  - Using the `useAchievementTracker` hook to track achievements
  - Fetching achievements data from Supabase
  - Displaying achievement badges and points

## Neothinkers Platform

Located in `joinneothinkers/examples/`

### API Routes

- `neothinkers-data.ts`: API route that demonstrates:
  - Authentication with a user token
  - Fetching Neothinkers-specific courses
  - Fetching user progress on courses
  - Fetching Neothinkers-specific concepts
  - Tracking API calls with analytics

### React Components

- `NeothinkersAnalyticsExample.tsx`: React component that demonstrates:
  - Using the `usePageView` hook to track page views
  - Using the `useContentView` hook to track content interactions
  - Using the analytics API directly to track custom events
  - Fetching courses data from Supabase
  - Displaying course details with metadata

## Immortals Platform

Located in `joinimmortals/examples/`

### API Routes

- `immortals-data.ts`: API route that demonstrates:
  - Authentication with a user token
  - Fetching health metrics data
  - Fetching vital signs records
  - Fetching health integrations
  - Tracking API calls with analytics

### React Components

- `ImmortalsAnalyticsExample.tsx`: React component that demonstrates:
  - Using the `usePageView` hook to track page views
  - Using the analytics API directly to track health-related events
  - Fetching health metrics from Supabase
  - Displaying health data in a dashboard format
  - Tracking export actions with analytics

## Using These Examples

To use these examples in your project:

1. Make sure you have the required packages installed:
   - `@neothink/core` for database client
   - `@neothink/analytics` for analytics tracking
   - `@neothink/types` for TypeScript types

2. Copy the relevant example to your application

3. Update any paths or imports as needed for your specific setup

4. These examples assume:
   - A properly configured Supabase project
   - The correct RLS policies are in place
   - The analytics tables are properly set up

## Important Notes

- The linter errors in the examples are expected since the import paths are relative to the actual project structure.
- In a real application, you would need to ensure all the imports resolve correctly.
- Always test RLS policies carefully to ensure data security.
- These examples leverage the shared database structure across all platforms but demonstrate platform-specific filtering. 