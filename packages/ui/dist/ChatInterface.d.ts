import React from 'react';
interface ChatInterfaceProps {
    appName: 'hub' | 'ascenders' | 'immortals' | 'neothinkers';
    userId: string;
    onSendMessage: (message: string) => Promise<void>;
    className?: string;
}
export declare const ChatInterface: React.FC<ChatInterfaceProps>;
export {};
//# sourceMappingURL=ChatInterface.d.ts.map