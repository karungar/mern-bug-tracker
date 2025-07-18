import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from '../../../components/FormInput';

describe('FormInput Component', () => {
  it('renders with label and input', () => {
    render(
      <FormInput
        label="Username"
        name="username"
        type="text"
      />
    );
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
  
  it('renders with placeholder', () => {
    render(
      <FormInput
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
      />
    );
    
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
  });
  
  it('handles value changes', async () => {
    const handleChange = vi.fn();
    render(
      <FormInput
        label="Name"
        name="name"
        type="text"
        onChange={handleChange}
      />
    );
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'John Doe');
    
    expect(handleChange).toHaveBeenCalled();
  });
  
  it('displays error message when provided', () => {
    render(
      <FormInput
        label="Password"
        name="password"
        type="password"
        error="Password is required"
      />
    );
    
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toHaveClass('text-red-500');
  });
  
  it('applies error styles to input when error is provided', () => {
    render(
      <FormInput
        label="Password"
        name="password"
        type="password"
        error="Password is required"
      />
    );
    
    const input = screen.getByLabelText(/password/i);
    expect(input).toHaveClass('border-red-500');
  });
  
  it('marks input as required when required prop is true', () => {
    render(
      <FormInput
        label="Username"
        name="username"
        type="text"
        required
      />
    );
    
    const input = screen.getByLabelText(/username/i);
    expect(input).toHaveAttribute('required');
  });
  
  it('disables input when disabled prop is true', () => {
    render(
      <FormInput
        label="Username"
        name="username"
        type="text"
        disabled
      />
    );
    
    const input = screen.getByLabelText(/username/i);
    expect(input).toBeDisabled();
  });
  
  it('renders textarea when type is textarea', () => {
    render(
      <FormInput
        label="Description"
        name="description"
        type="textarea"
      />
    );
    
    expect(screen.getByRole('textbox')).toHaveProperty('tagName', 'TEXTAREA');
  });
  
  it('passes additional props to input element', () => {
    render(
      <FormInput
        label="Age"
        name="age"
        type="number"
        min={18}
        max={100}
      />
    );
    
    const input = screen.getByLabelText(/age/i);
    expect(input).toHaveAttribute('min', '18');
    expect(input).toHaveAttribute('max', '100');
  });
});