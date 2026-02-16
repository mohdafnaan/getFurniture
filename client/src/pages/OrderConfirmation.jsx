import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import MainLayout from "../layouts/MainLayout";
import {
  Loader,
  ArrowLeft,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../utils/imageUtils";

const OrderConfirmation = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get("/private/products");
      const foundProduct = data.find((p) => p._id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast.error("Product not found");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to load product details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      await api.post(`/private/place-order/${productId}`);
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const nextImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length,
      );
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader className="animate-spin text-amber-700" size={48} />
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <p className="text-gray-500">Product not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order Confirmation
          </h1>
          <p className="text-gray-600">
            Review the product details before confirming your order
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery Section */}
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square">
                <AnimatePresence mode="wait">
                  {product.images && product.images.length > 0 ? (
                    <motion.img
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={getImageUrl(product.images[currentImageIndex].path)}
                      alt={`${product.modelName} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </AnimatePresence>

                {/* Image Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronLeft size={24} className="text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronRight size={24} className="text-gray-800" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-amber-700 ring-2 ring-indigo-200"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      <img
                        src={getImageUrl(image.path)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              {/* Model Name */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.modelName}
                </h2>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Model Name
                </p>
              </div>

              {/* Manufacturer Name */}
              <div className="border-t pt-4">
                <p className="text-lg font-semibold text-gray-800">
                  {product.manufacturerName || "N/A"}
                </p>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Manufacturer
                </p>
              </div>

              {/* Factory Name */}
              <div className="border-t pt-4">
                <p className="text-lg font-semibold text-gray-800">
                  {product.factoryName || "GetFurniture Factory"}
                </p>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Factory
                </p>
              </div>

              {/* Price Range */}
              <div className="border-t pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-amber-700">
                    ₹{product.priceRange?.min || 0}
                  </span>
                  <span className="text-xl text-gray-500">-</span>
                  <span className="text-3xl font-bold text-amber-700">
                    ₹{product.priceRange?.max || 0}
                  </span>
                </div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mt-1">
                  Price Range
                </p>
              </div>

              {/* Full Description */}
              <div className="border-t pt-4">
                <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  Full Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || "No description available"}
                </p>
              </div>

              {/* Category (Additional Info) */}
              {product.category && (
                <div className="border-t pt-4">
                  <p className="text-lg font-semibold text-gray-800 capitalize">
                    {product.category}
                  </p>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    Category
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Confirm Order Button */}
          <div className="bg-gray-50 px-8 py-6 border-t">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full bg-amber-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isPlacingOrder ? (
                <>
                  <Loader className="animate-spin" size={24} />
                  Placing Order...
                </>
              ) : (
                <>
                  <ShoppingBag size={24} />
                  Confirm Order
                </>
              )}
            </motion.button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Our team will contact you shortly after placing the order
            </p>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default OrderConfirmation;
