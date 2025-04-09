import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class values and resolves Tailwind class conflicts
 * Uses clsx for conditional class inclusion and tailwind-merge to properly handle
 * Tailwind CSS class conflicts (e.g., merging bg-blue-500 and bg-red-500)
 * 
 * @param inputs Class values to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export default cn; 