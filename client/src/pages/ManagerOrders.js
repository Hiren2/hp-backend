import { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import Toast from "../components/Toast";
import useToast from "../components/useToast";
import { Package, Inbox, CheckCircle, XCircle, Clock } from "lucide-react";

export default function ManagerOrders() {
  const [orders, setOrders] = useState([]);
  const { toast, showToast } = useToast();

  const getPendingDays = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
  };

  const displayStatus = (status) => {
    if (["Approved", "Processing", "Shipped", "Completed"].includes(status)) {
      return "Approved";
    }
    if (status === "Rejected") return "Rejected";
    return "Pending";
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/manager/orders");
      const sorted = [...res.data].sort((a, b) => {
        if (a.status === "Pending" && b.status !== "Pending") return -1;
        if (a.status !== "Pending" && b.status === "Pending") return 1;
        if (a.status === "Pending" && b.status === "Pending") {
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
  }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Mark order as ${status}?`)) return;
    try {
      await api.put(`/manager/orders/${id}`, { status });
      showToast(`Order ${status}`, "success");
      fetchOrders();
    } catch (err) {
      console.error(err);
      showToast("Failed to update order", "error");
    }
  };

  /* 🔥 INCREASED TEXT SIZE IN BADGES */
  const badgeStyle = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50";
    if (status === "Rejected") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50";
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50";
  };

  const priorityBadge = (order) => {
    if (["Approved", "Processing", "Shipped", "Completed"].includes(order.status)) {
      return <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">COMPLETED</span>;
    }
    if (order.status === "Rejected") {
      return <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">CLOSED</span>;
    }

    const days = getPendingDays(order.createdAt);
    if (days >= 5) return <span className="text-xs font-bold px-2.5 py-1 rounded bg-red-500 text-white shadow-sm">HIGH</span>;
    if (days >= 2) return <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-500 text-white shadow-sm">MEDIUM</span>;
    return <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500 text-white shadow-sm">LOW</span>;
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-7xl mx-auto mt-6 bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
          {/* 🔥 LARGER TITLE */}
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Package size={28} />
            </div>
            Order Processing
          </h2>
          {/* 🔥 LARGER PENDING BADGE */}
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-lg text-base font-bold tracking-wide">
            Total Pending: {orders.filter(o => o.status === "Pending").length}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">
            <Inbox size={72} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">All caught up!</h3>
            <p className="text-base mt-2">There are no orders waiting for processing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              {/* 🔥 LARGER TABLE HEADERS */}
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4 rounded-tl-xl">Customer</th>
                  <th className="p-4">Service Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 rounded-tr-xl">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((o) => {
                  const days = getPendingDays(o.createdAt);
                  const status = displayStatus(o.status);

                  return (
                    <tr key={o._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      
                      <td className="p-4">
                        {/* 🔥 LARGER USERNAME & EMAIL */}
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-base">{o.user?.name || "User"}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{o.user?.email}</p>
                      </td>

                      <td className="p-4">
                        {/* 🔥 LARGER SERVICE NAME */}
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-base">{o.service?.name}</p>
                        {o.status === "Pending" && (
                          <p className="text-xs font-medium text-amber-500 flex items-center gap-1 mt-1">
                            <Clock size={14} /> Pending for {days} days
                          </p>
                        )}
                      </td>

                      <td className="p-4">
                        {/* 🔥 LARGER STATUS BADGE */}
                        <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${badgeStyle(status)}`}>
                          {status === "Pending" && <Clock size={14} />}
                          {status === "Approved" && <CheckCircle size={14} />}
                          {status === "Rejected" && <XCircle size={14} />}
                          {status}
                        </span>
                      </td>

                      <td className="p-4">
                        {priorityBadge(o)}
                      </td>

                      <td className="p-4">
                        {o.status === "Pending" ? (
                          <div className="flex gap-2">
                            {/* 🔥 LARGER BUTTONS */}
                            <button
                              onClick={() => updateStatus(o._id, "Approved")}
                              className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(o._id, "Rejected")}
                              className="px-4 py-2 rounded-lg text-sm font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white dark:bg-red-900/20 dark:hover:bg-red-600 transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Processed</span>
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
    </>
  );
}