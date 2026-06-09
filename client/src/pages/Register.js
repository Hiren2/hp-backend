import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import Toast from "../components/Toast";
import useToast from "../components/useToast";

import {
  Mail,
  Lock,
  User,
  Calendar,
  ShieldCheck,
  Layers,
  Cpu,
  Eye,
  EyeOff
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Initialize Workspace 🚀";
    if (hour < 18) return "Create Operations Profile ✨";
    return "Join the Network 🌙";
  };

  const getStrength = () => {
    if (form.password.length === 0) return "";
    if (form.password.length < 6) return "Weak";
    if (form.password.length < 10) return "Medium";
    return "Strong";
  };

  const strengthColor = () => {
    if (getStrength() === "Weak") return "text-rose-500";
    if (getStrength() === "Medium") return "text-amber-500";
    if (getStrength() === "Strong") return "text-emerald-500";
    return "text-slate-500";
  };

  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    orders: 0
  });

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get("/public/stats");
      setStats({
        users: res.data.users,
        services: res.data.services,
        orders: res.data.orders
      });
    } catch {
      console.log("Stats load failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", form);
      showToast("Workspace created successfully", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      showToast(
        err.response?.data?.message || "Registration failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="min-h-screen grid md:grid-cols-2 bg-[#0B0F19] font-sans pb-20 md:pb-0 selection:bg-blue-500 selection:text-white">

        <div className="hidden md:flex flex-col justify-center px-12 lg:px-20 relative overflow-hidden border-r border-white/5">
          
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

          <div className="space-y-12 relative z-10">

            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
              <svg width="56" height="56" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-[0_0_20px_rgba(37,99,235,0.5)] rounded-full transition-transform group-hover:scale-105">
                <circle cx="24" cy="24" r="24" fill="url(#paint0_linear_register)"/>
                <path d="M14 14V34 M14 24H22 M22 14V34" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M28 34V14H33C35.7614 14 38 16.2386 38 19C38 21.7614 35.7614 24 33 24H28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="paint0_linear_register" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB"/> 
                    <stop offset="1" stopColor="#4F46E5"/> 
                  </linearGradient>
                </defs>
              </svg>
              <h1 className="text-4xl font-black text-white tracking-tight">
                H&P Solutions
              </h1>
            </div>

            <div className="w-28 h-28 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-[2rem] flex items-center justify-center border border-white/10 backdrop-blur-xl">
              <ShieldCheck size={56} className="text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            </div>

            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-md">
              Join the enterprise platform built with secure RBAC architecture and powerful operational analytics.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4">
              <Feature icon={<ShieldCheck size={28} />} title="Secure" />
              <Feature icon={<Layers size={28} />} title="Scalable" />
              <Feature icon={<Cpu size={28} />} title="Intelligent" />
            </div>

            <div className="grid grid-cols-4 gap-6 mt-6 bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 shadow-2xl">
              <Stat number={`${stats.users}+`} label="Users" />
              <Stat number={`${stats.services}+`} label="Services" />
              <Stat number={`${stats.orders}+`} label="Orders" />
              <Stat number="99%" label="Uptime" />
            </div>

          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 relative z-10 overflow-y-auto bg-[#0F1523]">

          <div className="w-full max-w-md bg-[#151C2C] p-10 rounded-[2.5rem] shadow-2xl border border-white/5 my-auto">

            <p className="text-center text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-4">
              {getGreeting()}
            </p>

            <h2 className="text-3xl font-black text-center mb-2 text-white tracking-tight">
              Create Profile
            </h2>

            <p className="text-center text-slate-400 mb-10 font-medium">
              Register your enterprise workspace
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              <InputField
                label="Full Name"
                icon={User}
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />

              <InputField
                label="Corporate Email"
                icon={Mail}
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">
                  Access Key (Password)
                </label>
                <div className="relative group">
                  <Lock size={20} className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-[#0B0F19] border border-white/10 pl-12 pr-12 py-3.5 rounded-2xl focus:bg-[#0B0F19] focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner relative z-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors z-10"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="h-4 mt-2 ml-1">
                  {form.password && (
                    <p className={`text-xs font-bold ${strengthColor()} transition-colors`}>
                      Strength: {getStrength()}
                    </p>
                  )}
                </div>
              </div>

              <InputField
                label="Date of Birth"
                icon={Calendar}
                type="date"
                value={form.dob}
                onChange={(v) => setForm({ ...form, dob: v })}
              />

              <button
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-500 transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.3)] mt-6 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white/40 border-t-white rounded-full"></span>
                    Initializing...
                  </>
                ) : (
                  "Register Workspace"
                )}
              </button>

            </form>

            <p className="text-sm text-center mt-8 text-slate-400 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white font-black hover:text-blue-400 transition-all"
              >
                Sign In
              </Link>
            </p>

          </div>
        </div>

      </div>

      <footer className="bg-[#0B0F19] border-t border-white/5 py-6 text-center text-sm text-slate-500 font-medium fixed md:absolute bottom-0 w-full z-20">
        © {new Date().getFullYear()} H&P Solutions. All rights reserved.
        <div className="space-x-6 mt-2">
          <span className="hover:text-white cursor-pointer transition-colors">
            Privacy Policy
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">
            Terms of Service
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="block sm:inline mt-2 sm:mt-0 hover:text-white transition-colors cursor-pointer">Support: support@hpsolutions.com</span>
        </div>
      </footer>

    </>
  );
}

function InputField({ label, icon: Icon, type, placeholder, value, onChange }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <Icon size={20} className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors z-10" />
        <input
          type={type}
          required
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0B0F19] border border-white/10 pl-12 pr-4 py-3.5 rounded-2xl focus:bg-[#0B0F19] focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner relative z-0"
        />
      </div>
    </div>
  );
}

function Feature({ icon, title }) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex justify-center items-center w-14 h-14 bg-[#0B0F19] shadow-inner rounded-2xl mb-4 text-blue-400 border border-white/5 group-hover:border-blue-500/30 transition-colors">
        {icon}
      </div>
      <p className="font-black text-slate-300 tracking-wide">{title}</p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-black text-white">{number}</p>
      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}