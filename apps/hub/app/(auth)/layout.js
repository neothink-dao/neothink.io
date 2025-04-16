import { AuthLayout } from '@neothink/ui';
import { ErrorBoundary } from '@neothink/ui';
export default function HubAuthLayout({ children, }) {
    return (<ErrorBoundary>
      <AuthLayout platform="hub">
        {children}
      </AuthLayout>
    </ErrorBoundary>);
}
//# sourceMappingURL=layout.js.map