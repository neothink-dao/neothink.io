-- ROLES SCHEMA
-- This file defines the role management system for the Neothink platforms

-- Role categories enum (member vs admin)
create type role_category_enum as enum ('member', 'admin');

-- Tenant roles table - defines different roles available across platforms
create table tenant_roles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  name text not null,
  slug text not null,
  description text,
  is_system_role boolean default false,
  role_category role_category_enum default 'member',
  priority integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, slug)
);

-- Role capabilities - specific permissions for each role
create table role_capabilities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  role_slug text not null,
  feature_name text not null,
  can_view boolean default false,
  can_create boolean default false,
  can_edit boolean default false,
  can_delete boolean default false,
  can_approve boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, role_slug, feature_name)
);

-- Profile table with role references
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  tenant_id uuid references tenants(id) not null,
  role_id uuid references tenant_roles(id),
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, tenant_id)
);

-- Function to set default role for new users
create or replace function set_default_role()
returns trigger as $$
declare
  subscriber_role_id uuid;
  tenant_id uuid;
begin
  -- Find the subscriber role ID for the main tenant (Neothinkers)
  select id into subscriber_role_id 
  from tenant_roles 
  where tenant_id = 'd2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d' and slug = 'subscriber';
  
  -- Set tenant ID to Neothinkers
  tenant_id := 'd2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d';
  
  -- Create a profile for the new user
  insert into profiles (user_id, tenant_id, role_id, display_name)
  values (new.id, tenant_id, subscriber_role_id, coalesce(new.raw_user_meta_data->>'name', new.email));
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to run function when a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure set_default_role(); 