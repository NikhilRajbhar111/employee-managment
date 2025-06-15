import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { config } from '../config/config';
import { ApiResponse } from '../types';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Check if admin exists
      const admin = await Admin.findOne({ email });
      if (!admin) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        } as ApiResponse);
        return;
      }

      // Check password
      const isPasswordValid = await admin.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        } as ApiResponse);
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id, email: admin.email },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          admin: {
            id: admin._id,
            email: admin.email,
          },
          token,
        },
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }

  async createAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        res.status(400).json({
          success: false,
          message: 'Admin with this email already exists',
        } as ApiResponse);
        return;
      }

      const admin = new Admin({ email, password });
      await admin.save();

      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        data: admin,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create admin',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }
}

export const authController = new AuthController();