import axios from 'axios';
import { config } from '../config/config';

export class LocationService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.COUNTRIES_API_URL;
  }

  async getCountries(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseURL}/countries`);
      if (response.data.error) {
        throw new Error('Failed to fetch countries');
      }
      return response.data.data.map((country: any) => country.country);
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw new Error('Failed to fetch countries from external API');
    }
  }

  async getStates(country: string): Promise<string[]> {
    try {
      const response = await axios.post(`${this.baseURL}/countries/states`, {
        country,
      });
      if (response.data.error) {
        throw new Error('Failed to fetch states');
      }
      return response.data.data.states.map((state: any) => state.name);
    } catch (error) {
      console.error('Error fetching states:', error);
      throw new Error('Failed to fetch states from external API');
    }
  }

  async getCities(country: string, state: string): Promise<string[]> {
    try {
      const response = await axios.post(`${this.baseURL}/countries/state/cities`, {
        country,
        state,
      });
      if (response.data.error) {
        throw new Error('Failed to fetch cities');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw new Error('Failed to fetch cities from external API');
    }
  }

  async validateLocation(country: string, state: string, city: string): Promise<boolean> {
    try {
      const countries = await this.getCountries();
      if (!countries.includes(country)) {
        return false;
      }

      const states = await this.getStates(country);
      if (!states.includes(state)) {
        return false;
      }

      const cities = await this.getCities(country, state);
      return cities.includes(city);
    } catch (error) {
      console.error('Error validating location:', error);
      return true; // Allow if external API fails
    }
  }
}

export const locationService = new LocationService();