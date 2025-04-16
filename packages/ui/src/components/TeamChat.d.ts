import React from 'react';
import { platformColors } from './QuestCard';
interface Message {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: Date;
    pointsAwarded?: number;
    platform?: keyof typeof platformColors;
}
interface TeamChatProps {
    teamName: string;
    messages: Message[];
    currentUserId: string;
    onSendMessage: (messageText: string) => void;
    className?: string;
}
declare const TeamChat: React.FC<TeamChatProps>;
export { TeamChat };
//# sourceMappingURL=TeamChat.d.ts.map