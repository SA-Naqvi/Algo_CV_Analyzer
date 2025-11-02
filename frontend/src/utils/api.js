import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchDocuments = async (keywords, algorithm = 'bruteForce') => {
  try {
    const response = await api.post('/search', {
      keywords,
      algorithm,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Search failed');
    }
    throw new Error('Network error: Unable to connect to server');
  }
};

export const compareAlgorithms = async (keywords) => {
  try {
    const response = await api.post('/compare', {
      keywords,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Comparison failed');
    }
    throw new Error('Network error: Unable to connect to server');
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Server health check failed');
  }
};

export default api;