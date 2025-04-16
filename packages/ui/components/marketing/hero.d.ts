import { type Platform } from '@neothink/types';
interface HeroProps {
    platform: Platform;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    imageSrc: string;
}
export declare function Hero({ platform, title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, imageSrc, }: HeroProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=hero.d.ts.map