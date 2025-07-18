import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../../components/Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary-600'); // default primary style
    expect(button).not.toBeDisabled();
  });
  
  it('renders with primary variant styling', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button', { name: /primary button/i });
    
    expect(button).toHaveClass('bg-primary-600');
    expect(button).toHaveClass('hover:bg-primary-700');
  });
  
  it('renders with secondary variant styling', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button', { name: /secondary button/i });
    
    expect(button).toHaveClass('bg-secondary-600');
    expect(button).toHaveClass('hover:bg-secondary-700');
  });
  
  it('renders with danger variant styling', () => {
    render(<Button variant="danger">Danger Button</Button>);
    const button = screen.getByRole('button', { name: /danger button/i });
    
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('hover:bg-red-700');
  });
  
  it('renders as disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });
  
  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onClick handler when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    await userEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('renders with custom className', () => {
    render(<Button className="test-class">Custom Button</Button>);
    const button = screen.getByRole('button', { name: /custom button/i });
    
    expect(button).toHaveClass('test-class');
  });
  
  it('passes through additional props', () => {
    render(<Button data-testid="test-button">Test Props</Button>);
    const button = screen.getByRole('button', { name: /test props/i });
    
    expect(button).toHaveAttribute('data-testid', 'test-button');
  });
});