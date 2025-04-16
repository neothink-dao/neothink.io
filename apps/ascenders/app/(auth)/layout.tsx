import { AuthLayout } from '@neothink/ui'
import { ErrorBoundary } from '@neothink/ui'

export default function AscendersAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <AuthLayout platform="ascenders">
        {children}
      </AuthLayout>
    </ErrorBoundary>
  )
} 