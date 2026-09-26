import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Server,
  ChevronRight
} from "lucide-react";

// --- Framer Motion Variants for Premium Stagger Effects ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
};

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
    <div className="min-h-screen bg-[#05050A] font-sans overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Ultra-Premium Animated Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen"
        ></motion.div>
      </div>

      {/* Floating Glass Navbar */}
      <nav className="fixed w-full z-50 top-0 pt-4 px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto bg-[#0A0E17]/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex justify-between items-center h-16 sm:h-20 px-4 sm:px-6">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300">
                <ShieldCheck className="text-white w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="font-black text-xl sm:text-2xl text-white tracking-tight">
                H&P<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">.</span>
              </span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link to="/login" className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <button 
                onClick={() => setDemoOpen(true)} 
                className="group relative inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-white"></span>
                <Zap size={14} className="text-yellow-400 mr-2 animate-pulse" />
                <span className="relative z-10">Live Sandbox</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-28 pb-10 sm:pt-36 sm:pb-20 relative z-10">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="h-[80vh] min-h-[600px] w-full"
        >
          {/* POSTER 1 */}
          <SwiperSlide>
            <div className="relative w-full h-full flex items-center justify-center sm:justify-start">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full text-center sm:text-left">
                <motion.div initial="hidden" whileInView="show" variants={staggerContainer} className="max-w-4xl mx-auto sm:mx-0">
                  <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Architecture Pillar 01
                  </motion.div>
                  <motion.h1 variants={fadeUpVariant} className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
                    Deploy Next-Gen <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                      SaaS Marketplaces
                    </span>
                  </motion.h1>
                  <motion.p variants={fadeUpVariant} className="text-lg sm:text-2xl text-slate-400 mb-10 font-medium max-w-2xl mx-auto sm:mx-0 leading-relaxed">
                    Ready-to-scale, highly secure 4-Tier RBAC architecture. Experience full white-label deployment with multi-layered protection.
                  </motion.p>
                  <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                    <button onClick={() => setDemoOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-105 group">
                      Enter Sandbox <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={scrollToExpertise} className="bg-transparent hover:bg-white/5 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-sm">
                      Explore Tech Stack
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          {/* POSTER 2 */}
          <SwiperSlide>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full text-center flex flex-col items-center">
                <motion.div initial="hidden" whileInView="show" variants={staggerContainer} className="max-w-4xl">
                  <motion.div variants={fadeUpVariant} className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-white/10">
                    <Cpu className="text-white w-10 h-10" />
                  </motion.div>
                  <motion.h1 variants={fadeUpVariant} className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
                    Autonomous AI <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                      Gemini Engine
                    </span>
                  </motion.h1>
                  <motion.p variants={fadeUpVariant} className="text-lg sm:text-2xl text-slate-400 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
                    Integrated NLP bots handle customer requests and optimize store management pipelines with zero human overhead.
                  </motion.p>
                  <motion.button variants={fadeUpVariant} onClick={() => setDemoOpen(true)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 mx-auto group">
                    Launch AI Sandbox <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          {/* POSTER 3: Strict Sandbox */}
          <SwiperSlide>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full text-center flex flex-col items-center">
                <motion.div initial="hidden" whileInView="show" variants={staggerContainer} className="max-w-4xl">
                  <motion.div variants={fadeUpVariant} className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(168,85,247,0.3)] border border-white/10">
                    <Layers className="text-white w-10 h-10" />
                  </motion.div>
                  <motion.h1 variants={fadeUpVariant} className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
                    Strict Sandbox <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                      & Data Isolation
                    </span>
                  </motion.h1>
                  <motion.p variants={fadeUpVariant} className="text-lg sm:text-2xl text-slate-400 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
                    Never leak test actions into live production. Our custom Multi-Tenancy firewall ensures complete parallel isolation.
                  </motion.p>
                  <motion.button variants={fadeUpVariant} onClick={() => setDemoOpen(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:scale-105 mx-auto group">
                    Test Isolation Firewall <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          {/* POSTER 4: Live Telemetry */}
          <SwiperSlide>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full text-center flex flex-col items-center">
                <motion.div initial="hidden" whileInView="show" variants={staggerContainer} className="max-w-4xl">
                  <motion.div variants={fadeUpVariant} className="w-20 h-20 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(244,63,94,0.3)] border border-white/10">
                    <Activity className="text-white w-10 h-10" />
                  </motion.div>
                  <motion.h1 variants={fadeUpVariant} className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
                    Immutable Audit Logs <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                      & Live Telemetry
                    </span>
                  </motion.h1>
                  <motion.p variants={fadeUpVariant} className="text-lg sm:text-2xl text-slate-400 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
                    Monitor entire node activities instantly. Capture system security modifications with deep aggregate analytics.
                  </motion.p>
                  <motion.button variants={fadeUpVariant} onClick={() => setDemoOpen(true)} className="bg-rose-500 hover:bg-rose-400 text-white px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:scale-105 mx-auto group">
                    View System Metrics <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
          
          {/* Add more SwiperSlides identical to above format if needed for Poster 3 & 4 */}
        </Swiper>
      </div>

      {/* Services Section (The Ecosystem) */}
      <div id="expertise-section" className="py-24 sm:py-32 relative z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" variants={staggerContainer} viewport={{ once: true, margin: "-100px" }} className="text-center max-w-3xl mx-auto mb-20">
            <motion.h2 variants={fadeUpVariant} className="text-sm font-black text-blue-500 tracking-widest uppercase mb-4">Enterprise Core</motion.h2>
            <motion.h3 variants={fadeUpVariant} className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
              The Complete Ecosystem
            </motion.h3>
            <motion.p variants={fadeUpVariant} className="mt-6 text-lg sm:text-xl text-slate-400 font-medium">
              A full-stack, white-label architecture engineered for global scale and zero-latency performance.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" variants={staggerContainer} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard icon={<Code size={28} className="text-blue-400" />} title="White-label Ready" desc="Deploy your branded storefront instantly with highly optimized conversion funnels." />
            <CategoryCard icon={<ShieldCheck size={28} className="text-emerald-400" />} title="4-Tier RBAC" desc="Military-grade authorization layers preventing data bleed across roles." />
            <CategoryCard icon={<Zap size={28} className="text-purple-400" />} title="AI Integration" desc="Embedded NLP Gemini ServiceBot for autonomous 24/7 customer support." />
            <CategoryCard icon={<LineChart size={28} className="text-rose-400" />} title="Live Telemetry" desc="Real-time performance monitoring and immutable audit logs." />
          </motion.div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="py-24 sm:py-32 bg-[#0A0E17]/50 border-y border-white/5 relative z-10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="show" variants={staggerContainer} viewport={{ once: true }}>
              <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                Architecture Blueprint
              </motion.div>
              <motion.h2 variants={fadeUpVariant} className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] mb-6">
                Engineered for <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">High-Load Systems</span>
              </motion.h2>
              <motion.p variants={fadeUpVariant} className="text-slate-400 text-lg leading-relaxed mb-8">
                The core framework separates frontend presentation from data Mutation engines, offering an airtight, developer-friendly workspace.
              </motion.p>
              
              <div className="space-y-6">
                {[
                  { title: "Node.js Express Secure REST API", desc: "Structured controller patterns with isolated middleware token parsing.", color: "blue" },
                  { title: "State Tracking Synchronizer", desc: "Frontend contextual storage triggering instant backend pipeline mutations.", color: "purple" },
                  { title: "MongoDB Optimized Aggregations", desc: "Heavy relational lookups handling profile metrics and telemetry efficiently.", color: "emerald" }
                ].map((item, i) => (
                  <motion.div variants={fadeUpVariant} key={i} className="flex items-start gap-4 group">
                    <div className={`w-8 h-8 rounded-full bg-${item.color}-500/10 border border-${item.color}-500/30 flex items-center justify-center shrink-0 mt-1 group-hover:scale-110 group-hover:bg-${item.color}-500/20 transition-all`}>
                      <CheckCircle2 size={16} className={`text-${item.color}-400`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">{item.title}</h4>
                      <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Glowing Tech Stack Grid */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-[100px] pointer-events-none"></div>
              
              <TechBlock icon={<Server size={32} className="text-blue-400" />} title="MERN" subtitle="Tech Stack Base" />
              <TechBlock icon={<Database size={32} className="text-purple-400" />} title="NoSQL" subtitle="Data Segregation" />
              <TechBlock icon={<Shield size={32} className="text-emerald-400" />} title="JWT" subtitle="Cryptographic Token" />
              <TechBlock icon={<Cpu size={32} className="text-rose-400" />} title="LLM" subtitle="AI Integration" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="py-24 sm:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" variants={staggerContainer} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <motion.h2 variants={fadeUpVariant} className="text-xs font-black text-blue-500 tracking-widest uppercase mb-3">Trusted Infrastructure</motion.h2>
              <motion.h3 variants={fadeUpVariant} className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">Validated by CTOs</motion.h3>
            </div>
            <motion.div variants={fadeUpVariant} className="flex items-center gap-4 bg-[#111827]/80 backdrop-blur-xl border border-white/10 px-8 py-5 rounded-3xl shadow-xl">
              <span className="font-black text-4xl text-white">4.9</span>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-yellow-400" fill="#FBBF24" />)}
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enterprise Rating</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" variants={staggerContainer} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReviewCard name="David Mitchell" role="Tech Lead, Silicon Valley" text="The automated workflows and the MERN RBAC system are flawlessly coded. A true enterprise asset." />
            <ReviewCard name="Sarah Jenkins" role="Product Manager, UK" text="We needed a secure white-label platform fast. H&P delivered. The strict data isolation is a game-changer!" />
            <ReviewCard name="Amit Patel" role="Managing Director, India" text="The AI ServiceBot integration saved our support team hundreds of hours. Exceptional B2B SaaS architecture." />
          </motion.div>
        </div>
      </div>

      {/* Premium CTA Block */}
      <div className="py-24 relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-[#0948ea] relative rounded-[3rem] p-10 sm:p-20 overflow-hidden shadow-[0_20px_50px_rgba(9,72,234,0.3)] border border-blue-400/30 text-center flex flex-col items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <h2 className="relative z-10 text-4xl sm:text-6xl font-black text-white tracking-tighter mb-6 max-w-3xl">
              Ready to stress-test the architecture?
            </h2>
            <p className="relative z-10 text-blue-100 text-lg sm:text-xl font-medium mb-10 max-w-2xl">
              Enter our Sandbox Environment to experience Data Isolation, Real-time Sync, and Role Management live.
            </p>
            <button onClick={() => setDemoOpen(true)} className="relative z-10 bg-white text-[#0948ea] px-10 py-5 rounded-full font-black text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] flex items-center gap-2 group">
              Launch Live Demo <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#05050A] border-t border-white/5 pt-12 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 font-semibold text-sm">
            H&P Solutions © {new Date().getFullYear()} • Enterprise Grade MERN
          </div>
          <div className="flex gap-6 text-sm font-semibold text-slate-400">
            <button onClick={() => setDemoOpen(true)} className="hover:text-white transition-colors">Sandbox</button>
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => setTermsOpen(true)} className="hover:text-white transition-colors">Terms</button>
          </div>
        </div>
      </footer>

      {/* --- DEMO SELECTION MODAL (Ultra Glassmorphism) --- */}
      <AnimatePresence>
        {demoOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#000000]/80 backdrop-blur-xl"
              onClick={() => setDemoOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0F141F]/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
            >
              <div className="p-8 sm:p-10 border-b border-white/5 flex justify-between items-start bg-gradient-to-b from-white/5 to-transparent">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
                    <Zap size={12} fill="currentColor" /> Sandbox Environment
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Select Access Role</h2>
                  <p className="text-slate-400 mt-2 font-medium">Experience the 4-Tier RBAC. Select a profile to auto-login to the isolated database.</p>
                </div>
                <button onClick={() => setDemoOpen(false)} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-3 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#05050A]/50">
                <DemoCard icon={<User size={28} className="text-emerald-400" />} title="Client / User" desc="Browse catalog, manage cart, and chat with AI Bot." onClick={() => handleDemoSelect('user')} color="emerald" />
                <DemoCard icon={<Users size={28} className="text-blue-400" />} title="Manager Level" desc="Review orders, approve workflows, and add notes." onClick={() => handleDemoSelect('manager')} color="blue" />
                <DemoCard icon={<Shield size={28} className="text-purple-400" />} title="Admin Level" desc="Manage user accounts, activations, and system metrics." onClick={() => handleDemoSelect('admin')} color="purple" />
                <DemoCard icon={<Key size={28} className="text-rose-400" />} title="Super Admin" desc="Full system override and Immutable Audit Log access." onClick={() => handleDemoSelect('superadmin')} color="rose" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Standard Modals */}
      <AnimatePresence>
        {privacyOpen && (
          <Modal title="Privacy Policy" close={() => setPrivacyOpen(false)}>
            <p>At H&P Solutions, your privacy is our priority. We employ enterprise-grade encryption to protect your operational data.</p>
          </Modal>
        )}
        {termsOpen && (
          <Modal title="Terms of Service" close={() => setTermsOpen(false)}>
            <p>By accessing the H&P Solutions Enterprise Portal, you agree to comply with our organizational security policies.</p>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB COMPONENTS ---

function CategoryCard({ icon, title, desc }) {
  return (
    <motion.div variants={fadeUpVariant} className="bg-[#111827]/60 backdrop-blur-lg p-8 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] group-hover:bg-white/10 transition-colors"></div>
      <div className="w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-black text-white mb-3">{title}</h3>
      <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function TechBlock({ icon, title, subtitle }) {
  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center flex flex-col items-center justify-center hover:bg-white/5 transition-colors relative z-10 shadow-2xl">
      <div className="mb-4 bg-black/30 p-4 rounded-2xl border border-white/5 shadow-inner">{icon}</div>
      <h3 className="font-black text-white text-2xl">{title}</h3>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">{subtitle}</p>
    </div>
  );
}

function ReviewCard({ name, role, text }) {
  return (
    <motion.div variants={fadeUpVariant} className="bg-[#111827]/60 backdrop-blur-lg border border-white/5 p-8 rounded-[2rem] relative hover:border-white/20 transition-all hover:-translate-y-2 group">
      <MessageSquareQuote size={40} className="absolute top-8 right-8 text-white/5 group-hover:text-blue-500/10 transition-colors" />
      <div className="flex gap-1 mb-6">
        {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-yellow-500" fill="#EAB308" />)}
      </div>
      <p className="text-lg text-slate-300 font-medium mb-8 leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-tr from-slate-700 to-slate-600 rounded-full flex items-center justify-center text-white font-black text-lg border border-white/10 shadow-inner">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-white text-base">{name}</h4>
          <p className="text-xs text-slate-400 font-semibold mt-1">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

function DemoCard({ icon, title, desc, onClick, color }) {
  return (
    <div onClick={onClick} className={`p-6 sm:p-8 rounded-[2rem] bg-[#111827]/80 backdrop-blur-md border border-white/5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-${color}-500/30 group relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div className="flex items-center gap-5 relative z-10">
        <div className={`bg-black/50 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 group-hover:bg-${color}-500/10 transition-all`}>
          {icon}
        </div>
        <div>
          <h4 className="font-black text-white text-2xl mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400">{title}</h4>
          <p className="text-sm text-slate-400 font-medium">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, children, close }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close}></motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111827] p-8 rounded-[2rem] shadow-2xl max-w-lg w-full border border-white/10 relative z-10">
        <button onClick={close} className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors">
          <X size={20} />
        </button>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
            <ShieldCheck size={24} />
          </div>
          <h2 className="font-black text-2xl text-white">{title}</h2>
        </div>
        <div className="text-slate-300 font-medium leading-relaxed text-lg mb-8">
          {children}
        </div>
        <button onClick={close} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-slate-200 transition-colors text-lg">
          I Understand & Agree
        </button>
      </motion.div>
    </div>
  );
}