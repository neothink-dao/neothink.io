import { AuthLayout } from '@neothink/ui';
import { ErrorBoundary } from '@neothink/ui';
export default function ImmortalsAuthLayout({ children, }) {
    return (<ErrorBoundary>
      <AuthLayout platform="immortals">
        {children}
      </AuthLayout>
    </ErrorBoundary>);
}
//# sourceMappingURL=layout.js.map