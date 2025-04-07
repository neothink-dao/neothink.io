import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names and handles Tailwind merging
 * Ensures proper combination of Tailwind classes without conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date using Intl.DateTimeFormat with appropriate options
 * @param date Date to format
 * @param format Format type: "short", "medium", "long", or "relative" 
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number, 
  format: "short" | "medium" | "long" | "relative" = "medium"
): string {
  const dateObj = date instanceof Date ? date : new Date(date)
  
  // For relative time formatting
  if (format === "relative") {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return "just now"
    }
    
    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
    }
    
    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    }
    
    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? "day" : "days"} ago`
    }
  }
  
  // For standard formatting
  const options: Intl.DateTimeFormatOptions = {
    short: { 
      month: "numeric", 
      day: "numeric", 
      year: "2-digit" 
    },
    medium: { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    },
    long: { 
      month: "long", 
      day: "numeric", 
      year: "numeric", 
      hour: "numeric", 
      minute: "numeric" 
    }
  }[format]
  
  return new Intl.DateTimeFormat("en-US", options).format(dateObj)
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 * @param str String to truncate
 * @param length Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str
  return `${str.slice(0, length)}...`
}

/**
 * Safely parses JSON with error handling
 * @param json JSON string to parse
 * @param fallback Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    return fallback
  }
}

/**
 * Creates a debounced version of a function
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
} 