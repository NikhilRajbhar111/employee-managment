import { Router } from 'express';
import { departmentController } from '../controllers/departmentController';
import { authenticate } from '../middleware/auth';
import { validateDepartment, validateObjectId } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   GET /api/departments
 * @desc    Get all departments
 * @access  Public
 */
router.get('/', departmentController.getAllDepartments);

/**
 * @route   GET /api/departments/:id
 * @desc    Get department by ID
 * @access  Public
 */
router.get('/:id', validateObjectId, handleValidationErrors, departmentController.getDepartmentById);

/**
 * @route   POST /api/departments
 * @desc    Create new department
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authenticate,
  validateDepartment,
  handleValidationErrors,
  departmentController.createDepartment
);

/**
 * @route   PUT /api/departments/:id
 * @desc    Update department
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateDepartment,
  handleValidationErrors,
  departmentController.updateDepartment
);

/**
 * @route   DELETE /api/departments/:id
 * @desc    Delete department
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  handleValidationErrors,
  departmentController.deleteDepartment
);

export { router as departmentRoutes };