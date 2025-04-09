import React from 'react';
import { render, screen, fireEvent } from '@neothink/testing';
import { Button } from '../../src/components/Button';

/**
 * Tests for the Button component
 * 
 * @see DEVELOPMENT.md - Testing with packages/testing
 */
describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies the default variant class', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByText('Default Button');
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('hover:bg-blue-700');
  });

  it('applies the outline variant class', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByText('Outline Button');
    expect(button).toHaveClass('border-blue-600');
    expect(button).toHaveClass('text-blue-600');
    expect(button).not.toHaveClass('bg-blue-600');
  });

  it('applies the ghost variant class', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByText('Ghost Button');
    expect(button).toHaveClass('hover:bg-blue-100');
    expect(button).toHaveClass('text-blue-600');
    expect(button).not.toHaveClass('bg-blue-600');
  });

  it('applies the correct size class', () => {
    render(<Button size="sm">Small Button</Button>);
    expect(screen.getByText('Small Button')).toHaveClass('py-1');
    
    render(<Button size="lg">Large Button</Button>);
    expect(screen.getByText('Large Button')).toHaveClass('py-3');
  });

  it('calls the onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    
    fireEvent.click(screen.getByText('Clickable Button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );
    
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders as an anchor tag when href is provided', () => {
    render(<Button href="/test">Link Button</Button>);
    
    const link = screen.getByText('Link Button');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('passes through additional props to the button element', () => {
    render(
      <Button data-testid="custom-button" aria-label="Test Button">
        Custom Props
      </Button>
    );
    
    const button = screen.getByText('Custom Props');
    expect(button).toHaveAttribute('data-testid', 'custom-button');
    expect(button).toHaveAttribute('aria-label', 'Test Button');
  });
}); 