import { useEffect, useState } from "react";
import api from "../utils/api";
import useToast from "../components/useToast";
import Toast from "../components/Toast";
import Swal from "sweetalert2";
import useTheme from "../hooks/useTheme";
import { ShieldCheck, Search } from "lucide-react";

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
      const res = await api.get("/superadmin/users");
      // Filter out superadmins so they can't be accidentally demoted
      setUsers(res.data.filter(u => u.role !== 'superadmin'));
    } catch (err) {
      showToast("Failed to fetch users", "error");
    } finally { 
      setLoading(false); 
    }
  };

  const handleRoleChange = async (userId, userName, currentRole, newRole) => {
    Swal.fire({
      title: `Confirm Role Change`,
      html: `Are you sure you want to change <b>${userName}</b> to <span className="uppercase font-bold text-indigo-600">${newRole}</span>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, change role',
      background: theme === 'dark' ? '#1e293b' : '#ffffff',
      color: theme === 'dark' ? '#f8fafc' : '#0f172a',
      borderRadius: '1.5rem',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/superadmin/users/${userId}/role`, { role: newRole });
          showToast(`User is now successfully set to ${newRole}`, "success");
          fetchUsers();
        } catch (error) {
          showToast(error.response?.data?.message || "Action failed", "error");
        }
      }
    });
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Toast message={toast.message} type={toast.type} />
      
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-3 text-slate-800 dark:text-white">
              <span className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600">
                <ShieldCheck size={24}/>
              </span> 
              Global Role Management
            </h1>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 text-slate-400" size={18}/>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm} 
              onChange={(e)=>setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User Identity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Platform Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Access Control Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter 
                      ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 
                        user.role === 'manager' ? 'bg-amber-100 text-amber-700' : 
                        'bg-slate-100 text-slate-500'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      
                      {/* IF CURRENT ROLE IS USER */}
                      {user.role === 'user' && (
                        <>
                          <button 
                            onClick={()=>handleRoleChange(user._id, user.name, user.role, 'manager')} 
                            className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all border border-amber-100"
                          >
                            Make Manager
                          </button>
                          <button 
                            onClick={()=>handleRoleChange(user._id, user.name, user.role, 'admin')} 
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
                          >
                            Make Admin
                          </button>
                        </>
                      )}

                      {/* IF CURRENT ROLE IS MANAGER */}
                      {user.role === 'manager' && (
                        <>
                          <button 
                            onClick={()=>handleRoleChange(user._id, user.name, user.role, 'user')} 
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all border border-rose-100"
                          >
                            Demote to User
                          </button>
                          <button 
                            onClick={()=>handleRoleChange(user._id, user.name, user.role, 'admin')} 
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
                          >
                            Promote to Admin
                          </button>
                        </>
                      )}

                      {/* IF CURRENT ROLE IS ADMIN */}
                      {user.role === 'admin' && (
                        <>
                          <button 
                            onClick={()=>handleRoleChange(user._id, user.name, user.role, 'user')} 
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all border border-rose-100"
                          >
                            Demote to User
                          </button>
                          <button 
                            onClick={()=>handleRoleChange(user._id, user.name, user.role, 'manager')} 
                            className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all border border-amber-100"
                          >
                            Demote to Manager
                          </button>
                        </>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}