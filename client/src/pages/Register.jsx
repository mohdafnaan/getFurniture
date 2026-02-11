import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = '/public/user-register';
      const { data } = await api.post(endpoint, formData);
      toast.success(data.message || 'Registration successful. Please verify OTP.');
      // Usually user is redirected to OTP verification page
      // But server sends email OTP. 
      // I should add an OTP input or redirect to an /otp-verify page.
      navigate('/verify-otp');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Phone', name: 'phone', type: 'tel' },
            { label: 'Address', name: 'address', type: 'text' },
            { label: 'Password', name: 'password', type: 'password' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData[field.name]}
                onChange={(e) =>
                  setFormData({ ...formData, [field.name]: e.target.value })
                }
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-500">Login</Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
