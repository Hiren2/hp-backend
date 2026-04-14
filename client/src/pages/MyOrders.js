import { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import GlobalLoader from "../components/GlobalLoader";
import EmptyState from "../components/EmptyState";
import { generateInvoice } from "../utils/generateInvoice";
import { getUser } from "../utils/auth"; 

import {
  Package,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  CalendarDays,
  FileText,
  Star,
  X,
  Send
} from "lucide-react";

const STEPS = ["Pending", "Approved", "Processing", "Shipped", "Completed"];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH LOGGED IN USER
  const currentUser = getUser();

  // --- REVIEW MODAL STATES ---
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔥 TRACK RATED SERVICES
  const [ratedServices, setRatedServices] = useState(new Set());

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      const fetchedOrders = res.data;
      setOrders(fetchedOrders);

      // 🔥 HIGH INTELLIGENCE: Check which delivered services the user has already rated
      const completedServiceIds = [...new Set(
        fetchedOrders
          .filter(o => o.status === "Completed" && o.service)
          .map(o => typeof o.service === 'object' ? o.service._id : o.service)
      )];

      const ratedSet = new Set();
      
      // Loop through completed services to check if current user reviewed them
      for (let sId of completedServiceIds) {
        try {
          const revRes = await api.get(`/reviews/service/${sId}`);
          const hasRated = revRes.data.some(r => 
            String(r.user?._id || r.user) === String(currentUser?._id || currentUser?.id)
          );
          if (hasRated) {
            ratedSet.add(String(sId));
          }
        } catch (e) {
          console.warn(`Could not check reviews for service ${sId}`);
        }
      }
      setRatedServices(ratedSet);

    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    return STEPS.indexOf(status);
  };

  /* ================= 🔥 ADVANCED PDF NAMING LOGIC ================= */
  const handleDownload = async (order) => {
    try {
      const doc = await generateInvoice(order);
      const safeName = currentUser?.name 
        ? currentUser.name.replace(/\s+/g, '_') 
        : "Customer";
      doc.save(`${safeName}_Order_Invoice.pdf`);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleView = async (order) => {
    try {
      const doc = await generateInvoice(order);
      window.open(doc.output("bloburl"));
    } catch (err) {
      console.error("View error:", err);
    }
  };

  // --- SUBMIT REVIEW LOGIC ---
  const submitReview = async () => {
    if (rating === 0) return alert("Please select stars ⭐");
    setSubmitting(true);
    try {
      await api.post("/reviews", {
        serviceId: selectedService,
        rating,
        comment
      });
      alert("Thank you for your review! 🚀");
      
      // Add to rated set so button updates to "Already Rated" immediately
      setRatedServices(prev => new Set(prev).add(String(selectedService)));
      
      setShowModal(false);
      setRating(0);
      setComment("");
    } catch (err) {
      alert("Failed to submit review. You may have already rated this.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <GlobalLoader text="Loading your orders..." />;

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 pb-12 font-sans antialiased animate-fadeIn space-y-6">
      
      {/* HEADER */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-6 sm:p-8 rounded-[1.5rem] shadow-xl shadow-blue-500/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 tracking-tight">
              <span className="text-3xl drop-shadow-md">📦</span> Order History
            </h1>
            <p className="text-blue-100 mt-1.5 text-sm sm:text-base font-medium">
              Track your service requests and manage your reviews.
            </p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="pt-6">
          <EmptyState title="No orders found" description="Head over to the Marketplace to get started." />
        </div>
      ) : (
        <div className="space-y-6 pt-2">
          {orders.map((order) => {
            const currentStep = getStepIndex(order.status);
            const isRejected = order.status === "Rejected";
            const progressWidth = Math.max(0, (currentStep / (STEPS.length - 1)) * 100);
            
            const sId = typeof order.service === 'object' ? order.service?._id : order.service;
            const hasUserRatedThis = ratedServices.has(String(sId));

            return (
              <div key={order._id} className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6 sm:p-8 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{order.service?.name || "Service Request"}</h2>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-2 rounded-md mt-1">
                      ID: #{order._id.slice(-6).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    
                    {/* 🔥 INTELLIGENT RATE BUTTON */}
                    {order.status === "Completed" && (
                      hasUserRatedThis ? (
                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200">
                          <CheckCircle size={14} fill="currentColor" className="text-emerald-500" /> Already Rated
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setSelectedService(sId);
                            setShowModal(true);
                          }}
                          className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-bold border border-amber-200 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                        >
                          <Star size={14} fill="currentColor" /> Rate Experience
                        </button>
                      )
                    )}

                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {!isRejected && (
                  <div className="mt-8 mb-4">
                    <div className="relative w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progressWidth}%` }} />
                    </div>
                    <div className="flex justify-between mt-3">
                      {STEPS.map((step, index) => (
                        <span key={step} className={`text-[10px] font-bold uppercase ${index <= currentStep ? "text-blue-600" : "text-slate-300"}`}>
                          {formatLabel(step)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => handleView(order)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                      <Eye size={16} /> View Invoice
                    </button>
                    <button onClick={() => handleDownload(order)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                      <Download size={16} /> Download
                    </button>
                  </div>
                  <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-lg border">
                    <CalendarDays size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- IN-LINE REVIEW MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-slideUp relative">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-rose-500 transition-colors"><X size={24}/></button>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Rate Service</h2>
            <p className="text-slate-500 text-sm mb-6">How was your experience with this service?</p>
            
            <div className="flex gap-2 mb-8 justify-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} size={36} 
                  fill={s <= rating ? "#f59e0b" : "none"}
                  className={`cursor-pointer transition-all hover:scale-110 ${s <= rating ? "text-amber-500 drop-shadow-md" : "text-slate-200"}`}
                  onClick={() => setRating(s)}
                />
              ))}
            </div>

            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 h-32 mb-6 transition-all"
              placeholder="Tell us what you liked or disliked..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button 
              disabled={submitting}
              onClick={submitReview}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? "Posting..." : <><Send size={18}/> Post Review</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Pending: "bg-amber-50 text-amber-600 border-amber-200/50",
    Approved: "bg-blue-50 text-blue-600 border-blue-200/50",
    Processing: "bg-indigo-50 text-indigo-600 border-indigo-200/50",
    Shipped: "bg-purple-50 text-purple-600 border-purple-200/50",
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
    Rejected: "bg-rose-50 text-rose-600 border-rose-200/50",
  };
  return <span className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border shadow-sm ${map[status] || "bg-slate-50 text-slate-600"}`}>{formatLabel(status)}</span>;
}

function formatLabel(label) {
  if (label === "Pending") return "Placed";
  if (label === "Completed") return "Delivered";
  return label;
}