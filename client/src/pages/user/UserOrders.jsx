import { useState, useEffect } from 'react';
import api from '../../utils/api';
import MainLayout from '../../layouts/MainLayout';
import toast from 'react-hot-toast';
import { XCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);

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

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Order History</h1>
            
            <AnimatePresence>
                {cancellingOrderId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-red-100 p-3 rounded-full mb-4">
                                    <AlertTriangle className="text-red-600" size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Order?</h3>
                                <p className="text-gray-500 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
                                <div className="flex gap-3 w-full">
                                    <button 
                                        onClick={() => setCancellingOrderId(null)}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        No, Keep It
                                    </button>
                                    <button 
                                        onClick={handleCancelOrder}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white p-6 rounded-lg shadow border border-gray-100 relative overflow-hidden">
                             {/* Status Indicator Stripe */}
                             <div className={`absolute top-0 left-0 w-1 h-full ${
                                order.status === 'completed' ? 'bg-green-500' : 
                                order.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                             }`}></div>
                             
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 ml-2">
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-semibold text-gray-800">{order.modelName}</h3>
                                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                                            <button 
                                                onClick={() => confirmCancel(order._id)}
                                                className="text-red-500 hover:text-red-700 p-2 sm:hidden"
                                                title="Cancel Order"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Status: <span className={`font-medium py-0.5 px-2 rounded-full text-xs ${
                                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>{order.status || 'Pending'}</span></p>
                                    <p className="text-sm text-gray-500 mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-500">Price: ₹{order.priceRange?.min} - ₹{order.priceRange?.max}</p>
                                </div>
                                {order.status !== 'completed' && order.status !== 'cancelled' && (
                                    <button 
                                        onClick={() => confirmCancel(order._id)}
                                        className="hidden sm:flex items-center gap-1 text-red-500 hover:text-red-700 px-3 py-1.5 rounded border border-red-200 hover:bg-red-50 transition-colors text-sm font-medium"
                                    >
                                        <XCircle size={16} /> Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </MainLayout>
    );
};

export default UserOrders;
