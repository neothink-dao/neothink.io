import * as React from "react";
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: React.ReactNode;
    size?: number;
}
export declare function Avatar({ src, alt, fallback, size, className, ...props }: AvatarProps): React.JSX.Element;
export declare function AvatarImage(props: React.ImgHTMLAttributes<HTMLImageElement>): React.JSX.Element;
export declare function AvatarFallback({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
//# sourceMappingURL=avatar.d.ts.map