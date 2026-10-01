import { render, screen, act } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    (window as any).fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    ) as jest.Mock;
  });

  test('should render App component', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/Real Estate Listings/i)).toBeInTheDocument();
  });
});
