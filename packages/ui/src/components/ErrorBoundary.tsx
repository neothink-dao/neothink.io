import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  /**
   * The content to render if no error occurs
   */
  children: ReactNode;
  
  /**
   * Text to display when an error occurs (optional)
   */
  fallbackText?: string;
  
  /**
   * Custom component to render when an error occurs (optional)
   */
  FallbackComponent?: React.ComponentType<{ error: Error; resetError: () => void }>;
  
  /**
   * Callback to be called when an error occurs (optional)
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * A component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary fallbackText="Something went wrong">
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback component if provided
      if (this.props.FallbackComponent) {
        return <this.props.FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      // Otherwise, render default fallback UI
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg m-4">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">
            {this.props.fallbackText || 'An error occurred while rendering this component.'}
          </p>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={this.resetError}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 