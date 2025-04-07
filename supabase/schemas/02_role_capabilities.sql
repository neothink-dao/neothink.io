-- ROLE CAPABILITIES
-- This file defines the default capabilities for each role

-- Neothinkers tenant capabilities

-- Subscriber capabilities - Read-only access
insert into role_capabilities (tenant_id, role_slug, feature_name, can_view, can_create, can_edit, can_delete, can_approve)
values
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'subscriber', 'thought_exercises', true, false, false, false, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'subscriber', 'concepts', true, false, false, false, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'subscriber', 'personal_journal', true, true, true, true, false);

-- Participant capabilities - Can create some content and participate in discussions
insert into role_capabilities (tenant_id, role_slug, feature_name, can_view, can_create, can_edit, can_delete, can_approve)
values
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'participant', 'thought_exercises', true, false, false, false, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'participant', 'concepts', true, false, false, false, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'participant', 'personal_journal', true, true, true, true, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'participant', 'discussions', true, true, true, false, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'participant', 'comments', true, true, true, true, false);

-- Contributor capabilities - Can create and edit content
insert into role_capabilities (tenant_id, role_slug, feature_name, can_view, can_create, can_edit, can_delete, can_approve)
values
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'contributor', 'thought_exercises', true, true, true, false, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'contributor', 'concepts', true, true, true, false, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'contributor', 'personal_journal', true, true, true, true, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'contributor', 'discussions', true, true, true, true, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'contributor', 'comments', true, true, true, true, false);

-- Associate capabilities - Admin with moderation abilities
insert into role_capabilities (tenant_id, role_slug, feature_name, can_view, can_create, can_edit, can_delete, can_approve)
values
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'associate', 'thought_exercises', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'associate', 'concepts', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'associate', 'personal_journal', true, true, true, true, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'associate', 'discussions', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'associate', 'comments', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'associate', 'user_management', true, true, true, false, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'associate', 'content_management', true, true, true, true, true);

-- Builder capabilities - Admin with development abilities
insert into role_capabilities (tenant_id, role_slug, feature_name, can_view, can_create, can_edit, can_delete, can_approve)
values
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'builder', 'thought_exercises', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'builder', 'concepts', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'builder', 'personal_journal', true, true, true, true, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'builder', 'discussions', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'builder', 'comments', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'builder', 'user_management', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'builder', 'content_management', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'builder', 'platform_analytics', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'builder', 'platform_configuration', true, true, true, true, true);

-- Partner capabilities - Full platform control
insert into role_capabilities (tenant_id, role_slug, feature_name, can_view, can_create, can_edit, can_delete, can_approve)
values
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'partner', 'thought_exercises', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'partner', 'concepts', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'partner', 'personal_journal', true, true, true, true, false),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'partner', 'discussions', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'partner', 'comments', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'partner', 'user_management', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'partner', 'content_management', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'partner', 'platform_analytics', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'partner', 'platform_configuration', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'partner', 'billing_management', true, true, true, true, true),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'partner', 'organization_management', true, true, true, true, true); 