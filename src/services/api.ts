import axios, { AxiosError } from 'axios';

// Base API configuration
// In development with unified Vite server, requests to /api are handled directly.
// If deployed separately, VITE_API_URL can be set to e.g. http://localhost:5000/api
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    city: string;
    createdAt?: string;
  };
}

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request Interceptor: Attach JWT Token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fixnear_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages nicely
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      // If unauthorized, clean invalid token
      // Avoid redirecting if already on public pages
      const publicPaths = ['/login', '/signup', '/', '/how-it-works', '/about'];
      if (!publicPaths.includes(window.location.pathname)) {
        localStorage.removeItem('fixnear_token');
        localStorage.removeItem('fixnear_user');
        window.dispatchEvent(new Event('fixnear:auth-invalid'));
      }
    }

    const serverMessage = error.response?.data?.message;
    const message =
      typeof serverMessage === 'string'
        ? serverMessage
        : error.response
          ? 'The request could not be completed. Please try again.'
          : 'Unable to connect to FixNear. Check your internet connection and try again.';

    return Promise.reject(new ApiError(message, error.response?.status));
  }
);

// Auth Service
export const authService = {
  signup: async (data: { name: string; email: string; password: string; city?: string }): Promise<AuthResponse> => {
    const res = await api.post('/auth/signup', data);
    return res.data;
  },
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

// Issues Service
export const issueService = {
  getMyIssues: async () => {
    const res = await api.get('/issues/my');
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/issues/stats');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/issues/${id}`);
    return res.data;
  },
  create: async (issueData: {
    title: string;
    description: string;
    category: string;
    location: string;
    priority?: string;
    imageUrl?: string;
    frequency?: string;
    landmark?: string;
  }) => {
    const res = await api.post('/issues', issueData);
    return res.data;
  },
  update: async (id: string, issueData: any) => {
    const res = await api.put(`/issues/${id}`, issueData);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/issues/${id}`);
    return res.data;
  },
  updateStatus: async (id: string, status: string) => {
    const res = await api.patch(`/issues/${id}/status`, { status });
    return res.data;
  },
};

// Notifications Service
export const notificationService = {
  getAll: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },
  markAsRead: async (id: string) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },
  markAllAsRead: async () => {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  },
};

// Comments Service
export const commentService = {
  getByIssueId: async (issueId: string) => {
    const res = await api.get(`/comments/${issueId}`);
    return res.data;
  },
  add: async (issueId: string, message: string) => {
    const res = await api.post(`/comments/${issueId}`, { message });
    return res.data;
  },
};

// Health Check
export const checkApiHealth = async () => {
  const res = await api.get('/health');
  return res.data;
};
