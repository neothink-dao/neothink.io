-- Migration for Subscription Management System
-- Adds tables and functionality for managing subscriptions across platforms

-- Subscription plans table for defining available subscription options
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  platform_access TEXT[] NOT NULL, -- Array of platform slugs this plan grants access to
  is_active BOOLEAN NOT NULL DEFAULT true,
  features JSONB DEFAULT '{}'::jsonb,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS subscription_plans_slug_idx ON public.subscription_plans(slug);
CREATE INDEX IF NOT EXISTS subscription_plans_is_active_idx ON public.subscription_plans(is_active);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, slug, description, price, interval, platform_access, features, stripe_price_id)
VALUES 
  ('Ascenders', 'ascenders', 'Access to Ascension + FLOW + Ascenders', 99.00, 'month', ARRAY['ascenders'], 
   '{"tagline": "Enjoy greater PROSPERITY as an Ascender (a value creator)", "benefits": ["Ascension Business System", "FLOW Platform Access", "Ascenders Community"]}'::jsonb, 
   'price_ascenders_monthly'),
  
  ('Neothinkers', 'neothinkers', 'Access to Neothink + Mark Hamilton + Neothinkers', 99.00, 'month', ARRAY['neothinkers'], 
   '{"tagline": "Enjoy greater HAPPINESS as a Neothinker (an integrated thinker)", "benefits": ["Neothink University", "Mark Hamilton\'s Teachings", "Neothinkers Community"]}'::jsonb, 
   'price_neothinkers_monthly'),
  
  ('Immortals', 'immortals', 'Access to Immortalis + Project Life + Immortals', 99.00, 'month', ARRAY['immortals'], 
   '{"tagline": "Enjoy greater LONGEVITY as an Immortal (a self-leader)", "benefits": ["Immortalis Movement", "Project Life Nutraceuticals", "Immortals Community"]}'::jsonb, 
   'price_immortals_monthly'),
  
  ('Superachiever', 'superachiever', 'Access to all Neothink platforms', 297.00, 'month', ARRAY['ascenders', 'neothinkers', 'immortals'], 
   '{"tagline": "Prosper Happily Forever by Going Further, Faster, Forever", "benefits": ["Full Access to Ascenders", "Full Access to Neothinkers", "Full Access to Immortals", "Priority Support", "Exclusive Superachiever Content"]}'::jsonb, 
   'price_superachiever_monthly');

-- User subscriptions table for tracking active subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'trialing', 'unpaid')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS user_subscriptions_user_id_idx ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS user_subscriptions_status_idx ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS user_subscriptions_current_period_end_idx ON public.user_subscriptions(current_period_end);

-- Subscription history for tracking subscription changes
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.user_subscriptions(id),
  previous_plan_id UUID REFERENCES public.subscription_plans(id),
  new_plan_id UUID REFERENCES public.subscription_plans(id),
  change_type TEXT NOT NULL CHECK (change_type IN ('created', 'updated', 'canceled', 'reactivated', 'payment_failed', 'payment_succeeded', 'upgraded', 'downgraded')),
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS subscription_history_user_id_idx ON public.subscription_history(user_id);
CREATE INDEX IF NOT EXISTS subscription_history_subscription_id_idx ON public.subscription_history(subscription_id);

-- Platform access table for tracking which platforms a user can access
CREATE TABLE IF NOT EXISTS public.platform_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_slug TEXT NOT NULL,
  access_level TEXT NOT NULL CHECK (access_level IN ('full', 'limited', 'trial', 'none')),
  source TEXT NOT NULL CHECK (source IN ('subscription', 'trial', 'comp', 'legacy')),
  source_id UUID, -- Reference to subscription_id or other source
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, platform_slug)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS platform_access_user_id_idx ON public.platform_access(user_id);
CREATE INDEX IF NOT EXISTS platform_access_platform_slug_idx ON public.platform_access(platform_slug);
CREATE INDEX IF NOT EXISTS platform_access_access_level_idx ON public.platform_access(access_level);
CREATE INDEX IF NOT EXISTS platform_access_expires_at_idx ON public.platform_access(expires_at);

-- Payment history table for tracking all payment-related events
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.user_subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS payment_history_user_id_idx ON public.payment_history(user_id);
CREATE INDEX IF NOT EXISTS payment_history_subscription_id_idx ON public.payment_history(subscription_id);
CREATE INDEX IF NOT EXISTS payment_history_status_idx ON public.payment_history(status);
CREATE INDEX IF NOT EXISTS payment_history_payment_date_idx ON public.payment_history(payment_date);

-- Enable Row Level Security on all tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans

-- Anyone can view active subscription plans
CREATE POLICY "Anyone can view active subscription plans"
  ON public.subscription_plans
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Only guardians can manage subscription plans
CREATE POLICY "Guardians can manage subscription plans"
  ON public.subscription_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- RLS Policies for user_subscriptions

