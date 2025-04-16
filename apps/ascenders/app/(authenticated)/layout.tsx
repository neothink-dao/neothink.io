import { AuthenticatedLayout } from '@neothink/ui'
import { ErrorBoundary } from '@neothink/ui'

export default function AscendersAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <AuthenticatedLayout platform="ascenders">
        {children}
      </AuthenticatedLayout>
    </ErrorBoundary>
  )
} 