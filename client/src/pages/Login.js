import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation(); 
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

  const demoAccounts = {
    user: { email: 'demo_user@hpsolutions.com', password: 'demoPassword123' },
    manager: { email: 'demo_manager@hpsolutions.com', password: 'demoPassword123' },
    admin: { email: 'demo_admin@hpsolutions.com', password: 'demoPassword123' },
    superadmin: { email: 'demo_superadmin@hpsolutions.com', password: 'demoPassword123' }
  };

  useEffect(() => {
    if (location.state?.autoLoginRole) {
      const role = location.state.autoLoginRole;
      const creds = demoAccounts[role];
      
      if (creds) {
        setEmail(creds.email);
        setPassword(creds.password);
        performLogin(creds.email, creds.password);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

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

  const performLogin = async (loginEmail, loginPassword) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: loginEmail,
        password: loginPassword
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showToast("Secure connection established.", "success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);

    } catch (err) {
      showToast(
        err.response?.data?.message || "Invalid enterprise credentials.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    performLogin(email, password);
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="min-h-screen grid md:grid-cols-2 bg-[#0B0F19] font-sans selection:bg-blue-500 selection:text-white">

        <div className="hidden md:flex flex-col justify-center px-12 lg:px-20 relative overflow-hidden border-r border-white/5">
          
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="space-y-12 relative z-10">

            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
              <svg width="56" height="56" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-[0_0_20px_rgba(37,99,235,0.5)] rounded-full transition-transform group-hover:scale-105">
                <circle cx="24" cy="24" r="24" fill="url(#paint0_linear_login)"/>
                <path d="M14 14V34 M14 24H22 M22 14V34" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M28 34V14H33C35.7614 14 38 16.2386 38 19C38 21.7614 35.7614 24 33 24H28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="paint0_linear_login" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
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
              Empowering enterprise operations with secure RBAC architecture and isolated sandbox environments.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4">
              <Feature icon={<ShieldCheck size={28} />} title="Secure" />
              <Feature icon={<Layers size={28} />} title="Isolated" />
              <Feature icon={<Cpu size={28} />} title="AI-Driven" />
            </div>

            <div className="grid grid-cols-4 gap-6 mt-6 bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 shadow-2xl">
              <Stat number={`${stats.users}+`} label="Users" />
              <Stat number={`${stats.services}+`} label="Services" />
              <Stat number={`${stats.orders}+`} label="Orders" />
              <Stat number="99%" label="Uptime" />
            </div>

          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 relative z-10 bg-[#0F1523]">
          
          <div className="w-full max-w-md bg-[#151C2C] p-10 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
            
            {loading && location.state?.autoLoginRole && (
               <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
                  <div className="w-1/2 h-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
               </div>
            )}

            <p className="text-center text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-4">
              {getGreeting()}
            </p>

            <h2 className="text-3xl font-black text-center mb-2 text-white tracking-tight">
              Access Portal
            </h2>

            <p className="text-center text-slate-400 mb-10 font-medium">
              Enterprise Identity Verification 🔒
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-300 mb-2 ml-1">
                  Corporate Email
                </label>
                <div className="relative group">
                  <Mail size={20} className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-white/10 pl-12 pr-4 py-3.5 rounded-2xl focus:bg-[#0B0F19] focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-300 mb-2 ml-1">
                  Access Key
                </label>
                <div className="relative group">
                  <Lock size={20} className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-white/10 pl-12 pr-12 py-3.5 rounded-2xl focus:bg-[#0B0F19] focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all font-medium text-white placeholder-slate-600 shadow-inner"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="text-right mt-3">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-500 transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.3)] mt-4 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white/40 border-t-white rounded-full"></span>
                    Authenticating...
                  </>
                ) : (
                  "Authenticate"
                )}
              </button>

            </form>

            <p className="text-sm text-center mt-8 text-slate-400 font-medium">
              Don’t have an account?{" "}
              <Link to="/register" className="text-white font-black hover:text-blue-400 transition-all">
                Register Workspace
              </Link>
            </p>

          </div>
        </div>

      </div>

      <footer className="bg-[#0B0F19] border-t border-white/5 py-6 text-center text-sm text-slate-500 font-medium absolute bottom-0 w-full z-20">
        © {new Date().getFullYear()} H&P Solutions. All rights reserved.
        <div className="space-x-6 mt-2">
          <button onClick={() => setPrivacyOpen(true)} className="hover:text-white transition-colors">
            Privacy Policy
          </button>
          <button onClick={() => setTermsOpen(true)} className="hover:text-white transition-colors">
            Terms of Service
          </button>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="block sm:inline mt-2 sm:mt-0 hover:text-white transition-colors cursor-pointer">Support: support@hpsolutions.com</span>
        </div>
      </footer>

      {privacyOpen && (
        <Modal title="Privacy Policy" close={() => setPrivacyOpen(false)}>
          H&P Solutions respects your privacy. All authentication data is encrypted and securely stored.
        </Modal>
      )}

      {termsOpen && (
        <Modal title="Terms of Service" close={() => setTermsOpen(false)}>
          By using H&P Solutions you agree to follow RBAC security rules and system policies. Unauthorized access is monitored.
        </Modal>
      )}
    </>
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

function Modal({ title, children, close }) {
  return (
    <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#151C2C] p-8 rounded-[2rem] shadow-2xl max-w-lg w-full border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-black text-2xl text-white">{title}</h2>
          <button 
            onClick={close}
            className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="text-slate-400 font-medium leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}