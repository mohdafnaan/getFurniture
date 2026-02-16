import { useState, useEffect } from 'react';
import api from '../../utils/api';
import MainLayout from '../../layouts/MainLayout';
import toast from 'react-hot-toast';
import { XCircle, AlertTriangle, Package, Calendar, IndianRupee, Loader, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/private/order-history');
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const confirmCancel = (orderId) => {
        setCancellingOrderId(orderId);
    };

    const handleCancelOrder = async () => {
        if (!cancellingOrderId) return;
        try {
            await api.delete(`/private/cancel-order/${cancellingOrderId}`);
            toast.success("Order cancelled");
            fetchHistory();
        } catch (error) {
            toast.error("Failed to cancel order");
        } finally {
            setCancellingOrderId(null);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            cancelled: 'bg-red-50 text-red-700 border border-red-200',
            pending: 'bg-amber-50 text-amber-700 border border-amber-200',
            contacted: 'bg-blue-50 text-blue-700 border border-blue-200',
            'in-process': 'bg-violet-50 text-violet-700 border border-violet-200',
        };
        const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}>
                {label}
            </span>
        );
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.modelName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const uniqueStatuses = ['All', ...new Set(orders.map(o => o.status || 'pending'))];

    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center gap-3 mb-1">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <Package className="text-amber-700" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
                        <p className="text-sm text-gray-500">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-indigo-400 transition-all"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full sm:w-44">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                        className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-indigo-400 transition-all appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {uniqueStatuses.map(status => (
                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <AnimatePresence>
                {cancellingOrderId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-100"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-red-100 p-3 rounded-full mb-4">
                                    <AlertTriangle className="text-red-600" size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Order?</h3>
                                <p className="text-gray-500 mb-6 text-sm">Are you sure you want to cancel this order? This action cannot be undone.</p>
                                <div className="flex gap-3 w-full">
                                    <button 
                                        onClick={() => setCancellingOrderId(null)}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                                    >
                                        No, Keep It
                                    </button>
                                    <button 
                                        onClick={handleCancelOrder}
                                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                                    >
                                        Yes, Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader className="animate-spin text-amber-700" size={32} />
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Package className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500 font-medium">No orders found</p>
                    <p className="text-gray-400 text-sm mt-1">Your order history will appear here</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/80">
                                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price Range</th>
                                    <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order, index) => (
                                    <motion.tr 
                                        key={order._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="py-3.5 px-4">
                                            <p className="text-sm font-semibold text-gray-900">{order.modelName}</p>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                                <IndianRupee size={14} className="text-gray-400" />
                                                {order.priceRange?.min?.toLocaleString()} - {order.priceRange?.max?.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            {order.status !== 'completed' && order.status !== 'cancelled' ? (
                                                <button 
                                                    onClick={() => confirmCancel(order._id)}
                                                    className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors text-xs font-medium"
                                                >
                                                    <XCircle size={14} /> Cancel
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                        {filteredOrders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 relative overflow-hidden"
                            >
                                <div className={`absolute top-0 left-0 w-1 h-full ${
                                    order.status === 'completed' ? 'bg-emerald-500' : 
                                    order.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                                }`}></div>

                                <div className="ml-2">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-sm font-semibold text-gray-900">{order.modelName}</h3>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 mb-3">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        <span className="flex items-center gap-1"><IndianRupee size={12} /> ₹{order.priceRange?.min?.toLocaleString()} - ₹{order.priceRange?.max?.toLocaleString()}</span>
                                    </div>
                                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                                        <button 
                                            onClick={() => confirmCancel(order._id)}
                                            className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium"
                                        >
                                            <XCircle size={14} /> Cancel Order
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </MainLayout>
    );
};

export default UserOrders;
