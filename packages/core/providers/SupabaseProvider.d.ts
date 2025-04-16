import React from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
export declare function useSupabase(): SupabaseClient<Database, "public", any>;
export declare function SupabaseProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
//# sourceMappingURL=SupabaseProvider.d.ts.map