export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export type Database = {
    public: {
        Tables: {
            achievements: {
                Row: {
                    badge_url: string | null;
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    name: string;
                    platform: string;
                    points: number | null;
                    requirements: Json | null;
                    updated_at: string | null;
                };
                Insert: {
                    badge_url?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name: string;
                    platform: string;
                    points?: number | null;
                    requirements?: Json | null;
                    updated_at?: string | null;
                };
                Update: {
                    badge_url?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name?: string;
                    platform?: string;
                    points?: number | null;
                    requirements?: Json | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            activity_feed: {
                Row: {
                    activity_type: string;
                    content_id: string | null;
                    content_type: string | null;
                    created_at: string | null;
                    id: string;
                    metadata: Json | null;
                    platform: string;
                    updated_at: string | null;
                    user_id: string | null;
                    visibility: string;
                };
                Insert: {
                    activity_type: string;
                    content_id?: string | null;
                    content_type?: string | null;
                    created_at?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    platform: string;
                    updated_at?: string | null;
                    user_id?: string | null;
                    visibility: string;
                };
                Update: {
                    activity_type?: string;
                    content_id?: string | null;
                    content_type?: string | null;
                    created_at?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    platform?: string;
                    updated_at?: string | null;
                    user_id?: string | null;
                    visibility?: string;
                };
                Relationships: [];
            };
            ai_analytics: {
                Row: {
                    app_name: string;
                    created_at: string;
                    event_type: string;
                    id: string;
                    metadata: Json | null;
                    metrics: Json;
                    user_id: string | null;
                };
                Insert: {
                    app_name: string;
                    created_at?: string;
                    event_type: string;
                    id?: string;
                    metadata?: Json | null;
                    metrics?: Json;
                    user_id?: string | null;
                };
                Update: {
                    app_name?: string;
                    created_at?: string;
                    event_type?: string;
                    id?: string;
                    metadata?: Json | null;
                    metrics?: Json;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            ai_configurations: {
                Row: {
                    created_at: string;
                    default_models: Json;
                    default_provider: string;
                    enabled_features: Json;
                    id: string;
                    platform_slug: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    default_models: Json;
                    default_provider: string;
                    enabled_features: Json;
                    id?: string;
                    platform_slug: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    default_models?: Json;
                    default_provider?: string;
                    enabled_features?: Json;
                    id?: string;
                    platform_slug?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            ai_conversations: {
                Row: {
                    created_at: string;
                    id: string;
                    message_count: number;
                    platform_slug: string;
                    title: string | null;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    message_count?: number;
                    platform_slug: string;
                    title?: string | null;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    message_count?: number;
                    platform_slug?: string;
                    title?: string | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            ai_embeddings: {
                Row: {
                    content_id: string;
                    content_type: string;
                    created_at: string;
                    embedding: string | null;
                    id: string;
                    metadata: Json | null;
                };
                Insert: {
                    content_id: string;
                    content_type: string;
                    created_at?: string;
                    embedding?: string | null;
                    id?: string;
                    metadata?: Json | null;
                };
                Update: {
                    content_id?: string;
                    content_type?: string;
                    created_at?: string;
                    embedding?: string | null;
                    id?: string;
                    metadata?: Json | null;
                };
                Relationships: [];
            };
            ai_messages: {
                Row: {
                    content: string;
                    conversation_id: string;
                    created_at: string;
                    id: string;
                    role: string;
                    token_count: number | null;
                };
                Insert: {
                    content: string;
                    conversation_id: string;
                    created_at?: string;
                    id?: string;
                    role: string;
                    token_count?: number | null;
                };
                Update: {
                    content?: string;
                    conversation_id?: string;
                    created_at?: string;
                    id?: string;
                    role?: string;
                    token_count?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "ai_messages_conversation_id_fkey";
                        columns: ["conversation_id"];
                        isOneToOne: false;
                        referencedRelation: "ai_conversations";
                        referencedColumns: ["id"];
                    }
                ];
            };
            ai_suggestions: {
                Row: {
                    app_name: string;
                    confidence: number;
                    content: string;
                    content_id: string | null;
                    content_type: string;
                    created_at: string;
                    id: string;
                    is_applied: boolean;
                    suggestion_type: string;
                    user_id: string | null;
                };
                Insert: {
                    app_name: string;
                    confidence: number;
                    content: string;
                    content_id?: string | null;
                    content_type: string;
                    created_at?: string;
                    id?: string;
                    is_applied?: boolean;
                    suggestion_type: string;
                    user_id?: string | null;
                };
                Update: {
                    app_name?: string;
                    confidence?: number;
                    content?: string;
                    content_id?: string | null;
                    content_type?: string;
                    created_at?: string;
                    id?: string;
                    is_applied?: boolean;
                    suggestion_type?: string;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            ai_usage_metrics: {
                Row: {
                    cost: number;
                    created_at: string;
                    id: string;
                    last_used_at: string;
                    platform_slug: string;
                    request_count: number;
                    token_usage: Json;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    cost?: number;
                    created_at?: string;
                    id?: string;
                    last_used_at?: string;
                    platform_slug: string;
                    request_count?: number;
                    token_usage?: Json;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    cost?: number;
                    created_at?: string;
                    id?: string;
                    last_used_at?: string;
                    platform_slug?: string;
                    request_count?: number;
                    token_usage?: Json;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            ai_vector_collection_mappings: {
                Row: {
                    collection_id: string;
                    created_at: string;
                    document_id: string;
                    id: string;
                };
                Insert: {
                    collection_id: string;
                    created_at?: string;
                    document_id: string;
                    id?: string;
                };
                Update: {
                    collection_id?: string;
                    created_at?: string;
                    document_id?: string;
                    id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "ai_vector_collection_mappings_collection_id_fkey";
                        columns: ["collection_id"];
                        isOneToOne: false;
                        referencedRelation: "ai_vector_collections";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "ai_vector_collection_mappings_document_id_fkey";
                        columns: ["document_id"];
                        isOneToOne: false;
                        referencedRelation: "ai_vector_documents";
                        referencedColumns: ["id"];
                    }
                ];
            };
            ai_vector_collections: {
                Row: {
                    created_at: string;
                    description: string | null;
                    id: string;
                    name: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    name: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    name?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            ai_vector_documents: {
                Row: {
                    content: string;
                    created_at: string;
                    embedding: string | null;
                    id: string;
                    metadata: Json;
                    updated_at: string;
                };
                Insert: {
                    content: string;
                    created_at?: string;
                    embedding?: string | null;
                    id?: string;
                    metadata: Json;
                    updated_at?: string;
                };
                Update: {
                    content?: string;
                    created_at?: string;
                    embedding?: string | null;
                    id?: string;
                    metadata?: Json;
                    updated_at?: string;
                };
                Relationships: [];
            };
            analytics_events: {
                Row: {
                    created_at: string | null;
                    event_category: string | null;
                    event_detail: Json | null;
                    event_name: string;
                    id: string;
                    platform: string;
                    properties: Json | null;
                    timestamp: string | null;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    event_category?: string | null;
                    event_detail?: Json | null;
                    event_name: string;
                    id?: string;
                    platform: string;
                    properties?: Json | null;
                    timestamp?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    event_category?: string | null;
                    event_detail?: Json | null;
                    event_name?: string;
                    id?: string;
                    platform?: string;
                    properties?: Json | null;
                    timestamp?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            analytics_metrics: {
                Row: {
                    created_at: string | null;
                    dimension_values: Json | null;
                    id: string;
                    measured_at: string;
                    metric_key: string;
                    metric_value: number;
                    platform: string;
                };
                Insert: {
                    created_at?: string | null;
                    dimension_values?: Json | null;
                    id?: string;
                    measured_at: string;
                    metric_key: string;
                    metric_value: number;
                    platform: string;
                };
                Update: {
                    created_at?: string | null;
                    dimension_values?: Json | null;
                    id?: string;
                    measured_at?: string;
                    metric_key?: string;
                    metric_value?: number;
                    platform?: string;
                };
                Relationships: [];
            };
            analytics_reports: {
                Row: {
                    created_at: string | null;
                    created_by: string | null;
                    id: string;
                    parameters: Json | null;
                    platform: string;
                    report_data: Json | null;
                    report_type: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    parameters?: Json | null;
                    platform: string;
                    report_data?: Json | null;
                    report_type: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    parameters?: Json | null;
                    platform?: string;
                    report_data?: Json | null;
                    report_type?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            analytics_summaries: {
                Row: {
                    created_at: string | null;
                    end_date: string;
                    id: string;
                    metrics: Json;
                    platform: string;
                    start_date: string;
                    summary_type: string;
                    time_period: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    end_date: string;
                    id?: string;
                    metrics: Json;
                    platform: string;
                    start_date: string;
                    summary_type: string;
                    time_period: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    end_date?: string;
                    id?: string;
                    metrics?: Json;
                    platform?: string;
                    start_date?: string;
                    summary_type?: string;
                    time_period?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            ascenders_profiles: {
                Row: {
                    created_at: string;
                    id: string;
                    level: number | null;
                    preferences: Json;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    level?: number | null;
                    preferences?: Json;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    level?: number | null;
                    preferences?: Json;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            audit_logs: {
                Row: {
                    action: string;
                    created_at: string | null;
                    entity_id: string | null;
                    entity_type: string;
                    id: string;
                    ip_address: string | null;
                    new_data: Json | null;
                    old_data: Json | null;
                    user_agent: string | null;
                    user_id: string | null;
                };
                Insert: {
                    action: string;
                    created_at?: string | null;
                    entity_id?: string | null;
                    entity_type: string;
                    id?: string;
                    ip_address?: string | null;
                    new_data?: Json | null;
                    old_data?: Json | null;
                    user_agent?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    action?: string;
                    created_at?: string | null;
                    entity_id?: string | null;
                    entity_type?: string;
                    id?: string;
                    ip_address?: string | null;
                    new_data?: Json | null;
                    old_data?: Json | null;
                    user_agent?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            auth_logs: {
                Row: {
                    action: string;
                    created_at: string;
                    details: Json | null;
                    id: string;
                    ip_address: string | null;
                    path: string | null;
                    platform: string | null;
                    user_agent: string | null;
                    user_id: string | null;
                };
                Insert: {
                    action: string;
                    created_at?: string;
                    details?: Json | null;
                    id?: string;
                    ip_address?: string | null;
                    path?: string | null;
                    platform?: string | null;
                    user_agent?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    action?: string;
                    created_at?: string;
                    details?: Json | null;
                    id?: string;
                    ip_address?: string | null;
                    path?: string | null;
                    platform?: string | null;
                    user_agent?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            badge_events: {
                Row: {
                    badge_id: string | null;
                    created_at: string;
                    event_type: string;
                    id: string;
                    metadata: Json | null;
                    simulation_run_id: string | null;
                    user_id: string | null;
                };
                Insert: {
                    badge_id?: string | null;
                    created_at?: string;
                    event_type: string;
                    id?: string;
                    metadata?: Json | null;
                    simulation_run_id?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    badge_id?: string | null;
                    created_at?: string;
                    event_type?: string;
                    id?: string;
                    metadata?: Json | null;
                    simulation_run_id?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            badges: {
                Row: {
                    created_at: string | null;
                    criteria: Json | null;
                    description: string | null;
                    id: string;
                    name: string;
                    nft_url: string | null;
                    role: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    criteria?: Json | null;
                    description?: string | null;
                    id?: string;
                    name: string;
                    nft_url?: string | null;
                    role?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    criteria?: Json | null;
                    description?: string | null;
                    id?: string;
                    name?: string;
                    nft_url?: string | null;
                    role?: string | null;
                };
                Relationships: [];
            };
            census_snapshots: {
                Row: {
                    activity_count: number | null;
                    assets: number | null;
                    id: string;
                    metadata: Json | null;
                    population: number;
                    scope: string;
                    scope_id: string | null;
                    simulation_run_id: string | null;
                    snapshot_at: string;
                };
                Insert: {
                    activity_count?: number | null;
                    assets?: number | null;
                    id?: string;
                    metadata?: Json | null;
                    population: number;
                    scope: string;
                    scope_id?: string | null;
                    simulation_run_id?: string | null;
                    snapshot_at?: string;
                };
                Update: {
                    activity_count?: number | null;
                    assets?: number | null;
                    id?: string;
                    metadata?: Json | null;
                    population?: number;
                    scope?: string;
                    scope_id?: string | null;
                    simulation_run_id?: string | null;
                    snapshot_at?: string;
                };
                Relationships: [];
            };
            chat_history: {
                Row: {
                    app_name: string;
                    created_at: string | null;
                    embedding: string | null;
                    id: string;
                    message: string;
                    metadata: Json | null;
                    role: string;
                    user_id: string | null;
                };
                Insert: {
                    app_name: string;
                    created_at?: string | null;
                    embedding?: string | null;
                    id?: string;
                    message: string;
                    metadata?: Json | null;
                    role: string;
                    user_id?: string | null;
                };
                Update: {
                    app_name?: string;
                    created_at?: string | null;
                    embedding?: string | null;
                    id?: string;
                    message?: string;
                    metadata?: Json | null;
                    role?: string;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            chat_messages: {
                Row: {
                    content: string;
                    conversation_id: string;
                    created_at: string;
                    id: string;
                    metadata: Json | null;
                    role: string;
                    user_id: string | null;
                };
                Insert: {
                    content: string;
                    conversation_id: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    role: string;
                    user_id?: string | null;
                };
                Update: {
                    content?: string;
                    conversation_id?: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    role?: string;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "chat_messages_conversation_id_fkey";
                        columns: ["conversation_id"];
                        isOneToOne: false;
                        referencedRelation: "conversations";
                        referencedColumns: ["id"];
                    }
                ];
            };
            chat_participants: {
                Row: {
                    created_at: string;
                    id: string;
                    room_id: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    room_id: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    room_id?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "chat_participants_room_id_fkey";
                        columns: ["room_id"];
                        isOneToOne: false;
                        referencedRelation: "chat_rooms";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "chat_participants_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            chat_rooms: {
                Row: {
                    created_at: string;
                    id: string;
                    is_group: boolean | null;
                    name: string | null;
                    platform: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    is_group?: boolean | null;
                    name?: string | null;
                    platform: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    is_group?: boolean | null;
                    name?: string | null;
                    platform?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            collaboration_bonuses: {
                Row: {
                    awarded_at: string;
                    bonus_amount: number;
                    group_action_id: string | null;
                    id: string;
                    user_id: string | null;
                };
                Insert: {
                    awarded_at?: string;
                    bonus_amount: number;
                    group_action_id?: string | null;
                    id?: string;
                    user_id?: string | null;
                };
                Update: {
                    awarded_at?: string;
                    bonus_amount?: number;
                    group_action_id?: string | null;
                    id?: string;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "collaboration_bonuses_group_action_id_fkey";
                        columns: ["group_action_id"];
                        isOneToOne: false;
                        referencedRelation: "group_actions";
                        referencedColumns: ["id"];
                    }
                ];
            };
            collaborative_challenges: {
                Row: {
                    created_at: string | null;
                    created_by: string;
                    current_participants: number | null;
                    description: string;
                    end_date: string | null;
                    id: string;
                    instructions: string;
                    max_participants: number | null;
                    start_date: string | null;
                    status: string | null;
                    title: string;
                };
                Insert: {
                    created_at?: string | null;
                    created_by: string;
                    current_participants?: number | null;
                    description: string;
                    end_date?: string | null;
                    id?: string;
                    instructions: string;
                    max_participants?: number | null;
                    start_date?: string | null;
                    status?: string | null;
                    title: string;
                };
                Update: {
                    created_at?: string | null;
                    created_by?: string;
                    current_participants?: number | null;
                    description?: string;
                    end_date?: string | null;
                    id?: string;
                    instructions?: string;
                    max_participants?: number | null;
                    start_date?: string | null;
                    status?: string | null;
                    title?: string;
                };
                Relationships: [];
            };
            community_features: {
                Row: {
                    access_level: string;
                    created_at: string | null;
                    description: string;
                    enabled: boolean | null;
                    id: string;
                    name: string;
                    platform: string;
                    type: string;
                };
                Insert: {
                    access_level: string;
                    created_at?: string | null;
                    description: string;
                    enabled?: boolean | null;
                    id?: string;
                    name: string;
                    platform: string;
                    type: string;
                };
                Update: {
                    access_level?: string;
                    created_at?: string | null;
                    description?: string;
                    enabled?: boolean | null;
                    id?: string;
                    name?: string;
                    platform?: string;
                    type?: string;
                };
                Relationships: [];
            };
            concept_relationships: {
                Row: {
                    explanation: string | null;
                    id: string;
                    relationship_strength: number;
                    relationship_type: string;
                    source_concept_id: string;
                    target_concept_id: string;
                };
                Insert: {
                    explanation?: string | null;
                    id?: string;
                    relationship_strength: number;
                    relationship_type: string;
                    source_concept_id: string;
                    target_concept_id: string;
                };
                Update: {
                    explanation?: string | null;
                    id?: string;
                    relationship_strength?: number;
                    relationship_type?: string;
                    source_concept_id?: string;
                    target_concept_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "concept_relationships_source_concept_id_fkey";
                        columns: ["source_concept_id"];
                        isOneToOne: false;
                        referencedRelation: "concepts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "concept_relationships_target_concept_id_fkey";
                        columns: ["target_concept_id"];
                        isOneToOne: false;
                        referencedRelation: "concepts";
                        referencedColumns: ["id"];
                    }
                ];
            };
            concepts: {
                Row: {
                    application_examples: string[] | null;
                    author_id: string | null;
                    category: string;
                    created_at: string | null;
                    description: string;
                    id: string;
                    importance_level: number;
                    prerequisite_concepts: string[] | null;
                    related_concepts: string[] | null;
                    tenant_slug: string;
                    title: string;
                };
                Insert: {
                    application_examples?: string[] | null;
                    author_id?: string | null;
                    category: string;
                    created_at?: string | null;
                    description: string;
                    id?: string;
                    importance_level: number;
                    prerequisite_concepts?: string[] | null;
                    related_concepts?: string[] | null;
                    tenant_slug: string;
                    title: string;
                };
                Update: {
                    application_examples?: string[] | null;
                    author_id?: string | null;
                    category?: string;
                    created_at?: string | null;
                    description?: string;
                    id?: string;
                    importance_level?: number;
                    prerequisite_concepts?: string[] | null;
                    related_concepts?: string[] | null;
                    tenant_slug?: string;
                    title?: string;
                };
                Relationships: [];
            };
            content: {
                Row: {
                    content: string | null;
                    content_data: Json | null;
                    created_at: string | null;
                    id: string;
                    platform: string;
                    route: string;
                    slug: string | null;
                    subroute: string | null;
                    title: string;
                    updated_at: string | null;
                };
                Insert: {
                    content?: string | null;
                    content_data?: Json | null;
                    created_at?: string | null;
                    id?: string;
                    platform: string;
                    route: string;
                    slug?: string | null;
                    subroute?: string | null;
                    title: string;
                    updated_at?: string | null;
                };
                Update: {
                    content?: string | null;
                    content_data?: Json | null;
                    created_at?: string | null;
                    id?: string;
                    platform?: string;
                    route?: string;
                    slug?: string | null;
                    subroute?: string | null;
                    title?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            content_categories: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    name: string;
                    slug: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name: string;
                    slug: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name?: string;
                    slug?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            content_content_tags: {
                Row: {
                    content_id: string;
                    tag_id: string;
                };
                Insert: {
                    content_id: string;
                    tag_id: string;
                };
                Update: {
                    content_id?: string;
                    tag_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "content_content_tags_content_id_fkey";
                        columns: ["content_id"];
                        isOneToOne: false;
                        referencedRelation: "shared_content";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "content_content_tags_tag_id_fkey";
                        columns: ["tag_id"];
                        isOneToOne: false;
                        referencedRelation: "content_tags";
                        referencedColumns: ["id"];
                    }
                ];
            };
            content_dependencies: {
                Row: {
                    content_id: string;
                    content_type: string;
                    created_at: string | null;
                    dependency_type: string;
                    depends_on_id: string;
                    depends_on_type: string;
                    id: string;
                };
                Insert: {
                    content_id: string;
                    content_type: string;
                    created_at?: string | null;
                    dependency_type: string;
                    depends_on_id: string;
                    depends_on_type: string;
                    id?: string;
                };
                Update: {
                    content_id?: string;
                    content_type?: string;
                    created_at?: string | null;
                    dependency_type?: string;
                    depends_on_id?: string;
                    depends_on_type?: string;
                    id?: string;
                };
                Relationships: [];
            };
            content_modules: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    is_published: boolean | null;
                    metadata: Json | null;
                    order_index: number | null;
                    platform: string;
                    title: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    metadata?: Json | null;
                    order_index?: number | null;
                    platform: string;
                    title: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    metadata?: Json | null;
                    order_index?: number | null;
                    platform?: string;
                    title?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            content_schedule: {
                Row: {
                    content_id: string;
                    content_type: string;
                    created_at: string | null;
                    created_by: string | null;
                    id: string;
                    platform: string;
                    publish_at: string;
                    status: string | null;
                    unpublish_at: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    content_id: string;
                    content_type: string;
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    platform: string;
                    publish_at: string;
                    status?: string | null;
                    unpublish_at?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    content_id?: string;
                    content_type?: string;
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    platform?: string;
                    publish_at?: string;
                    status?: string | null;
                    unpublish_at?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            content_similarity: {
                Row: {
                    content_id: string;
                    content_type: string;
                    created_at: string | null;
                    id: string;
                    similar_content_id: string;
                    similar_content_type: string;
                    similarity_factors: Json | null;
                    similarity_score: number;
                    updated_at: string | null;
                };
                Insert: {
                    content_id: string;
                    content_type: string;
                    created_at?: string | null;
                    id?: string;
                    similar_content_id: string;
                    similar_content_type: string;
                    similarity_factors?: Json | null;
                    similarity_score: number;
                    updated_at?: string | null;
                };
                Update: {
                    content_id?: string;
                    content_type?: string;
                    created_at?: string | null;
                    id?: string;
                    similar_content_id?: string;
                    similar_content_type?: string;
                    similarity_factors?: Json | null;
                    similarity_score?: number;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            content_tags: {
                Row: {
                    created_at: string | null;
                    id: string;
                    name: string;
                    slug: string;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    name: string;
                    slug: string;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    name?: string;
                    slug?: string;
                };
                Relationships: [];
            };
            content_versions: {
                Row: {
                    content: string | null;
                    content_id: string;
                    content_type: string;
                    created_at: string | null;
                    created_by: string | null;
                    description: string | null;
                    id: string;
                    metadata: Json | null;
                    review_notes: string | null;
                    reviewed_at: string | null;
                    reviewed_by: string | null;
                    status: string | null;
                    title: string | null;
                    version_number: number;
                };
                Insert: {
                    content?: string | null;
                    content_id: string;
                    content_type: string;
                    created_at?: string | null;
                    created_by?: string | null;
                    description?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    review_notes?: string | null;
                    reviewed_at?: string | null;
                    reviewed_by?: string | null;
                    status?: string | null;
                    title?: string | null;
                    version_number: number;
                };
                Update: {
                    content?: string | null;
                    content_id?: string;
                    content_type?: string;
                    created_at?: string | null;
                    created_by?: string | null;
                    description?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    review_notes?: string | null;
                    reviewed_at?: string | null;
                    reviewed_by?: string | null;
                    status?: string | null;
                    title?: string | null;
                    version_number?: number;
                };
                Relationships: [];
            };
            content_workflow: {
                Row: {
                    assigned_to: string | null;
                    content_id: string;
                    content_type: string;
                    created_at: string | null;
                    current_status: string;
                    due_date: string | null;
                    id: string;
                    platform: string;
                    review_notes: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    assigned_to?: string | null;
                    content_id: string;
                    content_type: string;
                    created_at?: string | null;
                    current_status: string;
                    due_date?: string | null;
                    id?: string;
                    platform: string;
                    review_notes?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    assigned_to?: string | null;
                    content_id?: string;
                    content_type?: string;
                    created_at?: string | null;
                    current_status?: string;
                    due_date?: string | null;
                    id?: string;
                    platform?: string;
                    review_notes?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            content_workflow_history: {
                Row: {
                    changed_by: string | null;
                    created_at: string | null;
                    id: string;
                    new_status: string;
                    notes: string | null;
                    previous_status: string | null;
                    workflow_id: string | null;
                };
                Insert: {
                    changed_by?: string | null;
                    created_at?: string | null;
                    id?: string;
                    new_status: string;
                    notes?: string | null;
                    previous_status?: string | null;
                    workflow_id?: string | null;
                };
                Update: {
                    changed_by?: string | null;
                    created_at?: string | null;
                    id?: string;
                    new_status?: string;
                    notes?: string | null;
                    previous_status?: string | null;
                    workflow_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "content_workflow_history_workflow_id_fkey";
                        columns: ["workflow_id"];
                        isOneToOne: false;
                        referencedRelation: "content_workflow";
                        referencedColumns: ["id"];
                    }
                ];
            };
            conversations: {
                Row: {
                    app_name: string;
                    created_at: string;
                    id: string;
                    metadata: Json | null;
                    title: string | null;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    app_name: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    title?: string | null;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    app_name?: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    title?: string | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            courses: {
                Row: {
                    cover_image: string | null;
                    created_at: string;
                    description: string | null;
                    duration_minutes: number | null;
                    id: string;
                    level: string | null;
                    platform: string;
                    section: string;
                    title: string;
                    updated_at: string;
                };
                Insert: {
                    cover_image?: string | null;
                    created_at?: string;
                    description?: string | null;
                    duration_minutes?: number | null;
                    id?: string;
                    level?: string | null;
                    platform: string;
                    section: string;
                    title: string;
                    updated_at?: string;
                };
                Update: {
                    cover_image?: string | null;
                    created_at?: string;
                    description?: string | null;
                    duration_minutes?: number | null;
                    id?: string;
                    level?: string | null;
                    platform?: string;
                    section?: string;
                    title?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            crowdfunding: {
                Row: {
                    amount: number;
                    contributed_at: string;
                    id: string;
                    proposal_id: string | null;
                    team_id: string | null;
                    user_id: string | null;
                };
                Insert: {
                    amount: number;
                    contributed_at?: string;
                    id?: string;
                    proposal_id?: string | null;
                    team_id?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    amount?: number;
                    contributed_at?: string;
                    id?: string;
                    proposal_id?: string | null;
                    team_id?: string | null;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "crowdfunding_proposal_id_fkey";
                        columns: ["proposal_id"];
                        isOneToOne: false;
                        referencedRelation: "proposals";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "crowdfunding_team_id_fkey";
                        columns: ["team_id"];
                        isOneToOne: false;
                        referencedRelation: "teams";
                        referencedColumns: ["id"];
                    }
                ];
            };
            csrf_tokens: {
                Row: {
                    created_at: string | null;
                    expires_at: string;
                    id: string;
                    token_hash: string;
                    user_agent: string | null;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    expires_at: string;
                    id?: string;
                    token_hash: string;
                    user_agent?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    expires_at?: string;
                    id?: string;
                    token_hash?: string;
                    user_agent?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            data_transfer_logs: {
                Row: {
                    completed_at: string | null;
                    data_types: string[];
                    error_message: string | null;
                    file_name: string | null;
                    file_size: number | null;
                    format: string | null;
                    id: string;
                    metadata: Json | null;
                    operation_type: string;
                    record_count: number | null;
                    started_at: string | null;
                    status: string | null;
                    user_id: string;
                };
                Insert: {
                    completed_at?: string | null;
                    data_types: string[];
                    error_message?: string | null;
                    file_name?: string | null;
                    file_size?: number | null;
                    format?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    operation_type: string;
                    record_count?: number | null;
                    started_at?: string | null;
                    status?: string | null;
                    user_id: string;
                };
                Update: {
                    completed_at?: string | null;
                    data_types?: string[];
                    error_message?: string | null;
                    file_name?: string | null;
                    file_size?: number | null;
                    format?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    operation_type?: string;
                    record_count?: number | null;
                    started_at?: string | null;
                    status?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            discussion_posts: {
                Row: {
                    content: string;
                    created_at: string | null;
                    downvotes: number | null;
                    id: string;
                    parent_post_id: string | null;
                    related_concepts: string[] | null;
                    tenant_slug: string;
                    topic_id: string;
                    upvotes: number | null;
                    user_id: string;
                };
                Insert: {
                    content: string;
                    created_at?: string | null;
                    downvotes?: number | null;
                    id?: string;
                    parent_post_id?: string | null;
                    related_concepts?: string[] | null;
                    tenant_slug: string;
                    topic_id: string;
                    upvotes?: number | null;
                    user_id: string;
                };
                Update: {
                    content?: string;
                    created_at?: string | null;
                    downvotes?: number | null;
                    id?: string;
                    parent_post_id?: string | null;
                    related_concepts?: string[] | null;
                    tenant_slug?: string;
                    topic_id?: string;
                    upvotes?: number | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "discussion_posts_parent_post_id_fkey";
                        columns: ["parent_post_id"];
                        isOneToOne: false;
                        referencedRelation: "discussion_posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "discussion_posts_topic_id_fkey";
                        columns: ["topic_id"];
                        isOneToOne: false;
                        referencedRelation: "discussion_topics";
                        referencedColumns: ["id"];
                    }
                ];
            };
            discussion_topics: {
                Row: {
                    category: string;
                    created_at: string | null;
                    created_by: string;
                    description: string;
                    id: string;
                    route: string | null;
                    status: string | null;
                    tags: string[] | null;
                    tenant_slug: string;
                    title: string;
                };
                Insert: {
                    category: string;
                    created_at?: string | null;
                    created_by: string;
                    description: string;
                    id?: string;
                    route?: string | null;
                    status?: string | null;
                    tags?: string[] | null;
                    tenant_slug: string;
                    title: string;
                };
                Update: {
                    category?: string;
                    created_at?: string | null;
                    created_by?: string;
                    description?: string;
                    id?: string;
                    route?: string | null;
                    status?: string | null;
                    tags?: string[] | null;
                    tenant_slug?: string;
                    title?: string;
                };
                Relationships: [];
            };
            documentation: {
                Row: {
                    content: string;
                    created_at: string | null;
                    id: number;
                    title: string;
                };
                Insert: {
                    content: string;
                    created_at?: string | null;
                    id?: number;
                    title: string;
                };
                Update: {
                    content?: string;
                    created_at?: string | null;
                    id?: number;
                    title?: string;
                };
                Relationships: [];
            };
            error_logs: {
                Row: {
                    context: Json | null;
                    error_message: string;
                    error_type: string;
                    id: string;
                    platform: string | null;
                    resolution_notes: string | null;
                    resolved: boolean | null;
                    severity: string;
                    stack_trace: string | null;
                    timestamp: string | null;
                    user_id: string | null;
                };
                Insert: {
                    context?: Json | null;
                    error_message: string;
                    error_type: string;
                    id?: string;
                    platform?: string | null;
                    resolution_notes?: string | null;
                    resolved?: boolean | null;
                    severity: string;
                    stack_trace?: string | null;
                    timestamp?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    context?: Json | null;
                    error_message?: string;
                    error_type?: string;
                    id?: string;
                    platform?: string | null;
                    resolution_notes?: string | null;
                    resolved?: boolean | null;
                    severity?: string;
                    stack_trace?: string | null;
                    timestamp?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            event_attendees: {
                Row: {
                    created_at: string;
                    event_id: string;
                    id: string;
                    status: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    event_id: string;
                    id?: string;
                    status: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    event_id?: string;
                    id?: string;
                    status?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "event_attendees_event_id_fkey";
                        columns: ["event_id"];
                        isOneToOne: false;
                        referencedRelation: "events";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "event_attendees_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            event_registrations: {
                Row: {
                    event_id: string;
                    id: string;
                    registered_at: string | null;
                    user_id: string;
                };
                Insert: {
                    event_id: string;
                    id?: string;
                    registered_at?: string | null;
                    user_id: string;
                };
                Update: {
                    event_id?: string;
                    id?: string;
                    registered_at?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "event_registrations_event_id_fkey";
                        columns: ["event_id"];
                        isOneToOne: false;
                        referencedRelation: "events";
                        referencedColumns: ["id"];
                    }
                ];
            };
            events: {
                Row: {
                    created_at: string;
                    description: string | null;
                    end_time: string;
                    event_type: string;
                    host_id: string;
                    id: string;
                    location: string | null;
                    max_attendees: number | null;
                    meeting_link: string | null;
                    platform: string;
                    route: string | null;
                    section: string | null;
                    start_time: string;
                    title: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    end_time: string;
                    event_type: string;
                    host_id: string;
                    id?: string;
                    location?: string | null;
                    max_attendees?: number | null;
                    meeting_link?: string | null;
                    platform: string;
                    route?: string | null;
                    section?: string | null;
                    start_time: string;
                    title: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    end_time?: string;
                    event_type?: string;
                    host_id?: string;
                    id?: string;
                    location?: string | null;
                    max_attendees?: number | null;
                    meeting_link?: string | null;
                    platform?: string;
                    route?: string | null;
                    section?: string | null;
                    start_time?: string;
                    title?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "events_host_id_fkey";
                        columns: ["host_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            feature_flags: {
                Row: {
                    config: Json | null;
                    created_at: string | null;
                    feature_key: string;
                    id: string;
                    is_enabled: boolean;
                    platform: string;
                    updated_at: string | null;
                };
                Insert: {
                    config?: Json | null;
                    created_at?: string | null;
                    feature_key: string;
                    id?: string;
                    is_enabled: boolean;
                    platform: string;
                    updated_at?: string | null;
                };
                Update: {
                    config?: Json | null;
                    created_at?: string | null;
                    feature_key?: string;
                    id?: string;
                    is_enabled?: boolean;
                    platform?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            feedback: {
                Row: {
                    app_name: string;
                    content: string;
                    created_at: string;
                    id: string;
                    metadata: Json | null;
                    sentiment: number | null;
                    status: Database["public"]["Enums"]["feedback_status"];
                    updated_at: string;
                    user_id: string | null;
                };
                Insert: {
                    app_name: string;
                    content: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    sentiment?: number | null;
                    status?: Database["public"]["Enums"]["feedback_status"];
                    updated_at?: string;
                    user_id?: string | null;
                };
                Update: {
                    app_name?: string;
                    content?: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    sentiment?: number | null;
                    status?: Database["public"]["Enums"]["feedback_status"];
                    updated_at?: string;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            feedback_ascenders: {
                Row: {
                    app_name: string;
                    content: string;
                    created_at: string;
                    id: string;
                    metadata: Json | null;
                    sentiment: number | null;
                    status: Database["public"]["Enums"]["feedback_status"];
                    updated_at: string;
                    user_id: string | null;
                };
                Insert: {
                    app_name: string;
                    content: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    sentiment?: number | null;
                    status?: Database["public"]["Enums"]["feedback_status"];
                    updated_at?: string;
                    user_id?: string | null;
                };
                Update: {
                    app_name?: string;
                    content?: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    sentiment?: number | null;
                    status?: Database["public"]["Enums"]["feedback_status"];
                    updated_at?: string;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            feedback_hub: {
                Row: {
                    app_name: string;
                    content: string;
                    created_at: string;
                    id: string;
                    metadata: Json | null;
                    sentiment: number | null;
                    status: Database["public"]["Enums"]["feedback_status"];
                    updated_at: string;
                    user_id: string | null;
                };
                Insert: {
                    app_name: string;
                    content: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    sentiment?: number | null;
                    status?: Database["public"]["Enums"]["feedback_status"];
                    updated_at?: string;
                    user_id?: string | null;
                };
                Update: {
                    app_name?: string;
                    content?: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    sentiment?: number | null;
                    status?: Database["public"]["Enums"]["feedback_status"];
                    updated_at?: string;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            feedback_immortals: {
                Row: {
                    app_name: string;
                    content: string;
                    created_at: string;
                    id: string;
                    metadata: Json | null;
                    sentiment: number | null;
                    status: Database["public"]["Enums"]["feedback_status"];
                    updated_at: string;
                    user_id: string | null;
                };
                Insert: {
                    app_name: string;
                    content: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    sentiment?: number | null;
                    status?: Database["public"]["Enums"]["feedback_status"];
                    updated_at?: string;
                    user_id?: string | null;
                };
                Update: {
                    app_name?: string;
                    content?: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    sentiment?: number | null;
                    status?: Database["public"]["Enums"]["feedback_status"];
                    updated_at?: string;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            feedback_neothinkers: {
                Row: {
                    app_name: string;
                    content: string;
                    created_at: string;
                    id: string;
                    metadata: Json | null;
                    sentiment: number | null;
                    status: Database["public"]["Enums"]["feedback_status"];
                    updated_at: string;
                    user_id: string | null;
                };
                Insert: {
                    app_name: string;
                    content: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    sentiment?: number | null;
                    status?: Database["public"]["Enums"]["feedback_status"];
                    updated_at?: string;
                    user_id?: string | null;
                };
                Update: {
                    app_name?: string;
                    content?: string;
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    sentiment?: number | null;
                    status?: Database["public"]["Enums"]["feedback_status"];
                    updated_at?: string;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            fibonacci_token_rewards: {
                Row: {
                    action_id: string | null;
                    awarded_at: string;
                    id: string;
                    reward_type: string;
                    simulation_run_id: string | null;
                    team_id: string | null;
                    tokens_awarded: number;
                    user_id: string | null;
                };
                Insert: {
                    action_id?: string | null;
                    awarded_at?: string;
                    id?: string;
                    reward_type: string;
                    simulation_run_id?: string | null;
                    team_id?: string | null;
                    tokens_awarded: number;
                    user_id?: string | null;
                };
                Update: {
                    action_id?: string | null;
                    awarded_at?: string;
                    id?: string;
                    reward_type?: string;
                    simulation_run_id?: string | null;
                    team_id?: string | null;
                    tokens_awarded?: number;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "fibonacci_token_rewards_action_id_fkey";
                        columns: ["action_id"];
                        isOneToOne: false;
                        referencedRelation: "user_actions";
                        referencedColumns: ["id"];
                    }
                ];
            };
            flow_templates: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    name: string;
                    template_data: Json | null;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name: string;
                    template_data?: Json | null;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name?: string;
                    template_data?: Json | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            gamification_events: {
                Row: {
                    amount: number;
                    created_at: string;
                    event_type: string;
                    id: number;
                    metadata: Json | null;
                    persona: string;
                    simulation_run_id: string | null;
                    site: string;
                    token_type: string;
                    user_id: string;
                };
                Insert: {
                    amount: number;
                    created_at?: string;
                    event_type: string;
                    id?: number;
                    metadata?: Json | null;
                    persona: string;
                    simulation_run_id?: string | null;
                    site: string;
                    token_type: string;
                    user_id: string;
                };
                Update: {
                    amount?: number;
                    created_at?: string;
                    event_type?: string;
                    id?: number;
                    metadata?: Json | null;
                    persona?: string;
                    simulation_run_id?: string | null;
                    site?: string;
                    token_type?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            governance_proposals: {
                Row: {
                    council_term: number | null;
                    created_at: string | null;
                    description: string;
                    proposal_id: string;
                    stake: number;
                    status: string;
                    title: string;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    council_term?: number | null;
                    created_at?: string | null;
                    description: string;
                    proposal_id?: string;
                    stake?: number;
                    status?: string;
                    title: string;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    council_term?: number | null;
                    created_at?: string | null;
                    description?: string;
                    proposal_id?: string;
                    stake?: number;
                    status?: string;
                    title?: string;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            group_actions: {
                Row: {
                    action_type: string;
                    id: string;
                    metadata: Json | null;
                    performed_at: string;
                    performed_by: string | null;
                    team_id: string | null;
                };
                Insert: {
                    action_type: string;
                    id?: string;
                    metadata?: Json | null;
                    performed_at?: string;
                    performed_by?: string | null;
                    team_id?: string | null;
                };
                Update: {
                    action_type?: string;
                    id?: string;
                    metadata?: Json | null;
                    performed_at?: string;
                    performed_by?: string | null;
                    team_id?: string | null;
                };
                Relationships: [];
            };
            health_integrations: {
                Row: {
                    access_token: string | null;
                    created_at: string | null;
                    id: string;
                    is_active: boolean | null;
                    last_sync: string | null;
                    metadata: Json | null;
                    provider: string;
                    provider_user_id: string | null;
                    refresh_token: string | null;
                    token_expires_at: string | null;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    access_token?: string | null;
                    created_at?: string | null;
                    id?: string;
                    is_active?: boolean | null;
                    last_sync?: string | null;
                    metadata?: Json | null;
                    provider: string;
                    provider_user_id?: string | null;
                    refresh_token?: string | null;
                    token_expires_at?: string | null;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    access_token?: string | null;
                    created_at?: string | null;
                    id?: string;
                    is_active?: boolean | null;
                    last_sync?: string | null;
                    metadata?: Json | null;
                    provider?: string;
                    provider_user_id?: string | null;
                    refresh_token?: string | null;
                    token_expires_at?: string | null;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            health_metrics: {
                Row: {
                    created_at: string | null;
                    id: string;
                    integration_id: string | null;
                    metadata: Json | null;
                    metric_type: string;
                    source: string;
                    timestamp: string;
                    unit: string;
                    user_id: string;
                    value: number;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    integration_id?: string | null;
                    metadata?: Json | null;
                    metric_type: string;
                    source: string;
                    timestamp: string;
                    unit: string;
                    user_id: string;
                    value: number;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    integration_id?: string | null;
                    metadata?: Json | null;
                    metric_type?: string;
                    source?: string;
                    timestamp?: string;
                    unit?: string;
                    user_id?: string;
                    value?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "health_metrics_integration_id_fkey";
                        columns: ["integration_id"];
                        isOneToOne: false;
                        referencedRelation: "health_integrations";
                        referencedColumns: ["id"];
                    }
                ];
            };
            hub_profiles: {
                Row: {
                    created_at: string;
                    id: string;
                    preferences: Json;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    preferences?: Json;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    preferences?: Json;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            immortals_profiles: {
                Row: {
                    created_at: string;
                    id: string;
                    level: number | null;
                    preferences: Json;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    level?: number | null;
                    preferences?: Json;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    level?: number | null;
                    preferences?: Json;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            integration_settings: {
                Row: {
                    auto_sync: boolean | null;
                    include_in_reports: boolean | null;
                    last_updated: string | null;
                    notify_on_sync: boolean | null;
                    sync_frequency: string | null;
                    user_id: string;
                };
                Insert: {
                    auto_sync?: boolean | null;
                    include_in_reports?: boolean | null;
                    last_updated?: string | null;
                    notify_on_sync?: boolean | null;
                    sync_frequency?: string | null;
                    user_id: string;
                };
                Update: {
                    auto_sync?: boolean | null;
                    include_in_reports?: boolean | null;
                    last_updated?: string | null;
                    notify_on_sync?: boolean | null;
                    sync_frequency?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            journal_entries: {
                Row: {
                    content: string;
                    created_at: string | null;
                    entry_type: string;
                    favorite: boolean | null;
                    id: string;
                    is_public: boolean | null;
                    related_concepts: string[] | null;
                    related_exercises: string[] | null;
                    tags: string[] | null;
                    tenant_slug: string;
                    title: string;
                    user_id: string;
                };
                Insert: {
                    content: string;
                    created_at?: string | null;
                    entry_type: string;
                    favorite?: boolean | null;
                    id?: string;
                    is_public?: boolean | null;
                    related_concepts?: string[] | null;
                    related_exercises?: string[] | null;
                    tags?: string[] | null;
                    tenant_slug: string;
                    title: string;
                    user_id: string;
                };
                Update: {
                    content?: string;
                    created_at?: string | null;
                    entry_type?: string;
                    favorite?: boolean | null;
                    id?: string;
                    is_public?: boolean | null;
                    related_concepts?: string[] | null;
                    related_exercises?: string[] | null;
                    tags?: string[] | null;
                    tenant_slug?: string;
                    title?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            learning_path_items: {
                Row: {
                    content_id: string;
                    content_type: string;
                    created_at: string | null;
                    id: string;
                    metadata: Json | null;
                    order_index: number;
                    path_id: string | null;
                    required: boolean | null;
                };
                Insert: {
                    content_id: string;
                    content_type: string;
                    created_at?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    order_index: number;
                    path_id?: string | null;
                    required?: boolean | null;
                };
                Update: {
                    content_id?: string;
                    content_type?: string;
                    created_at?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    order_index?: number;
                    path_id?: string | null;
                    required?: boolean | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "learning_path_items_path_id_fkey";
                        columns: ["path_id"];
                        isOneToOne: false;
                        referencedRelation: "learning_paths";
                        referencedColumns: ["id"];
                    }
                ];
            };
            learning_paths: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    difficulty_level: string | null;
                    id: string;
                    metadata: Json | null;
                    path_name: string;
                    platform: string;
                    prerequisites: Json | null;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    difficulty_level?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    path_name: string;
                    platform: string;
                    prerequisites?: Json | null;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    difficulty_level?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    path_name?: string;
                    platform?: string;
                    prerequisites?: Json | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            learning_progress: {
                Row: {
                    completed_at: string | null;
                    content_id: string;
                    content_type: string;
                    id: string;
                    last_interaction_at: string | null;
                    metadata: Json | null;
                    progress_percentage: number | null;
                    started_at: string | null;
                    status: string;
                    user_id: string | null;
                };
                Insert: {
                    completed_at?: string | null;
                    content_id: string;
                    content_type: string;
                    id?: string;
                    last_interaction_at?: string | null;
                    metadata?: Json | null;
                    progress_percentage?: number | null;
                    started_at?: string | null;
                    status: string;
                    user_id?: string | null;
                };
                Update: {
                    completed_at?: string | null;
                    content_id?: string;
                    content_type?: string;
                    id?: string;
                    last_interaction_at?: string | null;
                    metadata?: Json | null;
                    progress_percentage?: number | null;
                    started_at?: string | null;
                    status?: string;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            learning_recommendations: {
                Row: {
                    content_id: string;
                    content_type: string;
                    created_at: string | null;
                    expires_at: string | null;
                    id: string;
                    recommendation_reason: string | null;
                    relevance_score: number;
                    user_id: string | null;
                };
                Insert: {
                    content_id: string;
                    content_type: string;
                    created_at?: string | null;
                    expires_at?: string | null;
                    id?: string;
                    recommendation_reason?: string | null;
                    relevance_score: number;
                    user_id?: string | null;
                };
                Update: {
                    content_id?: string;
                    content_type?: string;
                    created_at?: string | null;
                    expires_at?: string | null;
                    id?: string;
                    recommendation_reason?: string | null;
                    relevance_score?: number;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            lessons: {
                Row: {
                    content: string | null;
                    created_at: string | null;
                    id: string;
                    is_published: boolean | null;
                    metadata: Json | null;
                    module_id: string;
                    order_index: number | null;
                    title: string;
                    updated_at: string | null;
                };
                Insert: {
                    content?: string | null;
                    created_at?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    metadata?: Json | null;
                    module_id: string;
                    order_index?: number | null;
                    title: string;
                    updated_at?: string | null;
                };
                Update: {
                    content?: string | null;
                    created_at?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    metadata?: Json | null;
                    module_id?: string;
                    order_index?: number | null;
                    title?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "lessons_module_id_fkey";
                        columns: ["module_id"];
                        isOneToOne: false;
                        referencedRelation: "content_modules";
                        referencedColumns: ["id"];
                    }
                ];
            };
            login_attempts: {
                Row: {
                    attempt_count: number | null;
                    created_at: string | null;
                    email: string;
                    id: string;
                    ip_address: string;
                    last_attempt: string | null;
                    locked_until: string | null;
                };
                Insert: {
                    attempt_count?: number | null;
                    created_at?: string | null;
                    email: string;
                    id?: string;
                    ip_address: string;
                    last_attempt?: string | null;
                    locked_until?: string | null;
                };
                Update: {
                    attempt_count?: number | null;
                    created_at?: string | null;
                    email?: string;
                    id?: string;
                    ip_address?: string;
                    last_attempt?: string | null;
                    locked_until?: string | null;
                };
                Relationships: [];
            };
            mark_hamilton_content: {
                Row: {
                    content_data: Json | null;
                    content_type: string;
                    created_at: string | null;
                    id: string;
                    title: string;
                    updated_at: string | null;
                };
                Insert: {
                    content_data?: Json | null;
                    content_type: string;
                    created_at?: string | null;
                    id?: string;
                    title: string;
                    updated_at?: string | null;
                };
                Update: {
                    content_data?: Json | null;
                    content_type?: string;
                    created_at?: string | null;
                    id?: string;
                    title?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            messages: {
                Row: {
                    content: string;
                    created_at: string;
                    id: string;
                    is_read: boolean | null;
                    reward_processed: boolean | null;
                    room_id: string;
                    room_type: string | null;
                    sender_id: string;
                    token_tag: string | null;
                };
                Insert: {
                    content: string;
                    created_at?: string;
                    id?: string;
                    is_read?: boolean | null;
                    reward_processed?: boolean | null;
                    room_id: string;
                    room_type?: string | null;
                    sender_id: string;
                    token_tag?: string | null;
                };
                Update: {
                    content?: string;
                    created_at?: string;
                    id?: string;
                    is_read?: boolean | null;
                    reward_processed?: boolean | null;
                    room_id?: string;
                    room_type?: string | null;
                    sender_id?: string;
                    token_tag?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "messages_room_id_fkey";
                        columns: ["room_id"];
                        isOneToOne: false;
                        referencedRelation: "chat_rooms";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "messages_sender_id_fkey";
                        columns: ["sender_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            modules: {
                Row: {
                    course_id: string;
                    created_at: string;
                    description: string | null;
                    id: string;
                    sequence_order: number;
                    title: string;
                    updated_at: string;
                };
                Insert: {
                    course_id: string;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    sequence_order: number;
                    title: string;
                    updated_at?: string;
                };
                Update: {
                    course_id?: string;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    sequence_order?: number;
                    title?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "modules_course_id_fkey";
                        columns: ["course_id"];
                        isOneToOne: false;
                        referencedRelation: "courses";
                        referencedColumns: ["id"];
                    }
                ];
            };
            neothinkers_profiles: {
                Row: {
                    created_at: string;
                    id: string;
                    level: number | null;
                    preferences: Json;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    level?: number | null;
                    preferences?: Json;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    level?: number | null;
                    preferences?: Json;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            notification_preferences: {
                Row: {
                    created_at: string | null;
                    email_enabled: boolean | null;
                    id: string;
                    in_app_enabled: boolean | null;
                    platform: string;
                    preferences: Json | null;
                    push_enabled: boolean | null;
                    updated_at: string | null;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    email_enabled?: boolean | null;
                    id?: string;
                    in_app_enabled?: boolean | null;
                    platform: string;
                    preferences?: Json | null;
                    push_enabled?: boolean | null;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    email_enabled?: boolean | null;
                    id?: string;
                    in_app_enabled?: boolean | null;
                    platform?: string;
                    preferences?: Json | null;
                    push_enabled?: boolean | null;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            notification_templates: {
                Row: {
                    body_template: string;
                    created_at: string | null;
                    id: string;
                    metadata: Json | null;
                    platform: string;
                    template_key: string;
                    title_template: string;
                    updated_at: string | null;
                };
                Insert: {
                    body_template: string;
                    created_at?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    platform: string;
                    template_key: string;
                    title_template: string;
                    updated_at?: string | null;
                };
                Update: {
                    body_template?: string;
                    created_at?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    platform?: string;
                    template_key?: string;
                    title_template?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            notifications: {
                Row: {
                    body: string;
                    created_at: string | null;
                    id: string;
                    is_read: boolean | null;
                    metadata: Json | null;
                    platform: string;
                    priority: string | null;
                    target_platforms: string[] | null;
                    title: string;
                    type: string | null;
                    updated_at: string | null;
                    user_id: string | null;
                };
                Insert: {
                    body: string;
                    created_at?: string | null;
                    id?: string;
                    is_read?: boolean | null;
                    metadata?: Json | null;
                    platform: string;
                    priority?: string | null;
                    target_platforms?: string[] | null;
                    title: string;
                    type?: string | null;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    body?: string;
                    created_at?: string | null;
                    id?: string;
                    is_read?: boolean | null;
                    metadata?: Json | null;
                    platform?: string;
                    priority?: string | null;
                    target_platforms?: string[] | null;
                    title?: string;
                    type?: string | null;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            participation: {
                Row: {
                    activity_type: string;
                    created_at: string | null;
                    id: string;
                    metadata: Json | null;
                    platform: string;
                    points: number | null;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    activity_type: string;
                    created_at?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    platform: string;
                    points?: number | null;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    activity_type?: string;
                    created_at?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    platform?: string;
                    points?: number | null;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "participation_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            performance_metrics: {
                Row: {
                    context: Json | null;
                    id: string;
                    metric_name: string;
                    metric_unit: string | null;
                    metric_value: number;
                    platform: string | null;
                    timestamp: string | null;
                };
                Insert: {
                    context?: Json | null;
                    id?: string;
                    metric_name: string;
                    metric_unit?: string | null;
                    metric_value: number;
                    platform?: string | null;
                    timestamp?: string | null;
                };
                Update: {
                    context?: Json | null;
                    id?: string;
                    metric_name?: string;
                    metric_unit?: string | null;
                    metric_value?: number;
                    platform?: string | null;
                    timestamp?: string | null;
                };
                Relationships: [];
            };
            permissions: {
                Row: {
                    category: string | null;
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    name: string;
                    scope: string;
                    slug: string;
                };
                Insert: {
                    category?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name: string;
                    scope: string;
                    slug: string;
                };
                Update: {
                    category?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name?: string;
                    scope?: string;
                    slug?: string;
                };
                Relationships: [];
            };
            platform_access: {
                Row: {
                    access_level: string | null;
                    expires_at: string | null;
                    granted_at: string | null;
                    granted_by: string | null;
                    id: string;
                    platform_slug: string;
                    user_id: string;
                };
                Insert: {
                    access_level?: string | null;
                    expires_at?: string | null;
                    granted_at?: string | null;
                    granted_by?: string | null;
                    id?: string;
                    platform_slug: string;
                    user_id: string;
                };
                Update: {
                    access_level?: string | null;
                    expires_at?: string | null;
                    granted_at?: string | null;
                    granted_by?: string | null;
                    id?: string;
                    platform_slug?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            platform_customization: {
                Row: {
                    component_key: string;
                    created_at: string | null;
                    customization: Json;
                    id: string;
                    platform: string;
                    updated_at: string | null;
                };
                Insert: {
                    component_key: string;
                    created_at?: string | null;
                    customization: Json;
                    id?: string;
                    platform: string;
                    updated_at?: string | null;
                };
                Update: {
                    component_key?: string;
                    created_at?: string | null;
                    customization?: Json;
                    id?: string;
                    platform?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            platform_settings: {
                Row: {
                    created_at: string | null;
                    id: string;
                    platform: string;
                    settings: Json;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    platform: string;
                    settings: Json;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    platform?: string;
                    settings?: Json;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            platform_state: {
                Row: {
                    created_at: string | null;
                    id: string;
                    key: string;
                    platform: string;
                    updated_at: string | null;
                    user_id: string;
                    value: Json;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    key: string;
                    platform: string;
                    updated_at?: string | null;
                    user_id: string;
                    value: Json;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    key?: string;
                    platform?: string;
                    updated_at?: string | null;
                    user_id?: string;
                    value?: Json;
                };
                Relationships: [];
            };
            popular_searches: {
                Row: {
                    id: string;
                    last_used_at: string | null;
                    platform: string | null;
                    query: string;
                    successful_searches: number | null;
                    total_searches: number | null;
                };
                Insert: {
                    id?: string;
                    last_used_at?: string | null;
                    platform?: string | null;
                    query: string;
                    successful_searches?: number | null;
                    total_searches?: number | null;
                };
                Update: {
                    id?: string;
                    last_used_at?: string | null;
                    platform?: string | null;
                    query?: string;
                    successful_searches?: number | null;
                    total_searches?: number | null;
                };
                Relationships: [];
            };
            post_comments: {
                Row: {
                    author_id: string;
                    content: string;
                    created_at: string;
                    id: string;
                    post_id: string;
                    updated_at: string;
                };
                Insert: {
                    author_id: string;
                    content: string;
                    created_at?: string;
                    id?: string;
                    post_id: string;
                    updated_at?: string;
                };
                Update: {
                    author_id?: string;
                    content?: string;
                    created_at?: string;
                    id?: string;
                    post_id?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "post_comments_author_id_fkey";
                        columns: ["author_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "post_comments_post_id_fkey";
                        columns: ["post_id"];
                        isOneToOne: false;
                        referencedRelation: "posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "post_comments_post_id_fkey";
                        columns: ["post_id"];
                        isOneToOne: false;
                        referencedRelation: "recent_posts_view";
                        referencedColumns: ["id"];
                    }
                ];
            };
            post_likes: {
                Row: {
                    created_at: string;
                    id: string;
                    post_id: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    post_id: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    post_id?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "post_likes_post_id_fkey";
                        columns: ["post_id"];
                        isOneToOne: false;
                        referencedRelation: "posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "post_likes_post_id_fkey";
                        columns: ["post_id"];
                        isOneToOne: false;
                        referencedRelation: "recent_posts_view";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "post_likes_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            post_reactions: {
                Row: {
                    created_at: string;
                    id: string;
                    post_id: string;
                    reaction_type: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    post_id: string;
                    reaction_type: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    post_id?: string;
                    reaction_type?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "post_reactions_post_id_fkey";
                        columns: ["post_id"];
                        isOneToOne: false;
                        referencedRelation: "posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "post_reactions_post_id_fkey";
                        columns: ["post_id"];
                        isOneToOne: false;
                        referencedRelation: "recent_posts_view";
                        referencedColumns: ["id"];
                    }
                ];
            };
            posts: {
                Row: {
                    author_id: string;
                    content: string;
                    created_at: string;
                    engagement_count: number | null;
                    id: string;
                    is_pinned: boolean | null;
                    platform: string;
                    reward_processed: boolean | null;
                    section: string | null;
                    token_tag: string | null;
                    updated_at: string;
                    visibility: string;
                };
                Insert: {
                    author_id: string;
                    content: string;
                    created_at?: string;
                    engagement_count?: number | null;
                    id?: string;
                    is_pinned?: boolean | null;
                    platform: string;
                    reward_processed?: boolean | null;
                    section?: string | null;
                    token_tag?: string | null;
                    updated_at?: string;
                    visibility?: string;
                };
                Update: {
                    author_id?: string;
                    content?: string;
                    created_at?: string;
                    engagement_count?: number | null;
                    id?: string;
                    is_pinned?: boolean | null;
                    platform?: string;
                    reward_processed?: boolean | null;
                    section?: string | null;
                    token_tag?: string | null;
                    updated_at?: string;
                    visibility?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "posts_author_id_fkey";
                        columns: ["author_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            profiles: {
                Row: {
                    avatar_url: string | null;
                    bio: string | null;
                    created_at: string | null;
                    email: string;
                    full_name: string | null;
                    guardian_since: string | null;
                    id: string;
                    is_ascender: boolean | null;
                    is_guardian: boolean | null;
                    is_immortal: boolean | null;
                    is_neothinker: boolean | null;
                    platforms: string[] | null;
                    role: string | null;
                    subscribed_platforms: string[] | null;
                    subscription_period_end: string | null;
                    subscription_period_start: string | null;
                    subscription_status: string | null;
                    subscription_tier: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    avatar_url?: string | null;
                    bio?: string | null;
                    created_at?: string | null;
                    email: string;
                    full_name?: string | null;
                    guardian_since?: string | null;
                    id: string;
                    is_ascender?: boolean | null;
                    is_guardian?: boolean | null;
                    is_immortal?: boolean | null;
                    is_neothinker?: boolean | null;
                    platforms?: string[] | null;
                    role?: string | null;
                    subscribed_platforms?: string[] | null;
                    subscription_period_end?: string | null;
                    subscription_period_start?: string | null;
                    subscription_status?: string | null;
                    subscription_tier?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    avatar_url?: string | null;
                    bio?: string | null;
                    created_at?: string | null;
                    email?: string;
                    full_name?: string | null;
                    guardian_since?: string | null;
                    id?: string;
                    is_ascender?: boolean | null;
                    is_guardian?: boolean | null;
                    is_immortal?: boolean | null;
                    is_neothinker?: boolean | null;
                    platforms?: string[] | null;
                    role?: string | null;
                    subscribed_platforms?: string[] | null;
                    subscription_period_end?: string | null;
                    subscription_period_start?: string | null;
                    subscription_status?: string | null;
                    subscription_tier?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            proposals: {
                Row: {
                    created_at: string;
                    created_by: string | null;
                    description: string | null;
                    id: string;
                    metadata: Json | null;
                    proposal_type: string;
                    status: string;
                    team_id: string | null;
                    title: string;
                };
                Insert: {
                    created_at?: string;
                    created_by?: string | null;
                    description?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    proposal_type: string;
                    status?: string;
                    team_id?: string | null;
                    title: string;
                };
                Update: {
                    created_at?: string;
                    created_by?: string | null;
                    description?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    proposal_type?: string;
                    status?: string;
                    team_id?: string | null;
                    title?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "proposals_team_id_fkey";
                        columns: ["team_id"];
                        isOneToOne: false;
                        referencedRelation: "teams";
                        referencedColumns: ["id"];
                    }
                ];
            };
            rate_limits: {
                Row: {
                    count: number;
                    created_at: string;
                    id: string;
                    identifier: string;
                    window_seconds: number;
                    window_start: string;
                };
                Insert: {
                    count?: number;
                    created_at?: string;
                    id?: string;
                    identifier: string;
                    window_seconds?: number;
                    window_start?: string;
                };
                Update: {
                    count?: number;
                    created_at?: string;
                    id?: string;
                    identifier?: string;
                    window_seconds?: number;
                    window_start?: string;
                };
                Relationships: [];
            };
            referral_bonuses: {
                Row: {
                    awarded_at: string;
                    bonus_amount: number;
                    id: string;
                    referred_id: string | null;
                    referrer_id: string | null;
                };
                Insert: {
                    awarded_at?: string;
                    bonus_amount: number;
                    id?: string;
                    referred_id?: string | null;
                    referrer_id?: string | null;
                };
                Update: {
                    awarded_at?: string;
                    bonus_amount?: number;
                    id?: string;
                    referred_id?: string | null;
                    referrer_id?: string | null;
                };
                Relationships: [];
            };
            referrals: {
                Row: {
                    created_at: string | null;
                    id: string;
                    referred_id: string | null;
                    referrer_id: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    referred_id?: string | null;
                    referrer_id?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    referred_id?: string | null;
                    referrer_id?: string | null;
                };
                Relationships: [];
            };
            resources: {
                Row: {
                    content: string | null;
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    is_published: boolean | null;
                    metadata: Json | null;
                    platform: string;
                    resource_type: string;
                    title: string;
                    updated_at: string | null;
                    url: string | null;
                };
                Insert: {
                    content?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    metadata?: Json | null;
                    platform: string;
                    resource_type: string;
                    title: string;
                    updated_at?: string | null;
                    url?: string | null;
                };
                Update: {
                    content?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    metadata?: Json | null;
                    platform?: string;
                    resource_type?: string;
                    title?: string;
                    updated_at?: string | null;
                    url?: string | null;
                };
                Relationships: [];
            };
            role_capabilities: {
                Row: {
                    can_approve: boolean | null;
                    can_create: boolean | null;
                    can_delete: boolean | null;
                    can_edit: boolean | null;
                    can_view: boolean | null;
                    created_at: string | null;
                    feature_name: string;
                    id: string;
                    role_slug: string;
                    tenant_id: string;
                    updated_at: string | null;
                };
                Insert: {
                    can_approve?: boolean | null;
                    can_create?: boolean | null;
                    can_delete?: boolean | null;
                    can_edit?: boolean | null;
                    can_view?: boolean | null;
                    created_at?: string | null;
                    feature_name: string;
                    id?: string;
                    role_slug: string;
                    tenant_id: string;
                    updated_at?: string | null;
                };
                Update: {
                    can_approve?: boolean | null;
                    can_create?: boolean | null;
                    can_delete?: boolean | null;
                    can_edit?: boolean | null;
                    can_view?: boolean | null;
                    created_at?: string | null;
                    feature_name?: string;
                    id?: string;
                    role_slug?: string;
                    tenant_id?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "role_capabilities_tenant_id_fkey";
                        columns: ["tenant_id"];
                        isOneToOne: false;
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            role_permissions: {
                Row: {
                    created_at: string | null;
                    permission_id: string;
                    role_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    permission_id: string;
                    role_id: string;
                };
                Update: {
                    created_at?: string | null;
                    permission_id?: string;
                    role_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "role_permissions_permission_id_fkey";
                        columns: ["permission_id"];
                        isOneToOne: false;
                        referencedRelation: "permissions";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "role_permissions_role_id_fkey";
                        columns: ["role_id"];
                        isOneToOne: false;
                        referencedRelation: "tenant_roles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            room_participants: {
                Row: {
                    id: string;
                    joined_at: string;
                    role: string;
                    room_id: string;
                    user_id: string;
                };
                Insert: {
                    id?: string;
                    joined_at?: string;
                    role?: string;
                    room_id: string;
                    user_id: string;
                };
                Update: {
                    id?: string;
                    joined_at?: string;
                    role?: string;
                    room_id?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "room_participants_room_id_fkey";
                        columns: ["room_id"];
                        isOneToOne: false;
                        referencedRelation: "rooms";
                        referencedColumns: ["id"];
                    }
                ];
            };
            rooms: {
                Row: {
                    created_at: string;
                    created_by: string | null;
                    description: string | null;
                    id: string;
                    name: string;
                    room_type: string;
                };
                Insert: {
                    created_at?: string;
                    created_by?: string | null;
                    description?: string | null;
                    id?: string;
                    name: string;
                    room_type: string;
                };
                Update: {
                    created_at?: string;
                    created_by?: string | null;
                    description?: string | null;
                    id?: string;
                    name?: string;
                    room_type?: string;
                };
                Relationships: [];
            };
            schema_version: {
                Row: {
                    applied_at: string | null;
                    version: number;
                };
                Insert: {
                    applied_at?: string | null;
                    version: number;
                };
                Update: {
                    applied_at?: string | null;
                    version?: number;
                };
                Relationships: [];
            };
            search_analytics: {
                Row: {
                    created_at: string | null;
                    filters: Json | null;
                    id: string;
                    platform: string | null;
                    query: string;
                    results_count: number | null;
                    selected_result: Json | null;
                    session_id: string | null;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    filters?: Json | null;
                    id?: string;
                    platform?: string | null;
                    query: string;
                    results_count?: number | null;
                    selected_result?: Json | null;
                    session_id?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    filters?: Json | null;
                    id?: string;
                    platform?: string | null;
                    query?: string;
                    results_count?: number | null;
                    selected_result?: Json | null;
                    session_id?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            search_suggestions: {
                Row: {
                    created_at: string | null;
                    id: string;
                    suggestion: string;
                    trigger_term: string;
                    updated_at: string | null;
                    weight: number | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    suggestion: string;
                    trigger_term: string;
                    updated_at?: string | null;
                    weight?: number | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    suggestion?: string;
                    trigger_term?: string;
                    updated_at?: string | null;
                    weight?: number | null;
                };
                Relationships: [];
            };
            search_vectors: {
                Row: {
                    content: string | null;
                    content_id: string;
                    content_type: string;
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    metadata: Json | null;
                    search_vector: unknown | null;
                    tags: string[] | null;
                    title: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    content?: string | null;
                    content_id: string;
                    content_type: string;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    search_vector?: unknown | null;
                    tags?: string[] | null;
                    title?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    content?: string | null;
                    content_id?: string;
                    content_type?: string;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    search_vector?: unknown | null;
                    tags?: string[] | null;
                    title?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            security_events: {
                Row: {
                    context: Json | null;
                    created_at: string | null;
                    details: Json | null;
                    event_type: string;
                    id: string;
                    ip_address: string | null;
                    platform_slug: string | null;
                    request_method: string | null;
                    request_path: string | null;
                    severity: string;
                    user_agent: string | null;
                    user_id: string | null;
                };
                Insert: {
                    context?: Json | null;
                    created_at?: string | null;
                    details?: Json | null;
                    event_type: string;
                    id?: string;
                    ip_address?: string | null;
                    platform_slug?: string | null;
                    request_method?: string | null;
                    request_path?: string | null;
                    severity: string;
                    user_agent?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    context?: Json | null;
                    created_at?: string | null;
                    details?: Json | null;
                    event_type?: string;
                    id?: string;
                    ip_address?: string | null;
                    platform_slug?: string | null;
                    request_method?: string | null;
                    request_path?: string | null;
                    severity?: string;
                    user_agent?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            security_logs: {
                Row: {
                    context: Json;
                    created_at: string;
                    details: Json;
                    event_type: string;
                    id: string;
                    ip_address: string | null;
                    platform: string | null;
                    severity: string;
                    timestamp: string;
                    user_agent: string | null;
                    user_id: string | null;
                };
                Insert: {
                    context?: Json;
                    created_at?: string;
                    details?: Json;
                    event_type: string;
                    id?: string;
                    ip_address?: string | null;
                    platform?: string | null;
                    severity: string;
                    timestamp?: string;
                    user_agent?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    context?: Json;
                    created_at?: string;
                    details?: Json;
                    event_type?: string;
                    id?: string;
                    ip_address?: string | null;
                    platform?: string | null;
                    severity?: string;
                    timestamp?: string;
                    user_agent?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            shared_content: {
                Row: {
                    author_id: string | null;
                    category_id: string | null;
                    content: Json;
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    is_published: boolean | null;
                    slug: string;
                    title: string;
                    updated_at: string | null;
                };
                Insert: {
                    author_id?: string | null;
                    category_id?: string | null;
                    content: Json;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    slug: string;
                    title: string;
                    updated_at?: string | null;
                };
                Update: {
                    author_id?: string | null;
                    category_id?: string | null;
                    content?: Json;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    slug?: string;
                    title?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "shared_content_category_id_fkey";
                        columns: ["category_id"];
                        isOneToOne: false;
                        referencedRelation: "content_categories";
                        referencedColumns: ["id"];
                    }
                ];
            };
            site_settings: {
                Row: {
                    base_reward: number;
                    collab_bonus: number;
                    conversion_rates: Json | null;
                    created_at: string;
                    diminishing_threshold: number;
                    site: string;
                    streak_bonus: number;
                };
                Insert: {
                    base_reward?: number;
                    collab_bonus?: number;
                    conversion_rates?: Json | null;
                    created_at?: string;
                    diminishing_threshold?: number;
                    site: string;
                    streak_bonus?: number;
                };
                Update: {
                    base_reward?: number;
                    collab_bonus?: number;
                    conversion_rates?: Json | null;
                    created_at?: string;
                    diminishing_threshold?: number;
                    site?: string;
                    streak_bonus?: number;
                };
                Relationships: [];
            };
            skill_requirements: {
                Row: {
                    content_id: string;
                    content_type: string;
                    created_at: string | null;
                    id: string;
                    required_level: number;
                    skill_name: string;
                };
                Insert: {
                    content_id: string;
                    content_type: string;
                    created_at?: string | null;
                    id?: string;
                    required_level: number;
                    skill_name: string;
                };
                Update: {
                    content_id?: string;
                    content_type?: string;
                    created_at?: string | null;
                    id?: string;
                    required_level?: number;
                    skill_name?: string;
                };
                Relationships: [];
            };
            social_interactions: {
                Row: {
                    activity_id: string | null;
                    comment_text: string | null;
                    created_at: string | null;
                    id: string;
                    interaction_type: string;
                    metadata: Json | null;
                    updated_at: string | null;
                    user_id: string | null;
                };
                Insert: {
                    activity_id?: string | null;
                    comment_text?: string | null;
                    created_at?: string | null;
                    id?: string;
                    interaction_type: string;
                    metadata?: Json | null;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    activity_id?: string | null;
                    comment_text?: string | null;
                    created_at?: string | null;
                    id?: string;
                    interaction_type?: string;
                    metadata?: Json | null;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "social_interactions_activity_id_fkey";
                        columns: ["activity_id"];
                        isOneToOne: false;
                        referencedRelation: "activity_feed";
                        referencedColumns: ["id"];
                    }
                ];
            };
            supplements: {
                Row: {
                    benefits: string | null;
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    name: string;
                    updated_at: string | null;
                };
                Insert: {
                    benefits?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name: string;
                    updated_at?: string | null;
                };
                Update: {
                    benefits?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            suspicious_activities: {
                Row: {
                    activity_type: string;
                    context: Json | null;
                    created_at: string | null;
                    id: string;
                    ip_address: string | null;
                    location_data: Json | null;
                    severity: string;
                    user_agent: string | null;
                    user_id: string | null;
                };
                Insert: {
                    activity_type: string;
                    context?: Json | null;
                    created_at?: string | null;
                    id?: string;
                    ip_address?: string | null;
                    location_data?: Json | null;
                    severity: string;
                    user_agent?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    activity_type?: string;
                    context?: Json | null;
                    created_at?: string | null;
                    id?: string;
                    ip_address?: string | null;
                    location_data?: Json | null;
                    severity?: string;
                    user_agent?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            system_alerts: {
                Row: {
                    alert_type: string;
                    context: Json | null;
                    created_at: string | null;
                    id: string;
                    message: string;
                    notification_sent: boolean | null;
                    resolution_notes: string | null;
                    resolved_at: string | null;
                    severity: string;
                };
                Insert: {
                    alert_type: string;
                    context?: Json | null;
                    created_at?: string | null;
                    id?: string;
                    message: string;
                    notification_sent?: boolean | null;
                    resolution_notes?: string | null;
                    resolved_at?: string | null;
                    severity: string;
                };
                Update: {
                    alert_type?: string;
                    context?: Json | null;
                    created_at?: string | null;
                    id?: string;
                    message?: string;
                    notification_sent?: boolean | null;
                    resolution_notes?: string | null;
                    resolved_at?: string | null;
                    severity?: string;
                };
                Relationships: [];
            };
            system_health_checks: {
                Row: {
                    check_duration: unknown | null;
                    check_name: string;
                    details: Json | null;
                    id: string;
                    last_check_time: string | null;
                    next_check_time: string | null;
                    severity: string | null;
                    status: string;
                };
                Insert: {
                    check_duration?: unknown | null;
                    check_name: string;
                    details?: Json | null;
                    id?: string;
                    last_check_time?: string | null;
                    next_check_time?: string | null;
                    severity?: string | null;
                    status: string;
                };
                Update: {
                    check_duration?: unknown | null;
                    check_name?: string;
                    details?: Json | null;
                    id?: string;
                    last_check_time?: string | null;
                    next_check_time?: string | null;
                    severity?: string | null;
                    status?: string;
                };
                Relationships: [];
            };
            team_memberships: {
                Row: {
                    id: string;
                    joined_at: string;
                    team_id: string | null;
                    user_id: string | null;
                };
                Insert: {
                    id?: string;
                    joined_at?: string;
                    team_id?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    id?: string;
                    joined_at?: string;
                    team_id?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            teams: {
                Row: {
                    admission_criteria: string | null;
                    census_data: Json | null;
                    created_at: string;
                    created_by: string;
                    description: string | null;
                    governance_model: string | null;
                    id: string;
                    mission: string | null;
                    name: string;
                    physical_footprint: Json | null;
                    virtual_capital: string | null;
                };
                Insert: {
                    admission_criteria?: string | null;
                    census_data?: Json | null;
                    created_at?: string;
                    created_by: string;
                    description?: string | null;
                    governance_model?: string | null;
                    id?: string;
                    mission?: string | null;
                    name: string;
                    physical_footprint?: Json | null;
                    virtual_capital?: string | null;
                };
                Update: {
                    admission_criteria?: string | null;
                    census_data?: Json | null;
                    created_at?: string;
                    created_by?: string;
                    description?: string | null;
                    governance_model?: string | null;
                    id?: string;
                    mission?: string | null;
                    name?: string;
                    physical_footprint?: Json | null;
                    virtual_capital?: string | null;
                };
                Relationships: [];
            };
            tenant_api_keys: {
                Row: {
                    api_key: string;
                    api_secret: string;
                    created_at: string | null;
                    created_by: string | null;
                    id: string;
                    last_used_at: string | null;
                    name: string;
                    scopes: string[] | null;
                    status: string;
                    tenant_id: string;
                    updated_at: string | null;
                };
                Insert: {
                    api_key: string;
                    api_secret: string;
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    last_used_at?: string | null;
                    name: string;
                    scopes?: string[] | null;
                    status: string;
                    tenant_id: string;
                    updated_at?: string | null;
                };
                Update: {
                    api_key?: string;
                    api_secret?: string;
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    last_used_at?: string | null;
                    name?: string;
                    scopes?: string[] | null;
                    status?: string;
                    tenant_id?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "tenant_api_keys_tenant_id_fkey";
                        columns: ["tenant_id"];
                        isOneToOne: false;
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            tenant_domains: {
                Row: {
                    created_at: string | null;
                    domain: string;
                    id: string;
                    is_primary: boolean | null;
                    is_verified: boolean | null;
                    tenant_id: string;
                    updated_at: string | null;
                    verification_token: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    domain: string;
                    id?: string;
                    is_primary?: boolean | null;
                    is_verified?: boolean | null;
                    tenant_id: string;
                    updated_at?: string | null;
                    verification_token?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    domain?: string;
                    id?: string;
                    is_primary?: boolean | null;
                    is_verified?: boolean | null;
                    tenant_id?: string;
                    updated_at?: string | null;
                    verification_token?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "tenant_domains_tenant_id_fkey";
                        columns: ["tenant_id"];
                        isOneToOne: false;
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            tenant_roles: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    is_system_role: boolean | null;
                    name: string;
                    priority: number | null;
                    role_category: string | null;
                    slug: string;
                    tenant_id: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    is_system_role?: boolean | null;
                    name: string;
                    priority?: number | null;
                    role_category?: string | null;
                    slug: string;
                    tenant_id: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    is_system_role?: boolean | null;
                    name?: string;
                    priority?: number | null;
                    role_category?: string | null;
                    slug?: string;
                    tenant_id?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "tenant_roles_tenant_id_fkey";
                        columns: ["tenant_id"];
                        isOneToOne: false;
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            tenant_shared_content: {
                Row: {
                    content_id: string;
                    created_at: string | null;
                    display_order: number | null;
                    id: string;
                    is_featured: boolean | null;
                    tenant_id: string;
                    tenant_specific_settings: Json | null;
                    updated_at: string | null;
                };
                Insert: {
                    content_id: string;
                    created_at?: string | null;
                    display_order?: number | null;
                    id?: string;
                    is_featured?: boolean | null;
                    tenant_id: string;
                    tenant_specific_settings?: Json | null;
                    updated_at?: string | null;
                };
                Update: {
                    content_id?: string;
                    created_at?: string | null;
                    display_order?: number | null;
                    id?: string;
                    is_featured?: boolean | null;
                    tenant_id?: string;
                    tenant_specific_settings?: Json | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "tenant_shared_content_content_id_fkey";
                        columns: ["content_id"];
                        isOneToOne: false;
                        referencedRelation: "shared_content";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "tenant_shared_content_tenant_id_fkey";
                        columns: ["tenant_id"];
                        isOneToOne: false;
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            tenant_subscriptions: {
                Row: {
                    cancel_at_period_end: boolean | null;
                    created_at: string | null;
                    current_period_end: string | null;
                    current_period_start: string | null;
                    customer_id: string | null;
                    id: string;
                    payment_method_id: string | null;
                    plan_id: string;
                    status: string;
                    subscription_id: string | null;
                    tenant_id: string;
                    trial_end: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    cancel_at_period_end?: boolean | null;
                    created_at?: string | null;
                    current_period_end?: string | null;
                    current_period_start?: string | null;
                    customer_id?: string | null;
                    id?: string;
                    payment_method_id?: string | null;
                    plan_id: string;
                    status: string;
                    subscription_id?: string | null;
                    tenant_id: string;
                    trial_end?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    cancel_at_period_end?: boolean | null;
                    created_at?: string | null;
                    current_period_end?: string | null;
                    current_period_start?: string | null;
                    customer_id?: string | null;
                    id?: string;
                    payment_method_id?: string | null;
                    plan_id?: string;
                    status?: string;
                    subscription_id?: string | null;
                    tenant_id?: string;
                    trial_end?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "tenant_subscriptions_tenant_id_fkey";
                        columns: ["tenant_id"];
                        isOneToOne: true;
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            tenant_users: {
                Row: {
                    created_at: string | null;
                    id: string;
                    joined_at: string | null;
                    role: string;
                    status: string;
                    tenant_id: string;
                    tenant_role_id: string | null;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    joined_at?: string | null;
                    role?: string;
                    status?: string;
                    tenant_id: string;
                    tenant_role_id?: string | null;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    joined_at?: string | null;
                    role?: string;
                    status?: string;
                    tenant_id?: string;
                    tenant_role_id?: string | null;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "tenant_users_tenant_id_fkey";
                        columns: ["tenant_id"];
                        isOneToOne: false;
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "tenant_users_tenant_role_id_fkey";
                        columns: ["tenant_role_id"];
                        isOneToOne: false;
                        referencedRelation: "tenant_roles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            tenants: {
                Row: {
                    branding: Json | null;
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    name: string;
                    settings: Json | null;
                    slug: string;
                    status: string;
                    updated_at: string | null;
                };
                Insert: {
                    branding?: Json | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name: string;
                    settings?: Json | null;
                    slug: string;
                    status: string;
                    updated_at?: string | null;
                };
                Update: {
                    branding?: Json | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name?: string;
                    settings?: Json | null;
                    slug?: string;
                    status?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            thinking_assessments: {
                Row: {
                    answers: Json | null;
                    completed: boolean | null;
                    created_at: string | null;
                    dimension_scores: Json | null;
                    growth_areas: string[] | null;
                    id: string;
                    results: Json | null;
                    strengths: string[] | null;
                    thinking_archetype: string | null;
                    user_id: string;
                };
                Insert: {
                    answers?: Json | null;
                    completed?: boolean | null;
                    created_at?: string | null;
                    dimension_scores?: Json | null;
                    growth_areas?: string[] | null;
                    id?: string;
                    results?: Json | null;
                    strengths?: string[] | null;
                    thinking_archetype?: string | null;
                    user_id: string;
                };
                Update: {
                    answers?: Json | null;
                    completed?: boolean | null;
                    created_at?: string | null;
                    dimension_scores?: Json | null;
                    growth_areas?: string[] | null;
                    id?: string;
                    results?: Json | null;
                    strengths?: string[] | null;
                    thinking_archetype?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            thought_exercises: {
                Row: {
                    author_id: string | null;
                    benefits: string[] | null;
                    category: string;
                    created_at: string | null;
                    description: string;
                    difficulty: string;
                    estimated_minutes: number;
                    id: string;
                    input_type: string;
                    instructions: string;
                    is_featured: boolean | null;
                    is_published: boolean | null;
                    prerequisites: string[] | null;
                    related_concepts: string[] | null;
                    tenant_slug: string;
                    title: string;
                };
                Insert: {
                    author_id?: string | null;
                    benefits?: string[] | null;
                    category: string;
                    created_at?: string | null;
                    description: string;
                    difficulty: string;
                    estimated_minutes: number;
                    id?: string;
                    input_type: string;
                    instructions: string;
                    is_featured?: boolean | null;
                    is_published?: boolean | null;
                    prerequisites?: string[] | null;
                    related_concepts?: string[] | null;
                    tenant_slug: string;
                    title: string;
                };
                Update: {
                    author_id?: string | null;
                    benefits?: string[] | null;
                    category?: string;
                    created_at?: string | null;
                    description?: string;
                    difficulty?: string;
                    estimated_minutes?: number;
                    id?: string;
                    input_type?: string;
                    instructions?: string;
                    is_featured?: boolean | null;
                    is_published?: boolean | null;
                    prerequisites?: string[] | null;
                    related_concepts?: string[] | null;
                    tenant_slug?: string;
                    title?: string;
                };
                Relationships: [];
            };
            token_balances: {
                Row: {
                    created_at: string;
                    id: string;
                    life_balance: number;
                    live_balance: number;
                    love_balance: number;
                    luck_balance: number;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    life_balance?: number;
                    live_balance?: number;
                    love_balance?: number;
                    luck_balance?: number;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    life_balance?: number;
                    live_balance?: number;
                    love_balance?: number;
                    luck_balance?: number;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            token_conversions: {
                Row: {
                    amount: number;
                    created_at: string;
                    from_token: string;
                    id: number;
                    rate: number;
                    simulation_run_id: string | null;
                    site: string;
                    to_token: string;
                    user_id: string;
                };
                Insert: {
                    amount: number;
                    created_at?: string;
                    from_token: string;
                    id?: number;
                    rate: number;
                    simulation_run_id?: string | null;
                    site: string;
                    to_token: string;
                    user_id: string;
                };
                Update: {
                    amount?: number;
                    created_at?: string;
                    from_token?: string;
                    id?: number;
                    rate?: number;
                    simulation_run_id?: string | null;
                    site?: string;
                    to_token?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            token_events: {
                Row: {
                    created_at: string;
                    event_type: string;
                    id: string;
                    metadata: Json | null;
                    team_id: string | null;
                    token_amount: number;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string;
                    event_type: string;
                    id?: string;
                    metadata?: Json | null;
                    team_id?: string | null;
                    token_amount: number;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string;
                    event_type?: string;
                    id?: string;
                    metadata?: Json | null;
                    team_id?: string | null;
                    token_amount?: number;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "token_events_team_id_fkey";
                        columns: ["team_id"];
                        isOneToOne: false;
                        referencedRelation: "teams";
                        referencedColumns: ["id"];
                    }
                ];
            };
            token_sinks: {
                Row: {
                    created_at: string;
                    description: string | null;
                    id: number;
                    simulation_run_id: string | null;
                    sink_type: string;
                    site: string;
                    token_type: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    id?: number;
                    simulation_run_id?: string | null;
                    sink_type: string;
                    site: string;
                    token_type: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    id?: number;
                    simulation_run_id?: string | null;
                    sink_type?: string;
                    site?: string;
                    token_type?: string;
                };
                Relationships: [];
            };
            token_transactions: {
                Row: {
                    amount: number;
                    created_at: string;
                    description: string | null;
                    id: string;
                    source_id: string | null;
                    source_type: string;
                    token_type: string;
                    user_id: string;
                };
                Insert: {
                    amount: number;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    source_id?: string | null;
                    source_type: string;
                    token_type: string;
                    user_id: string;
                };
                Update: {
                    amount?: number;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    source_id?: string | null;
                    source_type?: string;
                    token_type?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            tokens: {
                Row: {
                    life: number;
                    live: number;
                    love: number;
                    luck: number;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    life?: number;
                    live?: number;
                    love?: number;
                    luck?: number;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    life?: number;
                    live?: number;
                    love?: number;
                    luck?: number;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_achievements: {
                Row: {
                    badge_id: string | null;
                    earned_at: string | null;
                    id: string;
                    metadata: Json | null;
                    name: string | null;
                    user_id: string | null;
                };
                Insert: {
                    badge_id?: string | null;
                    earned_at?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    name?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    badge_id?: string | null;
                    earned_at?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    name?: string | null;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_achievements_achievement_id_fkey";
                        columns: ["badge_id"];
                        isOneToOne: false;
                        referencedRelation: "achievements";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_actions: {
                Row: {
                    action_type: string;
                    created_at: string | null;
                    id: string;
                    metadata: Json | null;
                    role: string;
                    user_id: string | null;
                    xp_earned: number;
                };
                Insert: {
                    action_type: string;
                    created_at?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    role: string;
                    user_id?: string | null;
                    xp_earned: number;
                };
                Update: {
                    action_type?: string;
                    created_at?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    role?: string;
                    user_id?: string | null;
                    xp_earned?: number;
                };
                Relationships: [];
            };
            user_activity_stats: {
                Row: {
                    activity_date: string;
                    created_at: string | null;
                    id: string;
                    last_activity_at: string | null;
                    lessons_completed: number | null;
                    modules_completed: number | null;
                    platform: string;
                    points_earned: number | null;
                    total_time_spent: unknown | null;
                    updated_at: string | null;
                    user_id: string | null;
                };
                Insert: {
                    activity_date: string;
                    created_at?: string | null;
                    id?: string;
                    last_activity_at?: string | null;
                    lessons_completed?: number | null;
                    modules_completed?: number | null;
                    platform: string;
                    points_earned?: number | null;
                    total_time_spent?: unknown | null;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    activity_date?: string;
                    created_at?: string | null;
                    id?: string;
                    last_activity_at?: string | null;
                    lessons_completed?: number | null;
                    modules_completed?: number | null;
                    platform?: string;
                    points_earned?: number | null;
                    total_time_spent?: unknown | null;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            user_ai_preferences: {
                Row: {
                    app_name: string;
                    created_at: string;
                    id: string;
                    preferences: Json;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    app_name: string;
                    created_at?: string;
                    id?: string;
                    preferences?: Json;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    app_name?: string;
                    created_at?: string;
                    id?: string;
                    preferences?: Json;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_assessments: {
                Row: {
                    answers: Json;
                    assessment_type: string;
                    completed_at: string | null;
                    id: string;
                    platform: string;
                    results: Json | null;
                    user_id: string;
                };
                Insert: {
                    answers: Json;
                    assessment_type: string;
                    completed_at?: string | null;
                    id?: string;
                    platform: string;
                    results?: Json | null;
                    user_id: string;
                };
                Update: {
                    answers?: Json;
                    assessment_type?: string;
                    completed_at?: string | null;
                    id?: string;
                    platform?: string;
                    results?: Json | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_badges: {
                Row: {
                    badge_id: string | null;
                    earned_at: string | null;
                    id: string;
                    user_id: string | null;
                };
                Insert: {
                    badge_id?: string | null;
                    earned_at?: string | null;
                    id?: string;
                    user_id?: string | null;
                };
                Update: {
                    badge_id?: string | null;
                    earned_at?: string | null;
                    id?: string;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_badges_badge_id_fkey";
                        columns: ["badge_id"];
                        isOneToOne: false;
                        referencedRelation: "badges";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_community: {
                Row: {
                    id: string;
                    joined_at: string | null;
                    joined_features: string[] | null;
                    platform: string;
                    user_id: string;
                };
                Insert: {
                    id?: string;
                    joined_at?: string | null;
                    joined_features?: string[] | null;
                    platform: string;
                    user_id: string;
                };
                Update: {
                    id?: string;
                    joined_at?: string | null;
                    joined_features?: string[] | null;
                    platform?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_concept_progress: {
                Row: {
                    concept_id: string;
                    familiarity_level: number | null;
                    favorite: boolean | null;
                    id: string;
                    last_viewed_at: string | null;
                    notes: string | null;
                    user_id: string;
                };
                Insert: {
                    concept_id: string;
                    familiarity_level?: number | null;
                    favorite?: boolean | null;
                    id?: string;
                    last_viewed_at?: string | null;
                    notes?: string | null;
                    user_id: string;
                };
                Update: {
                    concept_id?: string;
                    familiarity_level?: number | null;
                    favorite?: boolean | null;
                    id?: string;
                    last_viewed_at?: string | null;
                    notes?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_concept_progress_concept_id_fkey";
                        columns: ["concept_id"];
                        isOneToOne: false;
                        referencedRelation: "concepts";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_connections: {
                Row: {
                    connected_user_id: string | null;
                    connection_type: string;
                    created_at: string | null;
                    id: string;
                    status: string;
                    updated_at: string | null;
                    user_id: string | null;
                };
                Insert: {
                    connected_user_id?: string | null;
                    connection_type: string;
                    created_at?: string | null;
                    id?: string;
                    status: string;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    connected_user_id?: string | null;
                    connection_type?: string;
                    created_at?: string | null;
                    id?: string;
                    status?: string;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            user_exercise_progress: {
                Row: {
                    completed_at: string | null;
                    exercise_id: string;
                    favorite: boolean | null;
                    id: string;
                    insights: string[] | null;
                    responses: Json | null;
                    started_at: string | null;
                    time_spent_seconds: number | null;
                    user_id: string;
                };
                Insert: {
                    completed_at?: string | null;
                    exercise_id: string;
                    favorite?: boolean | null;
                    id?: string;
                    insights?: string[] | null;
                    responses?: Json | null;
                    started_at?: string | null;
                    time_spent_seconds?: number | null;
                    user_id: string;
                };
                Update: {
                    completed_at?: string | null;
                    exercise_id?: string;
                    favorite?: boolean | null;
                    id?: string;
                    insights?: string[] | null;
                    responses?: Json | null;
                    started_at?: string | null;
                    time_spent_seconds?: number | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_exercise_progress_exercise_id_fkey";
                        columns: ["exercise_id"];
                        isOneToOne: false;
                        referencedRelation: "thought_exercises";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_external_mappings: {
                Row: {
                    created_at: string | null;
                    external_id: string;
                    external_profile: Json | null;
                    external_provider: string;
                    id: string;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    external_id: string;
                    external_profile?: Json | null;
                    external_provider: string;
                    id?: string;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    created_at?: string | null;
                    external_id?: string;
                    external_profile?: Json | null;
                    external_provider?: string;
                    id?: string;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_gamification_stats: {
                Row: {
                    created_at: string | null;
                    is_inactive: boolean;
                    last_active: string | null;
                    points: number;
                    role: Database["public"]["Enums"]["user_role"];
                    streak: number;
                    subscriptions: Json;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    is_inactive?: boolean;
                    last_active?: string | null;
                    points?: number;
                    role?: Database["public"]["Enums"]["user_role"];
                    streak?: number;
                    subscriptions?: Json;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    created_at?: string | null;
                    is_inactive?: boolean;
                    last_active?: string | null;
                    points?: number;
                    role?: Database["public"]["Enums"]["user_role"];
                    streak?: number;
                    subscriptions?: Json;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_mentions: {
                Row: {
                    activity_id: string | null;
                    context: string | null;
                    created_at: string | null;
                    id: string;
                    mentioned_user_id: string | null;
                };
                Insert: {
                    activity_id?: string | null;
                    context?: string | null;
                    created_at?: string | null;
                    id?: string;
                    mentioned_user_id?: string | null;
                };
                Update: {
                    activity_id?: string | null;
                    context?: string | null;
                    created_at?: string | null;
                    id?: string;
                    mentioned_user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_mentions_activity_id_fkey";
                        columns: ["activity_id"];
                        isOneToOne: false;
                        referencedRelation: "activity_feed";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_onboarding: {
                Row: {
                    completed_steps: string[] | null;
                    created_at: string | null;
                    current_step: string | null;
                    id: string;
                    platform: string;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    completed_steps?: string[] | null;
                    created_at?: string | null;
                    current_step?: string | null;
                    id?: string;
                    platform: string;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    completed_steps?: string[] | null;
                    created_at?: string | null;
                    current_step?: string | null;
                    id?: string;
                    platform?: string;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_platform_preferences: {
                Row: {
                    created_at: string;
                    id: string;
                    last_accessed: string | null;
                    platform_slug: string;
                    preferences: Json;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    last_accessed?: string | null;
                    platform_slug: string;
                    preferences?: Json;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    last_accessed?: string | null;
                    platform_slug?: string;
                    preferences?: Json;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_points: {
                Row: {
                    action: string;
                    awarded_at: string | null;
                    id: string;
                    points: number;
                    user_id: string;
                };
                Insert: {
                    action: string;
                    awarded_at?: string | null;
                    id?: string;
                    points: number;
                    user_id: string;
                };
                Update: {
                    action?: string;
                    awarded_at?: string | null;
                    id?: string;
                    points?: number;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_profiles: {
                Row: {
                    avatar_url: string | null;
                    bio: string | null;
                    created_at: string | null;
                    display_name: string | null;
                    expertise: string[] | null;
                    id: string;
                    interests: string[] | null;
                    platform: string;
                    preferences: Json | null;
                    social_links: Json | null;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    avatar_url?: string | null;
                    bio?: string | null;
                    created_at?: string | null;
                    display_name?: string | null;
                    expertise?: string[] | null;
                    id?: string;
                    interests?: string[] | null;
                    platform: string;
                    preferences?: Json | null;
                    social_links?: Json | null;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    avatar_url?: string | null;
                    bio?: string | null;
                    created_at?: string | null;
                    display_name?: string | null;
                    expertise?: string[] | null;
                    id?: string;
                    interests?: string[] | null;
                    platform?: string;
                    preferences?: Json | null;
                    social_links?: Json | null;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_recommendations: {
                Row: {
                    content_id: string;
                    content_type: string;
                    created_at: string | null;
                    expires_at: string | null;
                    factors: Json | null;
                    id: string;
                    platform: string;
                    recommendation_type: string;
                    relevance_score: number;
                    user_id: string | null;
                };
                Insert: {
                    content_id: string;
                    content_type: string;
                    created_at?: string | null;
                    expires_at?: string | null;
                    factors?: Json | null;
                    id?: string;
                    platform: string;
                    recommendation_type: string;
                    relevance_score: number;
                    user_id?: string | null;
                };
                Update: {
                    content_id?: string;
                    content_type?: string;
                    created_at?: string | null;
                    expires_at?: string | null;
                    factors?: Json | null;
                    id?: string;
                    platform?: string;
                    recommendation_type?: string;
                    relevance_score?: number;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            user_roles: {
                Row: {
                    created_at: string;
                    is_contributor: boolean;
                    is_participant: boolean;
                    is_subscriber: boolean;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    is_contributor?: boolean;
                    is_participant?: boolean;
                    is_subscriber?: boolean;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    is_contributor?: boolean;
                    is_participant?: boolean;
                    is_subscriber?: boolean;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_segments: {
                Row: {
                    created_at: string | null;
                    created_by: string | null;
                    id: string;
                    platform: string;
                    segment_name: string;
                    segment_rules: Json;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    platform: string;
                    segment_name: string;
                    segment_rules: Json;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    platform?: string;
                    segment_name?: string;
                    segment_rules?: Json;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            user_sessions: {
                Row: {
                    created_at: string;
                    id: string;
                    interaction_count: number;
                    last_page_title: string | null;
                    last_page_url: string | null;
                    platform_slug: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    interaction_count?: number;
                    last_page_title?: string | null;
                    last_page_url?: string | null;
                    platform_slug: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    interaction_count?: number;
                    last_page_title?: string | null;
                    last_page_url?: string | null;
                    platform_slug?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_skills: {
                Row: {
                    created_at: string | null;
                    id: string;
                    last_assessed_at: string | null;
                    proficiency_level: number;
                    skill_name: string;
                    updated_at: string | null;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    last_assessed_at?: string | null;
                    proficiency_level: number;
                    skill_name: string;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    last_assessed_at?: string | null;
                    proficiency_level?: number;
                    skill_name?: string;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            vital_signs: {
                Row: {
                    created_at: string | null;
                    id: string;
                    integration_id: string | null;
                    measured_at: string;
                    notes: string | null;
                    source: string;
                    unit: string;
                    updated_at: string | null;
                    user_id: string;
                    value: number;
                    vital_type: string;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    integration_id?: string | null;
                    measured_at: string;
                    notes?: string | null;
                    source?: string;
                    unit: string;
                    updated_at?: string | null;
                    user_id: string;
                    value: number;
                    vital_type: string;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    integration_id?: string | null;
                    measured_at?: string;
                    notes?: string | null;
                    source?: string;
                    unit?: string;
                    updated_at?: string | null;
                    user_id?: string;
                    value?: number;
                    vital_type?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "vital_signs_integration_id_fkey";
                        columns: ["integration_id"];
                        isOneToOne: false;
                        referencedRelation: "health_integrations";
                        referencedColumns: ["id"];
                    }
                ];
            };
            votes: {
                Row: {
                    id: string;
                    proposal_id: string | null;
                    user_id: string | null;
                    vote_value: string;
                    voted_at: string;
                };
                Insert: {
                    id?: string;
                    proposal_id?: string | null;
                    user_id?: string | null;
                    vote_value: string;
                    voted_at?: string;
                };
                Update: {
                    id?: string;
                    proposal_id?: string | null;
                    user_id?: string | null;
                    vote_value?: string;
                    voted_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "votes_proposal_id_fkey";
                        columns: ["proposal_id"];
                        isOneToOne: false;
                        referencedRelation: "proposals";
                        referencedColumns: ["id"];
                    }
                ];
            };
            xp_events: {
                Row: {
                    created_at: string;
                    event_type: string;
                    id: string;
                    metadata: Json | null;
                    simulation_run_id: string | null;
                    team_id: string | null;
                    user_id: string | null;
                    xp_amount: number;
                };
                Insert: {
                    created_at?: string;
                    event_type: string;
                    id?: string;
                    metadata?: Json | null;
                    simulation_run_id?: string | null;
                    team_id?: string | null;
                    user_id?: string | null;
                    xp_amount: number;
                };
                Update: {
                    created_at?: string;
                    event_type?: string;
                    id?: string;
                    metadata?: Json | null;
                    simulation_run_id?: string | null;
                    team_id?: string | null;
                    user_id?: string | null;
                    xp_amount?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "xp_events_team_id_fkey";
                        columns: ["team_id"];
                        isOneToOne: false;
                        referencedRelation: "teams";
                        referencedColumns: ["id"];
                    }
                ];
            };
            xp_multipliers: {
                Row: {
                    active: boolean;
                    created_at: string;
                    event_type: string;
                    id: string;
                    multiplier: number;
                };
                Insert: {
                    active?: boolean;
                    created_at?: string;
                    event_type: string;
                    id?: string;
                    multiplier: number;
                };
                Update: {
                    active?: boolean;
                    created_at?: string;
                    event_type?: string;
                    id?: string;
                    multiplier?: number;
                };
                Relationships: [];
            };
            zoom_attendance: {
                Row: {
                    created_at: string;
                    duration_minutes: number | null;
                    id: string;
                    join_time: string;
                    leave_time: string | null;
                    meeting_id: string;
                    reward_processed: boolean | null;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    duration_minutes?: number | null;
                    id?: string;
                    join_time?: string;
                    leave_time?: string | null;
                    meeting_id: string;
                    reward_processed?: boolean | null;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    duration_minutes?: number | null;
                    id?: string;
                    join_time?: string;
                    leave_time?: string | null;
                    meeting_id?: string;
                    reward_processed?: boolean | null;
                    user_id?: string;
                };
                Relationships: [];
            };
        };
        Views: {
            feedback_trends: {
                Row: {
                    app_name: string | null;
                    avg_content_length: number | null;
                    feedback_count: number | null;
                    feedback_date: string | null;
                    metadata_summary: Json | null;
                    unique_users: number | null;
                    user_role: string | null;
                };
                Relationships: [];
            };
            recent_posts_view: {
                Row: {
                    author_id: string | null;
                    avatar_url: string | null;
                    content: string | null;
                    created_at: string | null;
                    engagement_count: number | null;
                    full_name: string | null;
                    id: string | null;
                    is_pinned: boolean | null;
                    platform: string | null;
                    section: string | null;
                    token_tag: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "posts_author_id_fkey";
                        columns: ["author_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            token_history: {
                Row: {
                    activity_count: number | null;
                    day: string | null;
                    token_tag: string | null;
                    tokens_earned: number | null;
                    user_id: string | null;
                };
                Relationships: [];
            };
            token_statistics: {
                Row: {
                    life_posts: number | null;
                    live_posts: number | null;
                    love_posts: number | null;
                    luck_posts: number | null;
                    user_id: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "posts_author_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_health_summary: {
                Row: {
                    average_value: number | null;
                    first_reading: string | null;
                    last_reading: string | null;
                    max_value: number | null;
                    metric_type: string | null;
                    min_value: number | null;
                    reading_count: number | null;
                    user_id: string | null;
                };
                Relationships: [];
            };
            user_token_progress: {
                Row: {
                    last_earned: string | null;
                    life_balance: number | null;
                    live_balance: number | null;
                    love_balance: number | null;
                    luck_balance: number | null;
                    token_type: string | null;
                    total_earned: number | null;
                    transaction_count: number | null;
                    user_id: string | null;
                };
                Relationships: [];
            };
        };
        Functions: {
            add_user_to_tenant: {
                Args: {
                    _user_id: string;
                    _tenant_slug: string;
                    _role?: string;
                };
                Returns: boolean;
            };
            advance_user_week: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                };
                Returns: boolean;
            };
            award_tokens: {
                Args: {
                    p_user_id: string;
                    p_token_type: string;
                    p_amount: number;
                    p_source_type: string;
                    p_source_id: string;
                };
                Returns: undefined;
            };
            award_zoom_attendance_tokens: {
                Args: {
                    attendee_id: string;
                    meeting_name: string;
                    token_type?: string;
                    token_amount?: number;
                };
                Returns: undefined;
            };
            binary_quantize: {
                Args: {
                    "": string;
                } | {
                    "": unknown;
                };
                Returns: unknown;
            };
            can_earn_tokens: {
                Args: {
                    p_user_id: string;
                    p_token_type: string;
                    p_source_type: string;
                };
                Returns: boolean;
            };
            check_email_exists: {
                Args: {
                    email: string;
                };
                Returns: boolean;
            };
            check_platform_access: {
                Args: {
                    user_id: string;
                    platform_slug: string;
                };
                Returns: boolean;
            };
            check_profile_exists: {
                Args: {
                    user_id: string;
                };
                Returns: boolean;
            };
            check_rate_limit: {
                Args: {
                    p_identifier: string;
                    p_max_requests?: number;
                    p_window_seconds?: number;
                };
                Returns: boolean;
            };
            check_skill_requirements: {
                Args: {
                    p_user_id: string;
                    p_content_type: string;
                    p_content_id: string;
                };
                Returns: {
                    skill_name: string;
                    required_level: number;
                    user_level: number;
                    meets_requirement: boolean;
                }[];
            };
            check_user_exists: {
                Args: {
                    user_email: string;
                };
                Returns: boolean;
            };
            check_user_role: {
                Args: {
                    _user_id: string;
                    _role_slug: string;
                };
                Returns: boolean;
            };
            cleanup_expired_tokens: {
                Args: Record<PropertyKey, never>;
                Returns: undefined;
            };
            cleanup_old_notifications: {
                Args: Record<PropertyKey, never>;
                Returns: undefined;
            };
            create_invite: {
                Args: {
                    p_code: string;
                    p_inviter_id: string;
                    p_expires_at: string;
                };
                Returns: string;
            };
            create_notification: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                    p_title: string;
                    p_body: string;
                    p_metadata?: Json;
                };
                Returns: string;
            };
            create_profile: {
                Args: {
                    user_id: string;
                    user_email: string;
                    user_role?: string;
                };
                Returns: undefined;
            };
            create_system_alert: {
                Args: {
                    p_alert_type: string;
                    p_message: string;
                    p_severity: string;
                    p_context?: Json;
                };
                Returns: string;
            };
            create_tenant: {
                Args: {
                    _name: string;
                    _slug: string;
                    _description: string;
                    _admin_user_id: string;
                };
                Returns: string;
            };
            exec_sql: {
                Args: {
                    sql: string;
                };
                Returns: undefined;
            };
            fibonacci: {
                Args: {
                    n: number;
                };
                Returns: number;
            };
            find_similar_content: {
                Args: {
                    p_content_type: string;
                    p_content_id: string;
                    p_limit?: number;
                };
                Returns: {
                    similar_content_type: string;
                    similar_content_id: string;
                    similarity_score: number;
                    similarity_factors: Json;
                }[];
            };
            flag_inactive_users: {
                Args: Record<PropertyKey, never>;
                Returns: undefined;
            };
            generate_embedding: {
                Args: {
                    content: string;
                };
                Returns: string;
            };
            generate_tenant_api_key: {
                Args: {
                    _tenant_id: string;
                    _name: string;
                    _scopes?: string[];
                };
                Returns: Json;
            };
            get_activity_interactions: {
                Args: {
                    p_activity_id: string;
                    p_limit?: number;
                    p_offset?: number;
                };
                Returns: {
                    interaction_id: string;
                    user_id: string;
                    interaction_type: string;
                    comment_text: string;
                    created_at: string;
                }[];
            };
            get_available_rooms: {
                Args: {
                    user_uuid: string;
                };
                Returns: {
                    id: string;
                    name: string;
                    description: string;
                    room_type: string;
                    created_at: string;
                    created_by: string;
                    is_accessible: boolean;
                }[];
            };
            get_content_dependencies: {
                Args: {
                    p_content_type: string;
                    p_content_id: string;
                };
                Returns: {
                    dependency_id: string;
                    depends_on_type: string;
                    depends_on_id: string;
                    dependency_type: string;
                }[];
            };
            get_content_engagement_metrics: {
                Args: {
                    p_platform: string;
                };
                Returns: {
                    module_id: string;
                    module_title: string;
                    unique_users: number;
                    completions: number;
                    avg_completion_time_seconds: number;
                }[];
            };
            get_dependent_content: {
                Args: {
                    p_content_type: string;
                    p_content_id: string;
                };
                Returns: {
                    content_type: string;
                    content_id: string;
                    dependency_type: string;
                }[];
            };
            get_discover_posts: {
                Args: {
                    page_size?: number;
                    page_number?: number;
                    filter_token_tag?: string;
                };
                Returns: {
                    id: string;
                    content: string;
                    author_id: string;
                    platform: string;
                    section: string;
                    is_pinned: boolean;
                    engagement_count: number;
                    created_at: string;
                    token_tag: string;
                    full_name: string;
                    avatar_url: string;
                }[];
            };
            get_enabled_features: {
                Args: {
                    p_platform: string;
                };
                Returns: {
                    feature_key: string;
                    config: Json;
                }[];
            };
            get_learning_recommendations: {
                Args: {
                    p_user_id: string;
                    p_limit?: number;
                };
                Returns: {
                    content_type: string;
                    content_id: string;
                    relevance_score: number;
                    recommendation_reason: string;
                }[];
            };
            get_next_lesson: {
                Args: {
                    user_id: string;
                    platform_name: string;
                };
                Returns: {
                    module_id: string;
                    module_title: string;
                    lesson_id: string;
                    lesson_title: string;
                }[];
            };
            get_pending_schedules: {
                Args: {
                    p_platform: string;
                };
                Returns: {
                    content_type: string;
                    content_id: string;
                    publish_at: string;
                    unpublish_at: string;
                    created_by: string;
                }[];
            };
            get_personalized_recommendations: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                    p_limit?: number;
                };
                Returns: {
                    content_type: string;
                    content_id: string;
                    relevance_score: number;
                    recommendation_type: string;
                    factors: Json;
                }[];
            };
            get_platform_content: {
                Args: {
                    p_platform: string;
                    include_unpublished?: boolean;
                };
                Returns: {
                    module_id: string;
                    module_title: string;
                    module_description: string;
                    module_is_published: boolean;
                    module_created_at: string;
                    module_updated_at: string;
                    lesson_id: string;
                    lesson_title: string;
                    lesson_is_published: boolean;
                    lesson_order_index: number;
                }[];
            };
            get_platform_customizations: {
                Args: {
                    p_platform: string;
                };
                Returns: {
                    component_key: string;
                    customization: Json;
                }[];
            };
            get_platform_metrics: {
                Args: {
                    p_platform: string;
                    p_start_date: string;
                    p_end_date: string;
                };
                Returns: {
                    metric_key: string;
                    metric_value: number;
                    dimension_values: Json;
                    measured_at: string;
                }[];
            };
            get_platform_redirect_url: {
                Args: {
                    platform_name: string;
                    redirect_type: string;
                };
                Returns: string;
            };
            get_platform_settings: {
                Args: {
                    p_platform: string;
                };
                Returns: Json;
            };
            get_recent_posts: {
                Args: {
                    p_visibility?: string;
                    p_limit?: number;
                    p_offset?: number;
                };
                Returns: {
                    id: string;
                    author_id: string;
                    content: string;
                    token_tag: string;
                    created_at: string;
                    visibility: string;
                    author_name: string;
                    author_avatar: string;
                }[];
            };
            get_role_capabilities: {
                Args: {
                    _role_slug: string;
                    _feature_name: string;
                    _tenant_id: string;
                };
                Returns: {
                    can_view: boolean;
                    can_create: boolean;
                    can_edit: boolean;
                    can_delete: boolean;
                    can_approve: boolean;
                }[];
            };
            get_room_messages: {
                Args: {
                    room_uuid: string;
                    page_size?: number;
                    before_timestamp?: string;
                };
                Returns: {
                    id: string;
                    content: string;
                    sender_id: string;
                    room_id: string;
                    created_at: string;
                    token_tag: string;
                    sender_name: string;
                    sender_avatar: string;
                }[];
            };
            get_room_type: {
                Args: {
                    room_uuid: string;
                };
                Returns: string;
            };
            get_tenant_analytics: {
                Args: {
                    _tenant_id: string;
                    _start_date?: string;
                    _end_date?: string;
                };
                Returns: Json;
            };
            get_tenant_by_slug: {
                Args: {
                    _slug: string;
                };
                Returns: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string;
                    settings: Json;
                    branding: Json;
                    status: string;
                    user_count: number;
                    domain: string;
                    subscription_status: string;
                    subscription_plan: string;
                }[];
            };
            get_tenant_shared_content: {
                Args: {
                    _tenant_slug: string;
                    _limit?: number;
                    _offset?: number;
                    _category_slug?: string;
                };
                Returns: {
                    id: string;
                    title: string;
                    slug: string;
                    description: string;
                    content: Json;
                    category_id: string;
                    category_name: string;
                    category_slug: string;
                    is_featured: boolean;
                    display_order: number;
                    tags: string[];
                    created_at: string;
                    updated_at: string;
                }[];
            };
            get_token_balances: {
                Args: {
                    p_user_id: string;
                };
                Returns: {
                    luck_balance: number;
                    live_balance: number;
                    love_balance: number;
                    life_balance: number;
                    total_earned: number;
                    last_updated: string;
                }[];
            };
            get_token_history: {
                Args: {
                    p_user_id: string;
                    p_token_type?: string;
                    p_limit?: number;
                    p_offset?: number;
                };
                Returns: {
                    token_type: string;
                    amount: number;
                    source: string;
                    created_at: string;
                    description: string;
                }[];
            };
            get_unread_notification_count: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                };
                Returns: number;
            };
            get_user_accessible_tenants: {
                Args: {
                    _user_id: string;
                };
                Returns: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string;
                    branding: Json;
                    role: string;
                    primary_domain: string;
                    is_active: boolean;
                }[];
            };
            get_user_achievements: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                };
                Returns: {
                    achievement_name: string;
                    achievement_description: string;
                    badge_url: string;
                    points: number;
                    earned_at: string;
                }[];
            };
            get_user_activity_feed: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                    p_limit?: number;
                    p_offset?: number;
                };
                Returns: {
                    activity_id: string;
                    user_id: string;
                    activity_type: string;
                    content_type: string;
                    content_id: string;
                    metadata: Json;
                    created_at: string;
                    interaction_count: number;
                }[];
            };
            get_user_activity_summary: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                    p_start_date: string;
                    p_end_date: string;
                };
                Returns: {
                    total_lessons_completed: number;
                    total_modules_completed: number;
                    total_points_earned: number;
                    active_days: number;
                }[];
            };
            get_user_conversations: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                    p_limit?: number;
                };
                Returns: {
                    id: string;
                    title: string;
                    created_at: string;
                    updated_at: string;
                    message_count: number;
                    model: string;
                }[];
            };
            get_user_engagement_summary: {
                Args: {
                    p_platform: string;
                    p_start_date: string;
                    p_end_date: string;
                };
                Returns: {
                    total_users: number;
                    active_users: number;
                    total_activities: number;
                    avg_activities_per_user: number;
                }[];
            };
            get_user_notifications: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                    p_limit?: number;
                    p_offset?: number;
                };
                Returns: {
                    notification_id: string;
                    title: string;
                    body: string;
                    is_read: boolean;
                    created_at: string;
                    metadata: Json;
                }[];
            };
            get_user_permissions: {
                Args: {
                    _user_id: string;
                    _tenant_slug?: string;
                };
                Returns: {
                    permission_slug: string;
                    permission_name: string;
                    permission_category: string;
                    permission_scope: string;
                    granted_via: string;
                }[];
            };
            get_user_platform_progress: {
                Args: {
                    user_id: string;
                    platform_name: string;
                };
                Returns: {
                    total_modules: number;
                    completed_modules: number;
                    total_lessons: number;
                    completed_lessons: number;
                    completion_percentage: number;
                }[];
            };
            get_user_points: {
                Args: {
                    user_id: string;
                    platform_name?: string;
                };
                Returns: {
                    platform: string;
                    activity_type: string;
                    total_points: number;
                }[];
            };
            get_user_progress_summary: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                };
                Returns: {
                    completed_lessons: number;
                    completed_modules: number;
                    total_points: number;
                    last_activity: string;
                }[];
            };
            get_user_role: {
                Args: {
                    user_id: string;
                };
                Returns: string;
            };
            get_user_role_details: {
                Args: {
                    _user_id: string;
                };
                Returns: {
                    role_id: string;
                    role_name: string;
                    role_slug: string;
                    role_category: string;
                    role_priority: number;
                    tenant_id: string;
                    tenant_name: string;
                }[];
            };
            get_user_tenants: {
                Args: {
                    _user_id: string;
                };
                Returns: {
                    tenant_id: string;
                    tenant_name: string;
                    tenant_slug: string;
                    tenant_status: string;
                    user_role: string;
                }[];
            };
            get_user_token_history: {
                Args: {
                    user_uuid: string;
                    token_type_filter?: string;
                    page_size?: number;
                    page_number?: number;
                };
                Returns: {
                    id: string;
                    token_type: string;
                    amount: number;
                    source_type: string;
                    description: string;
                    created_at: string;
                }[];
            };
            get_user_token_summary: {
                Args: {
                    user_uuid: string;
                };
                Returns: {
                    token_type: string;
                    total_earned: number;
                    current_balance: number;
                }[];
            };
            get_version_history: {
                Args: {
                    p_content_type: string;
                    p_content_id: string;
                };
                Returns: {
                    version_id: string;
                    version_number: number;
                    title: string;
                    created_by: string;
                    created_at: string;
                    status: string;
                    reviewed_by: string;
                    reviewed_at: string;
                }[];
            };
            get_workflow_history: {
                Args: {
                    p_content_type: string;
                    p_content_id: string;
                };
                Returns: {
                    status: string;
                    changed_by: string;
                    notes: string;
                    created_at: string;
                }[];
            };
            halfvec_avg: {
                Args: {
                    "": number[];
                };
                Returns: unknown;
            };
            halfvec_out: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            halfvec_send: {
                Args: {
                    "": unknown;
                };
                Returns: string;
            };
            halfvec_typmod_in: {
                Args: {
                    "": unknown[];
                };
                Returns: number;
            };
            has_active_subscription: {
                Args: {
                    p_user_id: string;
                };
                Returns: boolean;
            };
            has_content_access: {
                Args: {
                    user_id: string;
                    platform_name: string;
                };
                Returns: boolean;
            };
            has_platform_access: {
                Args: {
                    platform_slug_param: string;
                };
                Returns: boolean;
            };
            hnsw_bit_support: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            hnsw_halfvec_support: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            hnsw_sparsevec_support: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            hnswhandler: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            is_chat_participant: {
                Args: {
                    p_room_id: string;
                    p_user_id: string;
                };
                Returns: boolean;
            };
            is_premium_subscriber: {
                Args: {
                    user_uuid: string;
                };
                Returns: boolean;
            };
            is_rate_limited: {
                Args: {
                    p_email: string;
                    p_ip_address: string;
                    p_window_minutes?: number;
                    p_max_attempts?: number;
                };
                Returns: boolean;
            };
            is_superachiever: {
                Args: {
                    user_uuid: string;
                };
                Returns: boolean;
            };
            ivfflat_bit_support: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            ivfflat_halfvec_support: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            ivfflathandler: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            l2_norm: {
                Args: {
                    "": unknown;
                } | {
                    "": unknown;
                };
                Returns: number;
            };
            l2_normalize: {
                Args: {
                    "": string;
                } | {
                    "": unknown;
                } | {
                    "": unknown;
                };
                Returns: string;
            };
            log_auth_event: {
                Args: {
                    p_user_id: string;
                    p_email: string;
                    p_ip_address: string;
                    p_user_agent: string;
                    p_action: string;
                    p_status: string;
                };
                Returns: string;
            };
            log_error: {
                Args: {
                    p_error_type: string;
                    p_error_message: string;
                    p_severity: string;
                    p_stack_trace?: string;
                    p_platform?: string;
                    p_user_id?: string;
                    p_context?: Json;
                };
                Returns: string;
            };
            manage_content_workflow: {
                Args: {
                    p_content_type: string;
                    p_content_id: string;
                    p_platform: string;
                    p_status: string;
                    p_assigned_to: string;
                    p_due_date: string;
                    p_notes: string;
                    p_user_id: string;
                };
                Returns: string;
            };
            map_points_to_tokens: {
                Args: {
                    p_user_id: string;
                    p_token_type: string;
                    p_amount: number;
                };
                Returns: undefined;
            };
            mark_notifications_read: {
                Args: {
                    p_user_id: string;
                    p_notification_ids: string[];
                };
                Returns: undefined;
            };
            match_documents: {
                Args: {
                    query_embedding: string;
                    match_threshold: number;
                    match_count: number;
                };
                Returns: {
                    id: string;
                    content: string;
                    metadata: Json;
                    platform: string;
                    similarity: number;
                }[];
            };
            migrate_platform_to_tenant: {
                Args: {
                    _platform: string;
                    _admin_user_id?: string;
                };
                Returns: Json;
            };
            migrate_users_to_tenants: {
                Args: Record<PropertyKey, never>;
                Returns: undefined;
            };
            mint_points_on_action: {
                Args: {
                    p_user_id: string;
                    p_action_type: string;
                    p_platform: Database["public"]["Enums"]["platform_slug"];
                    p_action_id: string;
                };
                Returns: undefined;
            };
            process_sunday_zoom_rewards: {
                Args: {
                    p_meeting_id: string;
                    p_minimum_duration?: number;
                };
                Returns: number;
            };
            process_zoom_attendance_rewards: {
                Args: Record<PropertyKey, never>;
                Returns: undefined;
            };
            publish_module: {
                Args: {
                    content_id: string;
                    publisher_id: string;
                };
                Returns: boolean;
            };
            record_audit_log: {
                Args: {
                    p_user_id: string;
                    p_action: string;
                    p_entity_type: string;
                    p_entity_id: string;
                    p_old_data: Json;
                    p_new_data: Json;
                };
                Returns: string;
            };
            record_health_check: {
                Args: {
                    p_check_name: string;
                    p_status: string;
                    p_details?: Json;
                    p_severity?: string;
                };
                Returns: string;
            };
            record_participation: {
                Args: {
                    user_id: string;
                    platform_name: string;
                    activity: string;
                    points_earned?: number;
                    activity_metadata?: Json;
                };
                Returns: string;
            };
            record_performance_metric: {
                Args: {
                    p_metric_name: string;
                    p_metric_value: number;
                    p_metric_unit?: string;
                    p_platform?: string;
                    p_context?: Json;
                };
                Returns: string;
            };
            record_zoom_attendance: {
                Args: {
                    p_user_id: string;
                    p_meeting_id: string;
                    p_join_time?: string;
                };
                Returns: string;
            };
            refresh_materialized_views: {
                Args: Record<PropertyKey, never>;
                Returns: undefined;
            };
            refresh_token_history: {
                Args: Record<PropertyKey, never>;
                Returns: undefined;
            };
            remove_user_from_tenant: {
                Args: {
                    _user_id: string;
                    _tenant_slug: string;
                };
                Returns: boolean;
            };
            search_content: {
                Args: {
                    p_query: string;
                    p_limit?: number;
                    p_offset?: number;
                };
                Returns: {
                    content_type: string;
                    content_id: string;
                    title: string;
                    description: string;
                    rank: number;
                    metadata: Json;
                }[];
            };
            search_similar_content: {
                Args: {
                    query_text: string;
                    content_type: string;
                    similarity_threshold?: number;
                    max_results?: number;
                };
                Returns: {
                    content_id: string;
                    similarity: number;
                }[];
            };
            setup_default_tenant_roles: {
                Args: {
                    _tenant_id: string;
                };
                Returns: undefined;
            };
            sparsevec_out: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            sparsevec_send: {
                Args: {
                    "": unknown;
                };
                Returns: string;
            };
            sparsevec_typmod_in: {
                Args: {
                    "": unknown[];
                };
                Returns: number;
            };
            track_ai_analytics: {
                Args: {
                    p_event_type: string;
                    p_app_name: string;
                    p_metrics: Json;
                    p_metadata?: Json;
                };
                Returns: string;
            };
            track_ai_usage: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                    p_prompt_tokens: number;
                    p_completion_tokens: number;
                    p_model: string;
                    p_cost?: number;
                };
                Returns: string;
            };
            track_engagement: {
                Args: {
                    user_id: string;
                    platform_name: string;
                    activity: string;
                    points_earned?: number;
                };
                Returns: undefined;
            };
            update_learning_progress: {
                Args: {
                    p_user_id: string;
                    p_content_type: string;
                    p_content_id: string;
                    p_status: string;
                    p_progress_percentage: number;
                    p_metadata?: Json;
                };
                Returns: undefined;
            };
            update_progress: {
                Args: {
                    user_id: string;
                    platform_name: string;
                    module_id: string;
                    lesson_id?: string;
                    new_status?: string;
                };
                Returns: undefined;
            };
            update_search_vector: {
                Args: {
                    p_content_type: string;
                    p_content_id: string;
                    p_title: string;
                    p_description: string;
                    p_content: string;
                    p_metadata?: Json;
                };
                Returns: undefined;
            };
            update_team_earnings: {
                Args: {
                    p_user_id: string;
                    p_points_earned: number;
                };
                Returns: undefined;
            };
            update_user_activity: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                    p_lessons_completed: number;
                    p_modules_completed: number;
                    p_points_earned: number;
                };
                Returns: undefined;
            };
            update_user_platform_for_testing: {
                Args: {
                    p_user_id: string;
                    platform_name: string;
                };
                Returns: string;
            };
            update_user_preferences: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                    p_activity_type: string;
                    p_activity_data: Json;
                };
                Returns: undefined;
            };
            update_user_progress: {
                Args: {
                    p_user_id: string;
                    p_platform: string;
                    p_feature: string;
                    p_unlock?: boolean;
                };
                Returns: boolean;
            };
            update_user_skill: {
                Args: {
                    p_user_id: string;
                    p_skill_name: string;
                    p_proficiency_level: number;
                };
                Returns: undefined;
            };
            update_zoom_attendance: {
                Args: {
                    p_attendance_id: string;
                    p_leave_time?: string;
                };
                Returns: undefined;
            };
            user_belongs_to_tenant: {
                Args: {
                    _user_id: string;
                    _tenant_slug: string;
                };
                Returns: boolean;
            };
            user_exists: {
                Args: {
                    user_email: string;
                };
                Returns: boolean;
            };
            user_has_permission: {
                Args: {
                    _user_id: string;
                    _permission_slug: string;
                    _tenant_slug?: string;
                    _resource_id?: string;
                } | {
                    _user_id: string;
                    _permission_slug: string;
                    _tenant_slug?: string;
                };
                Returns: boolean;
            };
            user_has_platform_access: {
                Args: {
                    _user_id: string;
                    _platform_slug: string;
                };
                Returns: boolean;
            };
            validate_schema: {
                Args: Record<PropertyKey, never>;
                Returns: string;
            };
            vector_avg: {
                Args: {
                    "": number[];
                };
                Returns: string;
            };
            vector_dims: {
                Args: {
                    "": string;
                } | {
                    "": unknown;
                };
                Returns: number;
            };
            vector_norm: {
                Args: {
                    "": string;
                };
                Returns: number;
            };
            vector_out: {
                Args: {
                    "": string;
                };
                Returns: unknown;
            };
            vector_send: {
                Args: {
                    "": string;
                };
                Returns: string;
            };
            vector_typmod_in: {
                Args: {
                    "": unknown[];
                };
                Returns: number;
            };
        };
        Enums: {
            ascender_focus: "ascender" | "ascension" | "flow" | "ascenders";
            experience_phase: "discover" | "onboard" | "progress" | "endgame";
            feedback_status: "pending" | "reviewed" | "implemented" | "rejected";
            immortal_focus: "immortal" | "immortalis" | "project_life" | "immortals";
            neothinker_focus: "neothinker" | "neothink" | "revolution" | "fellowship" | "movement" | "command" | "mark_hamilton" | "neothinkers";
            platform_slug: "hub" | "ascenders" | "neothinkers" | "immortals";
            platform_type: "neothink_hub" | "ascender" | "neothinker" | "immortal" | "hub" | "ascenders" | "neothinkers" | "immortals";
            token_type: "live" | "love" | "life";
            user_role: "subscriber" | "participant" | "contributor";
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};
type DefaultSchema = Database[Extract<keyof Database, "public">];
export type Tables<DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | {
    schema: keyof Database;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"]) : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
    Row: infer R;
} ? R : never : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
    Row: infer R;
} ? R : never : never;
export type TablesInsert<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | {
    schema: keyof Database;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
} ? I : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I;
} ? I : never : never;
export type TablesUpdate<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | {
    schema: keyof Database;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
} ? U : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U;
} ? U : never : never;
export type Enums<DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | {
    schema: keyof Database;
}, EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"] : never = never> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName] : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions] : never;
export type CompositeTypes<PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | {
    schema: keyof Database;
}, CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"] : never = never> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
} ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName] : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions] : never;
export declare const Constants: {
    readonly public: {
        readonly Enums: {
            readonly ascender_focus: readonly ["ascender", "ascension", "flow", "ascenders"];
            readonly experience_phase: readonly ["discover", "onboard", "progress", "endgame"];
            readonly feedback_status: readonly ["pending", "reviewed", "implemented", "rejected"];
            readonly immortal_focus: readonly ["immortal", "immortalis", "project_life", "immortals"];
            readonly neothinker_focus: readonly ["neothinker", "neothink", "revolution", "fellowship", "movement", "command", "mark_hamilton", "neothinkers"];
            readonly platform_slug: readonly ["hub", "ascenders", "neothinkers", "immortals"];
            readonly platform_type: readonly ["neothink_hub", "ascender", "neothinker", "immortal", "hub", "ascenders", "neothinkers", "immortals"];
            readonly token_type: readonly ["live", "love", "life"];
            readonly user_role: readonly ["subscriber", "participant", "contributor"];
        };
    };
};
export {};
//# sourceMappingURL=supabase.d.ts.map