import { useState, useEffect } from 'react';
import api from '../../utils/api';
import MainLayout from '../../layouts/MainLayout';
import toast from 'react-hot-toast';
import { Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        modelName: '',
        manufacturerName: '',
        manufacturerPhone: '',
        factoryName: '',
        category: '',
        description: '',
        minPrice: '',
        maxPrice: '',
        images: null
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/private/get-all-products');
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/private/delete-product/${id}`);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, images: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            if (key === 'images') {
                if (formData.images) {
                    for (let i = 0; i < formData.images.length; i++) {
                        data.append('images', formData.images[i]);
                    }
                }
            } else {
                data.append(key, formData[key]);
            }
        }

        try {
            await api.post('/private/add-product', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Product added successfully");
            setIsAdding(false);
            setFormData({
                modelName: '',
                manufacturerName: '',
                manufacturerPhone: '',
                factoryName: '',
                category: '',
                description: '',
                minPrice: '',
                maxPrice: '',
                images: null
            });
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add product");
        }
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} /> {isAdding ? 'Cancel' : 'Add Product'}
                </button>
            </div>

            <AnimatePresence>
            {isAdding && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-white p-6 rounded-lg shadow mb-8 overflow-hidden"
                >
                    <h2 className="text-xl font-semibold mb-4">New Product Details</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Model Name" className="border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.modelName} onChange={e => setFormData({...formData, modelName: e.target.value})} required />
                        <input type="text" placeholder="Category (e.g. Sofa, Bed)" className="border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                        <input type="text" placeholder="Manufacturer Name" className="border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.manufacturerName} onChange={e => setFormData({...formData, manufacturerName: e.target.value})} />
                        <input type="text" placeholder="Manufacturer Phone" className="border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.manufacturerPhone} onChange={e => setFormData({...formData, manufacturerPhone: e.target.value})} />
                        <input type="text" placeholder="Factory Name" className="border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.factoryName} onChange={e => setFormData({...formData, factoryName: e.target.value})} />
                        <textarea placeholder="Description" className="border p-2 rounded md:col-span-2 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        <div className="flex gap-2">
                             <input type="number" placeholder="Min Price" className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.minPrice} onChange={e => setFormData({...formData, minPrice: e.target.value})} required />
                             <input type="number" placeholder="Max Price" className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.maxPrice} onChange={e => setFormData({...formData, maxPrice: e.target.value})} required />
                        </div>
                        <input type="file" multiple onChange={handleFileChange} className="border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" required />
                        
                        <button type="submit" className="md:col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">Submit Product</button>
                    </form>
                </motion.div>
            )}
            </AnimatePresence>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-x-auto bg-white rounded-lg shadow"
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.modelName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.factoryName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₹{product.priceRange?.min} - ₹{product.priceRange?.max}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900 transition-colors">
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && <div className="text-center p-4 text-gray-500">No products found.</div>}
            </motion.div>
        </MainLayout>
    );
};

export default AdminDashboard;
