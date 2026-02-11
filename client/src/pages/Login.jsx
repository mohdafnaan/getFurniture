import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';

const Login = () => {
  const [isUser, setIsUser] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isUser ? '/public/user-login' : '/public/admin-login';
      const { data } = await api.post(endpoint, { email, password });
      
      login(data.token, isUser ? 'user' : 'admin', data.user || null); 
      
      toast.success(data.message || 'Logged in successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {isUser ? 'User Login' : 'Admin Login'}
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
            <button 
                onClick={() => setIsUser(!isUser)} 
                className="text-sm text-indigo-600 hover:text-indigo-500"
            >
                {isUser ? 'Login as Admin' : 'Login as User'}
            </button>
        </div>

        <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-sm text-indigo-600 hover:text-indigo-500">Register</Link>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Login;
