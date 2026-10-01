import { calculateRelevancyScore, requestSort } from '../../utils/sortUtils';
import { Listing } from '../../types/Listing';

describe('sortUtils', () => {
  describe('calculateRelevancyScore', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-09-30T16:00:00Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test('should calculate correct relevancy score', () => {
      const listing: Listing = {
        id: '1', source: 'test', address: '123 Main St', city: 'Seattle', state: 'WA', zip: '98052',
        price: 400000, bedrooms: 3, bathrooms: 2, sqft: 2000, latitude: 0, longitude: 0, listedDate: '2026-09-29T10:00:00Z', status: 'Active', description: 'Nice home'
      };
      
      const score = calculateRelevancyScore(listing, 400000);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('requestSort', () => {
    test('should set correct sort config', () => {
      const setSortConfig = jest.fn();
      
      requestSort('price', { key: 'price', direction: 'asc' }, setSortConfig);
      expect(setSortConfig).toHaveBeenCalledWith({ key: 'price', direction: 'desc' });
      
      requestSort('relevancy', { key: 'price', direction: 'asc' }, setSortConfig);
      expect(setSortConfig).toHaveBeenCalledWith({ key: 'relevancy', direction: 'desc' });
    });
  });
});
