import { AuthenticatedLayout, ErrorBoundary } from '@neothink/ui'
import { Suspense } from 'react'

export default function HubAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <AuthenticatedLayout platform="hub">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </AuthenticatedLayout>
    </ErrorBoundary>
  )
} 