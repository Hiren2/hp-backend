import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import api from "../api/api";
import { Star, ShieldCheck, Clock, Zap, MessageSquare, ArrowRight, CheckCircle } from "lucide-react"; 
import GlobalLoader from "../components/GlobalLoader";

import Toast from "../components/Toast";
import useToast from "../components/useToast";
import { useCart } from "../context/CartContext";

export default function ServiceDetail() {
  const params = useParams(); 
  const navigate = useNavigate(); 

  const id = params.id || params.serviceId || window.location.pathname.split("/").pop();

  const { toast, showToast } = useToast(); 
  const { addToCart, cart } = useCart() || { cart: [], addToCart: () => {} }; 

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedServices, setRelatedServices] = useState([]); 
  const [loading, setLoading] = useState(true);

  // ================= 🔥 LOAD DATA =================
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchAllDetails = async () => {
      setLoading(true);
      try {
        const resService = await api.get("/services");
        const found = resService.data.find((s) => String(s._id) === String(id));
        setService(found);

        const resReviews = await api.get(`/reviews/service/${id}`);
        setReviews(resReviews.data);

        const resRelated = await api.get(`/services/${id}/related`);
        setRelatedServices(resRelated.data);

      } catch (err) {
        console.error("Error loading service details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [id]);

  /* ================= HANDLE ADD TO CART ================= */
  const handleAddToCart = () => {
    if (!service) return;
    addToCart({
      _id: service._id,
      name: service.name,
      price: service.price,
    });
    showToast("Added to cart 🛒", "success");
  };

  const isAlreadyInCart = service && cart && cart.some((item) => item._id === service._id);

  // 🔥 FRONTEND BULLETPROOF CALCULATION: Backend fail ho toh bhi UI mein sahi stars dikhenge!
  const displayTotalReviews = reviews.length > 0 ? reviews.length : (service?.totalReviews || 0);
  const displayAvgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) 
    : (service?.averageRating || 0);

  const renderDynamicStars = (avgRating) => {
    const rating = avgRating || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} size={18} fill="currentColor" className="text-amber-500" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<Star key={i} size={18} fill="currentColor" className="text-amber-500 opacity-40" />);
      } else {
        stars.push(<Star key={i} size={18} className="text-amber-500/20" />);
      }
    }
    return stars;
  };

  if (loading) return <GlobalLoader text="Loading service details..." />;
  if (!service) return <div className="text-center mt-20 text-gray-500 font-bold uppercase tracking-widest">Service Not Found</div>;

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-7xl mx-auto mt-8 px-4 pb-20 animate-fadeIn font-sans antialiased">
        
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-white/60 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-white shadow-xl">
          
          <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl bg-white border border-slate-100 flex items-center justify-center p-8">
            <img
              src={service.image || "https://via.placeholder.com/800x600"}
              alt={service.name}
              className="w-full h-[400px] object-contain transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-5 left-5 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Verified Service</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                {service.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                  <div className="flex gap-0.5">
                    {/* 🔥 USING FRONTEND CALCULATION HERE */}
                    {renderDynamicStars(displayAvgRating)}
                  </div>
                  <span className="font-black text-sm text-amber-600 ml-1">
                    {displayAvgRating > 0 ? displayAvgRating.toFixed(1) : "New"}
                  </span>
                </div>
                <span className="text-slate-400 font-bold text-sm tracking-wide">
                  | {displayTotalReviews} Customer Reviews
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-slate-600 font-medium leading-relaxed italic">
                "{service.description}"
              </p>
            </div>

            <div className="flex items-center justify-between py-6 border-y border-slate-100/60">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Rate</p>
                <h2 className="text-5xl font-black text-blue-600 tracking-tighter">₹{service.price}</h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Response Time</p>
                <div className="flex items-center gap-1.5 text-slate-700 font-black justify-end">
                  <Clock size={18} /> Instant
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={isAlreadyInCart}
              className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[2px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl
                ${isAlreadyInCart 
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed" 
                  : "bg-slate-900 text-white hover:bg-blue-600 hover:-translate-y-1"
                }`}
            >
              {isAlreadyInCart ? (
                <>
                  <CheckCircle size={20} /> Already in Cart
                </>
              ) : (
                <>
                  <Zap size={20} fill="currentColor" /> Add to Service Cart
                </>
              )}
            </button>
          </div>
        </div>

        {/* --- REVIEWS LIST (Share Your Experience form REMOVED totally!) --- */}
        <div className="mt-16">
          <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-tighter">
            Customer Stories <span className="text-sm font-bold text-slate-400">({reviews.length})</span>
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-slate-100/50 rounded-[2rem] p-16 text-center border-2 border-dashed border-slate-200">
              <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold italic tracking-wide">No reviews yet. Purchase this service to leave the first review!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r._id} className="bg-white/60 backdrop-blur-md border border-white p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                          {r.user?.image ? <img src={r.user.image} className="w-full h-full rounded-full object-cover"/> : r.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm capitalize leading-tight">{r.user?.name || "Verified Customer"}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= 🔥 SIMILAR SERVICES ================= */}
        {relatedServices.length > 0 && (
          <div className="mt-20 border-t border-slate-200 pt-16">
            <h2 className="text-3xl font-black text-slate-800 mb-8 uppercase tracking-tighter">
              Customers also looked at...
            </h2>
            
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
              {relatedServices.map((rs) => (
                <div 
                  key={rs._id} 
                  onClick={() => navigate(`/services/${rs._id}`)}
                  className="min-w-[280px] w-[280px] bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer snap-start overflow-hidden group flex flex-col"
                >
                  <div className="h-36 overflow-hidden bg-white flex items-center justify-center relative p-4 border-b border-slate-50">
                    <img 
                      src={rs.image || "https://via.placeholder.com/400"} 
                      alt={rs.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 shadow-sm border border-slate-100">
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-bold text-slate-700">{rs.averageRating > 0 ? rs.averageRating.toFixed(1) : "New"}</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                      {rs.name}
                    </h3>
                    <div className="mt-auto flex justify-between items-end pt-3">
                      <span className="font-black text-lg text-blue-600">₹{rs.price}</span>
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors border border-slate-200">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}