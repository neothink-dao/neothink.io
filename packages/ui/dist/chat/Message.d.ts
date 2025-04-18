interface MessageProps {
    userId: string;
    roomId: string;
    supabaseUrl: string;
    supabaseKey: string;
    onSend?: () => void;
}
export declare function Message({ userId, roomId, supabaseUrl, supabaseKey, onSend }: MessageProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Message.d.ts.map