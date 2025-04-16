// Auth components using Supabase UI Library
import { Auth as SupabaseAuth } from '@supabase/ui';
import { supabase } from '@neothink/core/database/client';
import { Platform } from '@neothink/types';
import React from 'react';

export type AuthFormProps = {
  redirectTo?: string;
  magicLink?: boolean;
  socialProviders?: ('google' | 'github' | 'twitter')[];
  onlyThirdPartyProviders?: boolean;
  appearance?: {
    theme?: 'light' | 'dark';
    accentColor?: string;
    brandColor?: string;
    borderRadius?: string;
  };
  platform?: Platform;
};

export const SignIn: React.FC<AuthFormProps> = ({
  redirectTo,
  magicLink = true,
  socialProviders = ['google', 'github'],
  appearance = { theme: 'dark' },
  platform = 'hub',
}) => (
  <SupabaseAuth
    supabaseClient={supabase}
    appearance={appearance}
    providers={socialProviders}
    view="sign_in"
    redirectTo={redirectTo || `/${platform}/dashboard`}
    magicLink={magicLink}
  />
);

export const SignUp: React.FC<AuthFormProps> = ({
  redirectTo,
  magicLink = true,
  socialProviders = ['google', 'github'],
  appearance = { theme: 'dark' },
  platform = 'hub',
}) => (
  <SupabaseAuth
    supabaseClient={supabase}
    appearance={appearance}
    providers={socialProviders}
    view="sign_up"
    redirectTo={redirectTo || `/${platform}/dashboard`}
    magicLink={magicLink}
  />
);

export const ResetPassword: React.FC<AuthFormProps> = ({
  redirectTo,
  appearance = { theme: 'dark' },
  platform = 'hub',
}) => (
  <SupabaseAuth
    supabaseClient={supabase}
    appearance={appearance}
    view="forgotten_password"
    redirectTo={redirectTo || `/${platform}/reset-password/update`}
  />
);

export const UpdatePassword: React.FC<AuthFormProps> = ({
  redirectTo,
  appearance = { theme: 'dark' },
  platform = 'hub',
}) => (
  <SupabaseAuth
    supabaseClient={supabase}
    appearance={appearance}
    view="update_password"
    redirectTo={redirectTo || `/${platform}/dashboard`}
  />
);

// Export a complete Auth component that provides all auth functionality
export const Auth: React.FC<AuthFormProps & { view?: 'sign_in' | 'sign_up' | 'forgotten_password' | 'update_password' }> = ({
  view = 'sign_in',
  ...props
}) => (
  <SupabaseAuth
    supabaseClient={supabase}
    appearance={props.appearance || { theme: 'dark' }}
    providers={props.socialProviders}
    view={view}
    redirectTo={props.redirectTo}
    magicLink={props.magicLink}
  />
);