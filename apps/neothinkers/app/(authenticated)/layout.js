import { AuthenticatedLayout } from '@neothink/ui';
import { ErrorBoundary } from '@neothink/ui';
export default function NeothinkersAuthenticatedLayout({ children, }) {
    return (<ErrorBoundary>
      <AuthenticatedLayout platform="neothinkers">
        {children}
      </AuthenticatedLayout>
    </ErrorBoundary>);
}
//# sourceMappingURL=layout.js.map