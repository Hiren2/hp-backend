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

  /* 🔥 GREETING */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Let's get started 🚀";
    if (hour < 18) return "Create your account ✨";
    return "Welcome to the platform 🌙";
  };

  /* 🔥 PASSWORD STRENGTH */
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
    return "text-slate-400";
  };

  /* LIVE STATS */
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
      showToast("Account created successfully", "success");

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

      {/* Premium Glassmorphism Background to match Login */}
      <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-indigo-50 via-blue-50/50 to-purple-100/60 font-sans pb-16 md:pb-0">

        {/* LEFT HERO */}
        <div className="hidden md:flex flex-col justify-center px-12 lg:px-20 relative">
          
          {/* Subtle background blur circle */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>

          <div className="space-y-10 relative z-10">

            <div className="flex items-center gap-4">
              {/* 🔥 NEW MODERN SVG MONOGRAM LOGO */}
              <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-lg rounded-full">
                <circle cx="24" cy="24" r="24" fill="url(#paint0_linear_register)"/>
                {/* H Letter Path */}
                <path d="M14 14V34 M14 24H22 M22 14V34" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                {/* P Letter Path */}
                <path d="M28 34V14H33C35.7614 14 38 16.2386 38 19C38 21.7614 35.7614 24 33 24H28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="paint0_linear_register" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB"/> {/* Tailwind blue-600 */}
                    <stop offset="1" stopColor="#4F46E5"/> {/* Tailwind indigo-600 */}
                  </linearGradient>
                </defs>
              </svg>
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
                H&P Solutions
              </h1>
            </div>

            {/* Shield Box with Hover Effect */}
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 border border-white/20 transform hover:scale-105 transition-transform duration-300">
              <ShieldCheck size={64} className="text-white drop-shadow-md" />
            </div>

            <p className="text-slate-600 text-xl font-medium leading-relaxed max-w-md">
              Join the enterprise platform built with secure RBAC architecture and powerful analytics.
            </p>

            <div className="grid grid-cols-3 gap-8 pt-4">
              <Feature icon={<ShieldCheck size={30} />} title="Secure" />
              <Feature icon={<Layers size={30} />} title="Scalable" />
              <Feature icon={<Cpu size={30} />} title="Intelligent" />
            </div>

            {/* Glassy Stats Box */}
            <div className="grid grid-cols-4 gap-6 mt-4 bg-white/40 backdrop-blur-lg p-5 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <Stat number={`${stats.users}+`} label="Users" />
              <Stat number={`${stats.services}+`} label="Services" />
              <Stat number={`${stats.orders}+`} label="Orders" />
              <Stat number="99%" label="Uptime" />
            </div>

          </div>
        </div>

        {/* REGISTER CARD */}
        <div className="flex items-center justify-center px-6 py-10 relative z-10 overflow-y-auto">

          <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/80 my-auto">

            <p className="text-center text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">
              {getGreeting()}
            </p>

            <h2 className="text-3xl font-extrabold text-center mb-2 text-slate-800 tracking-tight">
              Create Account
            </h2>

            <p className="text-center text-slate-500 mb-8 font-medium">
              Register your workspace profile
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              <InputField
                label="Full Name"
                icon={User}
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />

              <InputField
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />

              {/* PASSWORD FIELD */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-white/70 border border-slate-200/60 pl-11 pr-12 py-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm relative z-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors z-10"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="h-4 mt-1.5 ml-1">
                  {form.password && (
                    <p className={`text-xs font-semibold ${strengthColor()} transition-colors`}>
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
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-60 shadow-lg shadow-blue-500/30 mt-4"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white/40 border-t-white rounded-full"></span>
                    Creating...
                  </>
                ) : (
                  "Register Account"
                )}
              </button>

            </form>

            <p className="text-sm text-center mt-8 text-slate-600 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-bold hover:underline transition-all"
              >
                Sign In
              </Link>
            </p>

          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/50 py-5 text-center text-sm text-slate-500 font-medium fixed md:absolute bottom-0 w-full z-20">
        © {new Date().getFullYear()} H&P Solutions. All rights reserved.
        <div className="space-x-6 mt-2">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            Privacy Policy
          </span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            Terms of Service
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="block sm:inline mt-2 sm:mt-0">Support: support@hpsolutions.com</span>
        </div>
      </footer>

    </>
  );
}

/* POLISHED INPUT FIELD COMPONENT */
function InputField({ label, icon: Icon, type, placeholder, value, onChange }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <Icon size={18} className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
        <input
          type={type}
          required
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/70 border border-slate-200/60 pl-11 pr-4 py-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm relative z-0"
        />
      </div>
    </div>
  );
}

/* FEATURE */
function Feature({ icon, title }) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex justify-center items-center w-12 h-12 bg-white/50 backdrop-blur-sm shadow-sm rounded-xl mb-3 text-blue-600 border border-white/60">
        {icon}
      </div>
      <p className="font-bold text-slate-700 tracking-wide">{title}</p>
    </div>
  );
}

/* STATS */
function Stat({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{number}</p>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}