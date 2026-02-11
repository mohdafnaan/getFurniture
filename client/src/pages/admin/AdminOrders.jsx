import { useState, useEffect } from 'react';
import api from '../../utils/api';
import MainLayout from '../../layouts/MainLayout';
import toast from 'react-hot-toast';
import { Package, CheckCircle } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/private/getallorders');
            setOrders(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const completeOrder = async (orderId) => {
        try {
            await api.get(`/private/completeorder/${orderId}`);
            toast.success("Order marked complete");
            fetchOrders();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <MainLayout>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Pending Orders</h1>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {orders.length === 0 ? (
                        <p className="text-gray-500">No pending orders.</p>
                    ) : (
                        orders.map((order) => (
                            <div key={order._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Order ID: {order._id}</h3>
                                        <p className="text-sm text-gray-500">User: {order.userName} ({order.userPhone})</p>
                                        <p className="text-sm text-gray-500">Product: {order.modelName}</p>
                                        <p className="text-sm text-gray-500">Factory: {order.factoryName}</p>
                                        <div className="mt-2 text-sm text-gray-700">
                                            Address: {order.userAddress}
                                        </div>
                                         <p className="text-sm text-gray-700 font-medium mt-1">Manufacturer Phone: {order.manufacturerPhone}</p>
                                    </div>

                                    {order.productImage && (
                                        <div className="flex-shrink-0">
                                            <img 
                                                src={`http://localhost:3000/${order.productImage.path}`} 
                                                alt="Product" 
                                                className="h-24 w-24 object-cover rounded-md border"
                                            />
                                        </div>
                                    )}
                                    
                                    <button 
                                        onClick={() => completeOrder(order._id)}
                                        className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                                    >
                                        <CheckCircle size={18} className="mr-2" /> Mark Complete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </MainLayout>
    );
};

export default AdminOrders;
