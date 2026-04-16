import { useEffect, useState } from "react";
import api from "../utils/api";
import GlobalLoader from "../components/GlobalLoader";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import useToast from "../components/useToast";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import {
  Star, ShoppingCart, Search, Filter, CheckCircle, Heart, Zap, Users
} from "lucide-react";

export default function Services() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const { toast, showToast } = useToast();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
    fetchWishlist();
  }, []);

  useEffect(() => {
    let data = [...services];

    if (search) {
      data = data.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "priceLow") {
      data.sort((a, b) => a.price - b.price);
    }
    if (sort === "priceHigh") {
      data.sort((a, b) => b.price - a.price);
    }
    if (sort === "rating") {
      data.sort((a, b) => (b.realAvgRating || 0) - (a.realAvgRating || 0));
    }

    setFiltered(data);
  }, [search, sort, services]);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      let data = res.data;

      const servicesWithRealRatings = await Promise.all(
        data.map(async (service) => {
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

      setServices(servicesWithRealRatings);
      setFiltered(servicesWithRealRatings);
    } catch {
      setServices([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      const wishlistIds = res.data.map(item => item._id || item);
      setWishlist(wishlistIds);
    } catch (err) {
      console.error("Failed to load wishlist");
    }
  };

  const handleToggleWishlist = async (serviceId) => {
    const isWished = wishlist.includes(serviceId);
    if (isWished) {
      setWishlist((prev) => prev.filter((id) => id !== serviceId));
      showToast("Removed from wishlist", "info");
    } else {
      setWishlist((prev) => [...prev, serviceId]);
      showToast("Saved to wishlist ❤️", "success");
    }

    try {
      await api.put("/wishlist/toggle", { serviceId });
    } catch (err) {
      fetchWishlist();
      showToast("Failed to sync wishlist", "error");
    }
  };

  const handleAddToCart = (service) => {
    addToCart({
      _id: service._id,
      name: service.name,
      price: service.price,
    });
    showToast("Added to cart 🛒", "success");
  };

  const defaultDescription = "Professional service designed to deliver reliable and efficient solutions for modern business needs.";

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

  if (loading) return <GlobalLoader text="Loading services..." />;

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-7xl mx-auto mt-8 px-4 pb-12 space-y-6 font-sans antialiased animate-fadeIn transition-colors duration-300">

        <div className="w-full h-[250px] sm:h-[300px] rounded-3xl overflow-hidden shadow-2xl relative">
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="w-full h-full"
          >
            <SwiperSlide>
              <div className="relative w-full h-full bg-gradient-to-r from-blue-900 to-indigo-800 flex items-center px-8 sm:px-16 overflow-hidden">
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-blue-500/30 text-blue-200 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-lg mb-3 border border-blue-400/30">
                    Premium Category
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
                    Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Business</span>
                  </h2>
                  <p className="text-blue-100 font-medium text-sm sm:text-base max-w-md">
                    Discover handpicked premium IT products and services built for the modern enterprise.
                  </p>
                </div>
              </div>
            </SwiperSlide>
            
            <SwiperSlide>
              <div className="relative w-full h-full bg-gradient-to-r from-purple-900 to-slate-900 flex items-center px-8 sm:px-16 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 border border-purple-400/30">
                    <Zap size={24} className="text-purple-400" />
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
                    Flash <span className="text-purple-400">Sale</span> Live
                  </h2>
                  <p className="text-purple-100 font-medium text-sm sm:text-base max-w-md">
                    Use code <strong>SERV5</strong> at checkout to get an instant 5% discount on all installation services.
                  </p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between transition-colors sticky top-20 z-40">
          <div className="relative w-full md:w-1/2 group">
            <Search size={18} className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-2.5 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hidden sm:block">
              <Filter size={18} />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full md:w-56 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
            >
              <option value="">Sort by Relevance</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="pt-6">
            <EmptyState
              title="No products found"
              description="Try adjusting your search terms or filters to find what you're looking for."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
            {filtered.map((service, index) => {
              const exists = cart.find((s) => s._id === service._id);
              const isWished = wishlist.includes(service._id); 
              
              // 🔥 SMART PLACEHOLDER LOGIC 🔥
              // Agar photo nahi hai ya ud gayi hai, toh product ka naam generate hoke photo ban jayega
              const encodedName = encodeURIComponent(service.name || "Product");
              const smartPlaceholder = `https://placehold.co/600x400/f8fafc/334155?text=${encodedName}`;
              
              const imageSrc = service.image || smartPlaceholder;

              const avgRating = service.realAvgRating || 0;
              const totalUsers = service.realTotalReviews || 0;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
                  key={service._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden group flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-4 cursor-pointer" onClick={() => navigate(`/services/${service._id}`)}>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(service._id);
                      }}
                      className="absolute top-3 right-3 z-20 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-md hover:scale-110 active:scale-95 transition-all"
                      title={isWished ? "Remove from wishlist" : "Save for later"}
                    >
                      <Heart
                        size={16}
                        className={`transition-colors duration-300 ${
                          isWished ? "text-rose-500 fill-rose-500" : "text-slate-400 dark:text-slate-300"
                        }`}
                      />
                    </button>

                    {/* 🔥 IMAGE WITH SMART ERROR FALLBACK */}
                    <img
                      src={imageSrc}
                      alt={service.name}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = smartPlaceholder; // Error aane par naam wali photo aayegi
                      }}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out mix-blend-multiply dark:mix-blend-normal"
                    />
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                      {index === 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1">
                          <Zap size={10} fill="currentColor" /> Bestseller
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           if(!exists) handleAddToCart(service);
                         }}
                         className={`font-bold px-6 py-2.5 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 text-sm shadow-xl
                           ${exists ? "bg-white text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-500"}`}
                       >
                         {exists ? <><CheckCircle size={16}/> In Cart</> : <><ShoppingCart size={16}/> Quick View</>}
                       </button>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 bg-white dark:bg-slate-900 z-20 relative border-t border-slate-50 dark:border-slate-800">
                    <div className="flex-1 cursor-pointer" onClick={() => navigate(`/services/${service._id}`)}>
                      <h2 className="text-lg font-extrabold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
                        {service.name}
                      </h2>
                      
                      <div className="flex flex-col gap-1 mb-3">
                        <div className="flex items-center gap-1.5">
                          <div className="flex">
                            {renderDynamicStars(avgRating)}
                          </div>
                          <span className="text-sm font-bold text-slate-800 dark:text-white">
                            {avgRating > 0 ? avgRating.toFixed(1) : "New"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          <Users size={12} />
                          {totalUsers > 0 ? `Reviewed by ${totalUsers} users` : "No reviews yet"}
                        </div>
                      </div>

                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4 font-medium">
                        {service.description || defaultDescription}
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
                        onClick={() => handleAddToCart(service)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300
                        ${
                          exists
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed"
                            : "bg-slate-50 text-slate-700 hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-blue-600 shadow-sm"
                        }`}
                      >
                        {exists ? <CheckCircle size={18} /> : <ShoppingCart size={18} />}
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