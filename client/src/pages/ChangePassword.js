import { useState, useEffect } from 'react';
import api from '../utils/api'; 
import useToast from '../components/useToast';
import Toast from '../components/Toast';
import useTheme from "../hooks/useTheme";
import { Lock, ShieldCheck, KeyRound, Eye, EyeOff, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';

export default function ChangePassword() {
  const { toast, showToast } = useToast();
  const { theme } = useTheme();
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);

  // Live Password Strength Calculator
  useEffect(() => {
    let score = 0;
    const pwd = passwords.newPassword;
    if (pwd.length > 5) score += 1;
    if (pwd.length > 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    setStrength(Math.min(5, score));
  }, [passwords.newPassword]);

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
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      
      showToast("Security Credentials Updated Successfully! 🚀", "success");
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
      setStrength(0);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  // UI Helpers for Strength Meter
  const strengthColors = ["bg-slate-200", "bg-rose-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-400", "bg-emerald-600"];
  const strengthLabels = ["Enter Password", "Very Weak", "Weak", "Fair", "Strong", "Enterprise Grade"];

  return (
    <>
      <Toast message={toast.message} type={toast.type} />
      
      <div className="max-w-6xl mx-auto mt-6 mb-12">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row">
          
          {/* LEFT SIDE: BRANDING & TIPS */}
          <div className="lg:w-5/12 bg-gradient-to-br from-indigo-600 to-purple-700 p-10 text-white relative overflow-hidden flex flex-col justify-center">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400/20 rounded-full mix-blend-overlay filter blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-inner">
                <ShieldCheck size={36} className="text-emerald-400" />
              </div>
              
              <h2 className="text-3xl font-black mb-4 tracking-tight drop-shadow-md">
                Enterprise<br/>Security Center
              </h2>
              <p className="text-indigo-100 font-medium mb-8 text-sm leading-relaxed">
                Protecting your administrative access is crucial. Update your credentials regularly to maintain platform integrity.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <CheckCircle2 size={20} className="text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-xs font-medium text-indigo-50">Use at least 8 characters with a mix of letters, numbers & symbols.</p>
                </div>
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <ShieldAlert size={20} className="text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs font-medium text-indigo-50">Never reuse passwords from other internal or external applications.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: THE FORM */}
          <div className="lg:w-7/12 p-8 sm:p-12 flex flex-col justify-center bg-slate-50/50 dark:bg-slate-900/50">
            
            <div className="mb-8">
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                Change Password <Zap size={24} className="text-amber-500" />
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Verify your current identity to set a new password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* CURRENT PASSWORD */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Current Authorization Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    type={showPwd.current ? "text" : "password"} 
                    required 
                    value={passwords.currentPassword} 
                    onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm text-slate-800 dark:text-white shadow-sm" 
                    placeholder="Enter current password" 
                  />
                  <button type="button" onClick={() => setShowPwd({...showPwd, current: !showPwd.current})} className="absolute right-4 top-3.5 text-slate-400 hover:text-indigo-500 transition-colors">
                    {showPwd.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent my-6"></div>

              {/* NEW PASSWORD */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">New Security Key</label>
                <div className="relative group mb-3">
                  <KeyRound className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    type={showPwd.new ? "text" : "password"} 
                    required 
                    value={passwords.newPassword} 
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm text-slate-800 dark:text-white shadow-sm" 
                    placeholder="Create new password" 
                  />
                  <button type="button" onClick={() => setShowPwd({...showPwd, new: !showPwd.new})} className="absolute right-4 top-3.5 text-slate-400 hover:text-indigo-500 transition-colors">
                    {showPwd.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* LIVE STRENGTH METER */}
                {passwords.newPassword.length > 0 && (
                  <div className="px-1 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex gap-1.5 h-1.5 mb-1.5 w-full">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <div key={index} className={`h-full flex-1 rounded-full transition-all duration-500 ${index <= strength ? strengthColors[strength] : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                      ))}
                    </div>
                    <p className={`text-[10px] font-bold text-right uppercase tracking-wider ${strength < 3 ? 'text-rose-500' : strength < 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {strengthLabels[strength]}
                    </p>
                  </div>
                )}
              </div>

              {/* CONFIRM NEW PASSWORD */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Confirm New Key</label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    type={showPwd.confirm ? "text" : "password"} 
                    required 
                    value={passwords.confirmPassword} 
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm text-slate-800 dark:text-white shadow-sm" 
                    placeholder="Confirm new password" 
                  />
                  <button type="button" onClick={() => setShowPwd({...showPwd, confirm: !showPwd.confirm})} className="absolute right-4 top-3.5 text-slate-400 hover:text-indigo-500 transition-colors">
                    {showPwd.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwords.confirmPassword.length > 0 && passwords.newPassword !== passwords.confirmPassword && (
                  <p className="text-[10px] text-rose-500 font-bold mt-2 ml-1">Passwords do not match</p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading || (passwords.newPassword !== passwords.confirmPassword) || passwords.newPassword.length < 6} 
                className="w-full py-4 mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_8px_30px_rgb(79,70,229,0.3)] transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3 text-sm"
              >
                {loading ? (
                  <><div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div> Updating Protocol...</>
                ) : (
                  <><ShieldCheck size={18} /> Update Security Protocol</>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}