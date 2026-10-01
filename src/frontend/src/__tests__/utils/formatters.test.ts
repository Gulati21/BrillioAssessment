import { formatPrice, formatDate } from '../../utils/formatters';

describe('formatters', () => {
  describe('formatPrice', () => {
    test('should format prices correctly', () => {
      expect(formatPrice(500)).toBe('500');
      expect(formatPrice(1500)).toBe('1k');
      expect(formatPrice(450000)).toBe('450k');
      expect(formatPrice(1000000)).toBe('1m');
      expect(formatPrice(1455723)).toBe('1.46m');
    });
  });

  describe('formatDate', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-09-30T16:00:00Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test('should format recent dates correctly', () => {
      expect(formatDate('2026-09-30T15:59:00Z')).toBe('1 minutes ago');
      expect(formatDate('2026-09-30T15:00:00Z')).toBe('1 hours ago');
      expect(formatDate('2026-09-30T10:00:00Z')).toBe('6 hours ago');
    });

    test('should format this week dates correctly', () => {
      // 2026-09-30 is a Wednesday
      expect(formatDate('2026-09-28T10:00:00Z')).toBe('Monday, September 28');
    });

    test('should format older dates correctly', () => {
      expect(formatDate('2026-08-01T10:00:00Z')).toBe('August 1, 2026');
    });
  });
});
