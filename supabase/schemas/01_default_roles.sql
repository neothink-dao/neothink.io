-- DEFAULT ROLES
-- This file defines the default roles for all tenants in the Neothink ecosystem

-- Neothinkers tenant
-- User roles
insert into tenant_roles (tenant_id, name, slug, description, is_system_role, role_category, priority)
values 
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'Subscriber', 'subscriber', 'Basic access to platform content', false, 'member', 10),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'Participant', 'participant', 'Can participate in community activities', false, 'member', 20),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'Contributor', 'contributor', 'Can contribute content and lead discussions', false, 'member', 30);

-- Admin roles
insert into tenant_roles (tenant_id, name, slug, description, is_system_role, role_category, priority)
values 
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'Associate', 'associate', 'Admin role focused on helping and support', false, 'admin', 40),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'Builder', 'builder', 'Admin role focused on building and development', false, 'admin', 50),
('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'Partner', 'partner', 'Admin role with funding capabilities and strategic direction', false, 'admin', 60);

-- Ascenders tenant
-- User roles
insert into tenant_roles (tenant_id, name, slug, description, is_system_role, role_category, priority)
values 
('ce2cb142-075f-40cc-ad55-652ec6ea954d', 'Subscriber', 'subscriber', 'Basic access to platform content', false, 'member', 10),
('ce2cb142-075f-40cc-ad55-652ec6ea954d', 'Participant', 'participant', 'Can participate in community activities', false, 'member', 20),
('ce2cb142-075f-40cc-ad55-652ec6ea954d', 'Contributor', 'contributor', 'Can contribute content and lead discussions', false, 'member', 30);

-- Admin roles
insert into tenant_roles (tenant_id, name, slug, description, is_system_role, role_category, priority)
values 
('ce2cb142-075f-40cc-ad55-652ec6ea954d', 'Associate', 'associate', 'Admin role focused on helping and support', false, 'admin', 40),
('ce2cb142-075f-40cc-ad55-652ec6ea954d', 'Builder', 'builder', 'Admin role focused on building and development', false, 'admin', 50),
('ce2cb142-075f-40cc-ad55-652ec6ea954d', 'Partner', 'partner', 'Admin role with funding capabilities and strategic direction', false, 'admin', 60);

-- Immortals tenant
-- User roles
insert into tenant_roles (tenant_id, name, slug, description, is_system_role, role_category, priority)
values 
('013bbaf8-8d72-495c-9024-71fb945b0277', 'Subscriber', 'subscriber', 'Basic access to platform content', false, 'member', 10),
('013bbaf8-8d72-495c-9024-71fb945b0277', 'Participant', 'participant', 'Can participate in community activities', false, 'member', 20),
('013bbaf8-8d72-495c-9024-71fb945b0277', 'Contributor', 'contributor', 'Can contribute content and lead discussions', false, 'member', 30);

-- Admin roles
insert into tenant_roles (tenant_id, name, slug, description, is_system_role, role_category, priority)
values 
('013bbaf8-8d72-495c-9024-71fb945b0277', 'Associate', 'associate', 'Admin role focused on helping and support', false, 'admin', 40),
('013bbaf8-8d72-495c-9024-71fb945b0277', 'Builder', 'builder', 'Admin role focused on building and development', false, 'admin', 50),
('013bbaf8-8d72-495c-9024-71fb945b0277', 'Partner', 'partner', 'Admin role with funding capabilities and strategic direction', false, 'admin', 60);

-- Hub tenant
-- User roles
insert into tenant_roles (tenant_id, name, slug, description, is_system_role, role_category, priority)
values 
('2074cd50-6cf1-467d-b520-e5c6fc7a89f2', 'Subscriber', 'subscriber', 'Basic access to platform content', false, 'member', 10),
('2074cd50-6cf1-467d-b520-e5c6fc7a89f2', 'Participant', 'participant', 'Can participate in community activities', false, 'member', 20),
('2074cd50-6cf1-467d-b520-e5c6fc7a89f2', 'Contributor', 'contributor', 'Can contribute content and lead discussions', false, 'member', 30);

-- Admin roles
insert into tenant_roles (tenant_id, name, slug, description, is_system_role, role_category, priority)
values 
('2074cd50-6cf1-467d-b520-e5c6fc7a89f2', 'Associate', 'associate', 'Admin role focused on helping and support', false, 'admin', 40),
('2074cd50-6cf1-467d-b520-e5c6fc7a89f2', 'Builder', 'builder', 'Admin role focused on building and development', false, 'admin', 50),
('2074cd50-6cf1-467d-b520-e5c6fc7a89f2', 'Partner', 'partner', 'Admin role with funding capabilities and strategic direction', false, 'admin', 60); 