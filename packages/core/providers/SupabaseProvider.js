'use client';
import React, { createContext, useContext, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
const SupabaseContext = createContext(undefined);
export function useSupabase() {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context.supabase;
}
export function SupabaseProvider({ children }) {
    const [supabase] = useState(() => createClientComponentClient());
    return (<SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>);
}
//# sourceMappingURL=SupabaseProvider.js.map