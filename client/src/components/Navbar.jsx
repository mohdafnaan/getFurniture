import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Menu, X, Package, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, role, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl text-indigo-600">GetFurniture</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {role === 'admin' ? (
                            <>
                                <Link to="/admin/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                                    <LayoutDashboard size={18} /> Add Product
                                </Link>
                                <Link to="/admin/orders" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                                    <Package size={18} /> Order
                                </Link>
                            </>
                        ) : role === 'user' ? (
                            <>
                                <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                                <Link to="/favorites" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Favorites</Link>
                                <Link to="/orders" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">My Orders</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                            </>
                        )}

                        {role ? (
                            <button onClick={logout} className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                <LogOut size={16} /> Logout
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
                        {role === 'admin' ? (
                            <>
                                <Link to="/admin/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Add Product</Link>
                                <Link to="/admin/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Order</Link>
                            </>
                        ) : role === 'user' ? (
                            <>
                                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Home</Link>
                                <Link to="/favorites" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Favorites</Link>
                                <Link to="/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">My Orders</Link>
                            </>
                        ) : (
                             <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Home</Link>
                        )}
                         {role ? (
                            <button onClick={logout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Login</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
