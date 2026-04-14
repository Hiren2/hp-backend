import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../api/api";
import Toast from "../components/Toast";
import useToast from "../components/useToast";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Briefcase
} from "lucide-react";

// Strict color mapping taaki colors humesha fix rahein
const COLORS_MAP = {
  "Pending": "#f59e0b", // Amber
  "Approved": "#10b981", // Emerald
  "Rejected": "#f43f5e"  // Rose
};

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null);
  const { toast, showToast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/manager/stats");

      setStats(res.data || {
        totalOrders: 0,
        todayOrders: 0,
        pendingOrders: 0,
        approvedOrders: 0,
        rejectedOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        completedOrders: 0
      });
    } catch (err) {
      showToast("Failed to load manager dashboard", "error");
      setStats({
        totalOrders: 0, todayOrders: 0, pendingOrders: 0, approvedOrders: 0,
        rejectedOrders: 0, processingOrders: 0, shippedOrders: 0, completedOrders: 0
      });
    }
  }, [showToast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const { pieData, barData } = useMemo(() => {
    if (!stats) return { pieData: [], barData: [] };

    const approvedTotal =
      (stats.approvedOrders || 0) +
      (stats.processingOrders || 0) +
      (stats.shippedOrders || 0) +
      (stats.completedOrders || 0);

    const rawData = [
      { name: "Pending", value: Number(stats.pendingOrders || 0) },
      { name: "Approved", value: Number(approvedTotal) },
      { name: "Rejected", value: Number(stats.rejectedOrders || 0) },
    ];

    // 🚀 Sirf wahi data dikhega jo 0 se bada hai taaki math crash na ho
    const filteredPieData = rawData.filter(item => item.value > 0);

    return { pieData: filteredPieData, barData: rawData };
  }, [stats]);

  if (!stats) {
    return <SkeletonManagerDashboard />;
  }

  /* ================= CALCULATIONS ================= */
  const processed =
    (stats.approvedOrders || 0) +
    (stats.processingOrders || 0) +
    (stats.shippedOrders || 0) +
    (stats.completedOrders || 0) +
    (stats.rejectedOrders || 0);

  const workload = stats.pendingOrders === 0 ? "Low" : stats.pendingOrders <= 5 ? "Medium" : "High";
  const workloadColor = workload === "Low" ? "text-emerald-500" : workload === "Medium" ? "text-amber-500" : "text-rose-500";

  const approvedTotal =
    (stats.approvedOrders || 0) +
    (stats.processingOrders || 0) +
    (stats.shippedOrders || 0) +
    (stats.completedOrders || 0);

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-7xl mx-auto mt-6 px-4 pb-12 space-y-5 font-sans antialiased">

        <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white p-4 sm:p-5 rounded-2xl shadow-lg shadow-blue-500/20 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full mix-blend-overlay filter blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2 tracking-tight">
                <span className="text-2xl drop-shadow-md">🚀</span> Manager Panel
              </h1>
              <p className="text-blue-100 mt-1 text-sm font-medium max-w-xl">
                Real-time monitoring of orders and operational performance.
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30 flex items-center gap-2 shadow-inner shrink-0 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-white">Live Sync</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Orders" value={stats.totalOrders} icon={<Activity size={18} />} color="blue" />
          <StatCard title="Today's Orders" value={stats.todayOrders} icon={<TrendingUp size={18} />} color="emerald" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} icon={<AlertTriangle size={18} />} color="amber" />
          <StatCard title="Processed Orders" value={processed} icon={<CheckCircle size={18} />} color="purple" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard title="Current Workload" icon={<Briefcase size={16} className={workloadColor} />}>
            <div className="mt-1">
              <h2 className={`text-3xl font-extrabold tracking-tight ${workloadColor}`}>{workload}</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs font-medium">Based on active pending queue</p>
          </GlassCard>

          <GlassCard title="Pending vs Processed" icon={<Clock size={16} className="text-blue-500" />}>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{stats.pendingOrders}</h2>
              <span className="text-lg font-bold text-slate-400">/</span>
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{processed}</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs font-medium">Total operational throughput</p>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* PIE CHART */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <span className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md text-blue-600 dark:text-blue-400 text-sm">📊</span> Order Distribution
            </h2>

            {pieData.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-slate-400 font-medium">
                No orders data available to display
              </div>
            ) : (
              <div className="w-full h-[250px] animate-fadeIn">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      dataKey="value" 
                      nameKey="name"
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={85} 
                      isAnimationActive={false} // 🚀 ULTIMATE FIX: Hang issue solved, loads instantly!
                      label={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_MAP[entry.name]} className="stroke-white dark:stroke-slate-900 stroke-2" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '12px', backgroundColor: '#1e293b', color: '#fff' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* BAR CHART */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <span className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-md text-indigo-600 dark:text-indigo-400 text-sm">📈</span> Order Insights
            </h2>

            {barData.every(d => d.value === 0) ? (
              <div className="h-[250px] flex items-center justify-center text-slate-400 font-medium">
                No orders data available to display
              </div>
            ) : (
              <div className="w-full h-[250px] animate-fadeIn">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9', opacity: 0.1 }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '12px', backgroundColor: '#1e293b', color: '#fff' }}
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_MAP[entry.name]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 transition-colors">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <span className="p-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-md text-purple-600 dark:text-purple-400 text-sm">⚡</span> Smart Insights
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Insight text={`${stats.pendingOrders} pending`} icon="⏳" color="amber" />
            <Insight text={`${approvedTotal} approved`} icon="✅" color="emerald" />
            <Insight text={`${stats.rejectedOrders} rejected`} icon="❌" color="rose" />
            <Insight text={`${processed} processed`} icon="🔄" color="blue" />
            <Insight text={`Today: ${stats.todayOrders}`} icon="📅" color="indigo" />
            <Insight text={`Workload: ${workload}`} icon="⚙️" color={workload === 'Low' ? 'emerald' : workload === 'Medium' ? 'amber' : 'rose'} />
          </div>
        </div>

      </div>
    </>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-800/50",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-100 dark:border-purple-800/50",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-100 dark:border-amber-800/50",
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-2">
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">{title}</p>
        <div className={`p-1.5 rounded-lg border ${colorMap[color]} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{value}</h3>
    </div>
  );
}

function GlassCard({ title, icon, children }) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Insight({ text, icon, color = "slate" }) {
  const colorClasses = {
    slate: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700",
    amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30",
    rose: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30",
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/30",
  };

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 w-full rounded-xl border ${colorClasses[color]} shadow-sm font-semibold text-xs sm:text-sm cursor-default transition-all hover:shadow-md`}>
      <span className="text-sm">{icon}</span>
      {text}
    </div>
  );
}

function SkeletonManagerDashboard() {
  return (
    <div className="max-w-7xl mx-auto mt-6 space-y-5 px-4 pb-12 w-full">
      <div className="h-20 sm:h-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl border border-slate-100 dark:border-slate-800" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
        <div className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-[300px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
        <div className="h-[300px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}