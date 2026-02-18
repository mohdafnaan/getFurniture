import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { KeyRound, Eye, EyeOff, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const getStrength = (pwd) => {
        if (!pwd) return null;
        if (pwd.length < 6) return { label: 'Too short', color: 'bg-red-400', text: 'text-red-600', width: '25%' };
        if (pwd.length < 8) return { label: 'Weak', color: 'bg-orange-400', text: 'text-orange-600', width: '50%' };
        if (pwd.length < 12) return { label: 'Good', color: 'bg-amber-500', text: 'text-amber-700', width: '75%' };
        return { label: 'Strong', color: 'bg-green-500', text: 'text-green-700', width: '100%' };
    };

    const strength = getStrength(form.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.password || !form.confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post(`/public/reset-password/${token}`, {
                password: form.password,
            });
            toast.success(data.message || 'Password reset successfully!');
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password. Link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="max-w-md mx-auto mt-10 px-4"
            >
                <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
                    {/* Top gradient bar */}
                    <div className="h-1.5 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700" />

                    <div className="px-8 py-8">
                        {success ? (
                            /* Success State */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="text-center py-6"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                    <CheckCircle2 size={36} className="text-green-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Password Reset!</h2>
                                <p className="text-sm text-gray-500 mb-1">Your password has been updated successfully.</p>
                                <p className="text-xs text-gray-400">Redirecting to login in 3 seconds...</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-orange-600 text-white text-sm font-semibold hover:from-amber-800 hover:to-orange-700 transition-all shadow-md"
                                >
                                    Go to Login
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="text-center mb-7">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 mb-3 shadow-sm">
                                        <KeyRound size={26} className="text-amber-700" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                                    <p className="text-sm text-gray-500 mt-1">Create a new secure password for your account</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* New Password */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                            <KeyRound size={14} className="text-amber-600" /> New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder="Enter new password"
                                                className="w-full px-4 py-2.5 pr-10 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-all placeholder:text-gray-300"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>

                                        {/* Password strength bar */}
                                        {strength && (
                                            <div className="mt-2 space-y-1">
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: strength.width }}
                                                        transition={{ duration: 0.3 }}
                                                        className={`h-full rounded-full ${strength.color}`}
                                                    />
                                                </div>
                                                <p className={`text-xs font-medium ${strength.text}`}>{strength.label}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                            <ShieldCheck size={14} className="text-amber-600" /> Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirm ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm new password"
                                                className="w-full px-4 py-2.5 pr-10 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-all placeholder:text-gray-300"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                                            >
                                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {/* Match indicator */}
                                        {form.confirmPassword && (
                                            <p className={`text-xs font-medium mt-1 ${
                                                form.password === form.confirmPassword ? 'text-green-600' : 'text-red-500'
                                            }`}>
                                                {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Resetting...
                                            </>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </button>
                                </form>

                                <div className="mt-5 text-center">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-sm text-gray-400 hover:text-amber-700 transition-colors hover:underline"
                                    >
                                        ← Back to Login
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </MainLayout>
    );
};

export default ResetPassword;
