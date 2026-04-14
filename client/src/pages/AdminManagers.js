import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../api/api";
import Toast from "../components/Toast";
import useToast from "../components/useToast";
import { getUser } from "../utils/auth";

import { 
  Users, 
  Search, 
  ShieldCheck, 
  Lock, 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  UserCircle,
  Shield,
  UserX,        // 🔥 Added for Suspended icon
  UserCheck,    // 🔥 Added for Active icon
  Power         // 🔥 Added for Kill Switch icon
} from "lucide-react";

export default function AdminManagers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const { toast, showToast } = useToast();
  const currentUser = getUser();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* 🔥 ULTRA FIX — NO STATE LOOP */
  const filtered = useMemo(() => {
    let data = users;

    if (filter !== "All") {
      data = data.filter((u) => u.role === filter);
    }

    if (search) {
      data = data.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [users, search, filter]);

  /* 🔥 ZERO JERK UPDATE FOR ROLE */
  const changeRole = async (id, role) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${role.toUpperCase()}?`)) return;

    try {
      await api.put(`/admin/users/${id}/role`, { role });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, role } : u
        )
      );

      showToast(`Role updated to ${role} ✅`, "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update role",
        "error"
      );
    }
  };

  /* 🔥 NEW: KILL SWITCH LOGIC (SUSPEND / REACTIVATE) */
  const toggleAccountStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    const actionText = newStatus === "suspended" ? "SUSPEND (Block)" : "REACTIVATE (Unblock)";
    
    if (!window.confirm(`⚠️ Are you sure you want to ${actionText} this user?`)) return;

    try {
      // Calling the backend status update route
      await api.put(`/admin/users/${id}/status`, { status: newStatus });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, accountStatus: newStatus } : u
        )
      );

      showToast(`Account ${newStatus} successfully!`, newStatus === "active" ? "success" : "warning");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update account status",
        "error"
      );
    }
  };

  /* RBAC PROTECTION LOGIC */
  const canModify = (user) => {
    if (user._id === currentUser._id) return false;
    if (user.role === "superadmin") return false;

    if (currentUser.role === "admin") {
      if (user.role === "admin") return false;
      return true;
    }

    if (currentUser.role === "superadmin") return true;

    return false;
  };

  /* PREMIUM ROLE BADGES */
  const roleBadge = (role) => {
    if (role === "superadmin") return "bg-slate-900 text-amber-400 border-slate-700 shadow-md";
    if (role === "admin") return "bg-blue-50 text-blue-600 border-blue-200/50";
    if (role === "manager") return "bg-indigo-50 text-indigo-600 border-indigo-200/50";
    return "bg-slate-50 text-slate-600 border-slate-200/50"; // user
  };

  /* 🔥 PREMIUM STATUS BADGES */
  const statusBadge = (status) => {
    if (status === "suspended") return "bg-rose-50 text-rose-600 border-rose-200";
    return "bg-emerald-50 text-emerald-600 border-emerald-200"; // active
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
              <Users size={28} className="text-blue-200" />
              User & Security Management
            </h2>
            <p className="text-indigo-100 mt-1 text-xs sm:text-sm font-medium">
              Control platform access, assign privileges, and manage active sessions securely.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2 shadow-inner w-fit">
            <span className="text-xs font-bold tracking-wider uppercase text-white">Total Accounts:</span>
            <span className="text-lg font-black text-white">{filtered.length}</span>
          </div>
        </div>

        {/* 🔥 FILTER & SEARCH BAR (Glassmorphism) */}
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center">

          <div className="relative w-full lg:w-96 group">
            <Search size={18} className="absolute left-4 top-2.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 pl-11 pr-4 py-2 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            {["All", "user", "manager", "admin", "superadmin"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap capitalize
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
              <Shield size={56} className="mb-4 opacity-20" />
              <p className="text-base font-semibold text-slate-500">No users found.</p>
              <p className="text-sm mt-1">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">

                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-5">
                      <div className="flex items-center gap-2"><UserCircle size={16}/> Name</div>
                    </th>
                    <th className="px-6 py-5">
                      <div className="flex items-center gap-2"><Mail size={16}/> Email Account</div>
                    </th>
                    <th className="px-6 py-5">
                      <div className="flex items-center gap-2"><ShieldCheck size={16}/> System Role</div>
                    </th>
                    <th className="px-6 py-5">
                      <div className="flex items-center gap-2"><Power size={16}/> Status</div>
                    </th>
                    <th className="px-6 py-5 text-right">
                      Action Required
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filtered.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">

                      {/* Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800 text-sm sm:text-base capitalize">
                          {u.name || "Unknown"}
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-600">
                          {u.email}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${roleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </td>

                      {/* 🔥 Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${statusBadge(u.accountStatus || 'active')}`}>
                          {u.accountStatus === 'suspended' ? <UserX size={14} /> : <UserCheck size={14} />}
                          {u.accountStatus || 'active'}
                        </div>
                      </td>

                      {/* Action Buttons / Protection */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        
                        {!canModify(u) ? (
                          <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <Lock size={14} className="text-slate-300" /> Protected
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* 🔥 ROLE CHANGE BUTTONS */}
                            {u.role === "user" ? (
                              <button
                                onClick={() => changeRole(u._id, "manager")}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-300"
                              >
                                <TrendingUp size={14} /> Promote
                              </button>
                            ) : u.role === "manager" ? (
                              <button
                                onClick={() => changeRole(u._id, "user")}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all duration-300"
                              >
                                <TrendingDown size={14} /> Demote
                              </button>
                            ) : null}

                            {/* 🔥 KILL SWITCH BUTTON */}
                            <button
                              onClick={() => toggleAccountStatus(u._id, u.accountStatus || 'active')}
                              className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition-all duration-300 shadow-sm
                                ${(!u.accountStatus || u.accountStatus === 'active') 
                                  ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-600 hover:text-white" 
                                  : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-600 hover:text-white"
                                }`}
                            >
                              <Power size={14} />
                              {(!u.accountStatus || u.accountStatus === 'active') ? "Suspend" : "Activate"}
                            </button>

                          </div>
                        )}

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