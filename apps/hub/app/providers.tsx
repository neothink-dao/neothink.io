'use client';

import { AuthProvider } from '@neothink/auth';
import { SupabaseProvider } from '@neothink/core/providers';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <AuthProvider platformSlug="hub">
        {children}
      </AuthProvider>
    </SupabaseProvider>
  );
} 