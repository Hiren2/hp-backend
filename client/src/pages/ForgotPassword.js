import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast";
import useToast from "../components/useToast";

import {
  Mail,
  Calendar,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";

export default function ForgotPassword() {
  const nav = useNavigate();
  const { toast, showToast } = useToast();

  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.post("/auth/verify-dob", { email, dob });

      showToast("Verified — set new password", "success");

      setTimeout(() => nav("/reset-password", { state: { email } }), 800);

    } catch (err) {
      showToast(
        err.response?.data?.message || "Verification failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      {/* Premium Glassmorphism Background */}
      <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-indigo-50 via-blue-50/50 to-purple-100/60 font-sans pb-16 md:pb-0">

        {/* LEFT SIDE HERO */}
        <div className="hidden md:flex flex-col justify-center px-12 lg:px-20 relative">

          {/* Subtle background blur circle */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>

          <div className="space-y-10 relative z-10">

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-blue-500/20 border border-white/20">
                HP
              </div>
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
                Identity Verification
              </h1>
            </div>

            {/* Shield Box with Hover Effect */}
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 border border-white/20 transform hover:scale-105 transition-transform duration-300">
              <ShieldCheck size={64} className="text-white drop-shadow-md" />
            </div>

            <p className="text-slate-600 text-xl font-medium leading-relaxed max-w-md">
              Verify your identity using your registered email and date of birth. This ensures only you can reset your password. 🔐
            </p>

          </div>

        </div>

        {/* RIGHT SIDE FORM */}
        <div className="flex items-center justify-center px-6 py-10 relative z-10 overflow-y-auto">

          <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/80 my-auto">

            {/* Back Button */}
            <button 
              onClick={() => nav("/login")}
              className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors mb-6 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>

            <h2 className="text-3xl font-extrabold text-center mb-2 text-slate-800 tracking-tight">
              Verify Account
            </h2>

            <p className="text-center text-slate-500 mb-8 font-medium">
              Enter your details to continue
            </p>

            <form onSubmit={submit} className="space-y-5">

              <InputField
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="admin@hpsolutions.com"
                value={email}
                onChange={(v) => setEmail(v)}
              />

              <InputField
                label="Date of Birth"
                icon={Calendar}
                type="date"
                value={dob}
                onChange={(v) => setDob(v)}
              />

              <button
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-60 shadow-lg shadow-blue-500/30 mt-6"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white/40 border-t-white rounded-full"></span>
                    Verifying...
                  </>
                ) : (
                  "Verify Identity"
                )}
              </button>

            </form>

            <p className="text-sm text-center mt-8 text-slate-600 font-medium">
              Remember your password?{" "}
              <span
                onClick={() => nav("/login")}
                className="text-blue-600 font-bold hover:underline cursor-pointer transition-all"
              >
                Sign In
              </span>
            </p>

          </div>

        </div>

      </div>

      {/* FOOTER - Added to keep consistency with Login and Register */}
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