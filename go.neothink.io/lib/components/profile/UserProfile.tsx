'use client';

import { ProfileForm } from './ProfileForm';
import { ProfileView } from './ProfileView';
import { PlatformSlug } from '@/lib/supabase/auth-client';
import { useState } from 'react';

interface UserProfileProps {
  platformSlug: PlatformSlug;
  className?: string;
}

export function UserProfile({ platformSlug, className }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={className}>
      {isEditing ? (
        <ProfileForm platformSlug={platformSlug} onSave={() => setIsEditing(false)} />
      ) : (
        <ProfileView platformSlug={platformSlug} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
} 