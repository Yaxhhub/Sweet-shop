import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Auth API
export const authAPI = {
  register: (email: string, password: string, role?: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, role }),
  
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
};

// Sweets API
export const sweetsAPI = {
  getAll: () => api.get<Sweet[]>('/sweets'),
  
  search: (params: { name?: string; category?: string; minPrice?: number; maxPrice?: number }) =>
    api.get<Sweet[]>('/sweets/search', { params }),
  
  create: (sweet: Omit<Sweet, '_id'>) => api.post<Sweet>('/sweets', sweet),
  
  update: (id: string, sweet: Partial<Sweet>) => api.put<Sweet>(`/sweets/${id}`, sweet),
  
  delete: (id: string) => api.delete(`/sweets/${id}`),
  
  purchase: (id: string, quantity: number = 1) =>
    api.post(`/sweets/${id}/purchase`, { quantity }),
  
  restock: (id: string, quantity: number) =>
    api.post(`/sweets/${id}/restock`, { quantity }),
};

export default api;