import * as React from "react";

interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value: _value, onValueChange: _onValueChange, children, className = '', ...props }: TabsProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  // Minimal implementation: just render children
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function TabsList({ children, className = '', ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div className={`flex border-b ${className}`} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ children, className = '', ...props }: { children: React.ReactNode; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element {
  return (
    <button className={`px-4 py-2 text-sm font-medium focus:outline-none ${className}`} {...props}>
      {children}
    </button>
  );
}

export function TabsContent({ children, className = '', ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}