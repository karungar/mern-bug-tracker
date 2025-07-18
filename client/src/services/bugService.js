import api from './api';

// Get all bugs
export const getBugs = async () => {
  const response = await api.get('/bugs');
  return response.data;
};

// Get bug by ID
export const getBugById = async (id) => {
  const response = await api.get(`/bugs/${id}`);
  return response.data;
};

// Create new bug
export const createBug = async (bugData) => {
  const response = await api.post('/bugs', bugData);
  return response.data;
};

// Update bug
export const updateBug = async (id, bugData) => {
  const response = await api.put(`/bugs/${id}`, bugData);
  return response.data;
};

// Delete bug
export const deleteBug = async (id) => {
  const response = await api.delete(`/bugs/${id}`);
  return response.data;
};