import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { GratitudeEntry, CreateGratitudeEntryDto } from '../types/gratitude';
import { GeneralValues } from '../types/generalValues';

// Extend the Axios request config type to include our _retry property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to clear tokens and redirect to login
export const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
};

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // console.log('Current token in localStorage:', token); // Keep commented out unless debugging
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for handling token expiry
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    // Check if error is 401 and not a retry attempt
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.error('No refresh token found');
          handleLogout();
          return Promise.reject(error);
        }

        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const newToken = response.data.accessToken;
        
        if (!newToken) {
          console.error('No new token received from refresh');
          handleLogout();
          return Promise.reject(error);
        }

        // Store the new token
        localStorage.setItem('token', newToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        handleLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const gratitudeApi = {
  // Get all gratitude entries
  getAllEntries: async (): Promise<GratitudeEntry[]> => {
    const response = await api.get('/entries');
    return response.data;
  },

  // Create a new gratitude entry
  createEntry: async (entry: CreateGratitudeEntryDto): Promise<GratitudeEntry> => {
    const response = await api.post('/entries', entry);
    return response.data;
  },

  // Get a single gratitude entry
  getEntry: async (id: string): Promise<GratitudeEntry> => {
    const response = await api.get(`/entries/${id}`);
    return response.data;
  },

  // Delete a gratitude entry
  deleteEntry: async (id: string): Promise<void> => {
    await api.delete(`/entries/${id}`);
  },

  // Get a gratitude entry by date
  getEntryByDate: async (date: Date): Promise<GratitudeEntry> => {
    // Convert date to YYYY-MM-DD format
    const formattedDate = date.toISOString().split('T')[0];
    const response = await api.get(`/entries/date/${formattedDate}`);
    return response.data;
  },
}; 

export const generalValuesApi = {
  getGeneralValues: async (): Promise<GeneralValues[]> => {
    const response = await api.get('/general-values');
    return response.data;
  },
};