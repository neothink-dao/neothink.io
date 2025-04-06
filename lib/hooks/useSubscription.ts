import { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { PostgrestError } from '@supabase/supabase-js';

export type SubscriptionPlan = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  platform_access: string[];
  is_active: boolean;
  features: {
    tagline: string;
    benefits: string[];
    [key: string]: any;
  };
  stripe_price_id: string;
};

export type UserSubscription = {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
};

export type PlatformAccess = {
  id: string;
  user_id: string;
  platform_slug: string;
  access_level: 'full' | 'limited' | 'trial' | 'none';
  source: 'subscription' | 'trial' | 'comp' | 'legacy';
  source_id: string;
  granted_at: string;
  expires_at: string | null;
};

type SubscriptionHistory = {
  id: string;
  user_id: string;
  subscription_id: string;
  previous_plan_id: string | null;
  new_plan_id: string;
  change_type: 'created' | 'updated' | 'canceled' | 'reactivated' | 'payment_failed' | 'payment_succeeded' | 'upgraded' | 'downgraded';
  details: Record<string, any>;
  created_at: string;
};

/**
 * Hook for managing user subscriptions
 */
export function useSubscription() {
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionHistory[]>([]);
  const [platformAccess, setPlatformAccess] = useState<PlatformAccess[]>([]);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  
  const supabase = useSupabaseClient();
  const user = useUser();

  /**
   * Fetches the current user's subscription
   */
  const fetchCurrentSubscription = useCallback(async () => {
    if (!user) {
      setCurrentSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:plan_id (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        setError(error);
        return;
      }

      setCurrentSubscription(data);
    } catch (err) {
      console.error('Error in fetchCurrentSubscription:', err);
      setError(err as PostgrestError);
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  /**
   * Fetches all available subscription plans
   */
  const fetchAvailablePlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching plans:', error);
        setError(error);
        return;
      }

      setAvailablePlans(data || []);
    } catch (err) {
      console.error('Error in fetchAvailablePlans:', err);
      setError(err as PostgrestError);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  /**
   * Fetches the user's platform access
   */
  const fetchPlatformAccess = useCallback(async () => {
    if (!user) {
      setPlatformAccess([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('platform_access')
        .select('*')
        .eq('user_id', user.id)
        .in('access_level', ['full', 'limited', 'trial']);

      if (error) {
        console.error('Error fetching platform access:', error);
        setError(error);
        return;
      }

      setPlatformAccess(data || []);
    } catch (err) {
      console.error('Error in fetchPlatformAccess:', err);
      setError(err as PostgrestError);
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  /**
   * Fetches the user's subscription history
   */
  const fetchSubscriptionHistory = useCallback(async () => {
    if (!user) {
      setSubscriptionHistory([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('subscription_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscription history:', error);
        setError(error);
        return;
      }

      setSubscriptionHistory(data || []);
    } catch (err) {
      console.error('Error in fetchSubscriptionHistory:', err);
      setError(err as PostgrestError);
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  /**
   * Checks if the user has access to a specific platform
   */
  const hasPlatformAccess = useCallback((platformSlug: string): boolean => {
    return platformAccess.some(
      access => 
        access.platform_slug === platformSlug && 
        ['full', 'limited', 'trial'].includes(access.access_level) &&
        (!access.expires_at || new Date(access.expires_at) > new Date())
    );
  }, [platformAccess]);

  /**
   * Creates a new subscription (server-side API call required)
   */
  const createSubscription = useCallback(async (planId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // This would typically be a server-side API call to create a Stripe checkout session
      // Here we're just stubbing the API call
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }
      
      const data = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = data.checkoutUrl;
      
      return true;
    } catch (err) {
      console.error('Error creating subscription:', err);
      return false;
    }
  }, [user]);

  /**
   * Cancels the current subscription
   */
  const cancelSubscription = useCallback(async (): Promise<boolean> => {
    if (!user || !currentSubscription) return false;

    try {
      // This would typically be a server-side API call to cancel the subscription
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          subscriptionId: currentSubscription.id,
          stripeSubscriptionId: currentSubscription.stripe_subscription_id
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel subscription');
      }
      
      // Refresh subscription data
      await fetchCurrentSubscription();
      await fetchPlatformAccess();
      await fetchSubscriptionHistory();
      
      return true;
    } catch (err) {
      console.error('Error canceling subscription:', err);
      return false;
    }
  }, [user, currentSubscription, fetchCurrentSubscription, fetchPlatformAccess, fetchSubscriptionHistory]);

  /**
   * Updates the current subscription (e.g. upgrade/downgrade)
   */
  const updateSubscription = useCallback(async (newPlanId: string): Promise<boolean> => {
    if (!user || !currentSubscription) return false;

    try {
      // This would typically be a server-side API call to update the subscription
      const response = await fetch('/api/subscriptions/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          subscriptionId: currentSubscription.id,
          stripeSubscriptionId: currentSubscription.stripe_subscription_id,
          newPlanId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update subscription');
      }
      
      // Refresh subscription data
      await fetchCurrentSubscription();
      await fetchPlatformAccess();
      await fetchSubscriptionHistory();
      
      return true;
    } catch (err) {
      console.error('Error updating subscription:', err);
      return false;
    }
  }, [user, currentSubscription, fetchCurrentSubscription, fetchPlatformAccess, fetchSubscriptionHistory]);

  /**
   * Handles the subscription webhook callback (e.g., after successful checkout)
   */
  const handleSubscriptionCallback = useCallback(async () => {
    // Refresh all subscription data
    await fetchCurrentSubscription();
    await fetchPlatformAccess();
    await fetchSubscriptionHistory();
  }, [fetchCurrentSubscription, fetchPlatformAccess, fetchSubscriptionHistory]);

  // Fetch data on initial load
  useEffect(() => {
    fetchAvailablePlans();
  }, [fetchAvailablePlans]);

  // Fetch user-specific data when user changes
  useEffect(() => {
    if (user) {
      fetchCurrentSubscription();
      fetchPlatformAccess();
      fetchSubscriptionHistory();
    } else {
      setCurrentSubscription(null);
      setPlatformAccess([]);
      setSubscriptionHistory([]);
    }
  }, [user, fetchCurrentSubscription, fetchPlatformAccess, fetchSubscriptionHistory]);

  // Check for subscription callback (e.g., return from Stripe checkout)
  useEffect(() => {
    const url = new URL(window.location.href);
    const checkoutSuccess = url.searchParams.get('checkout');
    const sessionId = url.searchParams.get('session_id');
    
    if (checkoutSuccess === 'success' && sessionId) {
      // Remove query parameters from URL
      url.searchParams.delete('checkout');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, document.title, url.toString());
      
      // Handle the callback
      handleSubscriptionCallback();
    }
  }, [handleSubscriptionCallback]);

  return {
    currentSubscription,
    subscriptionHistory,
    platformAccess,
    availablePlans,
    loading,
    error,
    hasPlatformAccess,
    createSubscription,
    cancelSubscription,
    updateSubscription,
    fetchCurrentSubscription,
    fetchPlatformAccess,
    fetchSubscriptionHistory
  };
} 