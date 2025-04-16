import { Component } from 'react';
export class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    render() {
        var _a;
        if (this.state.hasError) {
            return this.props.fallback || (<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {((_a = this.state.error) === null || _a === void 0 ? void 0 : _a.message) || 'An unexpected error occurred'}
              </p>
              <div className="mt-6 text-center">
                <button onClick={() => window.location.reload()} className="text-black hover:text-gray-800">
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>);
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map