import * as React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`animate-pulse rounded-md bg-gray-200 ${className || ''}`}
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton"; 