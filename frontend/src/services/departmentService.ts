import api from '../api/axios';
import { ApiResponse, Department, CreateDepartmentData } from '../types';

export const departmentService = {
  getAll: async (): Promise<ApiResponse<Department[]>> => {
    const response = await api.get('/departments');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Department>> => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  create: async (data: CreateDepartmentData): Promise<ApiResponse<Department>> => {
    const response = await api.post('/departments', data);
    return response.data;
  },

  update: async (id: string, data: CreateDepartmentData): Promise<ApiResponse<Department>> => {
    const response = await api.put(`/departments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },
};