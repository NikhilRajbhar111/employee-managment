import api from '../api/axios';
import { ApiResponse, LoginCredentials, User } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', credentials);
    console.log(response.data);
    return response.data;
  },

  register: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('jwt_token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('jwt_token');
  },

  setToken: (token: string) => {
    localStorage.setItem('jwt_token', token);
  },
};