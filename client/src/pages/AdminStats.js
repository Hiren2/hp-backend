import { useEffect, useState } from "react";
import api from "../utils/api"; // 🔥 Ensure correct import path
import Toast from "../components/Toast";
import useToast from "../components/useToast";
import { CSVLink } from "react-csv"; 

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";

import {
  Users, Layers, Package, Activity, TrendingUp, ShieldAlert, Download, TicketPercent, Plus, Trash2, Edit
} from "lucide-react";

const COLORS = ["#f59e0b", "#10b981", "#f43f5e"]; 

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const { toast, showToast } = useToast();
  
  // 🔥 COUPON STATES WITH EDIT FUNCTIONALITY
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: "", title: "", desc: "", type: "percent", value: "", maxDiscount: 10000, applicableCategory: "All" });
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch {
        showToast("Failed to load admin statistics", "error");
      }
    };

    const fetchCoupons = async () => {
      try {
        const res = await api.get("/coupons/active");
        setCoupons(res.data);
      } catch {
        console.warn("Coupon API not ready yet.");
      }
    };

    fetchStats();
    fetchCoupons();
  }, []);

  const handleAddOrUpdateCoupon = async (e) => {
    e.preventDefault();
    if (newCoupon.type === "fixed" && Number(newCoupon.value) > 10000) {
      showToast("Fixed discount cannot exceed ₹10,000", "error");
      return;
    }
    
    try {
      const payload = {
        ...newCoupon,
        value: Number(newCoupon.value),
        maxDiscount: Number(newCoupon.maxDiscount),
        applicableCategory: newCoupon.applicableCategory || "All"
      };

      if (editingId) {
        const res = await api.put(`/coupons/${editingId}`, payload);
        setCoupons(coupons.map(c => c._id === editingId ? res.data : c));
        showToast("Coupon updated successfully! 🛠️", "success");
      } else {
        const res = await api.post("/coupons", payload);
        setCoupons([...coupons, res.data]);
        showToast("Coupon added & live successfully! 🎉", "success");
      }

      resetCouponForm();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to save coupon", "error");
    }
  };

  const handleEditClick = (coupon) => {
    setNewCoupon({
      code: coupon.code,
      title: coupon.title,
      desc: coupon.desc,
      type: coupon.type,
      value: coupon.value,
      maxDiscount: coupon.maxDiscount || 10000,
      applicableCategory: coupon.applicableCategory || "All"
    });
    setEditingId(coupon._id);
    setIsAddingCoupon(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const resetCouponForm = () => {
    setNewCoupon({ code: "", title: "", desc: "", type: "percent", value: "", maxDiscount: 10000, applicableCategory: "All" });
    setIsAddingCoupon(false);
    setEditingId(null);
  };

  const handleDeleteCoupon = async (id) => {
    if(!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(coupons.filter(c => c._id !== id));
      showToast("Coupon removed permanently", "success");
    } catch (error) {
      showToast("Failed to delete coupon", "error");
    }
  };

  if (!stats) return <SkeletonAdminStats />;

  const approvedTotal = (stats.approvedOrders || 0) + (stats.processingOrders || 0) + (stats.shippedOrders || 0) + (stats.completedOrders || 0);
  const pendingTotal = stats.pendingOrders || 0;
  const rejectedTotal = stats.rejectedOrders || 0;

  const approvalRate = approvedTotal + rejectedTotal > 0 ? Math.round((approvedTotal / (approvedTotal + rejectedTotal)) * 100) : 0;

  let systemHealth = "Healthy";
  if (pendingTotal > approvedTotal) systemHealth = "Attention";
  if (pendingTotal > approvedTotal * 2) systemHealth = "Overloaded";

  const healthColor = systemHealth === "Healthy" ? "text-emerald-500" : systemHealth === "Attention" ? "text-amber-500" : "text-rose-500";

  const pieData = [
    { name: "Pending", value: pendingTotal },
    { name: "Processed", value: approvedTotal },
    { name: "Rejected", value: rejectedTotal },
  ];

  // 🔥 THE FIX: Using REAL backend revenue data instead of hardcoded numbers!
  // Fallback to empty array if backend doesn't send it to prevent crashes
  const revenueData = stats.revenueTrend && stats.revenueTrend.length > 0 
    ? stats.revenueTrend 
    : [
        { name: "Mon", revenue: 0 }, { name: "Tue", revenue: 0 }, { name: "Wed", revenue: 0 },
        { name: "Thu", revenue: 0 }, { name: "Fri", revenue: 0 }, { name: "Sat", revenue: 0 },
        { name: "Sun", revenue: 0 },
      ];

  const csvReportData = [
    { Metric: "--- CORE METRICS ---", Value: "" },
    { Metric: "Total Registered Users", Value: stats.totalUsers },
    { Metric: "Total Services Available", Value: stats.totalServices },
    { Metric: "Total Orders Ever Placed", Value: stats.totalOrders },
    { Metric: "Orders Placed Today", Value: stats.todayOrders || 0 },
    { Metric: "--- WORKFLOW STATUS ---", Value: "" },
    { Metric: "Currently Pending", Value: pendingTotal },
    { Metric: "Successfully Processed", Value: approvedTotal },
    { Metric: "Rejected/Failed", Value: rejectedTotal },
    { Metric: "Overall Approval Rate", Value: `${approvalRate}%` },
    { Metric: "System Health Status", Value: systemHealth },
    { Metric: "--- REVENUE TREND (LAST 7 DAYS) ---", Value: "" },
    ...revenueData.map(d => ({ Metric: `Revenue on ${d.name}`, Value: `₹${d.revenue}` }))
  ];

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-7xl mx-auto mt-8 space-y-6 px-4 pb-12 font-sans antialiased transition-colors duration-300">

        <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white p-6 sm:p-8 rounded-[1.5rem] shadow-xl shadow-blue-500/20 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400/20 rounded-full mix-blend-overlay filter blur-2xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 tracking-tight">
                <span className="text-3xl drop-shadow-md">👑</span> Admin Control Center
              </h1>
              <p className="text-blue-100 mt-1.5 text-base font-medium max-w-xl">
                Full system intelligence & real-time monitoring dashboard.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 flex items-center gap-2 shadow-inner">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold tracking-wider uppercase text-white">System Live</span>
              </div>
              
              <CSVLink 
                data={csvReportData}
                filename={`HP_Solutions_Report_${new Date().toISOString().split('T')[0]}.csv`}
                className="bg-white/95 hover:bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95 border border-white group"
              >
                <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" /> 
                Export Report
              </CSVLink>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={20} />} color="blue" />
          <StatCard title="Total Services" value={stats.totalServices} icon={<Layers size={20} />} color="indigo" />
          <StatCard title="Total Orders" value={stats.totalOrders} icon={<Package size={20} />} color="purple" />
          <StatCard title="Today's Orders" value={stats.todayOrders ?? 0} icon={<Activity size={20} />} color="emerald" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GlassCard title="Approval Ratio" icon={<TrendingUp size={18} className="text-blue-500" />}>
            <div className="flex items-end gap-3 mt-2">
              <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">{approvalRate}%</h2>
              <span className="mb-1 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">Optimal</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm font-medium">True platform success rate</p>
          </GlassCard>

          <GlassCard title="System Health" icon={<ShieldAlert size={18} className={healthColor} />}>
            <div className="mt-2">
              <h2 className={`text-4xl font-extrabold tracking-tight ${healthColor}`}>
                {systemHealth}
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm font-medium">Based on current workload pressure</p>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-800 dark:text-white">
              <span className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-md text-blue-600 dark:text-blue-400">📊</span> Order Distribution
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} label={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} className="stroke-white dark:stroke-slate-900 stroke-2 hover:opacity-80 transition-opacity" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', fontSize: '14px', backgroundColor: '#1e293b', color: '#f8fafc' }} itemStyle={{ fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-800 dark:text-white">
              <span className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-md text-indigo-600 dark:text-indigo-400">📈</span> Revenue Analytics
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                {/* 🔥 REALISTIC FORMATTING FOR RUPEES */}
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', fontSize: '14px', backgroundColor: '#1e293b', color: '#f8fafc' }} itemStyle={{ fontWeight: 'bold', color: '#818cf8' }} formatter={(value) => [`₹${value}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors mt-5">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-800 dark:text-white">
            <span className="p-1.5 bg-purple-50 dark:bg-purple-500/10 rounded-md text-purple-600 dark:text-purple-400">⚡</span> Live Telemetry
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Insight text={`${stats.totalUsers} Active Users`} icon="👥" color="blue" />
            <Insight text={`${stats.totalOrders} Total Orders`} icon="📦" color="indigo" />
            <Insight text={`${pendingTotal} Pending`} icon="⏳" color="amber" />
            <Insight text={`${approvedTotal} Processed`} icon="✅" color="emerald" />
            <Insight text={`${rejectedTotal} Rejected`} icon="❌" color="rose" />
            <Insight text={`Today: ${stats.todayOrders ?? 0}`} icon="📅" color="purple" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 🔥 ENTERPRISE LIVE COUPON MANAGEMENT MODULE 🔥 */}
        {/* ======================================================== */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
              <span className="p-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-md text-rose-600 dark:text-rose-400"><TicketPercent size={18}/></span> 
              Live Platform Offers (Coupon Engine)
            </h2>
            <button 
              onClick={() => {
                if(isAddingCoupon && !editingId) {
                  setIsAddingCoupon(false);
                } else {
                  resetCouponForm();
                  setIsAddingCoupon(true);
                }
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-md"
            >
              {isAddingCoupon && !editingId ? "Cancel" : <><Plus size={16}/> Create New Coupon</>}
            </button>
          </div>

          {/* ADD / EDIT COUPON FORM */}
          {isAddingCoupon && (
            <form onSubmit={handleAddOrUpdateCoupon} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6 animate-fadeIn relative">
              
              {/* If editing, show a clear title and cancel button */}
              {editingId && (
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 dark:border-slate-600">
                  <h3 className="font-bold text-indigo-600 flex items-center gap-2"><Edit size={16}/> Updating Coupon: {newCoupon.code}</h3>
                  <button type="button" onClick={resetCouponForm} className="text-xs font-bold text-slate-400 hover:text-rose-500">Cancel Edit</button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Coupon Code</label>
                  <input required value={newCoupon.code} onChange={(e)=>setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} placeholder="e.g. WELCOME100" className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 font-bold uppercase"/>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Display Title</label>
                  <input required value={newCoupon.title} onChange={(e)=>setNewCoupon({...newCoupon, title: e.target.value})} placeholder="e.g. FLAT ₹100 OFF" className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 font-semibold"/>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Discount Type</label>
                  <select value={newCoupon.type} onChange={(e)=>setNewCoupon({...newCoupon, type: e.target.value})} className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 font-semibold">
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Value</label>
                  <input required type="number" min="1" max={newCoupon.type === "fixed" ? "10000" : "100"} value={newCoupon.value} onChange={(e)=>setNewCoupon({...newCoupon, value: e.target.value})} placeholder={newCoupon.type === "fixed" ? "Max 10000" : "%"} className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 font-bold"/>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1" title="Maximum discount allowed">Max Cap (₹)</label>
                  <input required type="number" min="1" max="10000" value={newCoupon.maxDiscount} disabled={newCoupon.type === "fixed"} onChange={(e)=>setNewCoupon({...newCoupon, maxDiscount: e.target.value})} placeholder="Max 10000" className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 font-bold disabled:bg-slate-100 disabled:text-slate-400"/>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Category</label>
                  <input required type="text" value={newCoupon.applicableCategory} onChange={(e)=>setNewCoupon({...newCoupon, applicableCategory: e.target.value})} placeholder="e.g. Electronics or All" className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 font-bold"/>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                  <input required value={newCoupon.desc} onChange={(e)=>setNewCoupon({...newCoupon, desc: e.target.value})} placeholder="Short details for users..." className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 text-sm"/>
                </div>

                <div className="lg:col-span-4 flex items-end mt-2">
                  <button type="submit" className={`w-full text-white py-2.5 rounded-xl font-bold transition-colors shadow-md ${editingId ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'}`}>
                    {editingId ? "Update Coupon Details" : "Publish Coupon to Marketplace"}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.length === 0 ? (
               <div className="col-span-full py-8 text-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl">
                 No active coupons. Create one to boost sales!
               </div>
            ) : (
              coupons.map((coupon) => (
                <div key={coupon._id} className={`border p-4 rounded-2xl relative group transition-all ${editingId === coupon._id ? 'bg-indigo-50 border-indigo-200 shadow-md scale-[1.02]' : 'bg-rose-50/50 border-rose-100 hover:border-rose-300'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`inline-block px-2.5 py-1 text-xs font-black tracking-widest rounded uppercase ${editingId === coupon._id ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'}`}>
                      {coupon.code}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditClick(coupon)} className="text-slate-400 hover:text-indigo-600 transition-colors p-1 bg-white rounded-md shadow-sm border border-slate-100" title="Edit Coupon">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteCoupon(coupon._id)} className="text-slate-400 hover:text-rose-600 transition-colors p-1 bg-white rounded-md shadow-sm border border-slate-100" title="Delete Coupon">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-lg leading-tight">{coupon.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-3">{coupon.desc}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-100">
                      Value: {coupon.type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </div>
                    {coupon.type === 'percent' && (
                      <div className="text-xs font-bold text-rose-600 bg-white px-2 py-1 rounded-lg border border-rose-100">
                        Cap: ₹{coupon.maxDiscount}
                      </div>
                    )}
                    <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                      Cat: {coupon.applicableCategory || "All"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </>
  );
}

/* 🔥 POLISHED COMPONENTS WITH DARK MODE */
function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    indigo: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20",
    purple: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">{title}</p>
        <div className={`p-2 rounded-lg border ${colorMap[color]} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</h3>
    </div>
  );
}

function GlassCard({ title, icon, children }) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Insight({ text, icon, color = "slate" }) {
  const colorClasses = {
    slate: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    rose: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    indigo: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20",
    purple: "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl border ${colorClasses[color]} shadow-sm font-semibold text-xs sm:text-sm cursor-default transition-all hover:shadow-md`}>
      <span className="text-base">{icon}</span>
      {text}
    </div>
  );
}

function SkeletonAdminStats() {
  return (
    <div className="max-w-7xl mx-auto mt-8 space-y-6 px-4 pb-12 w-full">
      <div className="h-28 sm:h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[1.5rem] w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />)}
      </div>
    </div>
  );
}