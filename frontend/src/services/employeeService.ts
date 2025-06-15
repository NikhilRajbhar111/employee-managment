import api from '../api/axios';
import { ApiResponse, Employee, CreateEmployeeData, PaginatedResponse } from '../types';

interface EmployeeFilters {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  jobTitle?: string;
}

export const employeeService = {
  getAll: async (filters: EmployeeFilters = {}): Promise<ApiResponse<PaginatedResponse<Employee>>> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.department) params.append('department', filters.department);
    if (filters.jobTitle) params.append('jobTitle', filters.jobTitle);

    const response = await api.get(`/employees?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Employee>> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (data: CreateEmployeeData): Promise<ApiResponse<Employee>> => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  update: async (id: string, data: CreateEmployeeData): Promise<ApiResponse<Employee>> => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};