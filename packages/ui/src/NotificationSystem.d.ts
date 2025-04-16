import React from 'react';
interface Notification {
    id: string;
    user_id: string;
    app_name: string;
    type: string;
    title: string;
    message: string;
    link: string | null;
    is_read: boolean;
    metadata: any;
    created_at: string;
}
interface NotificationSystemProps {
    userId: string;
    appName?: string;
    maxNotifications?: number;
    autoHideDuration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    className?: string;
}
export declare const NotificationSystem: React.FC<NotificationSystemProps>;
export declare function useMarkNotificationRead(): (notificationId: string) => Promise<boolean>;
export declare function useNotifications(userId: string, appName?: string): {
    notifications: Notification[];
    loading: boolean;
    error: Error | null;
};
export {};
//# sourceMappingURL=NotificationSystem.d.ts.map