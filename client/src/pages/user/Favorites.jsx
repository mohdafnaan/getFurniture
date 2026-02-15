import { useState, useEffect } from 'react';
import api from '../../utils/api';
import MainLayout from '../../layouts/MainLayout';
import toast from 'react-hot-toast';
import { Trash2, ShoppingBag, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const { data } = await api.get('/private/favourites');
            setFavorites(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    // Helper to get product details
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
             try {
                const { data } = await api.get('/private/products');
                setAllProducts(data);
             } catch(e) { console.error(e); }
        }
        fetchAll();
    }, []);

    const getFavoriteProducts = () => {
        return allProducts.filter(p => favorites.includes(p._id));
    };

    const removeFavorite = async (id) => {
        try {
            await api.delete(`/private/remove-from-favourites/${id}`);
            toast.success("Removed from favorites");
            setFavorites(favorites.filter(favId => favId !== id)); // Optimistically update
            // Also need to re-filter favoriteProducts since it depends on favorites state, 
            // but in this component structure, `favoriteProducts` is derived from `allProducts` and `favorites` on each render, so it should auto-update.
        } catch (error) {
            toast.error("Failed to remove");
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

    const favoriteProducts = getFavoriteProducts();

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Favorites</h1>
            {loading ? (
                <p>Loading...</p>
            ) : favoriteProducts.length === 0 ? (
                <p className="text-gray-500">No favorites yet.</p>
            ) : (
                 <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                 >
                    <AnimatePresence>
                        {favoriteProducts.map((product) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={product._id} 
                                className="bg-white rounded-lg shadow overflow-hidden relative"
                            >
                                <div className="h-48 bg-gray-200">
                                    {product.images && product.images.length > 0 ? (
                                        <img src={import.meta.env.VITE_URL ? `${import.meta.env.VITE_URL}/${product.images[0].path}` : `/${product.images[0].path}`} alt={product.modelName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold">{product.modelName}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <button 
                                            onClick={() => removeFavorite(product._id)}
                                            className="text-red-600 flex items-center gap-1 text-sm hover:underline"
                                        >
                                            <Trash2 size={16} /> Remove
                                        </button>
                                        <button 
                                            onClick={() => confirmOrder(product._id)}
                                            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-1"
                                        >
                                            <ShoppingBag size={14} /> Order
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                 </motion.div>
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

export default Favorites;
