import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Set global environment variables
process.env.REACT_APP_API_BASE_URL = 'http://localhost:5000/api';
process.env.REACT_APP_ENV = 'test';

// Configure test timeout
jest.setTimeout(15000);

// Add missing browser globals for Node environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};

// Configure Testing Library
configure({
  testIdAttribute: 'data-test',
  asyncUtilTimeout: 4000,
});

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

global.localStorage = localStorageMock;

// Mock sessionStorage
global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock API calls
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}));

// Mock authentication context
jest.mock('./contexts/authContext', () => ({
  useAuth: jest.fn(() => ({
    user: { id: 'test-user', name: 'Test User', token: 'test-token' },
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  })),
}));

// Global test utilities
global.renderWithProviders = (ui, { preloadedState = {}, ...options } = {}) => {
  const AllProviders = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
  
  return render(ui, { wrapper: AllProviders, ...options });
};

global.generateTestBug = (overrides = {}) => ({
  _id: faker.datatype.uuid(),
  title: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  status: 'open',
  priority: 'medium',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Cleanup after tests
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});