import React from 'react'
import { useTheme } from '../context/theme-context'

export function PlatformIndicator() {
  const { theme, platformSlug } = useTheme()
  
  return (
    <div 
      style={{ 
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        backgroundColor: theme.primary,
        color: 'white',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      Running on {platformSlug.toUpperCase()}
    </div>
  )
} 