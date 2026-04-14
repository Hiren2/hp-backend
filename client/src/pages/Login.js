import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import Toast from "../components/Toast";
import useToast from "../components/useToast";

import {
  Mail,
  Lock,
  ShieldCheck,
  Layers,
  Cpu,
  Eye,
  EyeOff
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    orders: 0
  });

  /* 🔥 FIXED GREETING (NO GOOD NIGHT EVER) */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning ☀️";
    if (hour >= 12 && hour < 17) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

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
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showToast("Login successful", "success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);

    } catch (err) {
      showToast(
        err.response?.data?.message || "Invalid credentials",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      {/* Kept your original gradient vibe, just made the colors blend smoother */}
      <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-indigo-50 via-blue-50/50 to-purple-100/60 font-sans">

        {/* LEFT HERO */}
        <div className="hidden md:flex flex-col justify-center px-12 lg:px-20 relative">
          
          {/* Subtle background blur circle to make the glass pop */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>

          <div className="space-y-10 relative z-10">

            <div className="flex items-center gap-4">
              {/* 🔥 NEW MODERN SVG MONOGRAM LOGO */}
              <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-lg rounded-full">
                <circle cx="24" cy="24" r="24" fill="url(#paint0_linear_login)"/>
                {/* H Letter Path */}
                <path d="M14 14V34 M14 24H22 M22 14V34" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                {/* P Letter Path */}
                <path d="M28 34V14H33C35.7614 14 38 16.2386 38 19C38 21.7614 35.7614 24 33 24H28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="paint0_linear_login" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB"/> {/* Tailwind blue-600 */}
                    <stop offset="1" stopColor="#4F46E5"/> {/* Tailwind indigo-600 */}
                  </linearGradient>
                </defs>
              </svg>
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
                H&P Solutions
              </h1>
            </div>

            {/* Kept your big shield block! Made it look really premium */}
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 border border-white/20 transform hover:scale-105 transition-transform duration-300">
              <ShieldCheck size={64} className="text-white drop-shadow-md" />
            </div>

            <p className="text-slate-600 text-xl font-medium leading-relaxed max-w-md">
              Empowering enterprise operations with secure RBAC architecture and advanced analytics.
            </p>

            <div className="grid grid-cols-3 gap-8 pt-4">
              <Feature icon={<ShieldCheck size={30} />} title="Secure" />
              <Feature icon={<Layers size={30} />} title="Scalable" />
              <Feature icon={<Cpu size={30} />} title="Intelligent" />
            </div>

            {/* Polished Glassmorphism Stats Box */}
            <div className="grid grid-cols-4 gap-6 mt-4 bg-white/40 backdrop-blur-lg p-5 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <Stat number={`${stats.users}+`} label="Users" />
              <Stat number={`${stats.services}+`} label="Services" />
              <Stat number={`${stats.orders}+`} label="Orders" />
              <Stat number="99%" label="Uptime" />
            </div>

          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="flex items-center justify-center px-6 py-10 relative z-10">
          
          {/* Enhanced Glassmorphism Card */}
          <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/80">

            <p className="text-center text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">
              {getGreeting()}
            </p>

            <h2 className="text-3xl font-extrabold text-center mb-2 text-slate-800 tracking-tight">
              Welcome Back
            </h2>

            <p className="text-center text-slate-500 mb-8 font-medium">
              Secure login to your account 🔒
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* EMAIL */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/70 border border-slate-200/60 pl-11 pr-4 py-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/70 border border-slate-200/60 pl-11 pr-12 py-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="text-right mt-3">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-60 shadow-lg shadow-blue-500/30 mt-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white/40 border-t-white rounded-full"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

            </form>

            <p className="text-sm text-center mt-8 text-slate-600 font-medium">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline transition-all">
                Register
              </Link>
            </p>

          </div>
        </div>

      </div>

      {/* FOOTER - Glassy version to match */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/50 py-5 text-center text-sm text-slate-500 font-medium absolute bottom-0 w-full z-20">
        © {new Date().getFullYear()} H&P Solutions. All rights reserved.
        <div className="space-x-6 mt-2">
          <button onClick={() => setPrivacyOpen(true)} className="hover:text-blue-600 transition-colors">
            Privacy Policy
          </button>
          <button onClick={() => setTermsOpen(true)} className="hover:text-blue-600 transition-colors">
            Terms of Service
          </button>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="block sm:inline mt-2 sm:mt-0">Support: support@hpsolutions.com</span>
        </div>
      </footer>

      {/* MODALS */}
      {privacyOpen && (
        <Modal title="Privacy Policy" close={() => setPrivacyOpen(false)}>
          H&P Solutions respects your privacy. All authentication data is encrypted and securely stored.
        </Modal>
      )}

      {termsOpen && (
        <Modal title="Terms of Service" close={() => setTermsOpen(false)}>
          By using H&P Solutions you agree to follow RBAC security rules and system policies.
        </Modal>
      )}
    </>
  );
}

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

function Stat({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{number}</p>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

function Modal({ title, children, close }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-lg w-full border border-white">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-extrabold text-xl text-slate-800">{title}</h2>
          <button 
            onClick={close}
            className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="text-slate-600 font-medium leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}