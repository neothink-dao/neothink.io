import { createClient } from '@supabase/supabase-js';
import { PlatformSlug, OnboardingStep, AssessmentResult, UserProfile } from '@neothink/types';

export interface OnboardingConfig {
  steps: OnboardingStep[];
  assessmentType: string;
  requiredAchievements: string[];
  communityFeatures: string[];
}

const PLATFORM_CONFIGS: Record<PlatformSlug, OnboardingConfig> = {
  hub: {
    steps: [
      { id: 'welcome', title: 'Welcome to Neothink+', type: 'introduction' },
      { id: 'profile', title: 'Create Your Profile', type: 'profile' },
      { id: 'assessment', title: 'Initial Assessment', type: 'assessment' },
      { id: 'platforms', title: 'Explore Platforms', type: 'exploration' },
      { id: 'community', title: 'Join the Community', type: 'community' }
    ],
    assessmentType: 'general',
    requiredAchievements: ['profile_complete', 'assessment_complete'],
    communityFeatures: ['forums', 'connections', 'groups']
  },
  neothinkers: {
    steps: [
      { id: 'welcome', title: 'Welcome to Neothinkers', type: 'introduction' },
      { id: 'profile', title: 'Thinking Profile', type: 'profile' },
      { id: 'assessment', title: 'Thinking Style Assessment', type: 'assessment' },
      { id: 'exercises', title: 'First Thinking Exercise', type: 'exercise' },
      { id: 'community', title: 'Join Think Tanks', type: 'community' }
    ],
    assessmentType: 'thinking_style',
    requiredAchievements: ['profile_complete', 'thinking_assessment_complete'],
    communityFeatures: ['think_tanks', 'study_groups', 'mentorship']
  },
  ascenders: {
    steps: [
      { id: 'welcome', title: 'Welcome to Ascenders', type: 'introduction' },
      { id: 'profile', title: 'Business Profile', type: 'profile' },
      { id: 'assessment', title: 'Business Potential Assessment', type: 'assessment' },
      { id: 'goals', title: 'Set Business Goals', type: 'goals' },
      { id: 'community', title: 'Business Network', type: 'community' }
    ],
    assessmentType: 'business_potential',
    requiredAchievements: ['profile_complete', 'business_assessment_complete'],
    communityFeatures: ['networking', 'masterminds', 'partnerships']
  },
  immortals: {
    steps: [
      { id: 'welcome', title: 'Welcome to Immortals', type: 'introduction' },
      { id: 'profile', title: 'Health Profile', type: 'profile' },
      { id: 'assessment', title: 'Vitality Assessment', type: 'assessment' },
      { id: 'protocol', title: 'Your Health Protocol', type: 'protocol' },
      { id: 'community', title: 'Health Community', type: 'community' }
    ],
    assessmentType: 'vitality',
    requiredAchievements: ['profile_complete', 'vitality_assessment_complete'],
    communityFeatures: ['health_circles', 'accountability', 'challenges']
  }
};

export class OnboardingService {
  private supabase;
  private userId: string;
  private platform: PlatformSlug;

  constructor(userId: string, platform: PlatformSlug) {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.userId = userId;
    this.platform = platform;
  }

  async getCurrentStep(): Promise<OnboardingStep> {
    const { data: progress } = await this.supabase
      .from('user_onboarding')
      .select('*')
      .eq('user_id', this.userId)
      .eq('platform', this.platform)
      .single();

    if (!progress) {
      return PLATFORM_CONFIGS[this.platform].steps[0];
    }

    const currentStepIndex = PLATFORM_CONFIGS[this.platform].steps
      .findIndex(step => step.id === progress.current_step);
    
    return PLATFORM_CONFIGS[this.platform].steps[currentStepIndex];
  }

  async completeStep(stepId: string): Promise<void> {
    const steps = PLATFORM_CONFIGS[this.platform].steps;
    const currentIndex = steps.findIndex(step => step.id === stepId);
    const nextStep = steps[currentIndex + 1]?.id;

    await this.supabase
      .from('user_onboarding')
      .upsert({
        user_id: this.userId,
        platform: this.platform,
        current_step: nextStep,
        completed_steps: steps.slice(0, currentIndex + 1).map(s => s.id),
        updated_at: new Date().toISOString()
      });

    // Grant achievement if step completion qualifies
    if (PLATFORM_CONFIGS[this.platform].requiredAchievements.includes(`${stepId}_complete`)) {
      await this.grantAchievement(`${stepId}_complete`);
    }
  }

  async submitAssessment(answers: Record<string, any>): Promise<AssessmentResult> {
    const assessmentType = PLATFORM_CONFIGS[this.platform].assessmentType;
    
    const { data: result } = await this.supabase
      .from('user_assessments')
      .insert({
        user_id: this.userId,
        platform: this.platform,
        assessment_type: assessmentType,
        answers,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    await this.completeStep('assessment');
    return result;
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<void> {
    await this.supabase
      .from('user_profiles')
      .upsert({
        user_id: this.userId,
        platform: this.platform,
        ...profile,
        updated_at: new Date().toISOString()
      });

    await this.completeStep('profile');
  }

  async joinCommunity(features: string[]): Promise<void> {
    const validFeatures = PLATFORM_CONFIGS[this.platform].communityFeatures;
    const selectedFeatures = features.filter(f => validFeatures.includes(f));

    await this.supabase
      .from('user_community')
      .upsert({
        user_id: this.userId,
        platform: this.platform,
        joined_features: selectedFeatures,
        joined_at: new Date().toISOString()
      });

    await this.completeStep('community');
  }

  private async grantAchievement(achievementId: string): Promise<void> {
    await this.supabase
      .from('user_achievements')
      .insert({
        user_id: this.userId,
        platform: this.platform,
        achievement_id: achievementId,
        earned_at: new Date().toISOString()
      });
  }
} 