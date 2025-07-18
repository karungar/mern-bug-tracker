import api from './api';

// Register user
export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await api.post('/users/login', userData);
  return response.data;
};

// Get user profile
export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Update user profile
export const updateProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};