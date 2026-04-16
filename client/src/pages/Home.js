import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { 
  ShieldCheck, 
  Cpu, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Zap,
  X,
  Server,
  Code,
  LineChart
} from "lucide-react";

export default function Home() {
  // 🔥 STATE FOR MODALS
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      
      {/* ================= PUBLIC NAVBAR ================= */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              {/* 🔥 MODERN SVG MONOGRAM LOGO */}
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-lg rounded-full">
                <circle cx="24" cy="24" r="24" fill="url(#paint0_linear)"/>
                <path d="M14 14V34 M14 24H22 M22 14V34" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M28 34V14H33C35.7614 14 38 16.2386 38 19C38 21.7614 35.7614 24 33 24H28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB"/>
                    <stop offset="1" stopColor="#4F46E5"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-extrabold text-2xl text-slate-800 tracking-tight">
                H&P Solutions
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden sm:block text-slate-600 font-bold hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                Explore Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO CAROUSEL ================= */}
      <div className="pt-20">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="h-[600px] w-full"
        >
          {/* SLIDE 1: Enterprise Focus */}
          <SwiperSlide>
            <div className="relative w-full h-full flex items-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl text-white"
                >
                  <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold tracking-widest uppercase mb-4 border border-blue-500/30">
                    SaaS Platform Provider
                  </span>
                  <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                    Deploy Your Own <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Enterprise Marketplace</span>
                  </h1>
                  <p className="text-lg text-slate-300 mb-8 font-medium max-w-xl leading-relaxed">
                    H&P Solutions builds ready-to-serve, highly secure platforms. You demand it, we build it. The products inside are just a glimpse of what your future digital ecosystem could hold.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25 hover:scale-105">
                      View Live Demo <ArrowRight size={20} />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 2: Tech & AI Focus */}
          <SwiperSlide>
            <div className="relative w-full h-full flex items-center bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 overflow-hidden">
              <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center flex flex-col items-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl text-white"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-400/30">
                    <Zap size={40} className="text-emerald-400" />
                  </div>
                  <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                    Built-in <span className="text-emerald-400">Smart AI & Automation</span>
                  </h1>
                  <p className="text-xl text-emerald-100/80 mb-8 font-medium">
                    Experience advanced Role-Based Access Control, intelligent AI Chatbots, and automated workflows right out of the box. Your platform, engineered for the future.
                  </p>
                  <Link to="/register" className="bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-4 rounded-full font-extrabold text-lg flex items-center gap-2 transition-all shadow-xl hover:scale-105 mx-auto w-max">
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* ================= WHAT WE OFFER SECTION (PaaS FOCUS) ================= */}
      <div className="py-20 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-2">Our Expertise</h2>
            <h3 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Everything Your Business Needs
            </h3>
            <p className="mt-4 text-lg text-slate-500 font-medium">
              We specialize in creating robust, scalable, and white-label platforms tailored precisely to your client demands.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard 
              icon={<Code size={36} className="text-blue-500 group-hover:text-white transition-colors" />}
              title="White-label Platforms"
              desc="Custom e-commerce platforms ready to deploy. You demand it, we build it."
              delay={0.1}
            />
            <CategoryCard 
              icon={<ShieldCheck size={36} className="text-emerald-500 group-hover:text-white transition-colors" />}
              title="Enterprise RBAC"
              desc="Secure architectures with distinct roles (SuperAdmin, Admin, Manager, User)."
              delay={0.2}
            />
            <CategoryCard 
              icon={<Zap size={36} className="text-purple-500 group-hover:text-white transition-colors" />}
              title="Smart Automation"
              desc="Automated order lifecycles, dynamic QR payments, and AI bot integrations."
              delay={0.3}
            />
            <CategoryCard 
              icon={<LineChart size={36} className="text-rose-500 group-hover:text-white transition-colors" />}
              title="Live Telemetry"
              desc="Real-time monitoring, financial analytics, and immutable audit logs."
              delay={0.4}
            />
          </div>
        </div>
      </div>

      {/* ================= FEATURES SECTION (The Tech Behind It) ================= */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-2">The Architecture</h2>
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight sm:text-4xl">
              Why Partner With H&P Solutions?
            </h3>
            <p className="mt-4 text-lg text-slate-500 font-medium">
              We don't just provide a service; we provide a fully automated, secure, and transparent IT ecosystem powered by advanced full-stack technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              delay={0.1}
              icon={<ShieldCheck size={32} className="text-blue-600" />}
              title="Advanced Security"
              desc="Bank-level data protection and isolated authorization layers ensuring ultimate data privacy."
            />
            <FeatureCard 
              delay={0.2}
              icon={<Cpu size={32} className="text-indigo-600" />}
              title="Automated Workflows"
              desc="Experience our background engine that updates statuses, triggers webhooks, and notifies users in real-time."
            />
            <FeatureCard 
              delay={0.3}
              icon={<Layers size={32} className="text-purple-600" />}
              title="Immutable Audit Logs"
              desc="Enterprise-grade accountability. Every critical administrative action is securely tracked and monitored."
            />
          </div>
        </div>
      </div>

      {/* ================= TRUST SECTION ================= */}
      <div className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between text-white">
            <div className="max-w-xl mb-8 md:mb-0">
              <h2 className="text-3xl font-extrabold mb-4">Ready to transform your operations?</h2>
              <p className="text-blue-100 text-lg font-medium mb-6">Partner with H&P Solutions to launch a platform that scales with your ambition.</p>
              <div className="flex gap-4 items-center">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-slate-300"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-slate-400"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-slate-500 flex items-center justify-center text-xs font-bold">+2k</div>
                </div>
                <div className="flex text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
              </div>
            </div>
            <div>
              <Link to="/register" className="bg-white text-indigo-700 px-8 py-4 rounded-full font-extrabold text-lg transition-all shadow-xl hover:scale-105 hover:bg-slate-50 inline-block">
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            {/* 🔥 FOOTER SMALL SVG LOGO */}
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-sm rounded-full">
              <circle cx="24" cy="24" r="24" fill="url(#paint0_linear_footer)"/>
              <path d="M14 14V34 M14 24H22 M22 14V34" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M28 34V14H33C35.7614 14 38 16.2386 38 19C38 21.7614 35.7614 24 33 24H28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear_footer" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB"/>
                  <stop offset="1" stopColor="#4F46E5"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="font-extrabold text-slate-800 tracking-tight">H&P Solutions © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm font-semibold text-slate-500">
            <Link to="/login" className="hover:text-blue-600 transition-colors">Admin Login</Link>
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-blue-600 transition-colors">Privacy Policy</button>
            <button onClick={() => setTermsOpen(true)} className="hover:text-blue-600 transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>

      {/* ================= MODALS ================= */}
      {privacyOpen && (
        <Modal title="Privacy Policy" close={() => setPrivacyOpen(false)}>
          <p className="mb-3">At H&P Solutions, your privacy is our priority. We employ enterprise-grade encryption to protect your personal and operational data.</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-500">
            <li>All authentication relies on secure JWT tokens.</li>
            <li>We do not sell or share your data with third parties.</li>
            <li>System audit logs are strictly monitored and immutable.</li>
          </ul>
        </Modal>
      )}

      {termsOpen && (
        <Modal title="Terms of Service" close={() => setTermsOpen(false)}>
          <p className="mb-3">By accessing the H&P Solutions Enterprise Portal, you agree to comply with our organizational security policies.</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-500">
            <li>Strict adherence to Role-Based Access Control (RBAC) is required.</li>
            <li>Unauthorized attempts to access restricted dashboard areas will be logged and reported.</li>
            <li>Service bookings are subject to approval by assigned managers.</li>
          </ul>
        </Modal>
      )}

    </div>
  );
}

// 🔥 NEW: Category Card for "What We Offer" Section
function CategoryCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-indigo-600 flex items-center justify-center mb-5 transition-colors duration-300 border border-slate-100 group-hover:border-indigo-600">
        {icon}
      </div>
      <h3 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300"
    >
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100">
        {icon}
      </div>
      <h3 className="text-xl font-extrabold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
      <ul className="mt-6 space-y-2">
        {['Real-time updates', 'Secure architecture', '24/7 AI Support'].map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <CheckCircle2 size={16} className="text-emerald-500" /> {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function Modal({ title, children, close }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 relative"
      >
        <button 
          onClick={close}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <h2 className="font-extrabold text-2xl text-slate-800">{title}</h2>
        </div>
        
        <div className="text-slate-600 font-medium leading-relaxed">
          {children}
        </div>
        
        <div className="mt-8">
          <button 
            onClick={close}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
          >
            I Understand & Agree
          </button>
        </div>
      </motion.div>
    </div>
  );
}