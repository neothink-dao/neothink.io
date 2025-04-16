import { AuthLayout } from '@neothink/ui'
import { ErrorBoundary } from '@neothink/ui'

export default function ImmortalsAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <AuthLayout platform="immortals">
        {children}
      </AuthLayout>
    </ErrorBoundary>
  )
} 