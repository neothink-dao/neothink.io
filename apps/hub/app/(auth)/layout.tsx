import { AuthLayout } from '@neothink/ui'
import { ErrorBoundary } from '@neothink/ui'

export default function HubAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <AuthLayout platform="hub">
        {children}
      </AuthLayout>
    </ErrorBoundary>
  )
} 