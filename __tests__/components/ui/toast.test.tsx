import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Toast } from '@/lib/ui/toast'

describe('Toast Component', () => {
  it('renders toast message correctly', () => {
    render(<Toast message="Test message" type="success" />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('applies correct styling based on type', () => {
    const { container } = render(<Toast message="Test message" type="error" />)
    expect(container.firstChild).toHaveClass('bg-red-500')
  })
}) 