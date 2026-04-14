import { useState, useEffect } from "react";
import { Star, Camera, MessageSquare, ThumbsUp, User, ShieldCheck, Image as ImageIcon } from "lucide-react";
import api from "../api/api";

export default function ReviewSection({ serviceId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats Logic
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${serviceId}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [serviceId]);

  if (loading) return <div className="p-10 text-center animate-pulse text-slate-400 font-bold tracking-widest uppercase text-xs">Loading Reviews...</div>;

  return (
    <div className="mt-16 max-w-7xl mx-auto px-4 pb-20">
      
      {/* 🔥 AMAZON STYLE HEADER & STATS */}
      <div className="grid lg:grid-cols-4 gap-12 mb-12">
        
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-black text-slate-900">{averageRating}</div>
            <div>
              <div className="flex gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.round(averageRating) ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{reviews.length} Global Ratings</p>
            </div>
          </div>

          {/* Rating Progress Bars (Amazon Style) */}
          <div className="space-y-2.5 pt-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.rating === star).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                  <span className="w-12 hover:underline cursor-pointer">{star} star</span>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="w-8 text-slate-400 text-right">{Math.round(percentage)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🔥 REVIEWS LIST */}
        <div className="lg:col-span-3 space-y-8">
          {reviews.length === 0 ? (
            <div className="bg-slate-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200">
              <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold italic">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="group animate-fadeIn bg-white/50 p-6 rounded-[1.5rem] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500">
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                      {rev.user?.image ? <img src={rev.user.image} className="w-full h-full rounded-full object-cover" /> : rev.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 leading-tight capitalize">{rev.user?.name}</p>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 border border-emerald-100">
                        <ShieldCheck size={10} /> VERIFIED PURCHASE
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-0.5 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />
                  ))}
                </div>

                <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4">
                  {rev.comment}
                </p>

                {/* USER UPLOADED IMAGES (IF ANY) */}
                {rev.reviewImage && (
                  <div className="mb-4 rounded-xl overflow-hidden w-32 h-32 border border-slate-100 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                    <img src={rev.reviewImage} alt="user upload" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                  <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                    <ThumbsUp size={14} /> Helpful
                  </button>
                  <button className="text-[10px] font-black text-slate-300 hover:text-slate-500 uppercase tracking-widest">Report</button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}