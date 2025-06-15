import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';
import { departmentService } from '../services/departmentService';
import { useNotification } from '../hooks/useNotification';
import { Department } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationContainer from '../components/NotificationContainer';

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [formErrors, setFormErrors] = useState<{ name?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const { notifications, addNotification, removeNotification } = useNotification();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAll();
      setDepartments(response.data);
    } catch (error: any) {
      addNotification('error', 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: { name?: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Department name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Department name must be at least 2 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingDepartment) {
        await departmentService.update(editingDepartment._id, formData);
        addNotification('success', 'Department updated successfully');
      } else {
        await departmentService.create(formData);
        addNotification('success', 'Department created successfully');
      }
      
      setIsModalOpen(false);
      setEditingDepartment(null);
      setFormData({ name: '' });
      fetchDepartments();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Operation failed';
      addNotification('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({ name: department.name });
    setIsModalOpen(true);
  };

  const handleDelete = async (department: Department) => {
    if (!confirm(`Are you sure you want to delete "${department.name}"?`)) {
      return;
    }

    try {
      await departmentService.delete(department._id);
      addNotification('success', 'Department deleted successfully');
      fetchDepartments();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete department';
      addNotification('error', message);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
    setFormData({ name: '' });
    setFormErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="text-sm text-gray-600">Manage your organization's departments</p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Departments Grid */}
      {departments.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first department.</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <div
              key={department.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {department.name}
                    </h3>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  Created: {new Date(department.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(department)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(department)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingDepartment ? 'Edit Department' : 'Add Department'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            error={formErrors.name}
            placeholder="Enter department name"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleModalClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting}
            >
              {editingDepartment ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;