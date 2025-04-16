export type PlatformSlug = 'hub' | 'neothinkers' | 'ascenders' | 'immortals';
export interface OnboardingStep {
    id: string;
    title: string;
    type: 'introduction' | 'profile' | 'assessment' | 'exploration' | 'community' | 'exercise' | 'goals' | 'protocol';
}
export interface AssessmentResult {
    id: string;
    user_id: string;
    platform: PlatformSlug;
    assessment_type: string;
    answers: Record<string, any>;
    results?: Record<string, any>;
    completed_at: string;
}
export interface UserProfile {
    id: string;
    user_id: string;
    platform: PlatformSlug;
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    preferences?: Record<string, any>;
    interests?: string[];
    expertise?: string[];
    social_links?: Record<string, string>;
    created_at: string;
    updated_at: string;
}
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    platform: PlatformSlug;
    category: string;
    points: number;
    requirements: string[];
}
export interface CommunityFeature {
    id: string;
    name: string;
    description: string;
    platform: PlatformSlug;
    type: string;
    access_level: string;
    enabled: boolean;
}
//# sourceMappingURL=onboarding.d.ts.map