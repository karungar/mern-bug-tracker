import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext';
import BugsPage from '../../../pages/BugsPage';
import BugDetailPage from '../../../pages/BugDetailPage';
import * as bugService from '../../../services/bugService';
import * as authService from '../../../services/authService';

// Mock services
vi.mock('../../../services/bugService', () => ({
  getAllBugs: vi.fn(),
  getBugById: vi.fn(),
  createBug: vi.fn(),
  updateBug: vi.fn(),
  deleteBug: vi.fn(),
}));

vi.mock('../../../services/authService', () => ({
  getCurrentUser: vi.fn(),
}));

// Mock react-router-dom hooks
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: '123' }),
  };
});

describe('Bug Management Flow Integration', () => {
  const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
  const mockBugs = [
    { id: '1', title: 'First Bug', description: 'Description 1', status: 'open', createdBy: mockUser, createdAt: '2023-01-01' },
    { id: '2', title: 'Second Bug', description: 'Description 2', status: 'in-progress', createdBy: mockUser, createdAt: '2023-01-02' },
  ];
  
  beforeEach(() => {
    vi.resetAllMocks();
    authService.getCurrentUser.mockReturnValue(mockUser);
  });

  it('should display list of bugs on BugsPage', async () => {
    bugService.getAllBugs.mockResolvedValueOnce(mockBugs);

    render(
      <BrowserRouter>
        <AuthProvider>
          <BugsPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for bugs to load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Check heading is present
    expect(screen.getByRole('heading', { name: /bugs/i })).toBeInTheDocument();
    
    // Check bug list items
    expect(screen.getByText('First Bug')).toBeInTheDocument();
    expect(screen.getByText('Second Bug')).toBeInTheDocument();
    
    // Check status badges are present
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText('in-progress')).toBeInTheDocument();
  });

  it('should display bug details on BugDetailPage', async () => {
    const mockBug = {
      id: '123',
      title: 'Critical Bug',
      description: 'This is a critical issue',
      status: 'open',
      priority: 'high',
      createdBy: mockUser,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-02',
    };
    
    bugService.getBugById.mockResolvedValueOnce(mockBug);

    render(
      <BrowserRouter>
        <AuthProvider>
          <BugDetailPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for bug details to load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Check bug details are displayed
    expect(screen.getByText('Critical Bug')).toBeInTheDocument();
    expect(screen.getByText('This is a critical issue')).toBeInTheDocument();
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    
    // Check created/updated info
    expect(screen.getByText(/created by/i)).toHaveTextContent('Test User');
    expect(screen.getByText(/created on/i)).toHaveTextContent('2023-01-01');
    expect(screen.getByText(/updated on/i)).toHaveTextContent('2023-01-02');
  });

  it('should handle delete bug operation', async () => {
    const mockBug = {
      id: '123',
      title: 'Bug to Delete',
      description: 'This bug will be deleted',
      status: 'open',
      priority: 'medium',
      createdBy: mockUser,
      createdAt: '2023-01-01',
    };
    
    bugService.getBugById.mockResolvedValueOnce(mockBug);
    bugService.deleteBug.mockResolvedValueOnce({ message: 'Bug deleted successfully' });

    render(
      <BrowserRouter>
        <AuthProvider>
          <BugDetailPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for bug details to load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Find and click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    
    await act(async () => {
      await userEvent.click(deleteButton);
    });

    // Confirm deletion in the dialog
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    
    await act(async () => {
      await userEvent.click(confirmButton);
    });

    // Check if delete service was called with correct ID
    expect(bugService.deleteBug).toHaveBeenCalledWith('123');
  });

  it('should filter bugs by status', async () => {
    bugService.getAllBugs.mockResolvedValueOnce(mockBugs);

    render(
      <BrowserRouter>
        <AuthProvider>
          <BugsPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for bugs to load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Find and click filter dropdown
    const filterDropdown = screen.getByLabelText(/filter by status/i);
    
    await act(async () => {
      await userEvent.click(filterDropdown);
    });

    // Select 'open' option
    const openOption = screen.getByRole('option', { name: /open/i });
    
    await act(async () => {
      await userEvent.click(openOption);
    });

    // Only the 'open' bug should be visible
    expect(screen.getByText('First Bug')).toBeInTheDocument();
    expect(screen.queryByText('Second Bug')).not.toBeInTheDocument();
  });
});