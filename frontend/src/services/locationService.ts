import api from '../api/axios';
import { ApiResponse } from '../types';

export const locationService = {
  getCountries: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/locations/countries');
    return response.data;
  },

  getStates: async (country: string): Promise<ApiResponse<string[]>> => {
    const response = await api.get(`/locations/states/${encodeURIComponent(country)}`);
    return response.data;
  },

  getCities: async (country: string, state: string): Promise<ApiResponse<string[]>> => {
    const response = await api.get(`/locations/cities/${encodeURIComponent(country)}/${encodeURIComponent(state)}`);
    return response.data;
  },
};