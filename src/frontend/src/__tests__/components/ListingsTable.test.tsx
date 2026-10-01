import { render, screen, fireEvent } from '@testing-library/react';
import { ListingsTable } from '../../components/ListingsTable';
import { Listing } from '../../types/Listing';

describe('ListingsTable', () => {
  const mockListing: Listing = {
    id: '1', source: 'test', address: '123 Main St', city: 'Seattle', state: 'WA', zip: '98052',
    price: 400000, bedrooms: 3, bathrooms: 2, sqft: 2000, latitude: 0, longitude: 0, listedDate: '2026-09-29T10:00:00Z', status: 'Active', description: 'Nice home'
  };

  const defaultProps = {
    currentListings: [mockListing],
    requestSort: jest.fn(),
    sortConfig: null,
    expandedDescriptionId: null,
    setExpandedDescriptionId: jest.fn(),
    formatPrice: (p: number) => p.toString(),
    formatDate: (d: string) => d,
    onOpenFilter: jest.fn(),
  };

  test('should render listings correctly', () => {
    render(<ListingsTable {...defaultProps} />);
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  test('should display "No results" when list is empty', () => {
    render(<ListingsTable {...defaultProps} currentListings={[]} />);
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  test('should call requestSort when column is clicked', () => {
    const requestSort = jest.fn();
    render(<ListingsTable {...defaultProps} requestSort={requestSort} />);
    fireEvent.click(screen.getByText(/Address/i));
    expect(requestSort).toHaveBeenCalledWith('address');
  });
});
