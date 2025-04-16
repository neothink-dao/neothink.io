import React from 'react';
declare const platformColors: {
    live: string;
    love: string;
    life: string;
    luck: string;
    flow: string;
    'mark-hamilton': string;
    'project-life': string;
    default: string;
};
type PlatformColorKey = keyof typeof platformColors;
interface QuestCardProps {
    title: string;
    description: string;
    points: number;
    actionText: string;
    platform: PlatformColorKey;
    questType: 'read' | 'write' | 'execute' | 'superachiever' | 'trial' | 'zoom';
    isTrialUser?: boolean;
    onActionClick?: () => void;
    className?: string;
}
declare const QuestCard: React.FC<QuestCardProps>;
export { QuestCard, platformColors };
//# sourceMappingURL=QuestCard.d.ts.map