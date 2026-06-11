import { useEffect, useState } from "react";
import api from "../api/api";
import GlobalLoader from "../components/GlobalLoader";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import useToast from "../components/useToast";
import Swal from "sweetalert2";
import { Star, MessageSquareQuote, Trash2, Filter, ChevronDown, CheckCircle, ShieldAlert } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("all");
  const { toast, showToast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews/all");
      setReviews(res.data);
      setFiltered(res.data);
    } catch (err) {
      showToast("Failed to load feedback.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterRating === "all") {
      setFiltered(reviews);
    } else {
      const f = reviews.filter(r => r.rating === parseInt(filterRating));
      setFiltered(f);
    }
  }, [filterRating, reviews]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Remove Feedback?',
      text: "This review will be permanently deleted from the system.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete it'
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/reviews/${id}`);
      showToast("Review deleted successfully", "success");
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete review", "error");
    }
  };

  const calculateAverage = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) return <GlobalLoader text="Loading Customer Insights..." />;

  return (
    <>
      <Toast message={toast.message} type={toast.type} />
      
      <div className="max-w-7xl mx-auto font-sans animate-fadeIn">
        <div className="relative bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-slate-800 dark:to-indigo-900 p-8 sm:p-10 rounded-[2rem] shadow-2xl mb-8 overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3 mb-2">
              <MessageSquareQuote className="text-yellow-400" size={32} />
              Feedback Hub
            </h1>
            <p className="text-slate-400 font-medium">Monitor customer sentiment, ratings, and platform reviews.</p>
          </div>

          <div className="relative z-10 flex gap-4">
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Total Reviews</p>
              <p className="text-3xl font-black text-white">{reviews.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Avg Rating</p>
              <div className="flex items-center gap-1.5 justify-center">
                <span className="text-3xl font-black text-yellow-400">{calculateAverage()}</span>
                <Star size={20} fill="#facc15" className="text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">
            <Filter size={16} /> Filter by Rating
          </div>
          <div className="relative">
            <select 
              value={filterRating} 
              onChange={(e) => setFilterRating(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm py-2 pl-4 pr-10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option value="3">⭐⭐⭐ (3 Stars)</option>
              <option value="2">⭐⭐ (2 Stars)</option>
              <option value="1">⭐ (1 Star)</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No Feedback Found" description="There are no reviews matching your current criteria." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <div key={r._id} className="bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300 flex flex-col group relative overflow-hidden">
                
                {r.rating <= 2 && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
                )}
                {r.rating === 5 && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < r.rating ? "#facc15" : "none"} className={i < r.rating ? "text-yellow-400" : "text-slate-300 dark:text-slate-700"} />
                    ))}
                  </div>
                  <button 
                    onClick={() => handleDelete(r._id)} 
                    className="text-slate-400 hover:text-rose-500 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg transition-colors"
                    title="Delete Feedback"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mb-6 flex-1">
                  <p className="text-slate-700 dark:text-slate-300 font-medium text-sm leading-relaxed italic">
                    "{r.comment || "No written comment provided."}"
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-black text-sm">
                      {r.user?.name ? r.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                        {r.user?.name || "Unknown User"} 
                        {r.user?.isDemo && <ShieldAlert size={12} className="text-amber-500" title="Sandbox User" />}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <CheckCircle size={14} className="text-blue-500" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">
                    For: {r.service?.name || "Deleted Service"}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}