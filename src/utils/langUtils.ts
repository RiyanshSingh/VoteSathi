/**
 * Utility functions for language and localization
 */

export const getBrowserLanguage = (): string => {
  return typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en';
};

export const formatCurrency = (amount: number, locale: string = 'en-IN'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
