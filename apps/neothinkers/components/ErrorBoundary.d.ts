import React, { Component, ReactNode, ErrorInfo } from 'react';
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
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): ReactNode;
}
/**
 * Higher-order component (HOC) that wraps a component with an ErrorBoundary
 */
export declare function withErrorBoundary<P>(Component: React.ComponentType<P>, fallback?: ReactNode): React.ComponentType<P>;
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map