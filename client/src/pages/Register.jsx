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
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg border border-amber-100 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Address', name: 'address', type: 'text' },
            { label: 'Password', name: 'password', type: 'password' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                required
                className="mt-1 block w-full px-3 py-2 border border-amber-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                value={formData[field.name]}
                onChange={(e) =>
                  setFormData({ ...formData, [field.name]: e.target.value })
                }
              />
            </div>
          ))}
          {/* Phone field with country code */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="mt-1 flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-amber-200 bg-gray-50 text-gray-600 text-sm font-medium">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="10-digit mobile number"
                className="block w-full px-3 py-2 border border-amber-200 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, phone: val });
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-sm text-amber-700 hover:text-amber-600 font-medium">Login</Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
