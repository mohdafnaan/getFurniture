import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { UserCog, User, Phone, MapPin, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

const UpdateUserDialog = ({ open, onOpenChange }) => {
    const [form, setForm] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (open) {
            setFetching(true);
            api.get('/private/me')
                .then(({ data }) => {
                    setForm({
                        name: data.name || '',
                        phone: data.phone || '',
                        address: data.address || '',
                    });
                })
                .catch(() => toast.error('Failed to load profile data'))
                .finally(() => setFetching(false));
        }
    }, [open]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error('Name is required');
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post('/private/update-user', {
                userInput: {
                    name: form.name.trim(),
                    phone: form.phone.trim(),
                    address: form.address.trim(),
                },
            });
            toast.success(data.message || 'Profile updated successfully!');
            onOpenChange(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-2xl border border-amber-100 shadow-2xl p-0 overflow-hidden">
                {/* Header gradient strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700" />

                <div className="px-6 pt-5 pb-6">
                    <DialogHeader className="mb-5">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 shadow-sm">
                                <UserCog size={22} className="text-amber-700" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-gray-900">Update Profile</DialogTitle>
                                <DialogDescription className="text-xs text-gray-400 mt-0.5">
                                    Edit your personal information below
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {fetching ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="animate-spin text-amber-600" size={32} />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="update-name" className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                    <User size={14} className="text-amber-600" /> Full Name
                                </Label>
                                <Input
                                    id="update-name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="border-amber-200 focus:border-amber-500 focus:ring-amber-400 rounded-xl h-11 text-sm"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <Label htmlFor="update-phone" className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                    <Phone size={14} className="text-amber-600" /> Phone Number
                                </Label>
                                <Input
                                    id="update-phone"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className="border-amber-200 focus:border-amber-500 focus:ring-amber-400 rounded-xl h-11 text-sm"
                                />
                            </div>

                            {/* Address */}
                            <div className="space-y-1.5">
                                <Label htmlFor="update-address" className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-amber-600" /> Address
                                </Label>
                                <textarea
                                    id="update-address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                    rows={3}
                                    className="w-full px-3 py-2.5 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 resize-none transition-all"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => onOpenChange(false)}
                                    className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateUserDialog;
