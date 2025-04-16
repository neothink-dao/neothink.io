import * as React from "react";
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
}
export declare function Tabs({ value, onValueChange, children, className, ...props }: TabsProps): React.JSX.Element;
export declare function TabsList({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
export declare function TabsTrigger({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>): React.JSX.Element;
export declare function TabsContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
export {};
//# sourceMappingURL=tabs.d.ts.map