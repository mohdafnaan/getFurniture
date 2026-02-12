import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Loader, Heart, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { user, role } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'user') {
        const fetchData = async () => {
            try {
                const [productsRes, favoritesRes] = await Promise.all([
                    api.get('/private/products'),
                    api.get('/private/favourites')
                ]);
                setProducts(productsRes.data);
                setFavorites(favoritesRes.data.map(f => typeof f === 'object' ? f.productId : f)); // Handle potential object/string difference
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    } else {
        setLoading(false);
    }
  }, [role, navigate]);

  const addToFavorites = async (productId) => {
    try {
        if (favorites.includes(productId)) {
            await api.delete(`/private/remove-from-favourites/${productId}`);
            setFavorites(prev => prev.filter(id => id !== productId));
            toast.success("Removed from favorites");
        } else {
            await api.post(`/private/add-to-favourites/${productId}`);
            setFavorites(prev => [...prev, productId]);
            toast.success("Added to favorites");
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update favorites");
    }
  };

  const [orderingProductId, setOrderingProductId] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const confirmOrder = (productId) => {
    setOrderingProductId(productId);
  };

  const handlePlaceOrder = async () => {
    if (!orderingProductId) return;
    setIsPlacingOrder(true);
    try {
        await api.post(`/private/place-order/${orderingProductId}`);
        toast.success("Order placed successfully!");
        setOrderingProductId(null);
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
        setIsPlacingOrder(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
      const matchesSearch = product.modelName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ['All', ...new Set(products.map(p => p.category))];

  if (!role) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Welcome to GetFurniture
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                Premium furniture directly from manufacturers. Login to browse our exclusive catalog.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Link to="/login" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Get Started
                </Link>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
      return (
          <MainLayout>
              <div className="flex justify-center items-center h-64">
                  <Loader className="animate-spin text-indigo-600" size={48} />
              </div>
          </MainLayout>
      )
  }

  return (
    <MainLayout>
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <h1 className="text-3xl font-bold text-gray-900">Our Collection</h1>
            <p className="text-gray-500 mb-6">Explore the best furniture for your home.</p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search furniture..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        {uniqueCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>
        </motion.div>

        {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        key={product._id} 
                        layout
                        className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
                    >
                        <div className="h-48 bg-gray-200 relative">
                             {product.images && product.images.length > 0 ? (
                                <img 
                                    src={`http://localhost:3000/${product.images[0].path}`} 
                                    alt={product.modelName} 
                                    className="w-full h-full object-cover"
                                />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                             )}
                             <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => addToFavorites(product._id)}
                                className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 ${
                                    favorites.includes(product._id) ? 'text-red-500 fill-current' : 'text-gray-400'
                                }`}
                             >
                                <Heart size={20} className={favorites.includes(product._id) ? 'fill-red-500 text-red-500' : ''} />
                             </motion.button>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900">{product.modelName}</h3>
                            <p className="text-xs text-indigo-600 font-medium mb-1">{product.factoryName || "GetFurniture Factory"}</p>
                            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                            <p className="text-sm text-gray-700 line-clamp-2 mb-4">{product.description}</p>
                            
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <span className="text-indigo-600 font-bold">
                                        ₹{product.priceRange?.min || 0} - ₹{product.priceRange?.max || 0}
                                    </span>
                                </div>
                                <motion.button 
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => confirmOrder(product._id)}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                                >
                                    <ShoppingBag size={16} /> Order
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}

        <AnimatePresence>
            {orderingProductId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-indigo-100 p-3 rounded-full mb-4">
                                <ShoppingBag className="text-indigo-600" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Order?</h3>
                            <p className="text-gray-500 mb-6">Are you sure you want to place this order? Our team will contact you shortly.</p>
                            <div className="flex gap-3 w-full">
                                <button 
                                    onClick={() => setOrderingProductId(null)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handlePlaceOrder}
                                    disabled={isPlacingOrder}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isPlacingOrder ? (
                                        <>
                                            <Loader className="animate-spin" size={18} /> Placing...
                                        </>
                                    ) : (
                                        "Yes, Place Order"
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </MainLayout>
  );
};

export default Home;