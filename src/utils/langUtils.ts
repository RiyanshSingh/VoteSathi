/**
 * Utility functions for language, localization, and election data processing.
 * @module langUtils
 */

/**
 * Gets the user's browser language code.
 * @returns ISO 639-1 language code (e.g., 'en', 'hi')
 */
export const getBrowserLanguage = (): string => {
  return typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en';
};

/**
 * Formats a number as Indian Rupee currency.
 * @param amount - The numeric value to format
 * @param locale - The locale to use (default: en-IN)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, locale: string = 'en-IN'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Truncates a string to a given length, appending '...' if truncated.
 * @param text - The input string
 * @param length - Maximum character length before truncation
 * @returns Truncated string with ellipsis if applicable
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Validates whether a string is a valid Indian Voter ID format.
 * Format: 3 uppercase letters followed by 7 digits (e.g., ABC1234567)
 * @param voterId - The voter ID string to validate
 * @returns True if valid, false otherwise
 */
export const isValidVoterId = (voterId: string): boolean => {
  const voterIdRegex = /^[A-Z]{3}[0-9]{7}$/;
  return voterIdRegex.test(voterId.trim().toUpperCase());
};

/**
 * Capitalizes the first letter of each word in a string.
 * @param text - Input string
 * @returns Title-cased string
 */
export const toTitleCase = (text: string): string => {
  if (!text) return '';
  return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Calculates the percentage completion of learning steps.
 * @param completed - Number of completed steps
 * @param total - Total number of steps
 * @returns Percentage as a number between 0 and 100
 */
export const calculateProgress = (completed: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((completed / total) * 100));
};

/**
 * Sanitizes user input to prevent XSS by removing HTML tags.
 * @param input - Raw user input string
 * @returns Sanitized string with HTML tags removed
 */
export const sanitizeInput = (input: string): string => {
  return input.replace(/<[^>]*>/g, '').trim();
};

/**
 * Checks if a user meets the minimum voting age requirement in India (18+).
 * @param birthYear - The user's year of birth
 * @param currentYear - The current year (defaults to actual current year)
 * @returns True if user is 18 or older
 */
export const isEligibleToVote = (birthYear: number, currentYear: number = new Date().getFullYear()): boolean => {
  return (currentYear - birthYear) >= 18;
};

/**
 * Formats a date string to a human-readable Indian date format.
 * @param dateStr - ISO date string
 * @returns Formatted date string (e.g., "1 Jan 2024")
 */
export const formatIndianDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * Debounces a function call to prevent excessive API calls during search.
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
