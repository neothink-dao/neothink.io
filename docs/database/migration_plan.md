# Neothink Database Migration Plan

![Migration Banner](https://assets.neothink.io/docs/migration-banner.png)

## 📋 Executive Summary

This document outlines a strategic, phased approach for enhancing the Neothink database schema based on the gap analysis. Each migration is carefully designed to minimize disruption while systematically implementing critical improvements to support the platform's growth and innovation through 2025 and beyond.

> **Important**: Always create a full database backup before applying any migration. Test all migrations in development environments first.

## 🚀 Phase 1: Foundation

The Foundation phase focuses on establishing core infrastructure for permissions, tenant configuration, and security - essential building blocks for all future enhancements.

### Migration 1: Permission System

**Objective**: Implement comprehensive permission framework to enable granular access control.

```sql
-- Create core permissions
INSERT INTO permissions (id, name, slug, description, resource_type) VALUES
  (uuid_generate_v4(), 'View Content', 'content:view', 'Can view content', 'content'),
  (uuid_generate_v4(), 'Edit Content', 'content:edit', 'Can edit content', 'content'),
  (uuid_generate_v4(), 'Create Content', 'content:create', 'Can create content', 'content'),
  (uuid_generate_v4(), 'Delete Content', 'content:delete', 'Can delete content', 'content'),
  (uuid_generate_v4(), 'Publish Content', 'content:publish', 'Can publish content', 'content'),
  (uuid_generate_v4(), 'Review Content', 'content:review', 'Can review content', 'content'),
  (uuid_generate_v4(), 'Manage Users', 'users:manage', 'Can manage users', 'users'),
  (uuid_generate_v4(), 'View Users', 'users:view', 'Can view users', 'users'),
  (uuid_generate_v4(), 'Manage Roles', 'roles:manage', 'Can manage roles', 'roles'),
  (uuid_generate_v4(), 'Manage Settings', 'settings:manage', 'Can manage tenant settings', 'settings'),
  (uuid_generate_v4(), 'View Analytics', 'analytics:view', 'Can view analytics', 'analytics'),
  (uuid_generate_v4(), 'Export Data', 'data:export', 'Can export data', 'data'),
  (uuid_generate_v4(), 'Import Data', 'data:import', 'Can import data', 'data'),
  (uuid_generate_v4(), 'Manage Integrations', 'integrations:manage', 'Can manage integrations', 'integrations');

-- Associate permissions with roles
INSERT INTO role_permissions (id, tenant_role_id, permission_id, created_at)
SELECT 
  uuid_generate_v4(), 
  tr.id, 
  p.id, 
  now()
FROM 
  tenant_roles tr
CROSS JOIN 
  permissions p
WHERE 
  tr.slug = 'admin' AND p.slug IN ('content:view', 'content:edit', 'content:create', 'content:delete', 'content:publish', 'content:review', 
                                  'users:manage', 'users:view', 'roles:manage', 'settings:manage', 'analytics:view', 
                                  'data:export', 'data:import', 'integrations:manage');

INSERT INTO role_permissions (id, tenant_role_id, permission_id, created_at)
SELECT 
  uuid_generate_v4(), 
  tr.id, 
  p.id, 
  now()
FROM 
  tenant_roles tr
CROSS JOIN 
  permissions p
WHERE 
  tr.slug = 'editor' AND p.slug IN ('content:view', 'content:edit', 'content:create', 'content:publish', 'users:view', 'analytics:view');

INSERT INTO role_permissions (id, tenant_role_id, permission_id, created_at)
SELECT 
  uuid_generate_v4(), 
  tr.id, 
  p.id, 
  now()
FROM 
  tenant_roles tr
CROSS JOIN 
  permissions p
WHERE 
  tr.slug = 'viewer' AND p.slug IN ('content:view', 'analytics:view');
```

**Impact Assessment**:
- **Risk Level**: Medium (affects access control)
- **Downtime Required**: None
- **Dependencies**: None

### Migration 2: Tenant Configuration

**Objective**: Enhance tenant branding and settings for platform customization.

```sql
-- Update tenant settings structure
ALTER TABLE tenants 
  ALTER COLUMN settings SET DEFAULT '{}'::jsonb,
  ALTER COLUMN branding SET DEFAULT '{}'::jsonb;

-- Update existing tenants with settings and branding
UPDATE tenants
SET settings = '{
  "features": {
    "contentSharing": true,
    "userProfiles": true,
    "achievements": true,
    "analytics": true,
    "notifications": true
  },
  "limits": {
    "storageGB": 50,
    "maxUsers": 10000,
    "maxContentItems": 5000
  },
  "security": {
    "mfa": false,
    "ssoEnabled": false,
    "passwordPolicy": "medium"
  }
}'::jsonb,
branding = '{
  "logo": {
    "full": "https://assets.neothink.io/[tenant-slug]/logo-full.png",
    "icon": "https://assets.neothink.io/[tenant-slug]/logo-icon.png"
  },
  "colors": {
    "primary": "#4285F4",
    "secondary": "#34A853",
    "accent": "#FBBC05",
    "background": "#FFFFFF",
    "text": "#202124"
  },
  "fonts": {
    "heading": "Montserrat",
    "body": "Roboto"
  }
}'::jsonb;

-- Update specific tenant branding
UPDATE tenants
SET branding = jsonb_set(branding, '{colors,primary}', '"#1A73E8"')
WHERE slug = 'hub';

UPDATE tenants
SET branding = jsonb_set(branding, '{colors,primary}', '"#FF5722"')
WHERE slug = 'ascenders';

UPDATE tenants
SET branding = jsonb_set(branding, '{colors,primary}', '"#009688"')
WHERE slug = 'neothinkers';

UPDATE tenants
SET branding = jsonb_set(branding, '{colors,primary}', '"#673AB7"')
WHERE slug = 'immortals';
```

**Impact Assessment**:
- **Risk Level**: Low
- **Downtime Required**: None
- **Dependencies**: None

### Migration 3: Security Enhancements

**Objective**: Implement row-level security policies for data protection.

```sql
-- Enable RLS on key tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_content ENABLE ROW LEVEL SECURITY;

-- Create policy functions
CREATE OR REPLACE FUNCTION auth.is_tenant_admin(tenant_id uuid) RETURNS boolean AS $$
DECLARE
  is_admin boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM tenant_users tu
    JOIN tenant_roles tr ON tu.tenant_role_id = tr.id
    WHERE tu.user_id = auth.uid()
    AND tu.tenant_id = tenant_id
    AND tr.slug = 'admin'
  ) INTO is_admin;
  
  RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add policies for tenant-specific content
CREATE POLICY tenant_users_tenant_access ON tenant_users
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

CREATE POLICY content_modules_tenant_access ON content_modules
  USING (platform IN (
    SELECT t.slug FROM tenant_users tu
    JOIN tenants t ON tu.tenant_id = t.id
    WHERE tu.user_id = auth.uid()
  ));
```

**Impact Assessment**:
- **Risk Level**: High (affects data access)
- **Downtime Required**: None
- **Dependencies**: Permission System (Migration 1)

## 🧑‍💻 Phase 2: User Experience

The User Experience phase focuses on enhancing profile capabilities, relationship management, and subscription features to improve personalization and user engagement.

### Migration 1: Enhanced User Profiles

**Objective**: Expand user profile capabilities to support richer user experiences.

```sql
-- Add additional profile fields
ALTER TABLE profiles
  ADD COLUMN display_name TEXT,
  ADD COLUMN location TEXT,
  ADD COLUMN website TEXT,
  ADD COLUMN social_links JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN skills TEXT[],
  ADD COLUMN interests TEXT[],
  ADD COLUMN languages TEXT[],
  ADD COLUMN timezone TEXT,
  ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN profile_visibility TEXT DEFAULT 'public',
  ADD COLUMN profile_stats JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN last_seen_at TIMESTAMPTZ;

-- Create profile completion function
CREATE OR REPLACE FUNCTION update_profile_completion() RETURNS TRIGGER AS $$
BEGIN
  IF (
    NEW.full_name IS NOT NULL AND
    NEW.avatar_url IS NOT NULL AND
    NEW.bio IS NOT NULL AND
    NEW.display_name IS NOT NULL
  ) THEN
    NEW.profile_completed = TRUE;
  ELSE
    NEW.profile_completed = FALSE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_profile_completion
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completion();
```

**Impact Assessment**:
- **Risk Level**: Medium
- **Downtime Required**: None
- **Dependencies**: None
- **Application Changes**: Profile UI updates required

### Migration 2: Guardian Relationships

**Objective**: Implement guardian-ward relationship system for youth safety and compliance.

```sql
-- Create guardian-ward relationship table
CREATE TABLE guardian_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guardian_id UUID NOT NULL REFERENCES profiles(id),
  ward_id UUID NOT NULL REFERENCES profiles(id),
  relationship_type TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  approval_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(guardian_id, ward_id)
);

-- Enable RLS on guardian relationships
ALTER TABLE guardian_relationships ENABLE ROW LEVEL SECURITY;

-- Add guardian relationship policies
CREATE POLICY guardian_relationships_access ON guardian_relationships
  USING (guardian_id = auth.uid() OR ward_id = auth.uid());

-- Update profiles to track guardian status
UPDATE profiles
SET is_guardian = TRUE
WHERE id IN (SELECT DISTINCT guardian_id FROM guardian_relationships);
```

**Impact Assessment**:
- **Risk Level**: Medium
- **Downtime Required**: None
- **Dependencies**: Enhanced User Profiles (Migration 1)
- **Application Changes**: Guardian relationship UI required

### Migration 3: Subscription Management

**Objective**: Implement comprehensive subscription system for monetization and access control.

```sql
-- Create subscription tracking table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  payment_provider TEXT,
  payment_provider_subscription_id TEXT,
  payment_method_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscription history table
CREATE TABLE subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  occurred_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on subscription tables
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Add subscription policies
CREATE POLICY subscriptions_user_access ON subscriptions
  USING (user_id = auth.uid() OR tenant_id IN (
    SELECT tenant_id FROM tenant_users
    JOIN tenant_roles ON tenant_users.tenant_role_id = tenant_roles.id
    WHERE tenant_users.user_id = auth.uid() AND tenant_roles.slug = 'admin'
  ));
```

**Impact Assessment**:
- **Risk Level**: Medium
- **Downtime Required**: None
- **Dependencies**: Enhanced User Profiles (Migration 1)
- **Application Changes**: Subscription management UI required

## 📚 Phase 3: Content Enhancement

The Content Enhancement phase focuses on improving content flexibility, rich media support, and multilingual capabilities.

### Migration 1: Content Types System

**Objective**: Implement flexible content type framework for diverse learning materials.

```sql
-- Create content types table
CREATE TABLE content_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  schema JSONB NOT NULL,
  tenant_id UUID REFERENCES tenants(id),
  is_system_type BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert system content types
INSERT INTO content_types (id, name, slug, description, schema, is_system_type) VALUES
  (uuid_generate_v4(), 'Text Article', 'text-article', 'Simple text article with rich text support', 
   '{
     "fields": [
       {"name": "title", "type": "string", "required": true},
       {"name": "content", "type": "rich-text", "required": true},
       {"name": "excerpt", "type": "string", "required": false},
       {"name": "featured_image", "type": "image", "required": false}
     ]
   }'::jsonb, TRUE),
  (uuid_generate_v4(), 'Video Lesson', 'video-lesson', 'Video-based lesson with transcript', 
   '{
     "fields": [
       {"name": "title", "type": "string", "required": true},
       {"name": "description", "type": "string", "required": true},
       {"name": "video_url", "type": "string", "required": true},
       {"name": "transcript", "type": "rich-text", "required": false},
       {"name": "duration", "type": "number", "required": false}
     ]
   }'::jsonb, TRUE),
  (uuid_generate_v4(), 'Interactive Exercise', 'interactive-exercise', 'Interactive exercise with questions', 
   '{
     "fields": [
       {"name": "title", "type": "string", "required": true},
       {"name": "description", "type": "string", "required": true},
       {"name": "questions", "type": "array", "required": true},
       {"name": "passing_score", "type": "number", "required": true}
     ]
   }'::jsonb, TRUE),
  (uuid_generate_v4(), 'PDF Document', 'pdf-document', 'PDF document with summary', 
   '{
     "fields": [
       {"name": "title", "type": "string", "required": true},
       {"name": "description", "type": "string", "required": true},
       {"name": "file_url", "type": "string", "required": true},
       {"name": "summary", "type": "rich-text", "required": false}
     ]
   }'::jsonb, TRUE);

-- Add content type to existing content tables
ALTER TABLE content_modules
  ADD COLUMN content_type_id UUID REFERENCES content_types(id);

ALTER TABLE lessons
  ADD COLUMN content_type_id UUID REFERENCES content_types(id);

ALTER TABLE resources
  ADD COLUMN content_type_id UUID REFERENCES content_types(id);
```

**Impact Assessment**:
- **Risk Level**: Medium
- **Downtime Required**: None
- **Dependencies**: None
- **Application Changes**: Content creation UI updates required

### Migration 2: Content Localization

**Objective**: Enable multilingual content support for global accessibility.

```sql
-- Create languages table
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert common languages
INSERT INTO languages (id, code, name, is_active, is_default) VALUES
  (uuid_generate_v4(), 'en', 'English', TRUE, TRUE),
  (uuid_generate_v4(), 'es', 'Spanish', TRUE, FALSE),
  (uuid_generate_v4(), 'fr', 'French', TRUE, FALSE),
  (uuid_generate_v4(), 'de', 'German', TRUE, FALSE),
  (uuid_generate_v4(), 'zh', 'Chinese', TRUE, FALSE);

-- Create content translations table
CREATE TABLE content_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  language_code TEXT NOT NULL REFERENCES languages(code),
  title TEXT,
  description TEXT,
  content TEXT,
  metadata JSONB,
  translator_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(content_type, content_id, language_code)
);

-- Enable RLS on translations
ALTER TABLE content_translations ENABLE ROW LEVEL SECURITY;

-- Add translation policy
CREATE POLICY content_translations_access ON content_translations
  USING (TRUE);
```

**Impact Assessment**:
- **Risk Level**: Medium
- **Downtime Required**: None
- **Dependencies**: Content Types System (Migration 1)
- **Application Changes**: Translation UI required

## 🎓 Phase 4: Learning Innovation

The Learning Innovation phase focuses on implementing advanced educational features including assessments and cohort-based learning.

### Migration 1: Assessment System

**Objective**: Implement comprehensive assessment framework for learning validation.

```sql
-- Create assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  title TEXT NOT NULL,
  description TEXT,
  assessment_type TEXT NOT NULL,
  passing_score INTEGER,
  time_limit_minutes INTEGER,
  attempts_allowed INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create assessment questions table
CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id),
  question_type TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer JSONB,
  points INTEGER DEFAULT 1,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create assessment attempts table
CREATE TABLE assessment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  score INTEGER,
  passed BOOLEAN,
  time_spent_minutes INTEGER,
  answers JSONB,
  attempt_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on assessment tables
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
```

**Impact Assessment**:
- **Risk Level**: Medium
- **Downtime Required**: None
- **Dependencies**: None
- **Application Changes**: Assessment UI required

### Migration 2: Learning Groups

**Objective**: Enable cohort-based learning for collaborative education.

```sql
-- Create learning groups table
CREATE TABLE learning_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  max_members INTEGER,
  join_code TEXT,
  created_by UUID REFERENCES auth.users(id),
  facilitator_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create learning group members table
CREATE TABLE learning_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES learning_groups(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create learning group content table
CREATE TABLE learning_group_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES learning_groups(id),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  due_date TIMESTAMPTZ,
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on learning group tables
ALTER TABLE learning_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_group_content ENABLE ROW LEVEL SECURITY;
```

**Impact Assessment**:
- **Risk Level**: Medium
- **Downtime Required**: None
- **Dependencies**: None
- **Application Changes**: Group learning UI required

## 📊 Phase 5: Analytics and Optimization

The Analytics and Optimization phase focuses on enhancing data insights and platform performance.

### Migration 1: Engagement Tracking

**Objective**: Implement comprehensive engagement tracking for better insights.

```sql
-- Create content engagement table
CREATE TABLE content_engagement (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id UUID,
  device_info JSONB,
  occurred_at TIMESTAMPTZ DEFAULT now()
);

-- Create engagement metrics view
CREATE VIEW engagement_metrics AS
SELECT 
  content_type,
  content_id,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(*) AS total_events,
  COUNT(*) FILTER (WHERE event_type = 'view') AS views,
  COUNT(*) FILTER (WHERE event_type = 'complete') AS completions,
  COUNT(*) FILTER (WHERE event_type = 'reaction') AS reactions,
  COUNT(*) FILTER (WHERE event_type = 'share') AS shares,
  COUNT(*) FILTER (WHERE event_type = 'comment') AS comments,
  DATE_TRUNC('day', occurred_at) AS day
FROM 
  content_engagement
GROUP BY 
  content_type, content_id, DATE_TRUNC('day', occurred_at);

-- Create engagement aggregation function
CREATE OR REPLACE FUNCTION aggregate_daily_engagement() RETURNS void AS $$
BEGIN
  INSERT INTO analytics_summaries (
    id, platform, summary_type, time_period, start_date, end_date, metrics, created_at
  )
  SELECT 
    uuid_generate_v4(),
    'all',
    'engagement',
    'daily',
    DATE_TRUNC('day', occurred_at)::date,
    DATE_TRUNC('day', occurred_at)::date,
    jsonb_build_object(
      'total_events', COUNT(*),
      'unique_users', COUNT(DISTINCT user_id),
      'content_types', jsonb_object_agg(content_type, COUNT(*)),
      'event_types', jsonb_object_agg(event_type, COUNT(*))
    ),
    now()
  FROM 
    content_engagement
  WHERE 
    occurred_at >= CURRENT_DATE - INTERVAL '1 day'
    AND occurred_at < CURRENT_DATE
  GROUP BY 
    DATE_TRUNC('day', occurred_at)::date;
END;
$$ LANGUAGE plpgsql;
```

**Impact Assessment**:
- **Risk Level**: Medium
- **Downtime Required**: None
- **Dependencies**: None
- **Application Changes**: Analytics tracking integration required

### Migration 2: Database Optimization

**Objective**: Enhance database performance for improved scalability.

```sql
-- Add indexes to critical tables
CREATE INDEX idx_profiles_email ON profiles (email);
CREATE INDEX idx_tenant_users_tenant_id ON tenant_users (tenant_id);
CREATE INDEX idx_tenant_users_user_id ON tenant_users (user_id);
CREATE INDEX idx_content_modules_platform ON content_modules (platform);
CREATE INDEX idx_lessons_module_id ON lessons (module_id);
CREATE INDEX idx_content_versions_content_id ON content_versions (content_id, content_type);
CREATE INDEX idx_learning_progress_user_id ON learning_progress (user_id);
CREATE INDEX idx_learning_progress_content ON learning_progress (content_type, content_id);
CREATE INDEX idx_activity_feed_user_id ON activity_feed (user_id);
CREATE INDEX idx_activity_feed_platform ON activity_feed (platform);
CREATE INDEX idx_social_interactions_activity_id ON social_interactions (activity_id);

-- Optimize large tables
ALTER TABLE content_engagement SET (autovacuum_vacuum_scale_factor = 0.05);
ALTER TABLE audit_logs SET (autovacuum_vacuum_scale_factor = 0.05);
ALTER TABLE activity_feed SET (autovacuum_vacuum_scale_factor = 0.05);

-- Create materialized views for common queries
CREATE MATERIALIZED VIEW user_platform_access AS
SELECT 
  p.id AS user_id,
  p.email,
  p.full_name,
  jsonb_object_agg(t.slug, tr.name) AS tenant_roles
FROM 
  profiles p
JOIN 
  tenant_users tu ON p.id = tu.user_id
JOIN 
  tenants t ON tu.tenant_id = t.id
JOIN 
  tenant_roles tr ON tu.tenant_role_id = tr.id
GROUP BY 
  p.id, p.email, p.full_name;

CREATE UNIQUE INDEX idx_user_platform_access_user_id ON user_platform_access (user_id);

-- Create refresh function
CREATE OR REPLACE FUNCTION refresh_materialized_views() RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_platform_access;
END;
$$ LANGUAGE plpgsql;
```

**Impact Assessment**:
- **Risk Level**: Medium
- **Downtime Required**: None
- **Dependencies**: All previous migrations
- **Application Changes**: None required

## 🛠️ Deployment Strategy

### Pre-Deployment Checklist

✅ **Database Backup**
- Create a complete backup of the production database
- Verify backup integrity with restoration test

✅ **Testing**
- Apply migrations to development environment
- Run comprehensive test suite
- Perform load testing to verify performance

✅ **Documentation**
- Update schema documentation
- Document application changes required
- Create rollback procedures

✅ **Communication**
- Inform stakeholders of scheduled migration
- Communicate expected downtime (if any)
- Prepare support team for potential issues

### Deployment Process

1. **Development Environment**
   - Apply migrations to development database
   - Verify schema changes
   - Run automated test suite

2. **Staging Environment**
   - Apply migrations to staging database
   - Conduct UAT with stakeholders
   - Verify performance metrics

3. **Production Environment**
   - Schedule maintenance window (if required)
   - Create final production backup
   - Apply migrations in order
   - Verify schema changes
   - Execute validation tests
   - Monitor system performance

### Rollback Procedures

Each migration includes a corresponding rollback script. Here's an example for Phase 1, Migration 1:

```sql
-- Rollback Permission System
DELETE FROM role_permissions;
DELETE FROM permissions;
```

For more complex migrations, rollback scripts should be tested in development before deployment.

## 📅 Implementation Timeline

| Phase | Estimated Duration | Risk Level | Key Dependencies |
|-------|-------------------|------------|------------------|
| Foundation | 2-3 weeks | Medium | None |
| User Experience | 3-4 weeks | Medium | Foundation Phase |
| Content Enhancement | 3-4 weeks | Medium | Foundation Phase |
| Learning Innovation | 4-5 weeks | High | Content Enhancement Phase |
| Analytics and Optimization | 3-4 weeks | Medium | All previous phases |

## 🚦 Monitoring and Validation

After applying migrations, monitor the following metrics:

1. **Database Performance**
   - Query execution times
   - Index usage statistics
   - Table growth rates

2. **Application Performance**
   - API response times
   - Error rates
   - User experience metrics

3. **Data Integrity**
   - Foreign key constraints
   - Uniqueness constraints
   - Data validation rules

## 📝 Conclusion

This comprehensive migration plan provides a structured approach to enhancing the Neothink database schema. By following this phased implementation strategy, we can systematically improve the platform's capabilities while minimizing disruption to users and ensuring data integrity.

The migrations address critical gaps identified in the gap analysis and establish a solid foundation for the platform's continued growth and innovation. Regular reviews of the migration progress will help ensure alignment with business goals and technical requirements.

---

*Prepared by: Database Engineering Team*  
*Last updated: June 2025* 