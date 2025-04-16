import * as React from "react";

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block">{children}</div>;
}

export function DropdownMenuTrigger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" {...props}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${className || ''}`} {...props}>
      {children}
    </div>
  );
} 