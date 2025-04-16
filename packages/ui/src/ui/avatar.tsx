import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: number;
}

export function Avatar({ src, alt, fallback, size = 40, className, ...props }: AvatarProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gray-200 overflow-hidden border border-gray-300 ${className || ''}`}
      style={{ width: size, height: size }}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="text-gray-500 text-sm font-medium">{fallback}</span>
      )}
    </div>
  );
}

export function AvatarImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img {...props} className={`object-cover w-full h-full ${props.className || ''}`} />;
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return <span className="text-gray-500 text-sm font-medium">{children}</span>;
} 