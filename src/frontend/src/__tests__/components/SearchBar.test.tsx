import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../../components/SearchBar';

describe('SearchBar', () => {
  test('should call onSearchChange when input changes', () => {
    const onSearchChange = jest.fn();
    render(<SearchBar searchQuery="" onSearchChange={onSearchChange} />);
    
    const inputElement = screen.getByPlaceholderText(/Search description.../i);
    fireEvent.change(inputElement, { target: { value: 'test' } });
    
    expect(onSearchChange).toHaveBeenCalledWith('test');
  });
});
