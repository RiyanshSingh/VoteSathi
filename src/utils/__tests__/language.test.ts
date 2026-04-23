import { describe, it, expect } from 'vitest';
import { truncateText, formatCurrency } from '../langUtils';

describe('Language Utilities', () => {
  describe('truncateText', () => {
    it('should truncate text longer than the specified length', () => {
      const text = 'This is a long sentence about elections in India.';
      const truncated = truncateText(text, 10);
      expect(truncated).toBe('This is a ...');
      expect(truncated.length).toBe(13); // 10 + '...'
    });

    it('should not truncate text shorter than or equal to the specified length', () => {
      const text = 'Short text';
      const truncated = truncateText(text, 20);
      expect(truncated).toBe(text);
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers as INR currency', () => {
      const amount = 5000;
      const formatted = formatCurrency(amount);
      // Using a regex to match the currency symbol which can vary in different environments
      expect(formatted).toMatch(/₹?\s?5,000/);
    });
  });
});
