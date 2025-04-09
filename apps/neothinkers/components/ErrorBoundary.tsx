'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { analytics } from '@neothink/analytics';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches JavaScript errors anywhere in the child
 * component tree, logs those errors, and displays a fallback UI.
 * 
 * @see DEVELOPMENT.md#error-handling - Error handling guidelines
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the analytics service
    analytics.track('error_boundary_caught', {
      platform: 'neothinkers',
      error_message: error.message,
      error_stack: error.stack,
      component_stack: errorInfo.componentStack,
    }).catch(e => {
      console.error('Failed to track error:', e);
    });
    
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render fallback UI if provided, otherwise default fallback
      return this.props.fallback || (
        <div className="p-6 bg-red-50 border border-red-100 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">
            An error occurred while rendering this component.
          </p>
          <details className="text-sm text-red-700 bg-white p-2 rounded border border-red-200">
            <summary className="cursor-pointer">Error details</summary>
            <p className="mt-2">{this.state.error?.message}</p>
            <pre className="mt-2 overflow-auto p-2 bg-gray-100 rounded">
              {this.state.error?.stack}
            </pre>
          </details>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component (HOC) that wraps a component with an ErrorBoundary
 */
export function withErrorBoundary<P>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.ComponentType<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
} 