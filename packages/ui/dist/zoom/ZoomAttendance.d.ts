interface ZoomAttendanceProps {
    userId: string;
    meetingId: string;
    supabaseUrl: string;
    supabaseKey: string;
    onJoin?: () => void;
    onLeave?: () => void;
}
export declare function ZoomAttendance({ userId, meetingId, supabaseUrl, supabaseKey, onJoin, onLeave }: ZoomAttendanceProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ZoomAttendance.d.ts.map