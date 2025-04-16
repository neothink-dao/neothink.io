interface TokenHistoryProps {
    userId: string;
    supabaseUrl: string;
    supabaseKey: string;
    tokenType?: string;
    limit?: number;
    offset?: number;
}
export declare function TokenHistory({ userId, supabaseUrl, supabaseKey, tokenType, limit, offset }: TokenHistoryProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=TokenHistory.d.ts.map