import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export default function Toast({ message, type, duration = 3000 }) {
  const [visible, setVisible] = useState(false);

  // Auto-hide logic
  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!message || !visible) return null;

  const styles = {
    success: {
      bg: "bg-emerald-600/90 border-emerald-400",
      icon: <CheckCircle size={20} />,
      shadow: "shadow-emerald-500/20"
    },
    error: {
      bg: "bg-rose-600/90 border-rose-400",
      icon: <XCircle size={20} />,
      shadow: "shadow-rose-500/20"
    },
    info: {
      bg: "bg-blue-600/90 border-blue-400",
      icon: <Info size={20} />,
      shadow: "shadow-blue-500/20"
    },
  };

  const config = styles[type] || styles.info;

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-toast-in">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white backdrop-blur-md border shadow-2xl transition-all hover:scale-105 ${config.bg} ${config.shadow}`}
      >
        <div className="bg-white/20 p-1 rounded-lg">
          {config.icon}
        </div>
        
        <span className="font-bold text-sm tracking-wide pr-4">
          {message}
        </span>

        {/* Manual Close Button */}
        <button 
          onClick={() => setVisible(false)}
          className="ml-auto opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}