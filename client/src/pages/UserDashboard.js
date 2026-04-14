import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { getUser } from "../utils/auth";

import {
  ShoppingCart,
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  XCircle
} from "lucide-react";

export default function UserDashboard() {
  const user = getUser();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    processing: 0,
    shipped: 0,
    completed: 0,
    rejected: 0
  });

  /* 🔥 SMART GREETING */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning ☀️";
    if (hour >= 12 && hour < 17) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  /* ================= FETCH USER ORDERS ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        const orders = res.data;

        const total = orders.length;
        const pending = orders.filter((o) => o.status === "Pending").length;
        const approved = orders.filter((o) => o.status === "Approved").length;
        const processing = orders.filter((o) => o.status === "Processing").length;
        const shipped = orders.filter((o) => o.status === "Shipped").length;
        const completed = orders.filter((o) => o.status === "Completed").length;
        const rejected = orders.filter((o) => o.status === "Rejected").length;

        setStats({
          total,
          pending,
          approved,
          processing,
          shipped,
          completed,
          rejected
        });

      } catch (err) {
        console.error("USER DASHBOARD ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* 🔥 COMPLETION RATE (REJECT EXCLUDED) */
  const validOrders = stats.total - stats.rejected;
  const completionRate =
    validOrders <= 0
      ? 0
      : Math.round((stats.completed / validOrders) * 100);

  /* 🔥 ACTIVE ORDERS (APPROVED FLOW) */
  const activeOrders =
    stats.approved +
    stats.processing +
    stats.shipped;

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 pb-12 space-y-6 font-sans antialiased animate-fadeIn">

      {/* 🔥 PREMIUM HERO HEADER */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-[1.5rem] shadow-xl shadow-blue-500/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400/20 rounded-full mix-blend-overlay filter blur-2xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, {user?.name?.split(' ')[0] || "User"} 👋
            </h1>
            <p className="text-blue-100 mt-1.5 text-base font-medium max-w-xl">
              Welcome to your personal service workspace.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 flex items-center gap-2 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold tracking-wider uppercase text-white">Client Portal</span>
          </div>
        </div>
      </div>

      {/* 🔥 STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          icon={<Clock size={20} />}
          title="Pending Orders"
          value={loading ? "—" : stats.pending}
          note="Waiting for approval"
          color="amber"
        />

        <StatCard
          icon={<CheckCircle size={20} />}
          title="Completed Orders"
          value={loading ? "—" : stats.completed}
          note="Delivered successfully"
          color="emerald"
        />

        <StatCard
          icon={<Package size={20} />}
          title="Total Orders"
          value={loading ? "—" : stats.total}
          note="All time orders"
          color="blue"
        />
      </div>

      {/* 🔥 INSIGHTS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* COMPLETION RATE */}
        <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-emerald-50 rounded-md text-emerald-600">
              <TrendingUp size={18} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">
              Success Rate
            </h3>
          </div>

          <div className="flex items-end gap-2 mb-3">
            <p className="text-5xl font-extrabold text-emerald-500 tracking-tight">
              {completionRate}%
            </p>
            <span className="text-sm font-semibold text-slate-500 mb-1.5">completion</span>
          </div>

          {/* Sleek Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${completionRate}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-400 mt-4 tracking-wide uppercase">
            Based on delivered vs valid orders
          </p>
        </div>

        {/* ACTIVITY LOG */}
        <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
              <Activity size={18} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">
              Activity Insight
            </h3>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
              </div>
            ) : (
              <>
                {stats.pending > 0 && (
                  <ActivityRow icon="⏳" text={`${stats.pending} order(s) waiting for approval`} color="amber" />
                )}
                
                {activeOrders > 0 && (
                  <ActivityRow icon="🚀" text={`${activeOrders} order(s) currently in progress`} color="blue" />
                )}

                {stats.completed > 0 && (
                  <ActivityRow icon="✅" text={`${stats.completed} order(s) delivered successfully`} color="emerald" />
                )}

                {stats.rejected > 0 && (
                  <ActivityRow icon="❌" text={`${stats.rejected} order(s) rejected`} color="rose" />
                )}

                {stats.total === 0 && (
                  <div className="flex flex-col items-center justify-center py-4 text-slate-400">
                    <Package size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">No orders found yet</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>

      {/* 🔥 QUICK ACTIONS PORTALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">

        <Link
          to="/services"
          className="group bg-white/80 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200 hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Browse Services
              </h2>
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-sm font-medium text-slate-500 ml-16">
            Explore our catalog and place new requests.
          </p>
        </Link>

        <Link
          to="/my-orders"
          className="group bg-white/80 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-purple-200 hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                <Package size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                My Orders
              </h2>
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-sm font-medium text-slate-500 ml-16">
            Track status and view your order history.
          </p>
        </Link>

      </div>

    </div>
  );
}

/* ================= POLISHED COMPONENTS ================= */

function StatCard({ icon, title, value, note, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl border ${colorMap[color]} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          {icon}
        </div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
      </div>
      <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</p>
      <p className="text-xs font-semibold text-slate-400 mt-1">{note}</p>
    </div>
  );
}

function ActivityRow({ icon, text, color }) {
  const colorClasses = {
    amber: "bg-amber-50/50 text-amber-700 border-amber-100",
    blue: "bg-blue-50/50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50/50 text-emerald-700 border-emerald-100",
    rose: "bg-rose-50/50 text-rose-700 border-rose-100",
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colorClasses[color]} text-sm font-semibold shadow-sm`}>
      <span className="text-lg">{icon}</span>
      {text}
    </div>
  );
}