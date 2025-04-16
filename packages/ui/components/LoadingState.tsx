interface LoadingStateProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingState({ message = 'Loading...', fullScreen = false }: LoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      <p className="text-gray-500">{message}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
        {content}
      </div>
    )
  }

  return (
    <div className="py-12 flex items-center justify-center">
      {content}
    </div>
  )
} 