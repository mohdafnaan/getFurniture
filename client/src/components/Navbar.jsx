import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Menu, X, Package, LayoutDashboard, Settings, KeyRound, UserCog } from 'lucide-react';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import UpdateUserDialog from './UpdateUserDialog';
import UpdatePasswordDialog from './UpdatePasswordDialog';

const Navbar = () => {
    const { user, role, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [showUpdateUser, setShowUpdateUser] = useState(false);
    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    const isAuthPage = ['/login', '/register', '/verify-otp', '/admin/login', '/admin/register'].includes(location.pathname);

    return (
        <>
            <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-amber-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 flex items-center">
                                <span className="font-bold text-2xl bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">GetFurnitures</span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            {role === 'admin' ? (
                                <>
                                    <Link to="/admin/dashboard" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                        <LayoutDashboard size={18} /> Add Product
                                    </Link>
                                    <Link to="/admin/orders" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                        <Package size={18} /> Order
                                    </Link>
                                    <button onClick={logout} className="ml-4 bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </>
                            ) : role === 'user' ? (
                                <>
                                    <Link to="/" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                                    <Link to="/favorites" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Favorites</Link>
                                    <Link to="/orders" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">My Orders</Link>
                                    <Link to="/profile" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                        <User size={16} /> Profile
                                    </Link>

                                    {/* Settings Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="ml-1 p-2 rounded-full text-gray-600 hover:text-amber-700 hover:bg-amber-50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1" title="Settings">
                                                <Settings size={20} className="transition-transform duration-300 hover:rotate-45" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-52 shadow-xl border border-amber-100 rounded-xl p-1 bg-white">
                                            <DropdownMenuLabel className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-3 py-2">Account Settings</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-amber-100" />
                                            <DropdownMenuItem
                                                onClick={() => setShowUpdateUser(true)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-amber-50 hover:text-amber-800 transition-colors group"
                                            >
                                                <div className="p-1.5 rounded-md bg-amber-100 group-hover:bg-amber-200 transition-colors">
                                                    <UserCog size={15} className="text-amber-700" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 group-hover:text-amber-800">Update Profile</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setShowUpdatePassword(true)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-orange-50 hover:text-orange-800 transition-colors group"
                                            >
                                                <div className="p-1.5 rounded-md bg-orange-100 group-hover:bg-orange-200 transition-colors">
                                                    <KeyRound size={15} className="text-orange-600" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-800">Update Password</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-amber-100 mt-1" />
                                            <DropdownMenuItem
                                                onClick={logout}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-50 transition-colors group"
                                            >
                                                <div className="p-1.5 rounded-md bg-red-100 group-hover:bg-red-200 transition-colors">
                                                    <LogOut size={15} className="text-red-500" />
                                                </div>
                                                <span className="text-sm font-medium text-red-500">Logout</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <>
                                    <Link to="/" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                                    {!isAuthPage && (
                                        <div className="flex items-center space-x-2">
                                            <Link to="/login" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                                            <Link to="/register" className="bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-md hover:shadow-lg">Register</Link>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-2">
                            {role === 'user' && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-2 rounded-full text-gray-600 hover:text-amber-700 hover:bg-amber-50 transition-all focus:outline-none" title="Settings">
                                            <Settings size={20} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-52 shadow-xl border border-amber-100 rounded-xl p-1 bg-white">
                                        <DropdownMenuLabel className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-3 py-2">Account Settings</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-amber-100" />
                                        <DropdownMenuItem
                                            onClick={() => setShowUpdateUser(true)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-amber-50 transition-colors group"
                                        >
                                            <div className="p-1.5 rounded-md bg-amber-100 group-hover:bg-amber-200 transition-colors">
                                                <UserCog size={15} className="text-amber-700" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Update Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setShowUpdatePassword(true)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors group"
                                        >
                                            <div className="p-1.5 rounded-md bg-orange-100 group-hover:bg-orange-200 transition-colors">
                                                <KeyRound size={15} className="text-orange-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Update Password</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-amber-100 mt-1" />
                                        <DropdownMenuItem
                                            onClick={logout}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-50 transition-colors group"
                                        >
                                            <div className="p-1.5 rounded-md bg-red-100 group-hover:bg-red-200 transition-colors">
                                                <LogOut size={15} className="text-red-500" />
                                            </div>
                                            <span className="text-sm font-medium text-red-500">Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-amber-700 focus:outline-none transition-colors"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden border-t border-amber-100">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
                            {role === 'admin' ? (
                                <>
                                    <Link to="/admin/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-colors">Add Product</Link>
                                    <Link to="/admin/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-colors">Order</Link>
                                    <button onClick={logout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors">
                                        Logout
                                    </button>
                                </>
                            ) : role === 'user' ? (
                                <>
                                    <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-colors">Home</Link>
                                    <Link to="/favorites" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-colors">Favorites</Link>
                                    <Link to="/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-colors">My Orders</Link>
                                    <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition-colors">
                                        <User size={18} /> Profile
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-colors">Home</Link>
                                    {!isAuthPage && (
                                        <>
                                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-colors">Login</Link>
                                            <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-amber-700 hover:bg-amber-50 transition-colors">Register</Link>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Modals */}
            <UpdateUserDialog open={showUpdateUser} onOpenChange={setShowUpdateUser} />
            <UpdatePasswordDialog open={showUpdatePassword} onOpenChange={setShowUpdatePassword} />
        </>
    );
};

export default Navbar;
