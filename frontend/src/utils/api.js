import axios from 'axios';

//const API_BASE_URL = 'https://cv-backend-04vy.onrender.com';
const API_BASE_URL = 'http://localhost:5000';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get detailed error message
const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.error || `Server error: ${error.response.status}`;
  } else if (error.request) {
    // Request was made but no response received
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout: Server is taking too long to respond';
    }
    return `Unable to connect to server at ${API_BASE_URL}. Make sure the backend server is running.`;
  } else {
    // Something else happened
    return error.message || 'Network error: Unable to connect to server';
  }
};

export const searchDocuments = async (keywords, algorithm = 'bruteForce') => {
  try {
    const response = await api.post('/search', {
      keywords,
      algorithm,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const compareAlgorithms = async (keywords) => {
  try {
    const response = await api.post('/compare', {
      keywords,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || 'Server health check failed');
  }
};

export default api;