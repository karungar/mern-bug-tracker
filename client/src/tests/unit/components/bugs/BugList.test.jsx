import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import BugList from '../../../../components/bugs/BugList';

describe('BugList Component', () => {
  const mockBugs = [
    {
      id: '1',
      title: 'First Bug',
      description: 'Description of the first bug',
      status: 'open',
      priority: 'high',
      createdAt: '2023-01-01T10:00:00Z',
      createdBy: { name: 'User One' }
    },
    {
      id: '2',
      title: 'Second Bug',
      description: 'Description of the second bug',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2023-01-02T11:00:00Z',
      createdBy: { name: 'User Two' }
    },
    {
      id: '3',
      title: 'Third Bug',
      description: 'Description of the third bug',
      status: 'closed',
      priority: 'low',
      createdAt: '2023-01-03T12:00:00Z',
      createdBy: { name: 'User One' }
    }
  ];
  
  const mockOnFilter = vi.fn();
  
  it('renders a list of bugs', () => {
    render(
      <BrowserRouter>
        <BugList bugs={mockBugs} onFilter={mockOnFilter} />
      </BrowserRouter>
    );
    
    // Check that all bugs are rendered
    expect(screen.getByText('First Bug')).toBeInTheDocument();
    expect(screen.getByText('Second Bug')).toBeInTheDocument();
    expect(screen.getByText('Third Bug')).toBeInTheDocument();
    
    // Check status badges
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText('in-progress')).toBeInTheDocument();
    expect(screen.getByText('closed')).toBeInTheDocument();
    
    // Check priority indicators
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();
    
    // Check creator names
    expect(screen.getAllByText('User One')).toHaveLength(2);
    expect(screen.getByText('User Two')).toBeInTheDocument();
  });
  
  it('links to bug details page', () => {
    render(
      <BrowserRouter>
        <BugList bugs={mockBugs} onFilter={mockOnFilter} />
      </BrowserRouter>
    );
    
    // Get all bug cards
    const bugCards = screen.getAllByTestId('bug-card');
    
    // Check that each card links to the correct bug detail page
    for (let i = 0; i < bugCards.length; i++) {
      const bugId = mockBugs[i].id;
      const link = within(bugCards[i]).getByRole('link');
      expect(link).toHaveAttribute('href', expect.stringContaining(`/bugs/${bugId}`));
    }
  });
  
  it('shows empty state when no bugs are provided', () => {
    render(
      <BrowserRouter>
        <BugList bugs={[]} onFilter={mockOnFilter} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/no bugs found/i)).toBeInTheDocument();
  });
  
  it('handles filtering by status', async () => {
    render(
      <BrowserRouter>
        <BugList bugs={mockBugs} onFilter={mockOnFilter} />
      </BrowserRouter>
    );
    
    // Find and click status filter dropdown
    const filterDropdown = screen.getByLabelText(/filter by status/i);
    await userEvent.click(filterDropdown);
    
    // Select 'open' status
    const openOption = screen.getByRole('option', { name: /open/i });
    await userEvent.click(openOption);
    
    // Check if onFilter was called with correct value
    expect(mockOnFilter).toHaveBeenCalledWith('status', 'open');
  });
  
  it('handles sorting by different fields', async () => {
    const mockOnSort = vi.fn();
    
    render(
      <BrowserRouter>
        <BugList bugs={mockBugs} onFilter={mockOnFilter} onSort={mockOnSort} />
      </BrowserRouter>
    );
    
    // Find and click sort dropdown
    const sortDropdown = screen.getByLabelText(/sort by/i);
    await userEvent.click(sortDropdown);
    
    // Select 'priority' option
    const priorityOption = screen.getByRole('option', { name: /priority/i });
    await userEvent.click(priorityOption);
    
    // Check if onSort was called with correct value
    expect(mockOnSort).toHaveBeenCalledWith('priority');
  });
  
  it('formats dates correctly', () => {
    render(
      <BrowserRouter>
        <BugList bugs={mockBugs} onFilter={mockOnFilter} />
      </BrowserRouter>
    );
    
    // Check if dates are formatted correctly (would show as Jan 1, 2023 format)
    const dateElements = screen.getAllByTestId('bug-date');
    expect(dateElements[0]).toHaveTextContent(/jan 1, 2023/i);
    expect(dateElements[1]).toHaveTextContent(/jan 2, 2023/i);
    expect(dateElements[2]).toHaveTextContent(/jan 3, 2023/i);
  });
});