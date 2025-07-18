import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../../context/AuthContext';
import * as authService from '../../../services/authService';

// Mock authService
vi.mock('../../../services/authService', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
}));

// Create a test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      {user && (
        <div data-testid="user-info">
          {user.name} - {user.email}
        </div>
      )}
      <button onClick={() => login({ email: 'test@example.com', password: 'password123' })}>
        Login
      </button>
      <button onClick={() => register({ name: 'New User', email: 'new@example.com', password: 'password123' })}>
        Register
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('provides initial auth state correctly', () => {
    authService.getCurrentUser.mockReturnValueOnce(null);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
  });
  
  it('loads user from localStorage on initial render', () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    authService.getCurrentUser.mockReturnValueOnce(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('Test User - test@example.com');
  });
  
  it('handles login successfully', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    authService.getCurrentUser.mockReturnValueOnce(null);
    authService.login.mockResolvedValueOnce({ user: mockUser, token: 'test-token' });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /login/i }));
    });
    
    expect(authService.login).toHaveBeenCalledWith({ 
      email: 'test@example.com', 
      password: 'password123' 
    });
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('Test User - test@example.com');
  });
  
  it('handles registration successfully', async () => {
    const mockUser = { id: '1', name: 'New User', email: 'new@example.com' };
    authService.getCurrentUser.mockReturnValueOnce(null);
    authService.register.mockResolvedValueOnce({ user: mockUser, token: 'test-token' });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /register/i }));
    });
    
    expect(authService.register).toHaveBeenCalledWith({ 
      name: 'New User',
      email: 'new@example.com', 
      password: 'password123' 
    });
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('New User - new@example.com');
  });
  
  it('handles logout correctly', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    authService.getCurrentUser.mockReturnValueOnce(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /logout/i }));
    });
    
    expect(authService.logout).toHaveBeenCalled();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
  });
  
  it('handles login errors', async () => {
    authService.getCurrentUser.mockReturnValueOnce(null);
    authService.login.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /login/i }));
    });
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});