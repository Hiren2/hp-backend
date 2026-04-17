// src/pages/SuperAdminManageAdmins.js

import { useEffect, useState } from "react";
import api from "../utils/api";
import useToast from "../components/useToast";
import Toast from "../components/Toast";
import Swal from "sweetalert2";
import useTheme from "../hooks/useTheme";
import { Users, Shield, UserX, ArrowUpRight, ArrowDownRight, Search } from "lucide-react";

export default function SuperAdminManageAdmins() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast, showToast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      // Filter out superadmins so they can't be accidentally demoted
      const manageableUsers = res.data.filter(u => u.role !== 'superadmin');
      setUsers(manageableUsers);
    } catch (err) {
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, userName, currentRole, newRole) => {
    // Confirmation Dialog
    Swal.fire({
      title: 'Confirm Role Change',
      html: `Are you sure you want to change <b>${userName}</b>'s role from <span className="uppercase text-xs font-bold">${currentRole}</span> to <span className="uppercase text-xs font-bold text-rose-500">${newRole}</span>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5', // Indigo-600
      cancelButtonColor: '#64748b',  // Slate-500
      confirmButtonText: 'Yes, update role!',
      background: theme === 'dark' ? '#1e293b' : '#ffffff',
      color: theme === 'dark' ? '#f8fafc' : '#0f172a',
      borderRadius: '1rem',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/users/${userId}/role`, { role: newRole });
          showToast(`Successfully updated role to ${newRole}`, "success");
          fetchUsers(); // Refresh list
        } catch (error) {
          showToast(error.response?.data?.message || "Failed to update role", "error");
        }
      }
    });
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Toast message={toast.message} type={toast.type} />
      
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 tracking-tight text-slate-800 dark:text-white">
              <span className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Shield size={28} />
              </span> 
              Role Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">
              Promote users to Admins or demote staff. SuperAdmins are protected.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">User Details</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Current Role</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No users found matching "{searchTerm}"</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 shadow-inner">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' : 
                            user.role === 'manager' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          
                          {/* Promote to Admin */}
                          {user.role !== 'admin' && (
                            <button 
                              onClick={() => handleRoleChange(user._id, user.name, user.role, 'admin')}
                              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Promote to Admin"
                            >
                              <ArrowUpRight size={14} /> Admin
                            </button>
                          )}

                           {/* Promote/Demote to Manager */}
                           {user.role !== 'manager' && (
                            <button 
                              onClick={() => handleRoleChange(user._id, user.name, user.role, 'manager')}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Make Manager"
                            >
                              {user.role === 'admin' ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>} Manager
                            </button>
                          )}

                          {/* Demote to User */}
                          {user.role !== 'user' && (
                            <button 
                              onClick={() => handleRoleChange(user._id, user.name, user.role, 'user')}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Demote to User"
                            >
                              <UserX size={14} /> Demote
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}