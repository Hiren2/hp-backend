import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../api/api";
import Toast from "../components/Toast";
import useToast from "../components/useToast";
import { 
  ShieldCheck, 
  Search, 
  Terminal, 
  Clock, 
  UserCircle, 
  Target, 
  AlertOctagon,
  FileText,
  ArrowRight
} from "lucide-react";

export default function SuperAdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const { toast, showToast } = useToast();

  /* 🔥 DEBOUNCE FIX */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await api.get("/admin/audit-logs");
      setLogs(res.data);
    } catch {
      showToast("Failed to load audit logs", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  /* 🔥 FAST FILTER */
  const filteredLogs = useMemo(() => {
    return logs.filter((log) =>
      JSON.stringify(log)
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    );
  }, [logs, debouncedSearch]);

  const severityBadge = (severity) => {
    const s = severity?.toLowerCase();
    if (s === "critical" || s === "high" || s === "danger") {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          Critical
        </span>
      );
    }
    if (s === "warning" || s === "medium") {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Warning
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Info
      </span>
    );
  };

  /* 🔥 INTELLIGENT META PARSER */
  const renderMetaDetails = (meta) => {
    // 🔥 THE FIX: Agar koi extra data nahi hai, toh kuch bhi render mat karo (Return null).
    if (!meta || Object.keys(meta).length === 0) return null;

    return (
      <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
        {meta.message && (
          <div className="flex items-start gap-2 text-slate-700">
            <FileText size={14} className="mt-0.5 text-blue-500 flex-shrink-0" />
            <span className="font-medium leading-snug">{meta.message}</span>
          </div>
        )}
        {meta.from && meta.to && (
          <div className="flex items-center gap-2 font-mono font-bold text-[10px] bg-white w-fit px-2 py-1 rounded border border-slate-200">
            <span className="text-slate-500">{meta.from.toUpperCase()}</span>
            <ArrowRight size={12} className="text-blue-500" />
            <span className="text-blue-600">{meta.to.toUpperCase()}</span>
          </div>
        )}
        {meta.amount && (
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
            💰 Amount Processed: ₹{meta.amount}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-7xl mx-auto mt-8 px-4 pb-12 space-y-6 font-sans antialiased animate-fadeIn">

        {/* HERO HEADER */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white p-6 sm:p-8 rounded-[2rem] shadow-2xl shadow-slate-900/20 overflow-hidden border border-slate-700">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3 tracking-tight">
                <ShieldCheck className="text-blue-400" size={32} /> Security Audit Logs
              </h1>
              <p className="text-slate-400 mt-2 text-sm font-medium max-w-2xl">
                Real-time, immutable monitoring of all platform security events, financial transactions, and role changes.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <span className="text-xs font-black tracking-widest uppercase text-emerald-400">System Secure</span>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-[400px] group">
            <Search size={18} className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by actor, action, or metadata..."
              className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-semibold text-slate-800 placeholder-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-4 text-[11px] font-black uppercase tracking-wider">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 rounded-xl text-slate-600">
              <Terminal size={14} /> Total Records: {logs.length}
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
              <Search size={14} /> Filtered: {filteredLogs.length}
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <div className="animate-spin h-10 w-10 border-4 border-slate-100 border-t-blue-600 rounded-full mb-4"></div>
              <p className="text-sm font-bold tracking-wide uppercase">Decrypting audit logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-slate-50/50">
              <ShieldCheck size={64} className="mb-4 text-slate-200" />
              <p className="text-lg font-black text-slate-600">No records found</p>
              <p className="text-sm font-medium mt-1">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-5 whitespace-nowrap"><div className="flex items-center gap-2"><UserCircle size={14}/> Actor Details</div></th>
                    <th className="px-6 py-5"><div className="flex items-center gap-2"><Terminal size={14}/> Action & Meta</div></th>
                    <th className="px-6 py-5 whitespace-nowrap"><div className="flex items-center gap-2"><Target size={14}/> Target</div></th>
                    <th className="px-6 py-5 whitespace-nowrap"><div className="flex items-center gap-2"><AlertOctagon size={14}/> Status</div></th>
                    <th className="px-6 py-5 whitespace-nowrap text-right"><div className="flex items-center justify-end gap-2"><Clock size={14}/> Timestamp</div></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-blue-50/30 transition-colors group">
                      
                      {/* ACTOR */}
                      <td className="px-6 py-5 whitespace-nowrap align-top">
                        <div className="font-black text-slate-800 text-sm">
                          {log.actor?.name || "System Automated"}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {log.actor?.email || "internal_process"}
                        </div>
                        <div className="mt-1.5 inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded border border-slate-200">
                          {log.actorRole}
                        </div>
                      </td>

                      {/* ACTION & METADATA */}
                      <td className="px-6 py-5 align-top max-w-md">
                        <span className="font-mono text-[11px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100">
                          {log.action}
                        </span>
                        {/* 🔥 DYNAMIC META RENDERER */}
                        {renderMetaDetails(log.meta)}
                      </td>

                      {/* TARGET */}
                      <td className="px-6 py-5 align-top">
                        <div className="text-slate-700 font-bold text-sm">
                          {log.target}
                        </div>
                        <div className="text-[10px] font-mono font-bold text-slate-400 mt-1">
                          ID: {log.targetId ? log.targetId.toString().slice(-6).toUpperCase() : "GLOBAL"}
                        </div>
                      </td>

                      {/* SEVERITY */}
                      <td className="px-6 py-5 whitespace-nowrap align-top">
                        {severityBadge(log.severity)}
                      </td>

                      {/* TIMESTAMP */}
                      <td className="px-6 py-5 whitespace-nowrap text-right align-top">
                        <div className="text-sm font-bold text-slate-700">
                          {new Date(log.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-xs font-mono font-bold text-slate-400 mt-0.5">
                          {new Date(log.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                        </div>
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