import { Request, Response } from 'express';
import { locationService } from '../services/locationService';
import { ApiResponse } from '../types';

export class LocationController {
  async getCountries(req: Request, res: Response): Promise<void> {
    try {
      const countries = await locationService.getCountries();

      res.status(200).json({
        success: true,
        message: 'Countries fetched successfully',
        data: countries,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch countries',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }

  async getStates(req: Request, res: Response): Promise<void> {
    try {
      const { country } = req.params;

      if (!country) {
        res.status(400).json({
          success: false,
          message: 'Country parameter is required',
        } as ApiResponse);
        return;
      }

      const states = await locationService.getStates(country);

      res.status(200).json({
        success: true,
        message: 'States fetched successfully',
        data: states,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch states',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }

  async getCities(req: Request, res: Response): Promise<void> {
    try {
      const { country, state } = req.params;

      if (!country || !state) {
        res.status(400).json({
          success: false,
          message: 'Country and state parameters are required',
        } as ApiResponse);
        return;
      }

      const cities = await locationService.getCities(country, state);

      res.status(200).json({
        success: true,
        message: 'Cities fetched successfully',
        data: cities,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cities',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }
}

export const locationController = new LocationController();