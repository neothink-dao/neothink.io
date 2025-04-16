import { AuthenticatedLayout } from '@neothink/ui';
import { ErrorBoundary } from '@neothink/ui';
export default function AscendersAuthenticatedLayout({ children, }) {
    return (<ErrorBoundary>
      <AuthenticatedLayout platform="ascenders">
        {children}
      </AuthenticatedLayout>
    </ErrorBoundary>);
}
//# sourceMappingURL=layout.js.map