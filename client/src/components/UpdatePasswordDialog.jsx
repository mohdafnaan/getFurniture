import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { KeyRound, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

// ⚠️ Must be defined OUTSIDE the parent component.
// Defining it inside causes React to create a new component type on every
// render, which unmounts/remounts the input and steals focus after each keystroke.
const PasswordInput = ({ id, name, value, placeholder, show, onToggle, onChange, label, icon }) => (
    <div className="space-y-1.5">
        <Label htmlFor={id} className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            {icon} {label}
        </Label>
        <div className="relative">
            <Input
                id={id}
                name={name}
                type={show ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="border-amber-200 focus:border-amber-500 focus:ring-amber-400 rounded-xl h-11 text-sm pr-10"
                required
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
            >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    </div>
);

const UpdatePasswordDialog = ({ open, onOpenChange }) => {
    const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClose = () => {
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setShowOld(false);
        setShowNew(false);
        setShowConfirm(false);
        onOpenChange(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
            toast.error('All fields are required');
            return;
        }
        if (form.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post('/private/update-password', {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
            });
            toast.success(data.message || 'Password updated successfully!');
            handleClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md rounded-2xl border border-amber-100 shadow-2xl p-0 overflow-hidden">
                {/* Header gradient strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700" />

                <div className="px-6 pt-5 pb-6">
                    <DialogHeader className="mb-5">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-sm">
                                <KeyRound size={22} className="text-orange-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-gray-900">Update Password</DialogTitle>
                                <DialogDescription className="text-xs text-gray-400 mt-0.5">
                                    Keep your account secure with a strong password
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <PasswordInput
                            id="old-password"
                            name="oldPassword"
                            value={form.oldPassword}
                            placeholder="Enter current password"
                            show={showOld}
                            onToggle={() => setShowOld(!showOld)}
                            onChange={handleChange}
                            label="Current Password"
                            icon={<ShieldCheck size={14} className="text-orange-500" />}
                        />

                        <PasswordInput
                            id="new-password"
                            name="newPassword"
                            value={form.newPassword}
                            placeholder="Enter new password"
                            show={showNew}
                            onToggle={() => setShowNew(!showNew)}
                            onChange={handleChange}
                            label="New Password"
                            icon={<KeyRound size={14} className="text-amber-600" />}
                        />

                        <PasswordInput
                            id="confirm-password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            placeholder="Confirm new password"
                            show={showConfirm}
                            onToggle={() => setShowConfirm(!showConfirm)}
                            onChange={handleChange}
                            label="Confirm New Password"
                            icon={<KeyRound size={14} className="text-amber-600" />}
                        />

                        {/* Password strength hint */}
                        {form.newPassword && (
                            <div className={`text-xs px-3 py-2 rounded-lg font-medium ${
                                form.newPassword.length >= 8
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-amber-50 text-amber-700'
                            }`}>
                                {form.newPassword.length >= 8
                                    ? '✓ Strong password'
                                    : `Password strength: ${form.newPassword.length}/8 characters minimum`}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdatePasswordDialog;
