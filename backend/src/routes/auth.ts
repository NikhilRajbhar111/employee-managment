import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validateLogin, validateEmployee } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/login', validateLogin, handleValidationErrors, authController.login);

/**
 * @route   POST /api/auth/register
 * @desc    Create admin (for development purposes)
 * @access  Public
 */
router.post('/register', validateLogin, handleValidationErrors, authController.createAdmin);

export { router as authRoutes };