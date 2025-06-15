import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, Search, Filter, ChevronRight, ChevronLeft } from 'lucide-react';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import { locationService } from '../services/locationService';
import { useNotification } from '../hooks/useNotification';
import { Employee, Department, CreateEmployeeData } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationContainer from '../components/NotificationContainer';
import Pagination from '../components/Pagination';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]); // Use correct type
  const [departments, setDepartments] = useState<Department[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState('');

  // Form data
  const [formData, setFormData] = useState<CreateEmployeeData>({
    name: '',
    email: '',
    departmentId: '',
    supervisorId: '',
    jobTitle: '',
    location: {
      country: '',
      state: '',
      city: ''
    }
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { notifications, addNotification, removeNotification } = useNotification();

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchCountries();
  }, [currentPage, searchTerm, departmentFilter, jobTitleFilter]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getAll({
        // page: currentPage,
        // limit: 10,
        // search: searchTerm || undefined,
        // department: departmentFilter || undefined,
        // jobTitle: jobTitleFilter || undefined,
      });

      // Most APIs return { data: [...], pagination: {...} }
      if (response.data?.data && response.data?.pagination) {
        setEmployees(response.data.data); // <-- Only the array!
        setTotalPages(response.data.pagination.pages || 4);
      } else if (Array.isArray(response.data)) {
        setEmployees(response.data);
        setTotalPages(1);
      } else {
        setEmployees([]);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      addNotification('error', 'Failed to fetch employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAll();
      console.log('Departments Response:', response);
      
      // Handle response structure
      if (response.data) {
        setDepartments(Array.isArray(response.data) ? response.data : response.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      addNotification('error', 'Failed to fetch departments');
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await locationService.getCountries();
      console.log('Countries Response:', response);
      
      // Handle response structure
      if (response.data) {
        setCountries(Array.isArray(response.data) ? response.data : response.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching countries:', error);
      addNotification('error', 'Failed to fetch countries');
    }
  };

  const fetchStates = async (country: string) => {
    if (!country) {
      setStates([]);
      setCities([]);
      return;
    }

    try {
      const response = await locationService.getStates(country);
      console.log('States Response:', response);
      
      // Handle response structure
      if (response.data) {
        setStates(Array.isArray(response.data) ? response.data : response.data || []);
      }
      setCities([]);
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, state: '', city: '' }
      }));
    } catch (error: any) {
      console.error('Error fetching states:', error);
      addNotification('error', 'Failed to fetch states');
    }
  };

  const fetchCities = async (country: string, state: string) => {
    if (!country || !state) {
      setCities([]);
      return;
    }

    try {
      const response = await locationService.getCities(country, state);
      console.log('Cities Response:', response);
      
      // Handle response structure
      if (response.data) {
        setCities(Array.isArray(response.data) ? response.data : response.data || []);
      }
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, city: '' }
      }));
    } catch (error: any) {
      console.error('Error fetching cities:', error);
      addNotification('error', 'Failed to fetch cities');
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.departmentId) errors.departmentId = 'Department is required';
    if (!formData.jobTitle.trim()) errors.jobTitle = 'Job title is required';
    if (!formData.location.country) errors.country = 'Country is required';
    if (!formData.location.state) errors.state = 'State is required';
    if (!formData.location.city) errors.city = 'City is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    console.log("Trying to submit")
    try {
      // Prepare data according to your API format
      const submitData = {
        name: formData.name,
        email: formData.email,
        departmentId: formData.departmentId,
        jobTitle: formData.jobTitle,
        location: {
          country: formData.location.country,
          state: formData.location.state,
          city: formData.location.city
        },
        // Only include supervisorId if it's not empty
        ...(formData.supervisorId && { supervisorId: formData.supervisorId })
      };
      console.log("Recived data")

      console.log('Submitting data:', submitData);

      if (editingEmployee) {
        await employeeService.update(editingEmployee._id, submitData);
        addNotification('success', 'Employee updated successfully');
      } else {
        console.log("Calling create employee routes")
        await employeeService.create(submitData);
        addNotification('success', 'Employee created successfully');
      }
      
      handleModalClose();
      fetchEmployees();
    } catch (error: any) {
      console.error('Submit error:', error);
      const message = error.response?.data?.message || error.message || 'Operation failed';
      addNotification('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      departmentId: employee.departmentId,
      supervisorId: employee.supervisorId || '',
      jobTitle: employee.jobTitle,
      location: employee.location
    });
    
    // Fetch location data
    if (employee.location.country) {
      fetchStates(employee.location.country);
      if (employee.location.state) {
        fetchCities(employee.location.country, employee.location.state);
      }
    }
    
    setIsModalOpen(true);
  };

  const handleDelete = async (employee: Employee) => {
    if (!confirm(`Are you sure you want to delete "${employee.name}"?`)) {
      return;
    }

    try {
      await employeeService.delete(employee._id);
      addNotification('success', 'Employee deleted successfully');
      fetchEmployees();
    } catch (error: any) {
      console.error('Delete error:', error);
      const message = error.response?.data?.message || 'Failed to delete employee';
      addNotification('error', message);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      departmentId: '',
      supervisorId: '',
      jobTitle: '',
      location: { country: '', state: '', city: '' }
    });
    setFormErrors({});
    setStates([]);
    setCities([]);
  };

  const handleCountryChange = (country: string) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, country }
    }));
    fetchStates(country);
  };

  const handleStateChange = (state: string) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, state }
    }));
    fetchCities(formData.location.country, state);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEmployees();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setJobTitleFilter('');
    setCurrentPage(1);
  };

  // const uniqueJobTitles = employees.length > 0 ? [...new Set(employees.map((emp: { jobTitle: any; }) => emp.jobTitle))] : [];

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
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
            <p className="text-sm text-gray-600">Manage your organization's employees</p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-2"
          />
          
          <Select
            options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            placeholder="Filter by department"
          />

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button type="button" variant="outline" onClick={resetFilters}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {employees.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first employee.</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supervisor
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee: Employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {employee.departmentId?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.jobTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {`${employee.location.city}, ${employee.location.state}, ${employee.location.country}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.supervisor?.name || 'None'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(employee)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(employee)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
           <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          <ChevronLeft className="h-4 w-4 mr-1"/> Prev
        </Button>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          Next <ChevronRight className="h-4 w-4 ml-1"/>
        </Button>
      </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={formErrors.name}
              placeholder="Enter employee name"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              error={formErrors.email}
              placeholder="Enter email address"
            />

            <Select
              label="Department"
              options={departments.map(dept => {
                console.log(dept);
                return { value: dept._id, label: dept.name }
              })}
              value={formData.departmentId}
              onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
              error={formErrors.departmentId}
              placeholder="Select department"
            />

            <Input
              label="Job Title"
              value={formData.jobTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
              error={formErrors.jobTitle}
              placeholder="Enter job title"
            />

            <Select
              label="Supervisor (Leave this empty)"
              options={employees
                .filter((emp: { id: string; }) => editingEmployee ? emp.id !== editingEmployee.id : true)
                .map((emp: { id: any; name: any; }) => ({ value: emp.id, label: emp.name }))}
              value={formData.supervisorId}
              onChange={(e) => setFormData(prev => ({ ...prev, supervisorId: e.target.value }))}
              placeholder="Select supervisor"
            />

            <Select
              label="Country"
              options={countries.map(country => ({ value: country, label: country }))}
              value={formData.location.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              error={formErrors.country}
              placeholder="Select country"
            />

            <Select
              label="State"
              options={states.map(state => ({ value: state, label: state }))}
              value={formData.location.state}
              onChange={(e) => handleStateChange(e.target.value)}
              error={formErrors.state}
              placeholder="Select state"
              disabled={!formData.location.country}
            />

            <Select
              label="City"
              options={cities.map(city => ({ value: city, label: city }))}
              value={formData.location.city}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, city: e.target.value }
              }))}
              error={formErrors.city}
              placeholder="Select city"
              disabled={!formData.location.state}
            />
          </div>

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
              {editingEmployee ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
