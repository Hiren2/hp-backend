import { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import Toast from "../components/Toast";
import useToast from "../components/useToast";
import { Package, Inbox, CheckCircle, XCircle, Clock, X, Send, Truck, Settings, CheckSquare } from "lucide-react";

export default function ManagerOrders() {
  const [orders, setOrders] = useState([]);
  const { toast, showToast } = useToast();
  
  const [rejectModal, setRejectModal] = useState({ show: false, orderId: null });
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPendingDays = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/manager/orders");
      const sorted = [...res.data].sort((a, b) => {
        // Bring active working states to top
        const activeStates = ["Pending", "Approved", "Processing", "Shipped"];
        const aActive = activeStates.includes(a.status);
        const bActive = activeStates.includes(b.status);
        
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        if (aActive && bActive) {
          return getPendingDays(b.createdAt) - getPendingDays(a.createdAt);
        }
        return 0;
      });
      setOrders(sorted);
    } catch {
      showToast("Failed to load orders", "error");
    }
  }, [showToast]);

  useEffect(() => {
    fetchOrders();
    // Auto refresh every 10 seconds to catch auto-delivered statuses
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (id, status, notes = "") => {
    if (status === "Approved") {
      if (!window.confirm(`Mark order as Approved?`)) return;
    }
    
    try {
      if (status === "Rejected") setIsSubmitting(true);
      await api.put(`/manager/orders/${id}`, { status, managerNotes: notes });
      showToast(`Order marked as ${status}`, "success");
      
      if (status === "Rejected") {
        setRejectModal({ show: false, orderId: null });
        setRejectReason("");
      }
      fetchOrders();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to update order", "error");
    } finally {
      if (status === "Rejected") setIsSubmitting(false);
    }
  };

  const badgeStyle = (status) => {
    if (status === "Approved") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50";
    if (status === "Processing") return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50";
    if (status === "Shipped") return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50";
    if (status === "Completed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50";
    if (status === "Rejected") return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50";
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50";
  };

  const statusIcon = (status) => {
    if (status === "Pending") return <Clock size={14} />;
    if (status === "Approved") return <CheckCircle size={14} />;
    if (status === "Processing") return <Settings size={14} />;
    if (status === "Shipped") return <Truck size={14} />;
    if (status === "Completed") return <CheckSquare size={14} />;
    if (status === "Rejected") return <XCircle size={14} />;
    return <Clock size={14} />;
  };

  const priorityBadge = (order) => {
    if (["Completed"].includes(order.status)) {
      return <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">RESOLVED</span>;
    }
    if (order.status === "Rejected") {
      return <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">CLOSED</span>;
    }

    const days = getPendingDays(order.createdAt);
    if (days >= 5) return <span className="text-xs font-bold px-2.5 py-1 rounded bg-rose-500 text-white shadow-sm">HIGH</span>;
    if (days >= 2) return <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-500 text-white shadow-sm">MEDIUM</span>;
    return <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500 text-white shadow-sm">LOW</span>;
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-7xl mx-auto mt-6 bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Package size={28} />
            </div>
            Pipeline Management
          </h2>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-lg text-base font-bold tracking-wide">
            Active Workflow: {orders.filter(o => ["Pending", "Approved", "Processing", "Shipped"].includes(o.status)).length}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">
            <Inbox size={72} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">All caught up!</h3>
            <p className="text-base mt-2">There are no active orders in the pipeline.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4 rounded-tl-xl">Customer</th>
                  <th className="p-4">Service Details</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 rounded-tr-xl">Pipeline Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((o) => {
                  const days = getPendingDays(o.createdAt);
                  const status = o.status;

                  return (
                    <tr key={o._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="p-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-base">{o.user?.name || "User"}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{o.user?.email}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-base">{o.service?.name}</p>
                        {status === "Pending" && (
                          <p className="text-xs font-medium text-amber-500 flex items-center gap-1 mt-1">
                            <Clock size={14} /> Waiting {days > 0 ? `${days} days` : 'today'}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${badgeStyle(status)}`}>
                          {statusIcon(status)} 
                          {status === "Completed" ? "Delivered" : status}
                        </span>
                      </td>
                      <td className="p-4">{priorityBadge(o)}</td>
                      <td className="p-4">
                        
                        {/* THE STEP-BY-STEP FAANG ACTION BUTTONS */}
                        {status === "Pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(o._id, "Approved")}
                              className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-sm shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectModal({ show: true, orderId: o._id })}
                              className="px-4 py-2 rounded-lg text-sm font-bold text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white dark:bg-rose-900/20 dark:hover:bg-rose-600 transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {status === "Approved" && (
                          <button
                            onClick={() => updateStatus(o._id, "Processing")}
                            className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-indigo-500 hover:bg-indigo-600 shadow-sm shadow-indigo-500/20 transition-all hover:-translate-y-0.5 w-full sm:w-auto text-center flex items-center justify-center gap-2"
                          >
                            <Settings size={16} /> Mark as Processing
                          </button>
                        )}

                        {status === "Processing" && (
                          <button
                            onClick={() => updateStatus(o._id, "Shipped")}
                            className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-purple-500 hover:bg-purple-600 shadow-sm shadow-purple-500/20 transition-all hover:-translate-y-0.5 w-full sm:w-auto text-center flex items-center justify-center gap-2"
                          >
                            <Truck size={16} /> Dispatch Order
                          </button>
                        )}

                        {/* 🔥 NEW PREMIUM OUT FOR DELIVERY STATUS */}
                        {status === "Shipped" && (
                          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 px-4 py-2 rounded-xl text-blue-600 dark:text-blue-400">
                            <Truck size={16} className="animate-pulse" />
                            <span className="text-sm font-bold italic tracking-wide">Out for Delivery... Arriving Shortly</span>
                          </div>
                        )}

                        {/* 🔥 NEW PREMIUM DELIVERED STATUS */}
                        {status === "Completed" && (
                          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 px-4 py-2 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <CheckCircle size={16} />
                            <span className="text-sm font-bold tracking-wide">Successfully Delivered</span>
                          </div>
                        )}
                        
                        {status === "Rejected" && (
                          <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Pipeline Finished</span>
                        )}

                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rejectModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-slideUp relative">
            <button onClick={() => setRejectModal({ show: false, orderId: null })} className="absolute top-5 right-5 text-slate-400 hover:text-rose-500 transition-colors">
              <X size={24}/>
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Reject Order</h2>
            <p className="text-slate-500 text-sm mb-6">Please provide a reason for rejecting this service request. This will be shown to the user.</p>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 h-32 mb-6 transition-all resize-none"
              placeholder="e.g. Service not available in your area..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <button 
              disabled={isSubmitting || rejectReason.trim() === ""}
              onClick={() => updateStatus(rejectModal.orderId, "Rejected", rejectReason)}
              className="w-full bg-rose-600 text-white py-4 rounded-xl font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-rose-700 shadow-lg shadow-rose-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : <><Send size={18}/> Append Note & Reject</>}
            </button>
          </div>
        </div>
      )}
    </>
  );
}