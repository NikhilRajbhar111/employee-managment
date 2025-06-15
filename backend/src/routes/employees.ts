import { Router } from 'express';
import { employeeController } from '../controllers/employeeController';
import { authenticate } from '../middleware/auth';
import { validateEmployee, validateObjectId, validateEmployeeQuery } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   GET /api/employees
 * @desc    Get all employees with pagination, filtering, and search
 * @access  Public
 */
router.get('/', validateEmployeeQuery, handleValidationErrors, employeeController.getAllEmployees);

/**
 * @route   GET /api/employees/:id
 * @desc    Get employee by ID
 * @access  Public
 */
router.get('/:id', validateObjectId, handleValidationErrors, employeeController.getEmployeeById);

/**
 * @route   POST /api/employees
 * @desc    Create new employee
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authenticate,
  validateEmployee,
  handleValidationErrors,
  employeeController.createEmployee
);

/**
 * @route   PUT /api/employees/:id
 * @desc    Update employee
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateEmployee,
  handleValidationErrors,
  employeeController.updateEmployee
);

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete employee
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  handleValidationErrors,
  employeeController.deleteEmployee
);

export { router as employeeRoutes };