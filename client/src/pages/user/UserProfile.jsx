import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import MainLayout from '../../layouts/MainLayout';
import { User, Mail, Phone, MapPin, Calendar, LogOut, Loader, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const UserProfile = () => {
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/private/me');
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64">
                    <Loader className="animate-spin text-indigo-600" size={40} />
                </div>
            </MainLayout>
        );
    }

    if (!profile) {
        return (
            <MainLayout>
                <div className="text-center py-16">
                    <p className="text-gray-500">Unable to load profile.</p>
                </div>
            </MainLayout>
        );
    }

    const memberSince = new Date(profile.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const initials = profile.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-lg mx-auto mt-6"
            >
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header gradient */}
                    <div className="h-24 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 relative">
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                            <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
                                <span className="text-2xl font-bold text-indigo-600">{initials}</span>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="pt-14 pb-6 px-6 text-center">
                        <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{profile.email}</p>
                    </div>

                    {/* Details */}
                    <div className="px-6 pb-6 space-y-1">
                        <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                                <User size={18} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Username</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Mail size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Email</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.email}</p>
                            </div>
                        </div>

                        {profile.phone && (
                            <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="bg-emerald-100 p-2 rounded-lg">
                                    <Phone size={18} className="text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Phone</p>
                                    <p className="text-sm font-semibold text-gray-800">+91 {profile.phone}</p>
                                </div>
                            </div>
                        )}

                        {profile.address && (
                            <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <MapPin size={18} className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Address</p>
                                    <p className="text-sm font-semibold text-gray-800">{profile.address}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="bg-violet-100 p-2 rounded-lg">
                                <Calendar size={18} className="text-violet-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Member Since</p>
                                <p className="text-sm font-semibold text-gray-800">{memberSince}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Shield size={18} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Account Status</p>
                                <p className="text-sm font-semibold text-emerald-600">Verified ✓</p>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="px-6 pb-6">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-red-200 active:scale-[0.98]"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </motion.div>
        </MainLayout>
    );
};

export default UserProfile;
