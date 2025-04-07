import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar'
import { HomeIcon } from 'lucide-react'

describe('Sidebar Component', () => {
  const mockNavItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      isActive: true,
    },
  ]

  it('renders sidebar with all sections', () => {
    render(
      <Sidebar>
        <SidebarHeader>Header</SidebarHeader>
        <SidebarContent>Content</SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
      </Sidebar>
    )

    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('handles collapsible state', () => {
    render(
      <Sidebar collapsible="icon">
        <SidebarContent>Content</SidebarContent>
      </Sidebar>
    )

    const sidebar = screen.getByRole('complementary')
    expect(sidebar).toHaveAttribute('data-collapsible', 'icon')
  })

  it('applies custom className', () => {
    render(
      <Sidebar className="custom-class">
        <SidebarContent>Content</SidebarContent>
      </Sidebar>
    )

    const sidebar = screen.getByRole('complementary')
    expect(sidebar).toHaveClass('custom-class')
  })
}) 