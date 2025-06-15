import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
  };
}

export interface JWTPayload extends JwtPayload {
  id: string;
  email: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface EmployeeQuery extends PaginationQuery {
  department?: string;
  jobTitle?: string;
  search?: string;
}

export interface LocationData {
  countries: string[];
  states: { [country: string]: string[] };
  cities: { [state: string]: string[] };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}