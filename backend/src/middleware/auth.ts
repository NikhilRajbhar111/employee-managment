import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { AuthenticatedRequest, JWTPayload } from '../types';
import { Admin } from '../models/Admin';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
    
    // Verify admin still exists
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. Admin not found.',
      });
      return;
    }

    req.admin = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};