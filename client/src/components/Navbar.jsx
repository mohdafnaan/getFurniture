import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Menu, X, Package, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, role, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    // Check if we're on a dashboard/authenticated page (not login, register, verify-otp, or landing)
    const isAuthPage = ['/login', '/register', '/verify-otp', '/admin/login', '/admin/register'].includes(location.pathname);
    const isLandingPage = location.pathname === '/' && !role;

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-amber-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-2xl bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">GetFurniture</span>
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
                                <Link to="/profile" className="ml-2 bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                                    <User size={16} /> Profile
                                </Link>
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
                    <div className="md:hidden flex items-center">
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
    );
};

export default Navbar;
