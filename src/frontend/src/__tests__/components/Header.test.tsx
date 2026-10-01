import { render, screen } from '@testing-library/react';
import { Header } from '../../components/Header';

describe('Header', () => {
  test('should render the title', () => {
    render(<Header />);
    const titleElement = screen.getByText(/Real Estate Listings/i);
    expect(titleElement).toBeInTheDocument();
  });
});
