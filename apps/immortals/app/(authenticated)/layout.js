import { AuthenticatedLayout } from '@neothink/ui';
import { ErrorBoundary } from '@neothink/ui';
export default function ImmortalsAuthenticatedLayout({ children, }) {
    return (<ErrorBoundary>
      <AuthenticatedLayout platform="immortals">
        {children}
      </AuthenticatedLayout>
    </ErrorBoundary>);
}
//# sourceMappingURL=layout.js.map