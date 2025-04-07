import { PlatformSlug } from '../types/platform'

export interface ThemeConfig {
  primary: string
  primaryDark: string
  secondary: string
  secondaryDark: string
  accent: string
  background: string
  text: string
  border: string
}

export const platformThemes: Record<PlatformSlug, ThemeConfig> = {
  hub: {
    primary: '#3b82f6',    // Blue
    primaryDark: '#1e40af',
    secondary: '#60a5fa',
    secondaryDark: '#2563eb',
    accent: '#93c5fd',
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb'
  },
  ascenders: {
    primary: '#10b981',    // Green
    primaryDark: '#047857',
    secondary: '#34d399',
    secondaryDark: '#059669',
    accent: '#6ee7b7',
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb'
  },
  neothinkers: {
    primary: '#8b5cf6',    // Purple
    primaryDark: '#6d28d9',
    secondary: '#a78bfa',
    secondaryDark: '#7c3aed',
    accent: '#c4b5fd',
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb'
  },
  immortals: {
    primary: '#f97316',    // Orange
    primaryDark: '#c2410c',
    secondary: '#fb923c',
    secondaryDark: '#ea580c',
    accent: '#fdba74',
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb'
  }
} 