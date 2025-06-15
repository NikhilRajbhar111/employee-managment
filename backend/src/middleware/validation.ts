import { body, query, param } from 'express-validator';

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const validateDepartment = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters'),
];

export const validateEmployee = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('departmentId')
    .isMongoId()
    .withMessage('Please provide a valid department ID'),
  body('supervisorId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid supervisor ID'),
  body('jobTitle')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Job title must be between 2 and 100 characters'),
  body('location.country')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Country is required'),
  body('location.state')
    .trim()
    .isLength({ min: 2 })
    .withMessage('State is required'),
  body('location.city')
    .trim()
    .isLength({ min: 2 })
    .withMessage('City is required'),
];

export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid ID'),
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const validateEmployeeQuery = [
  ...validatePagination,
  query('department')
    .optional()
    .isMongoId()
    .withMessage('Department must be a valid ID'),
  query('jobTitle')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Job title cannot be empty'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query cannot be empty'),
];