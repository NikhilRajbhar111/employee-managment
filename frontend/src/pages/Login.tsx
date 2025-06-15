import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import Input from '../components/Input';
import Button from '../components/Button';
import NotificationContainer from '../components/NotificationContainer';

const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { notifications, addNotification, removeNotification } = useNotification();

  const from = (location.state as any)?.from?.pathname || '/employees';

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        const response = await authService.login({ email, password });
        login(response.data.token);
        addNotification('success', 'Successfully logged in!');
        navigate(from, { replace: true });
      } else {
        await authService.register({ email, password });
        addNotification('success', 'Registration successful. You may now log in.');
        setMode('login');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Operation failed. Please try again.';
      addNotification('error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />

      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="flex justify-center">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              {mode === 'login' ? 'Admin Login' : 'Admin Registration'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {mode === 'login'
                ? 'Sign in to access the Office Management System'
                : 'Register a new admin account'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="admin@example.com"
                autoComplete="email"
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  placeholder="Enter your password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {mode === 'login' ? 'Sign In' : 'Register'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <span>
                Don’t have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setMode('register')}
                >
                  Register
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setMode('login')}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

          {mode === 'login' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 text-center">
                Demo Credentials:<br />
                <span className="font-mono">admin@example.com</span> / <span className="font-mono">admin123</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
