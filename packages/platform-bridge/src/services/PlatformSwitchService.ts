import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { PlatformAccess, PlatformSlug, PlatformState, SwitchError } from '../types';

export class PlatformSwitchService {
  private client: SupabaseClient;
  private userId: string | null = null;
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  async initialize(userId: string): Promise<void> {
    this.userId = userId;
  }

  async checkAccess(platformSlug: PlatformSlug): Promise<boolean> {
    if (!this.userId) return false;
    
    const { data, error } = await this.client
      .from('platform_access')
      .select('*')
      .eq('user_id', this.userId)
      .eq('platform_slug', platformSlug)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return true;
  }

  async preserveState(platformSlug: PlatformSlug, customState?: Partial<PlatformState>): Promise<boolean> {
    if (!this.userId) return false;
    
    const state: PlatformState = {
      currentPlatform: platformSlug,
      lastVisited: new Date().toISOString(),
      preferences: {
        theme: 'system',
        notifications: true,
        language: 'en',
      },
      recentItems: [],
      navigation: {
        lastPath: '/',
        scrollPosition: 0,
        breadcrumbs: [],
      },
      progress: {
        level: 1,
        achievements: [],
        completedModules: [],
      },
      timestamp: new Date().toISOString(),
      platformData: {},
      ...customState
    };
    
    const { error } = await this.client
      .from('platform_state')
      .upsert({
        user_id: this.userId,
        platform_slug: platformSlug,
        state_data: state,
        updated_at: new Date().toISOString(),
      });
    
    return !error;
  }

  async restoreState(platformSlug: PlatformSlug): Promise<PlatformState | null> {
    if (!this.userId) return null;
    
    const { data, error } = await this.client
      .from('platform_state')
      .select('state_data')
      .eq('user_id', this.userId)
      .eq('platform_slug', platformSlug)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return data?.state_data || null;
  }

  async switchPlatform(targetPlatform: PlatformSlug, preserveCurrentState: boolean = true, currentPlatform?: PlatformSlug): Promise<{ success: boolean; error?: SwitchError; state?: PlatformState }> {
    if (!this.userId) {
      const switchError: SwitchError = {
        code: 'SWITCH_FAILED',
        message: 'User not authenticated',
        details: 'You must be signed in to switch platforms'
      };
      return { success: false, error: switchError };
    }
    
    // Check if user has access to the target platform
    const hasAccess = await this.checkAccess(targetPlatform);
    if (!hasAccess) {
      const switchError: SwitchError = {
        code: 'ACCESS_DENIED',
        message: 'Access denied',
        details: 'You do not have access to this platform'
      };
      return { success: false, error: switchError };
    }
    
    try {
      // Preserve state from current platform
      if (preserveCurrentState && currentPlatform) {
        await this.preserveState(currentPlatform);
      }
      
      // Restore state for target platform
      const restoredState = await this.restoreState(targetPlatform);
      
      // Record switch in analytics
      await this.client
        .from('platform_switches')
        .insert({
          user_id: this.userId,
          from_platform: currentPlatform,
          to_platform: targetPlatform,
          timestamp: new Date().toISOString()
        });
        
      return { 
        success: true, 
        state: restoredState ?? undefined
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const switchError: SwitchError = {
        code: 'SWITCH_FAILED',
        message: 'Failed to switch platforms',
        details: errorMessage
      };
      return { success: false, error: switchError };
    }
  }

  async getPlatformAccess(): Promise<PlatformAccess[]> {
    if (!this.userId) return [];
    
    const { data, error } = await this.client
      .from('platform_access')
      .select('*')
      .eq('user_id', this.userId);
    
    if (error || !data) {
      return [];
    }
    
    return data as PlatformAccess[];
  }
} 