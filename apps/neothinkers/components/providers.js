'use client';
import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
export function Providers({ children }) {
    const [supabase] = useState(() => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
    return (<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>);
}
//# sourceMappingURL=providers.js.map