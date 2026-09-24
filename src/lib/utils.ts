import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Returns merged tailwind classes
 *
 * @param inputs - array of tailwind classes
 * @returns {string} merged tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
