import { Router } from 'express';
import { locationController } from '../controllers/locationController';

const router = Router();

/**
 * @route   GET /api/locations/countries
 * @desc    Get all countries
 * @access  Public
 */
router.get('/countries', locationController.getCountries);

/**
 * @route   GET /api/locations/states/:country
 * @desc    Get states for a country
 * @access  Public
 */
router.get('/states/:country', locationController.getStates);

/**
 * @route   GET /api/locations/cities/:country/:state
 * @desc    Get cities for a country and state
 * @access  Public
 */
router.get('/cities/:country/:state', locationController.getCities);

export { router as locationRoutes };