-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.user_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Only guardians can manage user subscriptions
CREATE POLICY "Guardians can manage user subscriptions"
  ON public.user_subscriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- RLS Policies for subscription_history

-- Users can view their own subscription history
CREATE POLICY "Users can view their own subscription history"
  ON public.subscription_history
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Only guardians can manage subscription history
CREATE POLICY "Guardians can manage subscription history"
  ON public.subscription_history
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- RLS Policies for platform_access

-- Users can view their own platform access
CREATE POLICY "Users can view their own platform access"
  ON public.platform_access
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Only guardians can manage platform access
CREATE POLICY "Guardians can manage platform access"
  ON public.platform_access
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- RLS Policies for payment_history

-- Users can view their own payment history
CREATE POLICY "Users can view their own payment history"
  ON public.payment_history
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Only guardians can manage payment history
CREATE POLICY "Guardians can manage payment history"
  ON public.payment_history
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Function to check if a user has access to a specific platform
CREATE OR REPLACE FUNCTION user_has_platform_access(
  _user_id UUID,
  _platform_slug TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.platform_access
    WHERE
      user_id = _user_id AND
      platform_slug = _platform_slug AND
      access_level IN ('full', 'limited', 'trial') AND
      (expires_at IS NULL OR expires_at > now())
  ) INTO has_access;

  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update platform access when a subscription changes
CREATE OR REPLACE FUNCTION update_platform_access_on_subscription_change()
RETURNS TRIGGER AS $$
DECLARE
  _plan_record RECORD;
  _platform TEXT;
BEGIN
  -- Get the subscription plan details
  SELECT * INTO _plan_record FROM public.subscription_plans WHERE id = NEW.plan_id;
  
  -- If the status is active, grant access to all platforms in the plan
  IF NEW.status = 'active' THEN
    -- Loop through each platform in the plan
    FOREACH _platform IN ARRAY _plan_record.platform_access
    LOOP
      -- Insert or update platform access
      INSERT INTO public.platform_access (
        user_id,
        platform_slug,
        access_level,
        source,
        source_id,
        granted_at,
        expires_at
      )
      VALUES (
        NEW.user_id,
        _platform,
        'full',
        'subscription',
        NEW.id,
        NEW.current_period_start,
        NEW.current_period_end
      )
      ON CONFLICT (user_id, platform_slug)
      DO UPDATE SET
        access_level = 'full',
        source = 'subscription',
        source_id = NEW.id,
        granted_at = NEW.current_period_start,
        expires_at = NEW.current_period_end,
        metadata = platform_access.metadata || jsonb_build_object('updated_at', now())
      WHERE
        platform_access.user_id = NEW.user_id AND
        platform_access.platform_slug = _platform;
    END LOOP;
  -- If the status is not active, remove access
  ELSE
    -- Only update platform access entries that were granted by this subscription
    UPDATE public.platform_access
    SET
      access_level = 'none',
      expires_at = now()
    WHERE
      user_id = NEW.user_id AND
      source = 'subscription' AND
      source_id = NEW.id;
  END IF;

  -- Record the subscription change in history
  INSERT INTO public.subscription_history (
    user_id,
    subscription_id,
    new_plan_id,
    change_type,
    details
  )
  VALUES (
    NEW.user_id,
    NEW.id,
    NEW.plan_id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'created'
      WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        CASE
          WHEN NEW.status = 'active' AND OLD.status != 'active' THEN 'reactivated'
          WHEN NEW.status = 'canceled' THEN 'canceled'
          ELSE 'updated'
        END
      WHEN TG_OP = 'UPDATE' AND OLD.plan_id != NEW.plan_id THEN
        CASE
          WHEN (SELECT price FROM public.subscription_plans WHERE id = NEW.plan_id) >
               (SELECT price FROM public.subscription_plans WHERE id = OLD.plan_id)
               THEN 'upgraded'
          ELSE 'downgraded'
        END
      ELSE 'updated'
    END,
    jsonb_build_object(
      'old_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END,
      'new_status', NEW.status,
      'old_plan_id', CASE WHEN TG_OP = 'UPDATE' THEN OLD.plan_id ELSE NULL END,
      'new_plan_id', NEW.plan_id
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for platform access updates
CREATE TRIGGER update_platform_access_trigger
AFTER INSERT OR UPDATE OF status, plan_id ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_platform_access_on_subscription_change();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscription_plans TO authenticated;
GRANT SELECT ON public.user_subscriptions TO authenticated;
GRANT SELECT ON public.subscription_history TO authenticated;
GRANT SELECT ON public.platform_access TO authenticated;
GRANT SELECT ON public.payment_history TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.subscription_plans IS 'Available subscription plans across all platforms';
COMMENT ON TABLE public.user_subscriptions IS 'Active user subscriptions';
COMMENT ON TABLE public.subscription_history IS 'History of subscription changes';
COMMENT ON TABLE public.platform_access IS 'Platform access permissions for users';
COMMENT ON TABLE public.payment_history IS 'Payment transaction history'; 