import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('generic');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    const customText = 'Carregando dados...';
    render(<LoadingSpinner text={customText} showText />);
    
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it('should not show text when showText is false', () => {
    render(<LoadingSpinner text="Test text" showText={false} />);
    
    expect(screen.queryByText('Test text')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const customClass = 'custom-spinner-class';
    render(<LoadingSpinner className={customClass} />);
    
    const spinner = screen.getByRole('generic');
    expect(spinner).toHaveClass(customClass);
  });

  it('should render different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let spinner = screen.getByRole('generic');
    expect(spinner.querySelector('div')).toHaveClass('h-4', 'w-4');

    rerender(<LoadingSpinner size="lg" />);
    spinner = screen.getByRole('generic');
    expect(spinner.querySelector('div')).toHaveClass('h-12', 'w-12');
  });
});
