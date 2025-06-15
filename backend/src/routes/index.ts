import { Router } from 'express';
import { authRoutes } from './auth';
import { departmentRoutes } from './departments';
import { employeeRoutes } from './employees';
import { locationRoutes } from './locations';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Office Management API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/locations', locationRoutes);

export { router as apiRoutes };