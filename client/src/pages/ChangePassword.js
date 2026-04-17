import { useState } from 'react';
import api from '../utils/api'; 
import useToast from '../components/useToast';
import Toast from '../components/Toast';
import useTheme from "../hooks/useTheme";
import { Lock, ShieldCheck, KeyRound } from 'lucide-react';

export default function ChangePassword() {
  const { toast, showToast } = useToast();
  const { theme } = useTheme();
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      return showToast("New passwords do not match!", "error");
    }
    
    if (passwords.newPassword.length < 6) {
      return showToast("Password must be at least 6 characters long", "error");
    }

    setLoading(true);
    try {
      // Backend route (hum isko authRoutes me add karenge)
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      
      showToast("Password updated successfully! 🚀", "success");
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
          
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-inner">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              Update Security
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
              Ensure your account is using a long, random password to stay secure.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required 
                  value={passwords.currentPassword} 
                  onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-white" 
                  placeholder="Enter current password" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required 
                  value={passwords.newPassword} 
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-white" 
                  placeholder="Create new password" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Confirm New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required 
                  value={passwords.confirmPassword} 
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-white" 
                  placeholder="Confirm new password" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

        </div>
      </div>
    </>
  );
}