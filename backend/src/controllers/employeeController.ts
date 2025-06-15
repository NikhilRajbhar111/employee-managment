import { Request, Response } from 'express';
import { Employee } from '../models/Employee';
import { Department } from '../models/Department';
import { ApiResponse, EmployeeQuery } from '../types';
import { locationService } from '../services/locationService';

export class EmployeeController {
  async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '10', department, jobTitle, search } = req.query as EmployeeQuery;
      
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query: any = {};

      if (department) {
        query.departmentId = department;
      }

      if (jobTitle) {
        query.jobTitle = { $regex: jobTitle, $options: 'i' };
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const [employees, total] = await Promise.all([
        Employee.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum),
        Employee.countDocuments(query),
      ]);

      const pages = Math.ceil(total / limitNum);

      res.status(200).json({
        success: true,
        message: 'Employees fetched successfully',
        data: employees,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages,
        },
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch employees',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }

  async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const employee = await Employee.findById(id);

      if (!employee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Employee fetched successfully',
        data: employee,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch employee',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }

  async createEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, departmentId, jobTitle, location } = req.body;

      // Validate department exists
      const department = await Department.findById(departmentId);
      if (!department) {
        res.status(400).json({
          success: false,
          message: 'Department not found',
        } as ApiResponse);
        return;
      }

      // // Validate supervisor exists (if provided)
      // if (supervisorId) {
      //   const supervisor = await Employee.findById(supervisorId);
      //   if (!supervisor) {
      //     res.status(400).json({
      //       success: false,
      //       message: 'Supervisor not found',
      //     } as ApiResponse);
      //     return;
      //   }
      // }

      // Validate location with external API
      const isLocationValid = await locationService.validateLocation(
        location.country,
        location.state,
        location.city
      );

      if (!isLocationValid) {
        res.status(400).json({
          success: false,
          message: 'Invalid location provided',
        } as ApiResponse);
        return;
      }

      const employee = new Employee({
        name,
        email,
        departmentId,
        // supervisorId,
        jobTitle,
        location,
      });

      await employee.save();

      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: employee,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create employee',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }

  async updateEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, departmentId, supervisorId, jobTitle, location } = req.body;

      // Validate department exists
      if (departmentId) {
        const department = await Department.findById(departmentId);
        if (!department) {
          res.status(400).json({
            success: false,
            message: 'Department not found',
          } as ApiResponse);
          return;
        }
      }

      // Validate supervisor exists (if provided)
      if (supervisorId) {
        const supervisor = await Employee.findById(supervisorId);
        if (!supervisor) {
          res.status(400).json({
            success: false,
            message: 'Supervisor not found',
          } as ApiResponse);
          return;
        }

        // Prevent self-supervision
        if (supervisorId === id) {
          res.status(400).json({
            success: false,
            message: 'Employee cannot be their own supervisor',
          } as ApiResponse);
          return;
        }
      }

      // Validate location with external API
      if (location) {
        const isLocationValid = await locationService.validateLocation(
          location.country,
          location.state,
          location.city
        );

        if (!isLocationValid) {
          res.status(400).json({
            success: false,
            message: 'Invalid location provided',
          } as ApiResponse);
          return;
        }
      }

      const employee = await Employee.findByIdAndUpdate(
        id,
        { name, email, departmentId, supervisorId, jobTitle, location },
        { new: true, runValidators: true }
      );

      if (!employee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data: employee,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update employee',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }

  async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const employee = await Employee.findByIdAndDelete(id);

      if (!employee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found',
        } as ApiResponse);
        return;
      }

      // Update employees who had this employee as supervisor
      await Employee.updateMany(
        { supervisorId: id },
        { $unset: { supervisorId: 1 } }
      );

      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
        data: employee,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete employee',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse);
    }
  }
}

export const employeeController = new EmployeeController();