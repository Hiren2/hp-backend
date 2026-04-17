import { useEffect, useState } from "react";
import api from "../utils/api";
import GlobalLoader from "../components/GlobalLoader";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import useToast from "../components/useToast";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, HeartOff, CheckCircle, ArrowRight, Heart } from "lucide-react";

export default function Wishlist() {
  const [wishlistServices, setWishlistServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const { toast, showToast } = useToast();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlistDetails();
  }, []);

  const fetchWishlistDetails = async () => {
    try {
      // 🔥 FIX 1: Updated API path to the secure auth route
      const res = await api.get("/auth/wishlist");
      const allServicesRes = await api.get("/services");
      const allServices = allServicesRes.data;

      const wishlistIds = res.data.map(item => typeof item === 'object' ? item._id : item);
      const populatedWishlist = allServices.filter(s => wishlistIds.includes(s._id));

      const servicesWithRealRatings = await Promise.all(
        populatedWishlist.map(async (service) => {
          try {
            const reviewRes = await api.get(`/reviews/service/${service._id}`);
            const reviews = reviewRes.data;
            if (reviews && reviews.length > 0) {
              const total = reviews.length;
              const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
              return { ...service, realAvgRating: avg, realTotalReviews: total };
            }
            return { ...service, realAvgRating: service.averageRating || 0, realTotalReviews: service.totalReviews || 0 };
          } catch (error) {
            return { ...service, realAvgRating: service.averageRating || 0, realTotalReviews: service.totalReviews || 0 };
          }
        })
      );

      setWishlistServices(servicesWithRealRatings);
    } catch (err) {
      console.error("Failed to load wishlist details");
    } finally {
      setLoading(false);
    }
  };

  // Default Remove Function (Just deletes from wishlist)
  const handleRemoveFromWishlist = async (serviceId) => {
    setWishlistServices((prev) => prev.filter((s) => s._id !== serviceId));
    showToast("Removed from wishlist 🗑️", "info");

    try {
      // 🔥 FIX 2: Updated API path for toggle
      await api.put("/auth/wishlist/toggle", { serviceId });
    } catch (err) {
      fetchWishlistDetails(); 
      showToast("Failed to remove item", "error");
    }
  };

  // 🔥 ENTERPRISE UX LOGIC: Add to Cart + Remove from Wishlist simultaneously
  const handleMoveToCart = async (service) => {
    // 1. Add to Cart Context
    addToCart({
      _id: service._id,
      name: service.name,
      price: service.price,
    });
    
    showToast("Moved to cart 🛒", "success");

    // 2. Optimistically remove from Wishlist UI
    setWishlistServices((prev) => prev.filter((s) => s._id !== service._id));

    // 3. Inform Backend to remove from Wishlist DB
    try {
      // 🔥 FIX 3: Updated API path for toggle
      await api.put("/auth/wishlist/toggle", { serviceId: service._id });
    } catch (err) {
      console.warn("Failed to sync wishlist deletion in background.");
      // We don't bother the user with an error toast here if cart addition was successful
    }
  };

  const renderDynamicStars = (avgRating) => {
    const rating = avgRating || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} size={14} fill="currentColor" className="text-yellow-400" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<Star key={i} size={14} fill="currentColor" className="text-yellow-400 opacity-40" />);
      } else {
        stars.push(<Star key={i} size={14} className="text-slate-200 dark:text-slate-700" />);
      }
    }
    return stars;
  };

  if (loading) return <GlobalLoader text="Loading your wishlist..." />;

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-7xl mx-auto mt-8 px-4 pb-12 space-y-6 font-sans antialiased animate-fadeIn transition-colors duration-300">

        <div className="relative bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 text-white p-6 sm:p-10 rounded-[2rem] shadow-xl shadow-rose-500/20 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold flex items-center gap-3 tracking-tight">
                <Heart className="fill-white text-white drop-shadow-md" size={32} /> Your Saved Items
              </h1>
              <p className="text-rose-100 mt-2 text-sm sm:text-base font-medium max-w-xl">
                All your favorite products and services in one place. Move them to cart when you're ready!
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/30 flex items-center gap-2">
              <span className="text-xl font-black text-white">{wishlistServices.length}</span>
              <span className="text-xs font-bold tracking-wider uppercase text-rose-100">Items</span>
            </div>
          </div>
        </div>

        {wishlistServices.length === 0 ? (
          <div className="pt-10">
            <EmptyState
              title="Your Wishlist is Empty"
              description="Looks like you haven't saved any items yet. Browse our services and tap the heart icon to save them here."
            />
            <div className="flex justify-center mt-6">
              <button onClick={() => navigate("/services")} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-rose-500/30">
                Browse Marketplace <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
            {wishlistServices.map((service, index) => {
              const exists = cart.find((s) => s._id === service._id);
              const avgRating = service.realAvgRating || 0;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
                  key={service._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden group flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-white flex items-center justify-center p-4 cursor-pointer border-b border-slate-50" onClick={() => navigate(`/services/${service._id}`)}>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(service._id);
                      }}
                      className="absolute top-3 right-3 z-20 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-md hover:scale-110 active:scale-95 transition-all group/btn"
                      title="Remove from wishlist"
                    >
                      <HeartOff
                        size={16}
                        className="text-rose-500 transition-colors duration-300 group-hover/btn:text-slate-400"
                      />
                    </button>

                    <img
                      src={service.image || "https://via.placeholder.com/400"}
                      alt={service.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           if(!exists) handleMoveToCart(service); // 🔥 MOVES TO CART & DELETES FROM WISHLIST
                         }}
                         className={`font-bold px-6 py-2.5 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 text-sm shadow-xl
                           ${exists ? "bg-white text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-500"}`}
                       >
                         {exists ? <><CheckCircle size={16}/> In Cart</> : <><ShoppingCart size={16}/> Move to Cart</>}
                       </button>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 bg-white dark:bg-slate-900 z-20 relative">
                    <div className="flex-1 cursor-pointer" onClick={() => navigate(`/services/${service._id}`)}>
                      <h2 className="text-lg font-extrabold text-slate-800 dark:text-white group-hover:text-rose-600 transition-colors line-clamp-1 mb-1.5">
                        {service.name}
                      </h2>
                      
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex">
                          {renderDynamicStars(avgRating)}
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">
                          {avgRating > 0 ? avgRating.toFixed(1) : "New"}
                        </span>
                      </div>

                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4 font-medium">
                        {service.description || "Professional service designed to deliver reliable solutions."}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Price</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-sm font-bold text-slate-400">₹</span>
                          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            {service.price}
                          </span>
                        </div>
                      </div>

                      <button
                        disabled={exists}
                        onClick={() => handleMoveToCart(service)} // 🔥 THE MASTER LOGIC HERE TOO
                        className={`px-4 py-2 flex items-center justify-center rounded-xl font-bold transition-all duration-300 text-sm
                        ${
                          exists
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/20"
                        }`}
                      >
                        {exists ? "Added" : "Move to Cart"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}