import { useEffect, useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, Loader, Heart, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../utils/imageUtils";

const Home = () => {
  const { user, role } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "user") {
      const fetchData = async () => {
        try {
          const [productsRes, favoritesRes] = await Promise.all([
            api.get("/private/products"),
            api.get("/private/favourites"),
          ]);
          setProducts(productsRes.data);
          setFavorites(
            favoritesRes.data.map((f) =>
              typeof f === "object" ? f.productId : f,
            ),
          ); // Handle potential object/string difference
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
        setFavorites((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from favorites");
      } else {
        await api.post(`/private/add-to-favourites/${productId}`);
        setFavorites((prev) => [...prev, productId]);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update favorites",
      );
    }
  };

  const handleOrderClick = (productId) => {
    navigate(`/order-confirmation/${productId}`);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ["All", ...new Set(products.map((p) => p.category))];

  if (!role) {
    return (
      <MainLayout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MjQwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtMi4yLTEuOC00LTQtNHMtNCAxLjgtNCA0IDEuOCA0IDQgNCA0LTEuOCA0LTR6bTEwIDEwYzAtMi4yLTEuOC00LTQtNHMtNCAxLjgtNCA0IDEuOCA0IDQgNCA0LTEuOCA0LTR6TTI0IDE0YzAtMi4yLTEuOC00LTQtNHMtNCAxLjgtNCA0IDEuOCA0IDQgNCA0LTEuOCA0LTR6bTEwIDEwYzAtMi4yLTEuOC00LTQtNHMtNCAxLjgtNCA0IDEuOCA0IDQgNCA0LTEuOCA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
                Premium Furniture,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600">
                  Factory Direct
                </span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-gray-700 leading-relaxed">
                Connect directly with manufacturers. No middlemen, no markups.
                Just beautiful, affordable furniture for your dream home.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Start Shopping Now
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-amber-900 bg-white hover:bg-amber-50 border-2 border-amber-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem We Solve Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose GetFurnitures?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Traditional furniture shopping is broken. We're here to fix it.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "No Middlemen",
                  description:
                    "Connect directly with manufacturers and save up to 40% on premium furniture. Why pay retail when you can buy factory direct?",
                  icon: "💰",
                },
                {
                  title: "Verified Quality",
                  description:
                    "Every manufacturer is vetted and verified. Browse detailed specifications, high-resolution images, and real customer reviews.",
                  icon: "✨",
                },
                {
                  title: "Transparent Pricing",
                  description:
                    "See the real factory price. No hidden fees, no surprise charges. What you see is what you pay.",
                  icon: "🔍",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-amber-200"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Getting your dream furniture is easier than ever
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Browse Catalog",
                  description:
                    "Explore thousands of furniture pieces from verified manufacturers.",
                },
                {
                  step: "02",
                  title: "Select & Customize",
                  description:
                    "Choose your perfect piece and customize it to your needs.",
                },
                {
                  step: "03",
                  title: "Direct Order",
                  description:
                    "Place your order directly with the manufacturer - no middlemen.",
                },
                {
                  step: "04",
                  title: "Delivered",
                  description:
                    "Get your furniture delivered straight to your doorstep.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative"
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-amber-200">
                    <div className="text-6xl font-extrabold text-amber-200 mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-amber-400 text-3xl">
                      →
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Categories Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Explore Our Categories
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From living rooms to bedrooms - we have everything you need
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Living Room",
                  description: "Sofas, coffee tables, TV units & more",
                  gradient: "from-amber-100 to-orange-100",
                },
                {
                  name: "Bedroom",
                  description: "Beds, wardrobes, nightstands & more",
                  gradient: "from-orange-100 to-red-100",
                },
                {
                  name: "Dining",
                  description: "Dining tables, chairs, cabinets & more",
                  gradient: "from-amber-100 to-yellow-100",
                },
              ].map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`bg-gradient-to-br ${category.gradient} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group`}
                >
                  <div className="h-48 bg-white/50 rounded-lg mb-6 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/70 transition-colors duration-300">
                    <span className="text-6xl">🪑</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-700">{category.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about GetFurniture
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="space-y-4">
                {[
                  {
                    question: "How does GetFurniture work?",
                    answer:
                      "GetFurniture connects you directly with verified furniture manufacturers. You browse our catalog, select your furniture, and place orders directly with the factory - cutting out middlemen and saving you money.",
                  },
                  {
                    question: "Is the quality guaranteed?",
                    answer:
                      "Absolutely! All our manufacturers are thoroughly vetted and verified. We provide detailed specifications, high-resolution images, and real customer reviews for each product. Plus, you can communicate directly with manufacturers for any questions.",
                  },
                  {
                    question: "How much can I save?",
                    answer:
                      "By buying directly from manufacturers, you typically save 30-40% compared to traditional retail prices. There are no middlemen markups, showroom costs, or hidden fees.",
                  },
                  {
                    question: "What about delivery?",
                    answer:
                      "Delivery terms are set by each manufacturer and clearly displayed on product pages. Most offer direct delivery to your location. You can discuss delivery details directly with the manufacturer before placing your order.",
                  },
                  {
                    question: "Can I customize my furniture?",
                    answer:
                      "Yes! One of the biggest advantages of buying factory-direct is the ability to customize. Many manufacturers offer customization options for dimensions, materials, colors, and finishes. Just reach out to them directly through our platform.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                  >
                    <details className="group">
                      <summary className="flex justify-between items-center cursor-pointer list-none py-4 text-lg font-semibold text-gray-900 hover:text-amber-700 transition-colors">
                        <span>{faq.question}</span>
                        <span className="transition group-open:rotate-180">
                          <svg
                            fill="none"
                            height="24"
                            shapeRendering="geometricPrecision"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            width="24"
                          >
                            <path d="M6 9l6 6 6-6"></path>
                          </svg>
                        </span>
                      </summary>
                      <p className="text-gray-600 pb-4 leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-700 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Space?
              </h2>
              <p className="text-xl text-amber-50 mb-10 max-w-2xl mx-auto">
                Join thousands of happy customers who found their perfect
                furniture at unbeatable prices.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg text-amber-900 bg-white hover:bg-amber-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Get Started Free Today
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-white text-2xl font-bold mb-4">
                  GetFurnitures
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Premium furniture directly from manufacturers. No middlemen,
                  no markups.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/login"
                      className="hover:text-amber-400 transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="hover:text-amber-400 transition-colors"
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Categories</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      Living Room
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      Bedroom
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      Dining
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      Office
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400">
                © 2026 GetFurniture. All rights reserved. Built with ❤️ for
                furniture lovers.
              </p>
            </div>
          </div>
        </footer>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-amber-700" size={48} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Our Collection</h1>
        <p className="text-gray-500 mb-6">
          Explore the best furniture for your home.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-amber-200 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
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
              className="block w-full pl-10 pr-3 py-2 border border-amber-200 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No products found matching your criteria.
          </p>
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
              className="bg-white rounded-lg shadow-md border border-amber-100 overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-48 bg-gray-200 relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={getImageUrl(product.images[0].path)}
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
                    favorites.includes(product._id)
                      ? "text-red-500 fill-current"
                      : "text-gray-400"
                  }`}
                >
                  <Heart
                    size={20}
                    className={
                      favorites.includes(product._id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }
                  />
                </motion.button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.modelName}
                </h3>
                <p className="text-xs text-amber-700 font-medium mb-1">
                  {product.factoryName || "GetFurniture Factory"}
                </p>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-amber-700 font-bold">
                      ₹{product.priceRange?.min || 0} - ₹
                      {product.priceRange?.max || 0}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOrderClick(product._id)}
                    className="bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                  >
                    <ShoppingBag size={16} /> Order
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Home;
