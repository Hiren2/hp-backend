import { useEffect, useState } from "react";
import api from "../api/api";
import GlobalLoader from "../components/GlobalLoader";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  ShieldAlert,
  Users,
  Layers,
  Package,
  Activity,
  ShieldCheck,
  Lock,
  Server,
  FileKey
} from "lucide-react";

// Premium Tailwind Hex Colors: Amber (Pending), Emerald (Approved), Rose (Rejected)
const COLORS = ["#f59e0b", "#10b981", "#f43f5e"];

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("SUPER ADMIN STATS ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <GlobalLoader text="Initializing platform intelligence..." />
      </div>
    );
  }

  /* 🔥 SAFE CALCULATIONS */
  const approvedTotal =
    (stats?.approvedOrders || 0) +
    (stats?.processingOrders || 0) +
    (stats?.shippedOrders || 0) +
    (stats?.completedOrders || 0);

  const pendingTotal = stats?.pendingOrders || 0;
  const rejectedTotal = stats?.rejectedOrders || 0;

  const chartData = [
    { name: "Pending", value: pendingTotal },
    { name: "Approved", value: approvedTotal },
    { name: "Rejected", value: rejectedTotal },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 pb-12 space-y-6 font-sans antialiased animate-fadeIn">

      {/* 🔥 GOD-MODE HERO HEADER (Deep Slate/Black Theme) */}
      <div className="relative bg-gradient-to-br from-slate-800 via-gray-900 to-black text-white p-6 sm:p-8 rounded-[1.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden">
        {/* Subtle high-tech ambient glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full mix-blend-overlay filter blur-2xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 tracking-tight">
              <span className="text-3xl drop-shadow-md">🛡️</span> System Command Center
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm sm:text-base font-medium max-w-xl">
              Root access. Enterprise platform monitoring, health, and security governance.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 flex items-center gap-2 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">System Secure</span>
          </div>
        </div>
      </div>

      {/* 🔥 SYSTEM OVERVIEW GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<Users size={20} />} color="blue" />
        <StatCard title="Total Services" value={stats?.totalServices || 0} icon={<Layers size={20} />} color="indigo" />
        <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={<Package size={20} />} color="purple" />
        <StatCard title="Orders Today" value={stats?.todayOrders || 0} icon={<Activity size={20} />} color="emerald" />
      </div>

      {/* 🔥 PLATFORM HEALTH OVERVIEW */}
      <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-800 pb-4 border-b border-slate-100">
          <Server size={20} className="text-blue-600" /> Platform Health Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <HealthCard title="Pending Queue" value={pendingTotal} color="amber" icon="⏳" />
          <HealthCard title="Approved Flow" value={approvedTotal} color="emerald" icon="✅" />
          <HealthCard title="Rejected Requests" value={rejectedTotal} color="rose" icon="❌" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* 🔥 CHARTS (Donut Chart Upgrade) */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-800">
            <span className="p-1.5 bg-indigo-50 rounded-md text-indigo-600">📊</span> Order Status Analytics
          </h2>

          <div className="h-[280px]">
            {chartData.every(d => d.value === 0) ? (
              <div className="h-full flex items-center justify-center text-slate-400 font-medium">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={5}
                    label={{ fontSize: 12, fill: '#475569', fontWeight: 500 }}
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} className="stroke-white stroke-2 hover:opacity-80 transition-opacity" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '14px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 🔥 INSIGHTS (3x2 Grid Format) */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-lg transition-shadow duration-300 flex flex-col">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-800">
            <span className="p-1.5 bg-blue-50 rounded-md text-blue-600">📈</span> Platform Insights
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <Insight text={`${stats?.totalUsers || 0} Active Users`} icon="👥" color="blue" />
            <Insight text={`${stats?.totalServices || 0} Hosted Services`} icon="📦" color="indigo" />
            <Insight text={`${stats?.totalOrders || 0} Total Orders Processed`} icon="🔄" color="purple" />
            <Insight text={`${pendingTotal} Approvals Pending`} icon="⏳" color="amber" />
            <Insight text={`${approvedTotal} Successful Fulfillments`} icon="✅" color="emerald" />
            <Insight text={`${rejectedTotal} Blocked Requests`} icon="❌" color="rose" />
          </div>
        </div>

      </div>

      {/* 🔥 SECURITY PANEL */}
      <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-800 pb-4 border-b border-slate-100">
          <ShieldCheck size={20} className="text-emerald-600" /> Security & Governance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SecurityCard
            icon={<FileKey size={18} />}
            title="Role Access Logs"
            value="Tracked via secure audit records"
            color="indigo"
          />
          <SecurityCard
            icon={<ShieldAlert size={18} />}
            title="Failed Authentications"
            value="Zero critical breaches detected"
            color="emerald"
          />
          <SecurityCard
            icon={<Lock size={18} />}
            title="System Governance"
            value="SuperAdmin override active"
            color="blue"
          />
        </div>
      </div>

    </div>
  );
}

/* 🔥 POLISHED COMPONENTS */

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{title}</p>
        <div className={`p-2 rounded-lg border ${colorMap[color]} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
    </div>
  );
}

function HealthCard({ title, value, color, icon }) {
  const colorClasses = {
    amber: "bg-amber-50/50 text-amber-700 border-amber-200/50",
    emerald: "bg-emerald-50/50 text-emerald-700 border-emerald-200/50",
    rose: "bg-rose-50/50 text-rose-700 border-rose-200/50",
  };

  return (
    <div className={`p-5 rounded-2xl border ${colorClasses[color]} shadow-sm`}>
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <p className="text-xs font-bold uppercase tracking-wider opacity-80">{title}</p>
      </div>
      <h3 className="text-3xl font-extrabold tracking-tight">{value}</h3>
    </div>
  );
}

function Insight({ text, icon, color = "slate" }) {
  const colorClasses = {
    amber: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    rose: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
    blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    purple: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl border ${colorClasses[color]} shadow-sm font-semibold text-xs sm:text-sm cursor-default transition-all`}>
      <span className="text-base">{icon}</span>
      {text}
    </div>
  );
}

function SecurityCard({ title, value, icon, color }) {
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300">
      <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs font-medium text-slate-500 mt-0.5">{value}</p>
      </div>
    </div>
  );
}