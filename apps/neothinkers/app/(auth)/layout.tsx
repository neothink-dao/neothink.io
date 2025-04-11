import { AuthLayout } from '@neothink/ui'
import { ErrorBoundary } from '@neothink/ui'

export default function NeothinkersAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <AuthLayout platform="neothinkers">
        {children}
      </AuthLayout>
    </ErrorBoundary>
  )
} 