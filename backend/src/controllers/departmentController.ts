import { Request, Response } from 'express';
import { Department } from '../models/Department';
import { ApiResponse } from '../types';

export class DepartmentController {
  async getAllDepartments(req: Request, res: Response): Promise<void> {
    try {
      const departments = await Department.find().sort({ name: 1 });

      res.status(200).json({
        success: true,
        message: 'Departments fetched successfully',
        data: departments,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch departments',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }

  async getDepartmentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const department = await Department.findById(id);

      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Department fetched successfully',
        data: department,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch department',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }

  async createDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      const department = new Department({ name });
      await department.save();

      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: department,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create department',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }

  async updateDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const department = await Department.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true }
      );

      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Department updated successfully',
        data: department,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update department',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }

  async deleteDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const department = await Department.findByIdAndDelete(id);

      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Department deleted successfully',
        data: department,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete department',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }
}

export const departmentController = new DepartmentController();