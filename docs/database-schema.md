# Neothink Database Schema

This document provides a comprehensive overview of the Neothink platform's database schema. The database is designed to support multiple platforms, tenant isolation, and a sophisticated role-based access control system.

## Table of Contents

- [Overview](#overview)
- [Core Tables](#core-tables)
- [Authentication and Authorization](#authentication-and-authorization)
- [Content Management](#content-management)
- [Learning and Progress](#learning-and-progress)
- [Communication and Community](#communication-and-community)
- [Analytics and Reporting](#analytics-and-reporting)
- [Health and Wellness](#health-and-wellness)
- [Platform Configuration](#platform-configuration)

## Overview

The Neothink database is built on PostgreSQL using Supabase and implements:

- **Multi-tenant architecture**: Data isolation between platforms and organizations
- **Row-level security (RLS)**: Granular access control at the row level
- **Realtime subscriptions**: Live updates for collaborative features
- **Full-text search**: Efficient content discovery
- **Type safety**: Generated TypeScript types for all tables

## Core Tables

### Profiles Table
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  platform_roles JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  last_seen_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT false,
  subscription_status subscription_status DEFAULT 'inactive',
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_period_start TIMESTAMPTZ,
  subscription_period_end TIMESTAMPTZ
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);
```

### Platform Access
```sql
CREATE TABLE public.platform_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform_slug TEXT NOT NULL,
  access_level access_level NOT NULL DEFAULT 'member',
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  granted_by UUID REFERENCES public.profiles(id),
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, platform_slug)
);

-- RLS Policies
ALTER TABLE public.platform_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own platform access"
ON public.platform_access FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage platform access"
ON public.platform_access FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND platform_roles->>'role' = 'admin'
  )
);
```

### Features Table
```sql
CREATE TABLE public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category feature_category NOT NULL,
  status feature_status DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  required_subscription_tier subscription_tier DEFAULT 'free'
);

-- RLS Policies
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Features are viewable by authenticated users"
ON public.features FOR SELECT
USING (auth.role() = 'authenticated');
```

### Feature Access
```sql
CREATE TABLE public.feature_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID REFERENCES public.features(id) ON DELETE CASCADE,
  platform_slug TEXT NOT NULL,
  access_type access_type DEFAULT 'full',
  override_subscription_tier BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(feature_id, platform_slug)
);

-- RLS Policies
ALTER TABLE public.feature_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feature access viewable by authenticated users"
ON public.feature_access FOR SELECT
USING (auth.role() = 'authenticated');
```

### Content Table
```sql
CREATE TABLE public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  content_type content_type NOT NULL,
  status content_status DEFAULT 'draft',
  platform_slug TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
  ) STORED
);

-- RLS Policies
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published content is viewable by platform users"
ON public.content FOR SELECT
USING (
  status = 'published' AND
  EXISTS (
    SELECT 1 FROM public.platform_access
    WHERE user_id = auth.uid()
    AND platform_slug = content.platform_slug
  )
);

CREATE POLICY "Authors can manage their content"
ON public.content FOR ALL
USING (author_id = auth.uid());
```

## Authentication and Authorization

### Tenant Roles
```sql
CREATE TABLE tenant_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  priority INTEGER DEFAULT 0,
  role_category TEXT DEFAULT 'member'
);
```

### Role Capabilities
```sql
CREATE TABLE role_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  role_slug TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_approve BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Permissions
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  category TEXT,
  scope TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Role Permissions
```sql
CREATE TABLE role_permissions (
  role_id UUID NOT NULL,
  permission_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);
```

## Content Management

### Content Modules
```sql
CREATE TABLE content_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER,
  is_published BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Content Versions
```sql
CREATE TABLE content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  title TEXT,
  content TEXT,
  description TEXT,
  metadata JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT,
  review_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ
);
```

### Content Workflow
```sql
CREATE TABLE content_workflow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  platform TEXT NOT NULL,
  current_status TEXT NOT NULL,
  assigned_to UUID,
  review_notes TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Learning and Progress

### Concepts
```sql
CREATE TABLE concepts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  importance_level INTEGER NOT NULL,
  prerequisite_concepts UUID[],
  related_concepts UUID[],
  application_examples TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  tenant_slug TEXT NOT NULL,
  author_id UUID
);
```

### Learning Paths
```sql
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  path_name TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT,
  prerequisites JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Learning Progress
```sql
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  status TEXT NOT NULL,
  progress_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  last_interaction_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB
);
```

## Communication and Community

### Chat Rooms
```sql
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  is_group BOOLEAN DEFAULT false,
  platform TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Discussion Topics
```sql
CREATE TABLE discussion_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  category TEXT NOT NULL,
  tags TEXT[],
  status TEXT,
  tenant_slug TEXT NOT NULL
);
```

## Analytics and Reporting

### Analytics Metrics
```sql
CREATE TABLE analytics_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  metric_key TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  dimension_values JSONB,
  measured_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Analytics Reports
```sql
CREATE TABLE analytics_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  report_type TEXT NOT NULL,
  parameters JSONB,
  report_data JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Analytics Summaries
```sql
CREATE TABLE analytics_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  summary_type TEXT NOT NULL,
  time_period TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  metrics JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Health and Wellness

### Health Metrics
```sql
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  integration_id UUID,
  metric_type VARCHAR NOT NULL,
  value NUMERIC NOT NULL,
  unit VARCHAR NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  source VARCHAR NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Health Integrations
```sql
CREATE TABLE health_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  provider VARCHAR NOT NULL,
  provider_user_id VARCHAR,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Vital Signs
```sql
CREATE TABLE vital_signs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  vital_type VARCHAR NOT NULL,
  value NUMERIC NOT NULL,
  unit VARCHAR NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  source VARCHAR NOT NULL DEFAULT 'manual',
  integration_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Platform Configuration

### Feature Flags
```sql
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  feature_key TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL,
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Platform Settings
```sql
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Platform Customization
```sql
CREATE TABLE platform_customization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  component_key TEXT NOT NULL,
  customization JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
``` 