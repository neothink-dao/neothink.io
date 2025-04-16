import { AuthenticatedLayout, ErrorBoundary } from '@neothink/ui';
import { Suspense } from 'react';
export default function HubAuthenticatedLayout({ children, }) {
    return (<ErrorBoundary>
      <AuthenticatedLayout platform="hub">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </AuthenticatedLayout>
    </ErrorBoundary>);
}
//# sourceMappingURL=layout.js.map