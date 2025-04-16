import { PlatformSlug, OnboardingStep, AssessmentResult, UserProfile } from '@neothink/types';
export interface OnboardingConfig {
    steps: OnboardingStep[];
    assessmentType: string;
    requiredAchievements: string[];
    communityFeatures: string[];
}
export declare class OnboardingService {
    private supabase;
    private userId;
    private platform;
    constructor(userId: string, platform: PlatformSlug);
    getCurrentStep(): Promise<OnboardingStep>;
    completeStep(stepId: string): Promise<void>;
    submitAssessment(answers: Record<string, any>): Promise<AssessmentResult>;
    updateProfile(profile: Partial<UserProfile>): Promise<void>;
    joinCommunity(features: string[]): Promise<void>;
    private grantAchievement;
}
//# sourceMappingURL=OnboardingService.d.ts.map