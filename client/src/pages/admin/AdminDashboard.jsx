import { useState, useEffect } from "react";
import api from "../../utils/api";
import MainLayout from "../../layouts/MainLayout";
import toast from "react-hot-toast";
import { Trash2, Plus, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [formData, setFormData] = useState({
    modelName: "",
    manufacturerName: "",
    manufacturerPhone: "",
    factoryName: "",
    category: "",
    description: "",
    minPrice: "",
    maxPrice: "",
    images: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/private/get-all-products");
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const confirmDelete = (id) => {
    setDeletingProductId(id);
  };

  const handleDeleteProduct = async () => {
    if (!deletingProductId) return;
    try {
      await api.delete(`/private/delete-product/${deletingProductId}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      e.target.value = ""; // Reset the input
      return;
    }
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.images || formData.images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (key === "images") {
        if (formData.images) {
          Array.from(formData.images).forEach((file) => {
            data.append("images", file);
          });
        }
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      // DO NOT set Content-Type header - let browser set it with boundary
      await api.post("/private/add-product", data);
      toast.success("Product added successfully");
      setIsAdding(false);
      setFormData({
        modelName: "",
        manufacturerName: "",
        manufacturerPhone: "",
        factoryName: "",
        category: "",
        description: "",
        minPrice: "",
        maxPrice: "",
        images: null,
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
          className="flex items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition-colors"
        >
          <Plus size={20} /> {isAdding ? "Cancel" : "Add Product"}
        </button>
      </div>

      <AnimatePresence>
        {deletingProductId && (
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
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Delete Product?
                </h3>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeletingProductId(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={handleDeleteProduct}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow mb-8 overflow-hidden"
          >
            <h2 className="text-xl font-semibold mb-4">New Product Details</h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Model Name"
                className="border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.modelName}
                onChange={(e) =>
                  setFormData({ ...formData, modelName: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Category (e.g. Sofa, Bed)"
                className="border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Manufacturer Name"
                className="border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.manufacturerName}
                onChange={(e) =>
                  setFormData({ ...formData, manufacturerName: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Manufacturer Phone"
                className="border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.manufacturerPhone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    manufacturerPhone: e.target.value,
                  })
                }
                required
              />
              <input
                type="text"
                placeholder="Factory Name"
                className="border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.factoryName}
                onChange={(e) =>
                  setFormData({ ...formData, factoryName: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                className="border p-2 rounded md:col-span-2 focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  className="border p-2 rounded w-full focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.minPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, minPrice: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  className="border p-2 rounded w-full focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.maxPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, maxPrice: e.target.value })
                  }
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images (Max 5 images)
                  {formData.images && formData.images.length > 0 && (
                    <span className="ml-2 text-amber-700">
                      {formData.images.length} image
                      {formData.images.length > 1 ? "s" : ""} selected
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileChange}
                  className="border p-2 rounded w-full focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="md:col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
              >
                Submit Product
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Factory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price Range
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.modelName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {product.factoryName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col sm:block">
                      <span>₹{product.priceRange?.min}</span>
                      <span className="sm:hidden text-xs text-gray-400">
                        {" "}
                        to{" "}
                      </span>
                      <span className="hidden sm:inline"> - </span>
                      <span>₹{product.priceRange?.max}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => confirmDelete(product._id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center p-4 text-gray-500">
              No products found.
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default AdminDashboard;
