import { useEffect, useState, useCallback, useRef } from "react";
import api from "../api/api";
import { 
  Bell, 
  CheckCheck, 
  ShoppingBag, 
  Settings, 
  User, 
  Lock, 
  Zap, 
  Clock,
  Inbox,
  Package,
  Truck,
  CheckCircle
} from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const dropdownRef = useRef(null);
  const intervalRef = useRef(null);

  /* ================= FETCH ================= */
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications");
      if (!isUpdating) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  }, [isUpdating]);

  /* ================= POLLING ================= */
  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(() => {
      fetchNotifications();
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [fetchNotifications]);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  /* ================= MARK ALL READ ================= */
  const markAllRead = async () => {
    try {
      setIsUpdating(true);
      const res = await api.put("/notifications/read-all");
      
      if (res.data?.data) {
        setNotifications(res.data.data);
      } else {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
      
      setTimeout(() => {
        setOpen(false);
        setIsUpdating(false);
      }, 500);

    } catch (err) {
      console.error("MARK READ ERROR:", err);
      setIsUpdating(false);
    }
  };

  /* ================= 🔥 UPDATED DYNAMIC ICONS ================= */
  const getIcon = (type = "") => {
    const act = (type || "").toUpperCase(); // Safety check added here
    const style = "p-1.5 rounded-lg";
    
    if (act.includes("ORDER_CREATED")) 
      return <div className={`${style} bg-emerald-50 text-emerald-600`}><ShoppingBag size={16} /></div>;
    if (act.includes("APPROVED")) 
      return <div className={`${style} bg-blue-50 text-blue-600`}><CheckCircle size={16} /></div>;
    if (act.includes("SHIPPED")) 
      return <div className={`${style} bg-indigo-50 text-indigo-600`}><Truck size={16} /></div>;
    if (act.includes("DELIVERED")) 
      return <div className={`${style} bg-green-50 text-green-600`}><Package size={16} /></div>;
    if (act.includes("NEW_ORDER")) 
      return <div className={`${style} bg-amber-50 text-amber-600`}><Inbox size={16} /></div>;
    
    return <div className={`${style} bg-slate-50 text-slate-600`}><Zap size={16} /></div>;
  };

  /* ================= TIME ================= */
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* 🔔 BELL TRIGGER */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-2 rounded-xl transition-all duration-300 hover:bg-slate-100 group ${open ? 'bg-slate-100' : ''}`}
      >
        <Bell size={22} className={`text-slate-600 group-hover:text-indigo-600 transition-colors ${unreadCount > 0 ? 'animate-wiggle' : ''}`} />

        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] text-white font-bold items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* 📂 DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-[1.5rem] border border-slate-100 z-50 overflow-hidden animate-fadeIn">
          
          <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
              Notifications 
              <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                {notifications.length}
              </span>
            </h3>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <Inbox size={40} className="opacity-20 mb-2" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-[11px]">No new notifications found.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`flex gap-4 px-5 py-4 transition-all duration-300 group cursor-default ${
                      !n.isRead
                        ? "bg-indigo-50/40 hover:bg-indigo-50/60"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {/* 🔥 Uses .type now instead of .action */}
                      {getIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* 🔥 Uses .title if available, else falls back to type */}
                      <p className={`text-sm tracking-tight capitalize leading-snug mb-1 ${!n.isRead ? "text-slate-900 font-bold" : "text-slate-600 font-medium"}`}>
                        {n.title || (n.type || "Update").replace(/_/g, " ").toLowerCase()}
                      </p>
                      
                      {/* 🔥 Shows the detailed message */}
                      <p className="text-[11px] text-slate-500 line-clamp-2 mb-1">
                        {n.message}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                        <Clock size={10} />
                        {timeAgo(n.createdAt)}
                        {!n.isRead && (
                           <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/30 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              End of notifications
            </p>
          </div>

        </div>
      )}

    </div>
  );
}