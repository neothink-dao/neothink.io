import { ReactNode } from 'react';
interface NavItem {
    href: string;
    label: string;
    icon?: ReactNode;
}
interface PlatformNavConfig {
    hub: NavItem[];
    ascenders: NavItem[];
    neothinkers: NavItem[];
    immortals: NavItem[];
}
interface NavigationProps {
    platform: keyof PlatformNavConfig;
}
export declare function Navigation({ platform }: NavigationProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Navigation.d.ts.map