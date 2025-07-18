import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { AuthProvider, useAuth } from '../../../context/AuthContext';
import * as authService from '../../../services/authService';

// Mock the auth context
vi.mock('../../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

// Mock authService
vi.mock('../../../services/authService', () => ({
  logout: vi.fn(),
}));

describe('Navbar Component', () => {
  const mockLogout = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('displays logo and navigation links', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: mockLogout,
    });
    
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    // Logo should be visible
    expect(screen.getByText(/bug tracker/i)).toBeInTheDocument();
    
    // Public links should be visible
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });
  
  it('shows authenticated navigation when user is logged in', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: mockLogout,
    });
    
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    // Authenticated links should be visible
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /bugs/i })).toBeInTheDocument();
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    
    // Public auth links should not be visible
    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /register/i })).not.toBeInTheDocument();
  });
  
  it('calls logout function when logout button is clicked', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: mockLogout,
    });
    
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    
    await userEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
  
  it('toggles mobile menu when hamburger button is clicked', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: mockLogout,
    });
    
    // Use window.innerWidth to simulate mobile viewport
    const originalInnerWidth = window.innerWidth;
    window.innerWidth = 500;
    
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    // Mobile menu should initially be hidden
    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(mobileMenu).toHaveClass('hidden');
    
    // Click hamburger button
    const hamburgerButton = screen.getByLabelText(/toggle menu/i);
    await userEvent.click(hamburgerButton);
    
    // Mobile menu should be visible
    expect(mobileMenu).not.toHaveClass('hidden');
    
    // Click again to hide
    await userEvent.click(hamburgerButton);
    
    // Mobile menu should be hidden again
    expect(mobileMenu).toHaveClass('hidden');
    
    // Restore original window width
    window.innerWidth = originalInnerWidth;
  });
});