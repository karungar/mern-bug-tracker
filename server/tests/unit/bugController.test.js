// tests/unit/controllers/bugController.test.js
const asyncHandler = require('express-async-handler');
const { getBugs, getBug, createBug, updateBug, deleteBug } = require('@/controllers/bugController');
const Bug = require('@/models/bugModel');
const User = require('@/models/userModel');

// Mock models
jest.mock('../../models/bugModel');
jest.mock('../../models/userModel');

describe('Bug Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      params: {},
      body: {},
      user: { id: 'user123', role: 'user' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });

  describe('getBugs', () => {
    it('should fetch all bugs with populated user data', async () => {
      const mockBugs = [{ title: 'Bug 1' }, { title: 'Bug 2' }];
      Bug.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockBugs)
      });

      await getBugs(req, res);

      expect(Bug.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBugs);
    });

    it('should handle errors during fetch', async () => {
      Bug.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await getBugs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getBug', () => {
    it('should fetch a single bug by ID', async () => {
      const mockBug = { _id: 'bug123', title: 'Test Bug' };
      req.params.id = 'bug123';
      
      Bug.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockBug)
      });

      await getBug(req, res);

      expect(Bug.findById).toHaveBeenCalledWith('bug123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBug);
    });

    it('should return 404 if bug not found', async () => {
      req.params.id = 'invalidId';
      Bug.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await getBug(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bug not found' });
    });
  });

  describe('createBug', () => {
    it('should create a new bug with valid data', async () => {
      req.body = {
        title: 'New Bug',
        description: 'Test description',
        assignedTo: 'user456'
      };
      
      const mockBug = { 
        _id: 'newBug123', 
        ...req.body,
        reportedBy: req.user.id
      };
      
      Bug.create.mockResolvedValue(mockBug);

      await createBug(req, res);

      expect(Bug.create).toHaveBeenCalledWith({
        title: 'New Bug',
        description: 'Test description',
        status: 'open',
        priority: 'medium',
        reportedBy: 'user123',
        assignedTo: 'user456',
        project: undefined,
        steps: ''
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBug);
    });

    it('should reject creation with missing title', async () => {
      req.body = { description: 'No title' };

      await createBug(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Please add title and description fields' 
      });
    });

    it('should handle database errors', async () => {
      req.body = { title: 'Bug', description: 'Test' };
      Bug.create.mockRejectedValue(new Error('Validation failed'));

      await createBug(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Validation failed' });
    });
  });

  describe('updateBug', () => {
    it('should update bug when user is reporter', async () => {
      req.params.id = 'bug123';
      req.body = { status: 'resolved' };
      
      const existingBug = { 
        _id: 'bug123', 
        title: 'Old Bug',
        reportedBy: 'user123',
        save: jest.fn().mockResolvedValue(true)
      };
      
      Bug.findById.mockResolvedValue(existingBug);
      Bug.findByIdAndUpdate.mockResolvedValue({
        ...existingBug,
        ...req.body
      });

      await updateBug(req, res);

      expect(Bug.findById).toHaveBeenCalledWith('bug123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'resolved'
      }));
    });

    it('should allow admin to update any bug', async () => {
      req.user.role = 'admin';
      req.params.id = 'bug123';
      req.body = { priority: 'high' };
      
      const existingBug = { 
        _id: 'bug123', 
        reportedBy: 'otherUser',
        save: jest.fn().mockResolvedValue(true)
      };
      
      Bug.findById.mockResolvedValue(existingBug);
      
      await updateBug(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should reject unauthorized updates', async () => {
      req.params.id = 'bug123';
      const existingBug = { 
        _id: 'bug123', 
        reportedBy: 'otherUser' 
      };
      
      Bug.findById.mockResolvedValue(existingBug);

      await updateBug(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Not authorized to update this bug' 
      });
    });

    it('should return 404 if bug not found', async () => {
      req.params.id = 'invalidId';
      Bug.findById.mockResolvedValue(null);

      await updateBug(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bug not found' });
    });
  });

  describe('deleteBug', () => {
    it('should delete bug when user is reporter', async () => {
      req.params.id = 'bug123';
      const existingBug = { 
        _id: 'bug123', 
        reportedBy: 'user123',
        deleteOne: jest.fn().mockResolvedValue(true)
      };
      
      Bug.findById.mockResolvedValue(existingBug);

      await deleteBug(req, res);

      expect(existingBug.deleteOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 'bug123' });
    });

    it('should allow admin to delete any bug', async () => {
      req.user.role = 'admin';
      req.params.id = 'bug123';
      const existingBug = { 
        _id: 'bug123', 
        reportedBy: 'otherUser',
        deleteOne: jest.fn().mockResolvedValue(true)
      };
      
      Bug.findById.mockResolvedValue(existingBug);

      await deleteBug(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should reject unauthorized deletion', async () => {
      req.params.id = 'bug123';
      const existingBug = { 
        _id: 'bug123', 
        reportedBy: 'otherUser' 
      };
      
      Bug.findById.mockResolvedValue(existingBug);

      await deleteBug(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Not authorized to delete this bug' 
      });
    });
  });
});