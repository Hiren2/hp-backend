import { Link } from "react-router-dom";
import { logout, getUser } from "../utils/auth";
import { LogOut } from "lucide-react";
import logo from "../assets/logo.png"; 

export default function Navbar() {
  const user = getUser();

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      
      {/* Logo & Brand */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <img src={logo} className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-sm" alt="H&P Logo" />
        <Link to="/dashboard" className="font-black text-xl sm:text-2xl text-slate-800 dark:text-white tracking-tight">
          H&P Solutions
        </Link>
      </div>

      {/* Desktop Links (Hidden on small screens) */}
      <div className="hidden lg:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-full border border-slate-100 dark:border-slate-700">
        <Link to="/dashboard" className="px-6 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all whitespace-nowrap">
          Dashboard
        </Link>

        {user?.role === "user" && (
          <>
            <Link to="/services" className="px-6 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all whitespace-nowrap">Browse Services</Link>
            <Link to="/my-orders" className="px-6 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all whitespace-nowrap">My Orders</Link>
            <Link to="/tasks" className="px-6 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all whitespace-nowrap">Tasks</Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/services" className="px-6 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all whitespace-nowrap">Manage Services</Link>
            <Link to="/admin/orders" className="px-6 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all whitespace-nowrap">Manage Orders</Link>
          </>
        )}
      </div>

      {/* Logout Button (Icon on mobile, Text on desktop) */}
      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full font-bold text-sm transition-colors border border-rose-100 shrink-0"
      >
        <LogOut size={16} /> <span className="hidden sm:block">Logout</span>
      </button>
    </nav>
  );
}