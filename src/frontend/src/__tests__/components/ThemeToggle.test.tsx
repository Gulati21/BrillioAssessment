import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../../components/ThemeToggle';

describe('ThemeToggle', () => {
  test('should call onToggle when clicked', () => {
    const onToggle = jest.fn();
    render(<ThemeToggle isDarkMode={true} onToggle={onToggle} />);
    
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
