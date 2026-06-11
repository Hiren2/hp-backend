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
  CheckCircle,
  X,
  Trash2
} from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const dropdownRef = useRef(null);
  const intervalRef = useRef(null);

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

  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(() => {
      fetchNotifications();
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [fetchNotifications]);

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
        setIsUpdating(false);
      }, 500);

    } catch (err) {
      console.error("MARK READ ERROR:", err);
      setIsUpdating(false);
    }
  };

  // 🔥 NEW: Individual Delete Logic (Optimistic UI Update)
  const deleteNotification = async (id, e) => {
    e.stopPropagation(); // Prevents click from marking it as read
    
    // Optimistic remove for FAANG-like speed
    const prevNotifications = [...notifications];
    setNotifications(prev => prev.filter(n => n._id !== id));

    try {
      await api.delete(`/notifications/${id}`);
    } catch (err) {
      console.error("DELETE ERROR:", err);
      // Revert if API fails
      setNotifications(prevNotifications);
    }
  };

  // 🔥 NEW: Clear All Logic
  const clearAllNotifications = async () => {
    try {
      setIsUpdating(true);
      // Sequentially delete all notifications currently in state
      for (const n of notifications) {
        await api.delete(`/notifications/${n._id}`);
      }
      setNotifications([]);
      setOpen(false);
    } catch (err) {
      console.error("CLEAR ALL ERROR:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getIcon = (type = "") => {
    const act = (type || "").toUpperCase(); 
    const style = "p-1.5 rounded-lg";
    
    if (act.includes("ORDER_CREATED")) 
      return <div className={`${style} bg-emerald-50 text-emerald-600`}><ShoppingBag size={16} /></div>;
    if (act.includes("APPROVED")) 
      return <div className={`${style} bg-blue-50 text-blue-600`}><CheckCircle size={16} /></div>;
    if (act.includes("SHIPPED")) 
      return <div className={`${style} bg-indigo-50 text-indigo-600`}><Truck size={16} /></div>;
    if (act.includes("DELIVERED")) 
      return <div className={`${style} bg-emerald-50 text-emerald-600`}><Package size={16} /></div>;
    if (act.includes("NEW_ORDER")) 
      return <div className={`${style} bg-amber-50 text-amber-600`}><Inbox size={16} /></div>;
    if (act.includes("REJECTED") || act.includes("SUSPENDED")) 
      return <div className={`${style} bg-rose-50 text-rose-600`}><X size={16} /></div>;
    
    return <div className={`${style} bg-slate-50 text-slate-600`}><Zap size={16} /></div>;
  };

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
      
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-2 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 group ${open ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
      >
        <Bell size={22} className={`text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${unreadCount > 0 ? 'animate-wiggle' : ''}`} />

        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] text-white font-bold items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-[0_15px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.5)] rounded-[1.5rem] border border-slate-100 dark:border-slate-800 z-50 overflow-hidden animate-fadeIn">
          
          <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-tight flex items-center gap-2">
              Notifications 
              <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full text-[10px] font-black">
                {notifications.length}
              </span>
            </h3>

            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <Inbox size={48} className="opacity-20 mb-3" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">All caught up!</p>
                <p className="text-[11px] font-medium mt-1">No new notifications found.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`flex gap-4 px-5 py-4 transition-all duration-300 group cursor-default relative overflow-hidden ${
                      !n.isRead
                        ? "bg-indigo-50/40 dark:bg-indigo-900/10 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    }`}
                  >
                    {/* Unread Indicator Bar */}
                    {!n.isRead && (
                       <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500"></div>
                    )}

                    <div className="shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {getIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <p className={`text-sm tracking-tight capitalize leading-snug mb-1 ${!n.isRead ? "text-slate-900 dark:text-white font-bold" : "text-slate-600 dark:text-slate-300 font-medium"}`}>
                        {n.title || (n.type || "Update").replace(/_/g, " ").toLowerCase()}
                      </p>
                      
                      <p className={`text-[11px] line-clamp-2 mb-2 ${!n.isRead ? "text-slate-600 dark:text-slate-400 font-medium" : "text-slate-500 dark:text-slate-500"}`}>
                        {n.message}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                        <Clock size={10} />
                        {timeAgo(n.createdAt)}
                      </div>
                    </div>

                    {/* 🔥 Delete Button (Appears on Hover) */}
                    <button 
                      onClick={(e) => deleteNotification(n._id, e)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-slate-800 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-slate-100 dark:border-slate-700"
                      title="Delete Notification"
                    >
                      <X size={14} />
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              End of alerts
            </p>
            {notifications.length > 0 && (
              <button 
                onClick={clearAllNotifications}
                disabled={isUpdating}
                className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest flex items-center gap-1 transition-colors"
              >
                <Trash2 size={12} /> Clear All
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}