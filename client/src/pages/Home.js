import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Code,
  LineChart,
  MessageSquareQuote,
  User,
  Users,
  Shield,
  Key,
  Database,
  Activity,
  Server
} from "lucide-react";

export default function Home() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false); 
  const navigate = useNavigate();

  const scrollToExpertise = () => {
    const section = document.getElementById("expertise-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDemoSelect = (role) => {
    setDemoOpen(false);
    navigate('/login', { state: { autoLoginRole: role } });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Premium Navbar */}
      <nav className="fixed w-full z-50 bg-[#0B0F19]/85 backdrop-blur-2xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-[0_0_15px_rgba(37,99,235,0.4)] rounded-xl transition-transform group-hover:scale-105">
                <rect width="48" height="48" rx="12" fill="url(#paint0_linear_logo)"/>
                <path d="M14 14V34 M14 24H22 M22 14V34" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M28 34V14H33C35.7614 14 38 16.2386 38 19C38 21.7614 35.7614 24 33 24H28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="paint0_linear_logo" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB"/>
                    <stop offset="1" stopColor="#4F46E5"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                H&P<span className="text-blue-500">.</span>Solutions
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/login" className="hidden sm:block text-slate-300 font-semibold hover:text-white transition-colors">
                Sign In
              </Link>
              <button 
                onClick={() => setDemoOpen(true)} 
                className="bg-white hover:bg-slate-100 text-[#0B0F19] px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105"
              >
                <Zap size={16} className="text-blue-600" />
                Live Sandbox
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with 4 Super High Rank Cinematic Posters */}
      <div className="pt-20 relative z-10">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="h-[85vh] min-h-[650px] w-full"
        >
          {/* POSTER 1: SaaS Marketplace & RBAC */}
          <SwiperSlide>
            <div className="relative w-full h-full flex items-center bg-[#0B0F19] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.02]"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-10">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="max-w-3xl text-white"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Architecture Pillar 01
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                    Deploy Your Next-Gen <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                      SaaS Marketplace
                    </span>
                  </h1>
                  <p className="text-xl text-slate-400 mb-10 font-medium max-w-2xl leading-relaxed">
                    H&P Solutions delivers a ready-to-scale, highly secure 4-Tier RBAC architecture. Experience full white-label deployment, optimized conversion paths, and multi-layered protection layers.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setDemoOpen(true)} 
                      className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105"
                    >
                      Enter Sandbox <ArrowRight size={20} />
                    </button>
                    <button onClick={scrollToExpertise} className="bg-transparent hover:bg-white/5 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-white/20">
                      Explore Architecture
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          {/* POSTER 2: AI Automation & Gemini */}
          <SwiperSlide>
            <div className="relative w-full h-full flex items-center bg-[#0B0F19] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.02]"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center flex flex-col items-center mt-10">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="max-w-4xl text-white"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <Cpu size={32} className="text-white" />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                    Autonomous Workflows <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                      via Gemini NLP Engine
                    </span>
                  </h1>
                  <p className="text-xl text-slate-400 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
                    Integrated natural language processing bots handle customer requests, resolve order support queries, and optimize store management pipelines with zero human overhead.
                  </p>
                  <button onClick={() => setDemoOpen(true)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 mx-auto w-max">
                    Launch AI Sandbox
                  </button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          {/* POSTER 3: Parallel Universe Isolation */}
          <SwiperSlide>
            <div className="relative w-full h-full flex items-center bg-[#0B0F19] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.02]"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-10">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="max-w-3xl text-white"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-8">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    Architecture Pillar 03
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                    Strict Sandbox <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                      & Data Isolation
                    </span>
                  </h1>
                  <p className="text-xl text-slate-400 mb-10 font-medium max-w-2xl leading-relaxed">
                    Never leak test actions into live production. Our custom Multi-Tenancy firewall ensures that demo purchases, logs, and notification flows remain securely inside a parallel sandbox universe.
                  </p>
                  <button onClick={() => setDemoOpen(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-105">
                    Test Isolation Firewall
                  </button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          {/* POSTER 4: Live Telemetry & Audits */}
          <SwiperSlide>
            <div className="relative w-full h-full flex items-center bg-[#0B0F19] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.02]"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center flex flex-col items-center mt-10">
                <motion.div 
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="max-w-4xl text-white"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                    <Activity size={40} className="text-white" />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                    Immutable Audit Logs <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                      & Live Metric Telemetry
                    </span>
                  </h1>
                  <p className="text-xl text-slate-400 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
                    Monitor entire node activities instantly. Capture system security modifications, unauthorized penetration attempts, and financial workflows with deep aggregate analytical telemetry.
                  </p>
                  <button onClick={() => setDemoOpen(true)} className="bg-rose-500 hover:bg-rose-400 text-white px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:scale-105 mx-auto w-max">
                    View System Metrics
                  </button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Services Section */}
      <div id="expertise-section" className="py-32 bg-[#0A0D14] border-y border-white/5 relative z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-xs font-black text-blue-500 tracking-widest uppercase mb-3">Enterprise Core</h2>
            <h3 className="text-4xl font-black text-white sm:text-5xl tracking-tight">
              The Complete Ecosystem
            </h3>
            <p className="mt-6 text-lg text-slate-400 font-medium leading-relaxed">
              When you acquire the H&P Solutions architecture, you receive a full-stack, white-label ecosystem engineered for global scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CategoryCard 
              icon={<Code size={28} className="text-blue-400" />}
              title="White-label Ready"
              desc="Deploy your own branded storefront instantly with highly optimized conversion funnels."
              delay={0.1}
            />
            <CategoryCard 
              icon={<ShieldCheck size={28} className="text-emerald-400" />}
              title="4-Tier RBAC"
              desc="Military-grade authorization layers preventing data bleed across enterprise roles."
              delay={0.2}
            />
            <CategoryCard 
              icon={<Zap size={28} className="text-purple-400" />}
              title="AI Integration"
              desc="Embedded NLP Gemini ServiceBot for autonomous 24/7 customer support."
              delay={0.3}
            />
            <CategoryCard 
              icon={<LineChart size={28} className="text-rose-400" />}
              title="Live Telemetry"
              desc="Real-time performance monitoring and immutable blockchain-style audit logs."
              delay={0.4}
            />
          </div>
        </div>
      </div>

      {/* --- NEW TECHNICAL SPECIFICATIONS & PILLARS SECTION --- */}
      <div className="py-32 bg-[#0B0F19] border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                Full-Stack Architecture
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Engineered for High-Load <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Business Infrastructures</span>
              </h2>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                The H&P Solutions core framework separates frontend presentation from data Mutation engines. It offers an airtight developer workspace environment ready for direct customization.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                    <CheckCircle2 size={12} fill="currentColor" className="text-[#0B0F19]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Node.js Express Secure REST API</h4>
                    <p className="text-slate-500 text-sm mt-0.5">Fully structured controller patterns with isolated middleware token parsing wrappers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-1">
                    <CheckCircle2 size={12} fill="currentColor" className="text-[#0B0F19]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">State Tracking Multi-Tab Synchronizer</h4>
                    <p className="text-slate-500 text-sm mt-0.5">Frontend contextual storage listening triggers matching instant backend pipeline mutations seamlessly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                    <CheckCircle2 size={12} fill="currentColor" className="text-[#0B0F19]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">MongoDB Optimized Aggregations</h4>
                    <p className="text-slate-500 text-sm mt-0.5">Heavy relational lookup lookups handling profile metrics, order resolution telemetry, and item trends efficiently.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-[#0F1523] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur opacity-10 pointer-events-none"></div>
              <div className="bg-[#151C2C] p-6 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center">
                <Server size={32} className="text-blue-400 mb-3" />
                <h3 className="font-black text-white text-2xl">MERN</h3>
                <p className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-wider">Tech Stack Base</p>
              </div>
              <div className="bg-[#151C2C] p-6 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center">
                <Database size={32} className="text-purple-400 mb-3" />
                <h3 className="font-black text-white text-2xl">NoSQL</h3>
                <p className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-wider">Data Segregation</p>
              </div>
              <div className="bg-[#151C2C] p-6 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center">
                <Shield size={32} className="text-emerald-400 mb-3" />
                <h3 className="font-black text-white text-2xl">JWT</h3>
                <p className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-wider">Cryptographic Token</p>
              </div>
              <div className="bg-[#151C2C] p-6 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center">
                <Cpu size={32} className="text-rose-400 mb-3" />
                <h3 className="font-black text-white text-2xl">LLM</h3>
                <p className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-wider">AI Integration</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="py-32 bg-[#0B0F19] text-white relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-black text-blue-400 tracking-widest uppercase mb-3">Trusted Infrastructure</h2>
              <h3 className="text-4xl font-black tracking-tight sm:text-5xl">
                Validated by CTOs
              </h3>
            </div>
            <div className="flex items-center gap-3 bg-[#151C2C] border border-white/5 px-6 py-4 rounded-2xl">
              <span className="font-black text-3xl text-white">4.9</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#FBBF24" className="text-yellow-400" />)}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ReviewCard 
              name="David Mitchell"
              role="Tech Lead, Silicon Valley"
              text="H&P Solutions completely transformed our architecture. The automated workflows and the MERN RBAC system are flawlessly coded. A true enterprise asset."
              delay={0.1}
            />
            <ReviewCard 
              name="Sarah Jenkins"
              role="Product Manager, UK"
              text="We needed a secure white-label platform fast. H&P delivered a scalable product. The strict data isolation in the sandbox is a game-changer!"
              delay={0.2}
            />
            <ReviewCard 
              name="Amit Patel"
              role="Managing Director, India"
              text="The AI ServiceBot integration saved our support team hundreds of hours. Exceptional B2B SaaS architecture and an incredibly clean codebase."
              delay={0.3}
            />
          </div>
        </div>
      </div>

      {/* CTA Footer Section */}
      <div className="py-24 bg-[#0A0D14] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden border border-blue-500/20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="max-w-2xl mb-10 md:mb-0 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Ready to stress-test the architecture?</h2>
              <p className="text-blue-100 text-lg font-medium mb-0 leading-relaxed">Enter our Sandbox Environment to experience Data Isolation, Real-time Sync, and Role Management live.</p>
            </div>
            <div className="relative z-10 w-full md:w-auto">
              <button onClick={() => setDemoOpen(true)} className="w-full md:w-auto bg-[#0B0F19] text-white border border-white/10 px-10 py-5 rounded-full font-bold text-lg transition-all hover:bg-white hover:text-[#0B0F19] inline-block text-center">
                Launch Live Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0B0F19] border-t border-white/10 pt-12 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 text-sm tracking-tight">H&P Solutions © {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-slate-500">
            <button onClick={() => setDemoOpen(true)} className="hover:text-white transition-colors">Test Sandbox</button>
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => setTermsOpen(true)} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>

      {/* --- THE NEW DEMO SELECTION MODAL --- */}
      {demoOpen && (
        <div className="fixed inset-0 bg-[#0B0F19]/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#151C2C] rounded-[2rem] shadow-2xl max-w-4xl w-full border border-white/10 overflow-hidden"
          >
            <div className="bg-[#1A2235] border-b border-white/5 p-8 sm:p-10 relative">
              <button onClick={() => setDemoOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                <X size={20} />
              </button>
              <h2 className="font-black text-3xl text-white mb-3 tracking-tight">Select Sandbox Environment</h2>
              <p className="text-slate-400 font-medium text-lg">Experience our 4-Tier RBAC architecture. Select a role below to auto-login into the isolated database.</p>
            </div>
            
            <div className="p-8 sm:p-10 grid sm:grid-cols-2 gap-6 bg-[#0B0F19]">
              <DemoCard 
                icon={<User size={24} className="text-emerald-400" />}
                title="Client / User"
                desc="Browse catalog, manage cart, and chat with AI Bot."
                onClick={() => handleDemoSelect('user')}
                bg="bg-[#151C2C] hover:bg-emerald-500/10 border-white/5 hover:border-emerald-500/30"
              />
              <DemoCard 
                icon={<Users size={24} className="text-blue-400" />}
                title="Manager Level"
                desc="Review orders, approve workflows, and add notes."
                onClick={() => handleDemoSelect('manager')}
                bg="bg-[#151C2C] hover:bg-blue-500/10 border-white/5 hover:border-blue-500/30"
              />
              <DemoCard 
                icon={<Shield size={24} className="text-purple-400" />}
                title="Admin Level"
                desc="Manage user accounts, activations, and system metrics."
                onClick={() => handleDemoSelect('admin')}
                bg="bg-[#151C2C] hover:bg-purple-500/10 border-white/5 hover:border-purple-500/30"
              />
              <DemoCard 
                icon={<Key size={24} className="text-rose-400" />}
                title="Super Admin"
                desc="Full system override and Immutable Audit Log access."
                onClick={() => handleDemoSelect('superadmin')}
                bg="bg-[#151C2C] hover:bg-rose-500/10 border-white/5 hover:border-rose-500/30"
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Standard Modals */}
      {privacyOpen && (
        <Modal title="Privacy Policy" close={() => setPrivacyOpen(false)}>
          <p className="mb-3">At H&P Solutions, your privacy is our priority. We employ enterprise-grade encryption to protect your personal and operational data.</p>
        </Modal>
      )}

      {termsOpen && (
        <Modal title="Terms of Service" close={() => setTermsOpen(false)}>
          <p className="mb-3">By accessing the H&P Solutions Enterprise Portal, you agree to comply with our organizational security policies.</p>
        </Modal>
      )}
    </div>
  );
}

function DemoCard({ icon, title, desc, onClick, bg }) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-[1.5rem] border cursor-pointer transition-all duration-300 group ${bg}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-[#0B0F19] w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
          {icon}
        </div>
        <h4 className="font-bold text-white text-xl">{title}</h4>
      </div>
      <p className="text-sm text-slate-400 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function CategoryCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-[#151C2C] p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all duration-300 group"
    >
      <div className="w-14 h-14 rounded-xl bg-[#0B0F19] flex items-center justify-center mb-6 border border-white/5">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-sm text-slate-400 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function ReviewCard({ name, role, text, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-[#151C2C] border border-white/5 p-8 rounded-[2rem] relative hover:border-white/10 transition-colors"
    >
      <MessageSquareQuote size={40} className="absolute top-8 right-8 text-white/5" />
      <p className="text-slate-300 font-medium mb-8 leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-4 pt-6 border-t border-white/5">
        <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-white text-base">{name}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Modal({ title, children, close }) {
  return (
    <div className="fixed inset-0 bg-[#0B0F19]/90 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#151C2C] p-8 rounded-[2rem] shadow-2xl max-w-lg w-full border border-white/10 relative"
      >
        <button 
          onClick={close}
          className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
            <ShieldCheck size={24} />
          </div>
          <h2 className="font-bold text-2xl text-white">{title}</h2>
        </div>
        
        <div className="text-slate-400 font-medium leading-relaxed">
          {children}
        </div>
        
        <div className="mt-8">
          <button 
            onClick={close}
            className="w-full bg-white text-[#0B0F19] font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </motion.div>
    </div>
  );
}