import * as React from "react";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children, className, ...props }: TabsProps) {
  // Minimal implementation: just render children
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function TabsList({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex border-b ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`px-4 py-2 text-sm font-medium focus:outline-none ${className || ''}`} {...props}>
      {children}
    </button>
  );
}

export function TabsContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
} 