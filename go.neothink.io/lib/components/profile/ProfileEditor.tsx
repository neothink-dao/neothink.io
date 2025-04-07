'use client';

import { ProfileForm } from './ProfileForm';
import { PlatformSlug } from '@/lib/supabase/auth-client';

interface ProfileEditorProps {
  platformSlug: PlatformSlug;
  className?: string;
}

export function ProfileEditor({ platformSlug, className }: ProfileEditorProps) {
  return (
    <div className={className}>
      <ProfileForm platformSlug={platformSlug} onSave={() => window.history.back()} />
    </div>
  );
} 