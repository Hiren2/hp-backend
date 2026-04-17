import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../utils/api";
import Toast from "../components/Toast";
import useToast from "../components/useToast";

import { 
  Search, 
  FileText, 
  UserCircle, 
  Package, 
  Activity, 
  ShieldCheck, 
  Clock,
  Inbox
} from "lucide-react";

export default function AdminOrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const { toast, showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/admin/orders");

      const priority = {
        Pending: 1,
        Approved: 2,
        processing: 2,
        shipped: 2,
        completed: 2,
        Rejected: 3,
      };

      const sorted = [...res.data].sort((a, b) => {
        if (priority[a.status] !== priority[b.status]) {
          return (priority[a.status] || 99) - (priority[b.status] || 99);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setOrders(sorted);
    } catch {
      showToast("Failed to load order history", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ====================================================================
     🔥 SMART FILTERING ENGINE (Fix for "Approved" & "Completed" match)
  ==================================================================== */
  const filtered = useMemo(() => {
    let data = [...orders];

    if (filter !== "All") {
      if (filter === "Approved") {
        // Show everything that is NOT Pending or Rejected (including COMPLETED)
        const approvedStatuses = ["approved", "processing", "shipped", "completed"];
        data = data.filter((o) => approvedStatuses.includes(o.status?.toLowerCase()));
      } else {
        data = data.filter((o) => o.status?.toLowerCase() === filter.toLowerCase());
      }
    }

    if (search) {
      data = data.filter((o) =>
        o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        o.service?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o._id?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [search, filter, orders]);

  /* 🔥 PREMIUM BADGE SYSTEM */
  const badgeStyle = (status) => {
    const s = status?.toLowerCase();
    if (["approved", "completed"].includes(s)) return "bg-emerald-50 text-emerald-600 border-emerald-200/50";
    if (s === "rejected") return "bg-rose-50 text-rose-600 border-rose-200/50";
    if (["processing", "shipped"].includes(s)) return "bg-blue-50 text-blue-600 border-blue-200/50";
    return "bg-amber-50 text-amber-600 border-amber-200/50"; // Default to pending/yellow
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-8 px-4 space-y-6 animate-pulse">
        <div className="h-24 bg-slate-200 rounded-[1.5rem] w-full" />
        <div className="h-20 bg-slate-200 rounded-[1.5rem] w-full" />
        <div className="h-[400px] bg-slate-200 rounded-[1.5rem] w-full" />
      </div>
    );
  }

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-7xl mx-auto mt-8 px-4 pb-12 space-y-6 font-sans antialiased animate-fadeIn">

        {/* 🔥 PREMIUM COMPACT HERO HEADER */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white p-5 sm:p-6 rounded-[1.5rem] shadow-xl shadow-blue-500/20 overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5 tracking-tight">
              <FileText size={28} className="text-blue-200" />
              Order History Dashboard
            </h2>
            <p className="text-indigo-100 mt-1 text-xs sm:text-sm font-medium">
              Smart sorting & filtering for enterprise service requests.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2 shadow-inner w-fit">
            <span className="text-xs font-bold tracking-wider uppercase text-white">Total Records:</span>
            <span className="text-lg font-black text-white">{filtered.length}</span>
          </div>
        </div>

        {/* 🔥 FILTER & SEARCH BAR */}
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center">

          <div className="relative w-full lg:w-96 group">
            <Search size={18} className="absolute left-4 top-2.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              placeholder="Search user, service, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 pl-11 pr-4 py-2 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            {["All", "Pending", "Approved", "Rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                ${filter === f
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

        </div>

        {/* 🔥 ENTERPRISE DATA TABLE */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Inbox size={56} className="mb-4 opacity-20" />
              <p className="text-base font-semibold text-slate-500">No matching orders found.</p>
              <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">

                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-5">
                      <div className="flex items-center gap-2"><UserCircle size={16}/> User / Client</div>
                    </th>
                    <th className="px-6 py-5">
                      <div className="flex items-center gap-2"><Package size={16}/> Service</div>
                    </th>
                    <th className="px-6 py-5">
                      <div className="flex items-center gap-2"><Activity size={16}/> Status</div>
                    </th>
                    <th className="px-6 py-5">
                      <div className="flex items-center gap-2"><ShieldCheck size={16}/> Processed By</div>
                    </th>
                    <th className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2"><Clock size={16}/> Created At</div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filtered.map((o) => (
                    <tr
                      key={o._id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="font-bold text-slate-800 text-sm sm:text-base">
                          {o.user?.email || "Unknown User"}
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">
                          ID: {o._id.slice(-6).toUpperCase()}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-700 text-sm sm:text-base line-clamp-1">
                          {o.service?.name || "Service Unavailable"}
                        </div>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border shadow-sm ${badgeStyle(o.status)}`}>
                          {o.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        {o.processedBy?.email ? (
                          <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-md border border-indigo-100/50">
                            {o.processedBy.email}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium text-sm">— Pending —</span>
                        )}
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-mono font-bold text-slate-500">
                        {new Date(o.createdAt).toLocaleString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute:'2-digit'
                        })}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

      </div>
    </>
  );
}