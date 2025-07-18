const request = require('supertest');
const express = require('express');
const bugRoutes = require('@/routes/bugRoutes');
const {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
} = require('@/controllers/bugController');
const { protect } = require('@/middleware/authMiddleware');

// Mock auth middleware and controller methods
jest.mock('@/middleware/authMiddleware');
jest.mock('@/controllers/bugController');

// Create test app with bug routes
const app = express();
app.use(express.json());
app.use('/bugs', bugRoutes);

describe('Bug Routes', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    authMiddleware.protect.mockImplementation((req, res, next) => next());
  });

  describe('GET /bugs', () => {
    it('should require authentication', async () => {
      authMiddleware.protect.mockImplementationOnce((req, res) => 
        res.status(401).json({ message: 'Not authorized' })
      );

      const response = await request(app).get('/bugs');
      expect(response.status).toBe(401);
      expect(bugController.getBugs).not.toHaveBeenCalled();
    });

    it('should call getBugs when authenticated', async () => {
      await request(app).get('/bugs');
      expect(bugController.getBugs).toHaveBeenCalled();
    });
  });

  describe('POST /bugs', () => {
    it('should require authentication', async () => {
      authMiddleware.protect.mockImplementationOnce((req, res) => 
        res.status(401).json({ message: 'Not authorized' })
      );

      const response = await request(app).post('/bugs');
      expect(response.status).toBe(401);
      expect(bugController.createBug).not.toHaveBeenCalled();
    });

    it('should call createBug when authenticated', async () => {
      const newBug = { title: 'Test Bug', description: 'Test description' };
      await request(app).post('/bugs').send(newBug);
      expect(bugController.createBug).toHaveBeenCalled();
    });
  });

  describe('GET /bugs/:id', () => {
    it('should require authentication', async () => {
      authMiddleware.protect.mockImplementationOnce((req, res) => 
        res.status(401).json({ message: 'Not authorized' })
      );

      const response = await request(app).get('/bugs/123');
      expect(response.status).toBe(401);
      expect(bugController.getBug).not.toHaveBeenCalled();
    });

    it('should call getBug when authenticated', async () => {
      await request(app).get('/bugs/123');
      expect(bugController.getBug).toHaveBeenCalled();
    });
  });

  describe('PUT /bugs/:id', () => {
    it('should require authentication', async () => {
      authMiddleware.protect.mockImplementationOnce((req, res) => 
        res.status(401).json({ message: 'Not authorized' })
      );

      const response = await request(app).put('/bugs/123');
      expect(response.status).toBe(401);
      expect(bugController.updateBug).not.toHaveBeenCalled();
    });

    it('should call updateBug when authenticated', async () => {
      const updatedData = { status: 'fixed' };
      await request(app).put('/bugs/123').send(updatedData);
      expect(bugController.updateBug).toHaveBeenCalled();
    });
  });

  describe('DELETE /bugs/:id', () => {
    it('should require authentication', async () => {
      authMiddleware.protect.mockImplementationOnce((req, res) => 
        res.status(401).json({ message: 'Not authorized' })
      );

      const response = await request(app).delete('/bugs/123');
      expect(response.status).toBe(401);
      expect(bugController.deleteBug).not.toHaveBeenCalled();
    });

    it('should call deleteBug when authenticated', async () => {
      await request(app).delete('/bugs/123');
      expect(bugController.deleteBug).toHaveBeenCalled();
    });
  });
});