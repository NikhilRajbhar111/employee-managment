export interface User {
  id: string;
  email: string;
}

export interface Department {
  _id: any;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  country: string;
  state: string;
  city: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  departmentId: any;
  department?: Department;
  supervisorId?: string;
  supervisor?: Employee;
  jobTitle: string;
  location: Location;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateDepartmentData {
  name: string;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  departmentId: string;
  supervisorId?: string;
  jobTitle: string;
  location: Location;
}