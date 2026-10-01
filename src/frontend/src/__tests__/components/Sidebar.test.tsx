import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../../components/Sidebar';

describe('Sidebar', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onApplyFilters: jest.fn(),
    minPriceRange: 0,
    maxPriceRange: 1000000,
  };

  test('should render filters correctly', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Target Budget/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Min/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Max/i)).toBeInTheDocument();
    expect(screen.getByText(/City/i)).toBeInTheDocument();
  });

  test('should call onApplyFilters when View is clicked', () => {
    const onApplyFilters = jest.fn();
    render(<Sidebar {...defaultProps} onApplyFilters={onApplyFilters} />);
    
    fireEvent.click(screen.getByText(/View/i));
    expect(onApplyFilters).toHaveBeenCalled();
  });

  test('should call onClose and clear filters when Clear All is clicked', () => {
    const onClose = jest.fn();
    const onApplyFilters = jest.fn();
    render(<Sidebar {...defaultProps} onClose={onClose} onApplyFilters={onApplyFilters} />);
    
    fireEvent.click(screen.getByText(/Clear All/i));
    expect(onApplyFilters).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
