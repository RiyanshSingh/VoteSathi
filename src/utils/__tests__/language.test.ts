import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getBrowserLanguage,
  truncateText,
  formatCurrency,
  isValidVoterId,
  toTitleCase,
  calculateProgress,
  sanitizeInput,
  isEligibleToVote,
  formatIndianDate,
  debounce,
} from '../langUtils';

// ─── getBrowserLanguage ───────────────────────────────────────────────────────
describe('getBrowserLanguage', () => {
  it('should return "en" as a fallback string when language is unavailable', () => {
    const lang = getBrowserLanguage();
    expect(typeof lang).toBe('string');
    expect(lang.length).toBeGreaterThanOrEqual(2);
  });

  it('should return only the language part (no region)', () => {
    const lang = getBrowserLanguage();
    expect(lang).not.toContain('-');
    expect(lang.length).toBeGreaterThanOrEqual(2);
  });
});

// ─── truncateText ─────────────────────────────────────────────────────────────
describe('truncateText', () => {
  it('should truncate and append ellipsis when text exceeds limit', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
  });

  it('should return original text when within limit', () => {
    expect(truncateText('Hi', 10)).toBe('Hi');
  });

  it('should return original text when exactly at limit', () => {
    expect(truncateText('Exact', 5)).toBe('Exact');
  });

  it('should handle empty string', () => {
    expect(truncateText('', 5)).toBe('');
  });
});

// ─── formatCurrency ───────────────────────────────────────────────────────────
describe('formatCurrency', () => {
  it('should format positive numbers as INR', () => {
    expect(formatCurrency(5000)).toMatch(/5,000/);
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toMatch(/0/);
  });

  it('should format large amounts with commas', () => {
    expect(formatCurrency(100000)).toMatch(/1,00,000|100,000/);
  });
});

// ─── isValidVoterId ───────────────────────────────────────────────────────────
describe('isValidVoterId', () => {
  it('should return true for a valid Voter ID', () => {
    expect(isValidVoterId('ABC1234567')).toBe(true);
  });

  it('should return true for lowercase input (auto-uppercase)', () => {
    expect(isValidVoterId('abc1234567')).toBe(true);
  });

  it('should return false for IDs with too few letters', () => {
    expect(isValidVoterId('AB1234567')).toBe(false);
  });

  it('should return false for IDs with too few digits', () => {
    expect(isValidVoterId('ABC123456')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidVoterId('')).toBe(false);
  });

  it('should return false for IDs with special characters', () => {
    expect(isValidVoterId('ABC@234567')).toBe(false);
  });
});

// ─── toTitleCase ──────────────────────────────────────────────────────────────
describe('toTitleCase', () => {
  it('should capitalize the first letter of each word', () => {
    expect(toTitleCase('voter registration')).toBe('Voter Registration');
  });

  it('should handle already-capitalized text', () => {
    expect(toTitleCase('ELECTION COMMISSION')).toBe('Election Commission');
  });

  it('should return empty string for empty input', () => {
    expect(toTitleCase('')).toBe('');
  });

  it('should handle single words', () => {
    expect(toTitleCase('vote')).toBe('Vote');
  });
});

// ─── calculateProgress ───────────────────────────────────────────────────────
describe('calculateProgress', () => {
  it('should return 50 for half-completed steps', () => {
    expect(calculateProgress(5, 10)).toBe(50);
  });

  it('should return 100 for fully completed steps', () => {
    expect(calculateProgress(10, 10)).toBe(100);
  });

  it('should return 0 when nothing is completed', () => {
    expect(calculateProgress(0, 10)).toBe(0);
  });

  it('should return 0 when total is 0 (avoid division by zero)', () => {
    expect(calculateProgress(0, 0)).toBe(0);
  });

  it('should cap at 100 even if completed exceeds total', () => {
    expect(calculateProgress(15, 10)).toBe(100);
  });
});

// ─── sanitizeInput ────────────────────────────────────────────────────────────
describe('sanitizeInput', () => {
  it('should remove HTML tags from input', () => {
    const result = sanitizeInput('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('</script>');
  });

  it('should trim whitespace from ends', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('should keep plain text unchanged', () => {
    expect(sanitizeInput('Voter ID query')).toBe('Voter ID query');
  });

  it('should strip mixed HTML and text', () => {
    expect(sanitizeInput('<b>Vote</b> for India')).toBe('Vote for India');
  });
});

// ─── isEligibleToVote ─────────────────────────────────────────────────────────
describe('isEligibleToVote', () => {
  it('should return true for 18+ year old', () => {
    expect(isEligibleToVote(2000, 2024)).toBe(true);
  });

  it('should return true for exactly 18 years old', () => {
    expect(isEligibleToVote(2006, 2024)).toBe(true);
  });

  it('should return false for under 18', () => {
    expect(isEligibleToVote(2010, 2024)).toBe(false);
  });

  it('should return false for a very recent birth year (underage)', () => {
    expect(isEligibleToVote(2020, 2024)).toBe(false);
  });
});

// ─── formatIndianDate ─────────────────────────────────────────────────────────
describe('formatIndianDate', () => {
  it('should return "Invalid Date" for an invalid string', () => {
    expect(formatIndianDate('not-a-date')).toBe('Invalid Date');
  });

  it('should return a formatted date string for a valid ISO date', () => {
    const result = formatIndianDate('2024-01-01');
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/2024/);
  });
});

// ─── debounce ─────────────────────────────────────────────────────────────────
describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('should only call the function once after the delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should reset the timer on each call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    vi.advanceTimersByTime(100);
    debounced();
    vi.advanceTimersByTime(100);
    debounced();
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
