import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as bugService from '../../../services/bugService';
import api from '../../../services/api';

// Mock the API module
vi.mock('../../../services/api', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    }
  };
});

describe('Bug Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  describe('getAllBugs', () => {
    it('should fetch all bugs', async () => {
      const mockBugs = [
        { id: '1', title: 'Bug 1', description: 'Description 1', status: 'open' },
        { id: '2', title: 'Bug 2', description: 'Description 2', status: 'in-progress' }
      ];
      api.get.mockResolvedValueOnce({ data: mockBugs });
      
      const result = await bugService.getAllBugs();
      
      expect(api.get).toHaveBeenCalledWith('/api/bugs');
      expect(result).toEqual(mockBugs);
    });
  });
  
  describe('getBugById', () => {
    it('should fetch a bug by id', async () => {
      const bugId = '1';
      const mockBug = { id: bugId, title: 'Bug 1', description: 'Description 1', status: 'open' };
      api.get.mockResolvedValueOnce({ data: mockBug });
      
      const result = await bugService.getBugById(bugId);
      
      expect(api.get).toHaveBeenCalledWith(`/api/bugs/${bugId}`);
      expect(result).toEqual(mockBug);
    });
  });
  
  describe('createBug', () => {
    it('should create a new bug', async () => {
      const newBug = { title: 'New Bug', description: 'New Description', status: 'open' };
      const mockResponse = { id: '3', ...newBug };
      api.post.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await bugService.createBug(newBug);
      
      expect(api.post).toHaveBeenCalledWith('/api/bugs', newBug);
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('updateBug', () => {
    it('should update a bug', async () => {
      const bugId = '1';
      const updatedBug = { title: 'Updated Bug', description: 'Updated Description', status: 'closed' };
      const mockResponse = { id: bugId, ...updatedBug };
      api.put.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await bugService.updateBug(bugId, updatedBug);
      
      expect(api.put).toHaveBeenCalledWith(`/api/bugs/${bugId}`, updatedBug);
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('deleteBug', () => {
    it('should delete a bug', async () => {
      const bugId = '1';
      const mockResponse = { message: 'Bug deleted' };
      api.delete.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await bugService.deleteBug(bugId);
      
      expect(api.delete).toHaveBeenCalledWith(`/api/bugs/${bugId}`);
      expect(result).toEqual(mockResponse);
    });
  });
});