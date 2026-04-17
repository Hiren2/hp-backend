import { Outlet, NavLink, Navigate, useNavigate, useLocation } from "react-router-dom";
import { getUser, logout, listenToLogout } from "../utils/auth";
import { useCart } from "../context/CartContext";
import NotificationBell from "./NotificationBell";
import Chatbot from "./Chatbot"; 
import { useEffect, useState } from "react";
import api from "../utils/api"; 
import useTheme from "../hooks/useTheme"; 
import Swal from "sweetalert2"; 
import { 
  Menu, X, User as UserIcon, LogOut, ChevronRight, Sun, Moon, 
  Home, ShoppingCart, Package, ClipboardList, Users, Settings, 
  ShieldAlert, MessageSquare, Heart, ShieldCheck, KeyRound 
} from "lucide-react";
import logo from "../assets/logo.png"; 

export default function Layout() {
  const [user, setUser] = useState(getUser());
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const { theme, toggleTheme } = useTheme();

  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlistCount = async () => {
    try {
      const res = await api.get("/wishlist");
      if (res.data) {
        setWishlistCount(res.data.length);
      }
    } catch (err) {
      console.warn("Failed to fetch wishlist count");
    }
  };

  useEffect(() => {
    listenToLogout(() => { window.location.replace("/login"); });
    
    const handleProfileUpdate = () => {
      setUser(getUser()); 
    };
    
    window.addEventListener('userProfileUpdated', handleProfileUpdate);

    if (user && user.role === "user") {
        fetchWishlistCount();
    }

    const interval = setInterval(() => { 
        setUser(getUser()); 
        if (getUser() && getUser().role === "user") {
            fetchWishlistCount();
        }
    }, 2000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const profileImage = user?.image || null; 
  const userRole = user.role?.toLowerCase()?.trim();
  const normalizedPath = location.pathname.toLowerCase().replace(/\/$/, ""); 

  const isDashboardActive = (role) => {
    if (role === 'user') return ['/', '', '/dashboard'].includes(normalizedPath);
    if (role === 'manager') return ['/manager', '/manager/dashboard', '/manager/stats'].includes(normalizedPath);
    if (role === 'admin') return ['/admin', '/admin/dashboard', '/admin/stats'].includes(normalizedPath);
    if (role === 'superadmin') return ['/superadmin', '/superadmin/dashboard', '/superadmin/stats'].includes(normalizedPath);
    return false;
  };

  const handleLogoutClick = () => {
    setOpen(false); 
    Swal.fire({
      title: 'Ready to leave?',
      text: "You are about to securely log out of your session.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48', 
      cancelButtonColor: '#475569',  
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'Cancel',
      background: theme === 'dark' ? '#1e293b' : '#ffffff', 
      color: theme === 'dark' ? '#f8fafc' : '#0f172a',
      borderRadius: '1rem',
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); 
      }
    });
  };

  const navBase = "px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold transition-all duration-300 border border-transparent";
  const navActive = "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25";
  const navInactive = "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300";

  const renderTopNav = () => {
    switch (userRole) {
      case "user":
        return (
          <>
            <NavLink to="/dashboard" className={({isActive})=>`${navBase} ${(isActive || isDashboardActive('user')) ? navActive : navInactive}`}>🏠 Dashboard</NavLink>
            <NavLink to="/services" className={({isActive})=>`${navBase} ${isActive?navActive:navInactive}`}>🛒 Services</NavLink>
            <NavLink to="/wishlist" className={({isActive})=>`${navBase} ${isActive?navActive:navInactive}`}>
                ❤️ Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </NavLink>
            <NavLink to="/cart" className={({isActive})=>`${navBase} ${isActive?navActive:navInactive}`}>🧺 Cart ({cartCount})</NavLink>
            <NavLink to="/my-orders" className={({isActive})=>`${navBase} ${isActive?navActive:navInactive}`}>📦 Orders</NavLink>
          </>
        );
      case "manager":
        return (
          <>
            <NavLink to="/manager/dashboard" className={({isActive})=>`${navBase} ${(isActive || isDashboardActive('manager')) ? navActive : navInactive}`}>📊 Dashboard</NavLink>
            <NavLink to="/manager/orders" className={({isActive})=>`${navBase} ${isActive?navActive:navInactive}`}>📋 Manage Orders</NavLink>
          </>
        );
      case "admin":
        return (
          <>
            <NavLink to="/admin/dashboard" className={({isActive})=>`${navBase} ${(isActive || isDashboardActive('admin')) ? navActive : navInactive}`}>📊 Stats</NavLink>
            <NavLink to="/admin/services" className={({isActive})=>`${navBase} ${isActive?navActive:navInactive}`}>🛠 Services</NavLink>
            <NavLink to="/admin/orders" className={({isActive})=>`${navBase} ${isActive?navActive:navInactive}`}>📜 Orders</NavLink>
            <NavLink to="/admin/managers" className={({isActive})=>`${navBase} ${isActive?navActive:navInactive}`}>👥 Users</NavLink>
          </>
        );
      case "superadmin":
        return (
          <>
            <NavLink to="/superadmin/dashboard" className={({isActive})=>`${navBase} ${(isActive || isDashboardActive('superadmin')) ? navActive : navInactive}`}>🛡 Dashboard</NavLink>
            <NavLink to="/superadmin/manage-roles" className={({isActive})=>`${navBase} ${isActive?navActive:navInactive}`}>👥 Manage Admins</NavLink>
            <NavLink to="/superadmin/audit-logs" className={({isActive})=>`${navBase} ${isActive?navActive:navInactive}`}>📜 Logs</NavLink>
          </>
        );
      default: return null;
    }
  };

  const sidebarBase = "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group border border-transparent";
  const sidebarActive = "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm border-blue-100 dark:border-blue-500/20";
  const sidebarInactive = "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200";

  const renderSidebarNav = () => {
    switch (userRole) {
      case "user":
        return (
          <>
            <NavLink to="/dashboard" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${(isActive || isDashboardActive('user')) ? sidebarActive : sidebarInactive}`}><Home size={18} className="group-hover:scale-110 transition-transform"/> Dashboard</NavLink>
            <NavLink to="/services" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${isActive?sidebarActive:sidebarInactive}`}><ShoppingCart size={18} className="group-hover:scale-110 transition-transform"/> Services</NavLink>
            <NavLink to="/wishlist" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${isActive?sidebarActive:sidebarInactive}`}>
                <Heart size={18} className="group-hover:scale-110 transition-transform text-rose-500"/> 
                Saved Items {wishlistCount > 0 && `(${wishlistCount})`}
            </NavLink>
            <NavLink to="/cart" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${isActive?sidebarActive:sidebarInactive}`}><Package size={18} className="group-hover:scale-110 transition-transform"/> Cart ({cartCount})</NavLink>
            <NavLink to="/my-orders" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${isActive?sidebarActive:sidebarInactive}`}><ClipboardList size={18} className="group-hover:scale-110 transition-transform"/> My Orders</NavLink>
          </>
        );
      case "manager":
        return (
          <>
            <NavLink to="/manager/dashboard" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${(isActive || isDashboardActive('manager')) ? sidebarActive : sidebarInactive}`}><Home size={18} className="group-hover:scale-110 transition-transform"/> Manager Dashboard</NavLink>
            <NavLink to="/manager/orders" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${isActive?sidebarActive:sidebarInactive}`}><ClipboardList size={18} className="group-hover:scale-110 transition-transform"/> Assigned Orders</NavLink>
          </>
        );
      case "admin":
        return (
          <>
            <NavLink to="/admin/dashboard" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${(isActive || isDashboardActive('admin')) ? sidebarActive : sidebarInactive}`}><Home size={18} className="group-hover:scale-110 transition-transform"/> Admin Stats</NavLink>
            <NavLink to="/admin/services" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${isActive?sidebarActive:sidebarInactive}`}><Settings size={18} className="group-hover:scale-110 transition-transform"/> Manage Services</NavLink>
            <NavLink to="/admin/orders" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${isActive?sidebarActive:sidebarInactive}`}><ClipboardList size={18} className="group-hover:scale-110 transition-transform"/> All Orders</NavLink>
            <NavLink to="/admin/managers" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${isActive?sidebarActive:sidebarInactive}`}><Users size={18} className="group-hover:scale-110 transition-transform"/> Manage Users</NavLink>
            <NavLink to="/admin/system-activity" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${isActive?sidebarActive:sidebarInactive}`}><ShieldAlert size={18} className="group-hover:scale-110 transition-transform"/> System Activity</NavLink>
          </>
        );
      case "superadmin":
        return (
          <>
            <NavLink to="/superadmin/dashboard" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${(isActive || isDashboardActive('superadmin')) ? sidebarActive : sidebarInactive}`}><Home size={18} className="group-hover:scale-110 transition-transform"/> Super Dashboard</NavLink>
            <NavLink to="/superadmin/manage-roles" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${isActive?sidebarActive:sidebarInactive}`}><ShieldCheck size={18} className="group-hover:scale-110 transition-transform"/> Manage Admins</NavLink>
            <NavLink to="/superadmin/audit-logs" onClick={()=>setOpen(false)} className={({isActive})=>`${sidebarBase} ${isActive?sidebarActive:sidebarInactive}`}><ShieldAlert size={18} className="group-hover:scale-110 transition-transform"/> Global Audit Logs</NavLink>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
      
      {/* --- GLASSMORPHISM HEADER --- */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 flex items-center sticky top-0 z-40 transition-colors">
        <button onClick={() => setOpen(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-colors">
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-3 ml-4 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <img src={logo} className="h-10 w-10 object-contain drop-shadow-sm" alt="logo" />
          <span className="hidden sm:block font-extrabold text-xl text-slate-800 dark:text-white tracking-tight">
            H&P Solutions
          </span>
        </div>
        
        <div className="hidden xl:flex gap-3 ml-10">
          {renderTopNav()}
        </div>

        <div className="ml-auto flex items-center gap-5">
          <button onClick={toggleTheme} className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-amber-400 transition-colors shadow-inner">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <NotificationBell />
          
          <div onClick={() => setOpen(true)} className="w-11 h-11 rounded-full text-white flex items-center justify-center font-black cursor-pointer shadow-md hover:shadow-lg transition-all hover:scale-105 border-2 border-white dark:border-slate-800 overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </div>
        </div>
      </header>

      {/* --- PREMIUM SIDEBAR DRAWER --- */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 shadow-[20px_0_40px_rgb(0,0,0,0.1)] z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${open ? "translate-x-0" : "-translate-x-full"}`}>
        
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <img src={logo} className="h-10 w-10 object-contain" alt="logo" />
            <span className="font-extrabold text-xl text-slate-800 dark:text-white tracking-tight">H&P Solutions</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/20 transition-all"></div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-full text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white dark:border-slate-700 overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <div>
                   <p className="font-extrabold text-slate-800 dark:text-white capitalize text-lg leading-tight">{user?.name}</p>
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2.5 py-1 rounded-md mt-1.5 inline-block border border-blue-200 dark:border-blue-500/30">
                     {user?.role}
                   </span>
                </div>
             </div>
          </div>
        </div>

        <div className="px-4 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar pb-6">
          <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4 mb-3 mt-2">Main Menu</p>
          
          {renderSidebarNav()}
          
          {userRole === "user" && (
            <>
              <div className="my-5 border-t border-slate-100 dark:border-slate-800/60 mx-4"></div>
              <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4 mb-3 mt-4">Help & Support</p>
              <NavLink to="/support" onClick={() => setOpen(false)} className={({isActive}) => `${sidebarBase} justify-between ${isActive ? sidebarActive : sidebarInactive}`}>
                  <div className="flex items-center gap-3"><MessageSquare size={18} className="group-hover:scale-110 transition-transform" /> AI Support Chat</div>
                  <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            </>
          )}

          <div className="my-5 border-t border-slate-100 dark:border-slate-800/60 mx-4"></div>
          <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4 mb-3 mt-4">Account Settings</p>
          
          {/* UNIVERSAL PROFILE LINK */}
          <NavLink to="/profile" onClick={() => setOpen(false)} className={({isActive}) => `${sidebarBase} justify-between ${isActive ? sidebarActive : sidebarInactive}`}>
              <div className="flex items-center gap-3"><UserIcon size={18} className="group-hover:scale-110 transition-transform" /> Profile Overview</div>
              <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:translate-x-1 transition-transform" />
          </NavLink>

          {/* 🔥 SECURITY LINK - ONLY VISIBLE TO MANAGERS, ADMINS, AND SUPERADMINS */}
          {userRole !== "user" && (
            <NavLink to="/change-password" onClick={() => setOpen(false)} className={({isActive}) => `${sidebarBase} justify-between ${isActive ? sidebarActive : sidebarInactive}`}>
                <div className="flex items-center gap-3"><KeyRound size={18} className="group-hover:scale-110 transition-transform" /> Security</div>
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          )}

        </div>

        <div className="w-full p-6 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 mt-auto">
          <button onClick={handleLogoutClick} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-sm hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors border border-rose-100 dark:border-rose-500/20 shadow-sm">
            <LogOut size={18} /> Secure Logout
          </button>
        </div>
      </div>

      {open && <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setOpen(false)} />}

      <main className="p-6 md:p-8 flex-1 transition-colors duration-300 max-w-[1600px] mx-auto w-full">
        <Outlet />
      </main>

      {userRole === "user" && <Chatbot />}
    </div>
  );
}