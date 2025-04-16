import { AuthLayout } from '@neothink/ui';
import { ErrorBoundary } from '@neothink/ui';
export default function NeothinkersAuthLayout({ children, }) {
    return (<ErrorBoundary>
      <AuthLayout platform="neothinkers">
        {children}
      </AuthLayout>
    </ErrorBoundary>);
}
//# sourceMappingURL=layout.js.map