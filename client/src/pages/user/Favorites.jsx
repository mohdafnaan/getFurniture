import { useState, useEffect } from "react";
import api from "../../utils/api";
import MainLayout from "../../layouts/MainLayout";
import toast from "react-hot-toast";
import { Trash2, ShoppingBag, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get("/private/favourites");
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
        const { data } = await api.get("/private/products");
        setAllProducts(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAll();
  }, []);

  const getFavoriteProducts = () => {
    return allProducts.filter((p) => favorites.includes(p._id));
  };

  const removeFavorite = async (id) => {
    try {
      await api.delete(`/private/remove-from-favourites/${id}`);
      toast.success("Removed from favorites");
      setFavorites(favorites.filter((favId) => favId !== id)); // Optimistically update
      // Also need to re-filter favoriteProducts since it depends on favorites state,
      // but in this component structure, `favoriteProducts` is derived from `allProducts` and `favorites` on each render, so it should auto-update.
    } catch (error) {
      toast.error("Failed to remove");
    }
  };

  const handleOrderClick = (productId) => {
    navigate(`/order-confirmation/${productId}`);
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
                    <img
                      src={getImageUrl(product.images[0].path)}
                      alt={product.modelName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{product.modelName}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => removeFavorite(product._id)}
                      className="text-red-600 flex items-center gap-1 text-sm hover:underline"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                    <button
                      onClick={() => handleOrderClick(product._id)}
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
    </MainLayout>
  );
};

export default Favorites;
