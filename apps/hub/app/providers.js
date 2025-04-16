'use client';
import { AuthProvider } from '@neothink/auth';
import { SupabaseProvider } from '@neothink/core/providers';
export function Providers({ children }) {
    return (<SupabaseProvider>
      <AuthProvider platformSlug="hub">
        {children}
      </AuthProvider>
    </SupabaseProvider>);
}
//# sourceMappingURL=providers.js.map