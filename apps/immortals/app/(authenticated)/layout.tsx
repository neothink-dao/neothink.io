import { AuthenticatedLayout } from '@neothink/ui'
import { ErrorBoundary } from '@neothink/ui'

export default function ImmortalsAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <AuthenticatedLayout platform="immortals">
        {children}
      </AuthenticatedLayout>
    </ErrorBoundary>
  )
} 