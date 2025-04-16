import { AuthLayout } from '@neothink/ui';
import { ErrorBoundary } from '@neothink/ui';
export default function AscendersAuthLayout({ children, }) {
    return (<ErrorBoundary>
      <AuthLayout platform="ascenders">
        {children}
      </AuthLayout>
    </ErrorBoundary>);
}
//# sourceMappingURL=layout.js.map