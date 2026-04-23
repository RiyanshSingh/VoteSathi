import { describe, it, expect } from 'vitest';
import { dedupeCanonicalSteps } from '../../lib/contentLocalization';
import type { Step } from '../../data/mockData';

describe('Content Localization Utilities', () => {
  describe('dedupeCanonicalSteps', () => {
    it('should remove duplicate steps by ID', () => {
      const mockSteps: Step[] = [
        { id: '1', stepNumber: 1, topicId: 't1', title: 'Step 1', description: 'Desc 1', titleKey: 'tk1', descriptionKey: 'dk1' },
        { id: '2', stepNumber: 2, topicId: 't1', title: 'Step 2', description: 'Desc 2', titleKey: 'tk2', descriptionKey: 'dk2' },
        { id: '1', stepNumber: 1, topicId: 't1', title: 'Step 1 Duplicate', description: 'Desc 1', titleKey: 'tk1', descriptionKey: 'dk1' },
      ];
      
      const deduped = dedupeCanonicalSteps(mockSteps);
      expect(deduped).toHaveLength(2);
      expect(deduped[0].title).toBe('Step 1');
    });

    it('should return empty array if input is empty', () => {
      expect(dedupeCanonicalSteps([])).toHaveLength(0);
    });
  });
});
