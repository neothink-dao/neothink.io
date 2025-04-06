import React from 'react';

interface LoadingSpinnerProps {
  /**
   * Size of the spinner in pixels
   * @default 48
   */
  size?: number;
  
  /**
   * Color of the spinner
   * @default "currentColor"
   */
  color?: string;
  
  /**
   * Whether to center the spinner
   * @default true
   */
  centered?: boolean;
  
  /**
   * Optional label text
   */
  label?: string;
}

/**
 * A simple loading spinner component
 */
export default function LoadingSpinner({
  size = 48,
  color = 'currentColor',
  centered = true,
  label,
}: LoadingSpinnerProps) {
  const Container = centered ? CenteredContainer : React.Fragment;
  
  return (
    <Container>
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="animate-spin rounded-full border-2 border-opacity-20"
          style={{
            width: size,
            height: size,
            borderColor: color,
            borderTopColor: 'transparent',
          }}
        />
        {label && (
          <div className="mt-4 text-center text-sm text-gray-600">{label}</div>
        )}
      </div>
    </Container>
  );
}

function CenteredContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center min-h-[200px] w-full">
      {children}
    </div>
  );
} 