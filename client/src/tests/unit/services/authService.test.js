import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from '../../../services/authService';
import api from '../../../services/api';

// Mock the API module
vi.mock('../../../services/api', () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
    }
  };
});

// Mock local storage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key],
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Auth Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });
  
  describe('login', () => {
    it('should login successfully and store token', async () => {
      const mockResponse = { 
        data: { 
          token: 'test-token',
          user: { id: '1', name: 'Test User', email: 'test@example.com' }
        } 
      };
      api.post.mockResolvedValueOnce(mockResponse);
      
      const credentials = { email: 'test@example.com', password: 'password123' };
      const result = await authService.login(credentials);
      
      expect(api.post).toHaveBeenCalledWith('/api/users/login', credentials);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('authToken')).toBe('test-token');
      expect(localStorage.getItem('userData')).toBe(JSON.stringify(mockResponse.data.user));
    });
    
    it('should throw an error if login fails', async () => {
      const errorMessage = 'Invalid credentials';
      api.post.mockRejectedValueOnce(new Error(errorMessage));
      
      const credentials = { email: 'test@example.com', password: 'wrong-password' };
      
      await expect(authService.login(credentials)).rejects.toThrow(errorMessage);
      expect(localStorage.getItem('authToken')).toBe(null);
      expect(localStorage.getItem('userData')).toBe(null);
    });
  });
  
  describe('register', () => {
    it('should register successfully and store token', async () => {
      const mockResponse = { 
        data: { 
          token: 'test-token',
          user: { id: '1', name: 'New User', email: 'new@example.com' }
        } 
      };
      api.post.mockResolvedValueOnce(mockResponse);
      
      const userData = { 
        name: 'New User', 
        email: 'new@example.com', 
        password: 'password123' 
      };
      const result = await authService.register(userData);
      
      expect(api.post).toHaveBeenCalledWith('/api/users/register', userData);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('authToken')).toBe('test-token');
      expect(localStorage.getItem('userData')).toBe(JSON.stringify(mockResponse.data.user));
    });
  });
  
  describe('logout', () => {
    it('should clear localStorage when logging out', () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('userData', JSON.stringify({ id: '1' }));
      
      authService.logout();
      
      expect(localStorage.getItem('authToken')).toBe(null);
      expect(localStorage.getItem('userData')).toBe(null);
    });
  });
  
  describe('getCurrentUser', () => {
    it('should return user data if stored in localStorage', () => {
      const userData = { id: '1', name: 'Test User' };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      const result = authService.getCurrentUser();
      
      expect(result).toEqual(userData);
    });
    
    it('should return null if no user data in localStorage', () => {
      const result = authService.getCurrentUser();
      expect(result).toBeNull();
    });
  });
});