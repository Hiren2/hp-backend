import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Parallax } from "swiper/modules";
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
  ChevronRight,
  Globe,
  Terminal
} from "lucide-react";

// --- Ultra-Premium Cinematic Animation Variants ---
const textReveal = {
  hidden: { y: "150%", opacity: 0, rotate: 5 },
  show: { y: 0, opacity: 1, rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
};

const floatAnim = {
  y: [0, -20, 0],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
};

const floatVariantReverse = {
  y: [0, 20, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
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
    <div className="min-h-screen bg-black font-sans overflow-x-hidden text-white selection:bg-cyan-500/40 selection:text-cyan-100">
      
      {/* 5M USD Vibe: Abstract Breathing Gradients (Cyberpunk/Neon) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-30%] left-[-20%] w-[70vw] h-[70vw] bg-fuchsia-600/10 rounded-full blur-[150px] mix-blend-screen"
        ></motion.div>
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.5, 1] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-40%] right-[-20%] w-[80vw] h-[80vw] bg-cyan-600/10 rounded-full blur-[200px] mix-blend-screen"
        ></motion.div>
      </div>

      {/* Ultra-Minimal Pill Navbar */}
      <nav className="fixed w-full z-50 top-6 px-4 flex justify-center transition-all duration-500">
        <div className="w-full max-w-5xl bg-white/[0.03] backdrop-blur-3xl border border-white/[0.05] rounded-full px-6 py-3 flex justify-between items-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
            <div className="relative w-10 h-10 bg-white text-black flex items-center justify-center rounded-full overflow-hidden group-hover:scale-95 transition-transform duration-500">
              <ShieldCheck className="w-5 h-5 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <span className="font-black text-xl tracking-tighter text-white">
              H&P<span className="text-cyan-400">.</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/login" className="hidden sm:block text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
              Client Login
            </Link>
            <button 
              onClick={() => setDemoOpen(true)} 
              className="relative overflow-hidden bg-white text-black px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all hover:scale-105 group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Globe size={14} className="group-hover:animate-spin-slow" /> Sandbox
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-cyan-300 bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Cinematic Full-Screen Hero */}
      <div className="relative z-10 h-screen w-full">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, Parallax]}
          effect="fade"
          parallax={true}
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          pagination={{ clickable: true, renderBullet: (index, className) => `<span class="${className} custom-bullet"></span>` }}
          className="h-full w-full custom-swiper"
        >
          {/* POSTER 1: Massive Typography & Glass Dashboard (Right Fill) */}
          <SwiperSlide>
            <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between px-6 lg:px-20 overflow-hidden">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50vw] h-[100vh] bg-gradient-to-l from-cyan-900/20 to-transparent blur-3xl pointer-events-none"></div>
              
              {/* Left Content */}
              <motion.div initial="hidden" whileInView="show" variants={staggerContainer} className="w-full md:w-[55%] z-10 mt-20 md:mt-0">
                <div className="overflow-hidden mb-4">
                  <motion.div variants={textReveal} className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-[0.3em] bg-cyan-950/30 backdrop-blur-md">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></span>
                    Architecture 01
                  </motion.div>
                </div>
                
                <h1 className="text-6xl sm:text-7xl lg:text-[120px] xl:text-[140px] font-black tracking-tighter leading-[0.85] mb-8" data-swiper-parallax="-300">
                  <div className="overflow-hidden py-2"><motion.div variants={textReveal}>ENTERPRISE</motion.div></div>
                  <div className="overflow-hidden py-2">
                    <motion.div variants={textReveal} className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-500">
                      MARKETPLACE.
                    </motion.div>
                  </div>
                </h1>
                
                <motion.p variants={fadeUpVariant} className="text-lg md:text-2xl lg:text-3xl text-white/50 font-light max-w-2xl mb-12 leading-tight" data-swiper-parallax="-200">
                  Deploy a highly secure 4-Tier RBAC architecture instantly. Experience full white-label scaling with military-grade Multi-Tenancy.
                </motion.p>
                
                <motion.div variants={fadeUpVariant} className="flex gap-4" data-swiper-parallax="-100">
                  <button onClick={() => setDemoOpen(true)} className="h-14 md:h-16 px-8 md:px-10 rounded-full bg-cyan-500 text-black font-black uppercase tracking-widest flex items-center gap-3 hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all">
                    Initialize Demo <ArrowRight size={20} />
                  </button>
                </motion.div>
              </motion.div>

              {/* Right Content - Floating Glass Dashboard */}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="hidden md:flex w-full md:w-[45%] justify-center items-center z-10 relative perspective-1000">
                <motion.div variants={floatAnim} animate="animate" className="relative w-full max-w-md aspect-square preserve-3d" style={{ rotateY: -15, rotateX: 5 }}>
                  {/* Glass Card */}
                  <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.15)] flex flex-col p-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500"></div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      </div>
                      <div className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full">RBAC_NODE: ACTIVE</div>
                    </div>
                    {/* Mock Data Bars */}
                    <div className="flex-1 flex flex-col gap-5 justify-center">
                      <div className="w-full h-10 bg-white/[0.03] rounded-lg relative overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: "85%" }} transition={{ duration: 1.5, delay: 0.5 }} className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500/40 to-cyan-400/80"></motion.div></div>
                      <div className="w-full h-10 bg-white/[0.03] rounded-lg relative overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: "45%" }} transition={{ duration: 1.5, delay: 0.7 }} className="absolute left-0 top-0 h-full bg-gradient-to-r from-fuchsia-500/40 to-fuchsia-400/80"></motion.div></div>
                      <div className="w-full h-10 bg-white/[0.03] rounded-lg relative overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: "92%" }} transition={{ duration: 1.5, delay: 0.9 }} className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500/40 to-blue-400/80"></motion.div></div>
                    </div>
                  </div>
                  {/* Floating Badge */}
                  <motion.div variants={floatVariantReverse} animate="animate" className="absolute -bottom-8 -left-12 bg-black/80 backdrop-blur-xl border border-cyan-500/30 p-5 rounded-2xl flex items-center gap-4 shadow-2xl">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30"><Activity className="text-cyan-400 animate-pulse" size={24} /></div>
                    <div>
                      <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold">System Uptime</div>
                      <div className="text-2xl font-black text-white">99.99%</div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </SwiperSlide>

          {/* POSTER 2: AI Gemini (Right Fill - Terminal) */}
          <SwiperSlide>
            <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between px-6 lg:px-20 overflow-hidden">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50vw] h-[100vh] bg-gradient-to-l from-fuchsia-900/20 to-transparent blur-3xl pointer-events-none"></div>
              
              <motion.div initial="hidden" whileInView="show" variants={staggerContainer} className="w-full md:w-[55%] z-10 mt-20 md:mt-0">
                <div className="overflow-hidden mb-4">
                  <motion.div variants={textReveal} className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-fuchsia-500/30 text-fuchsia-400 text-xs font-black uppercase tracking-[0.3em] bg-fuchsia-950/30 backdrop-blur-md">
                    <Cpu size={14} /> Autonomous Workflow
                  </motion.div>
                </div>
                
                <h1 className="text-6xl sm:text-7xl lg:text-[120px] xl:text-[140px] font-black tracking-tighter leading-[0.85] mb-8" data-swiper-parallax="-300">
                  <div className="overflow-hidden py-2"><motion.div variants={textReveal}>GEMINI NLP</motion.div></div>
                  <div className="overflow-hidden py-2">
                    <motion.div variants={textReveal} className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-200 to-orange-400">
                      INTEGRATED.
                    </motion.div>
                  </div>
                </h1>
                
                <motion.p variants={fadeUpVariant} className="text-lg md:text-2xl lg:text-3xl text-white/50 font-light max-w-2xl mb-12 leading-tight" data-swiper-parallax="-200">
                  Embedded natural language bots resolve support queries and optimize pipelines with absolute zero human oversight.
                </motion.p>
                
                <motion.div variants={fadeUpVariant} className="flex gap-4" data-swiper-parallax="-100">
                  <button onClick={() => setDemoOpen(true)} className="h-14 md:h-16 px-8 md:px-10 rounded-full bg-fuchsia-500 text-white font-black uppercase tracking-widest flex items-center gap-3 hover:bg-fuchsia-400 hover:shadow-[0_0_40px_rgba(217,70,239,0.5)] transition-all">
                    Launch AI Core <ArrowRight size={20} />
                  </button>
                </motion.div>
              </motion.div>

              {/* Right Content - Floating AI Terminal */}
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="hidden md:flex w-full md:w-[45%] justify-center items-center z-10 relative">
                <motion.div variants={floatAnim} animate="animate" className="w-full max-w-lg bg-[#0A0A0A] rounded-2xl border border-white/10 shadow-[0_0_100px_rgba(217,70,239,0.15)] overflow-hidden">
                  <div className="bg-white/5 px-4 py-3 flex items-center gap-3 border-b border-white/10">
                    <Terminal size={16} className="text-fuchsia-400" />
                    <span className="text-xs font-mono text-white/50">gemini_core_engine.sh</span>
                  </div>
                  <div className="p-6 font-mono text-sm leading-relaxed text-white/70 h-[300px] flex flex-col justify-end overflow-hidden">
                    <p className="text-green-400 mb-2">{">"} System initializing...</p>
                    <p className="text-white/50 mb-2">{">"} Connecting to Google Gemini NLP...</p>
                    <p className="text-cyan-400 mb-2">{">"} Connection established (99.9% stable).</p>
                    <p className="text-white/50 mb-4">{">"} Parsing user intent payload:</p>
                    <div className="pl-4 border-l-2 border-fuchsia-500/30 text-fuchsia-300">
                      {"{"}<br/>
                      &nbsp;&nbsp;"action": "resolve_order",<br/>
                      &nbsp;&nbsp;"confidence": 0.98,<br/>
                      &nbsp;&nbsp;"status": "autonomous_override_engaged"<br/>
                      {"}"}
                    </div>
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} className="w-3 h-5 bg-fuchsia-500 mt-4"></motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </SwiperSlide>

          {/* POSTER 3: Strict Sandbox (Right Fill - Holographic Rings) */}
          <SwiperSlide>
            <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between px-6 lg:px-20 overflow-hidden">
              <motion.div initial="hidden" whileInView="show" variants={staggerContainer} className="w-full md:w-[55%] z-10 mt-20 md:mt-0">
                <h1 className="text-6xl sm:text-7xl lg:text-[120px] xl:text-[140px] font-black tracking-tighter leading-[0.85] mb-8">
                  <div className="overflow-hidden py-2"><motion.div variants={textReveal}>ISOLATED</motion.div></div>
                  <div className="overflow-hidden py-2">
                    <motion.div variants={textReveal} className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                      SANDBOX.
                    </motion.div>
                  </div>
                </h1>
                <motion.p variants={fadeUpVariant} className="text-lg md:text-2xl lg:text-3xl text-white/50 font-light max-w-2xl mb-12 leading-tight">
                  Never leak test actions into live production. Our Multi-Tenancy firewall ensures complete parallel database isolation.
                </motion.p>
                <motion.button variants={fadeUpVariant} onClick={() => setDemoOpen(true)} className="h-14 md:h-16 px-8 md:px-10 rounded-full bg-white text-black font-black uppercase tracking-widest flex items-center gap-3 hover:bg-gray-200 transition-all">
                  Test Firewall <Shield size={20} />
                </motion.button>
              </motion.div>

              {/* Right Content - Rotating Hologram */}
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5 }} className="hidden md:flex w-full md:w-[45%] justify-center items-center z-10 relative">
                <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                  {/* Outer Ring */}
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-dashed border-purple-500/50"></motion.div>
                  {/* Middle Ring */}
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border-2 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]"></motion.div>
                  {/* Inner Core */}
                  <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-400 shadow-[0_0_50px_rgba(168,85,247,0.6)] backdrop-blur-md">
                    <Database size={32} className="text-white" />
                  </div>
                  {/* Security Lock Badge */}
                  <div className="absolute top-0 right-0 bg-black border border-white/10 p-3 rounded-xl shadow-xl flex items-center gap-2">
                    <ShieldCheck className="text-green-400" size={16} />
                    <span className="text-xs font-bold uppercase">Encrypted</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Marquee Divider (SaaS Trend) */}
      <div className="w-full bg-cyan-500 text-black py-4 overflow-hidden flex whitespace-nowrap rotate-[-1deg] scale-105 z-20 relative">
        <div className="animate-marquee font-black uppercase tracking-[0.2em] text-sm flex gap-10">
          <span>Multi-Tier Architecture</span><span>•</span>
          <span>Google Gemini AI</span><span>•</span>
          <span>JWT Secure Encryption</span><span>•</span>
          <span>Zero-Latency Output</span><span>•</span>
          <span>MongoDB Aggregations</span><span>•</span>
          <span>Multi-Tier Architecture</span><span>•</span>
          <span>Google Gemini AI</span><span>•</span>
        </div>
      </div>

      {/* Modern Brutalist Feature Grid */}
      <div id="expertise-section" className="py-32 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-24 md:flex justify-between items-end">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none max-w-2xl">
              BUILT FOR <br/><span className="text-white/30">GLOBAL SCALE.</span>
            </h2>
            <p className="text-white/50 font-medium max-w-md mt-6 md:mt-0">
              A full-stack ecosystem engineered for zero-latency performance and unbreakable security pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <UltraCard num="01" icon={<Code />} title="White-label Ready" desc="Instant branded storefront deployment with optimized funnels." />
            <UltraCard num="02" icon={<ShieldCheck />} title="4-Tier RBAC" desc="Military-grade authorization preventing enterprise data bleed." />
            <UltraCard num="03" icon={<Zap />} title="AI Integration" desc="Embedded NLP Gemini ServiceBot for autonomous support." />
            <UltraCard num="04" icon={<LineChart />} title="Live Telemetry" desc="Real-time monitoring and immutable blockchain-style logs." />
          </div>
        </div>
      </div>

      {/* Holographic Tech Specs */}
      <div className="py-32 relative z-10 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-10">
              CORE <br/> <span className="text-cyan-400">BLUEPRINT.</span>
            </h2>
            <div className="space-y-8">
              <SpecRow title="Express Secure REST API" desc="Structured controller patterns with isolated middleware token parsing." />
              <SpecRow title="Multi-Tab Synchronizer" desc="Frontend contextual storage triggering instant backend mutations." />
              <SpecRow title="Optimized Aggregations" desc="Heavy relational lookups handling profile metrics efficiently." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <BentoBox title="MERN" subtitle="Tech Stack Base" bg="from-cyan-500/20 to-transparent" />
            <BentoBox title="NoSQL" subtitle="Data Segregation" bg="from-fuchsia-500/20 to-transparent" />
            <BentoBox title="JWT" subtitle="Cryptography" bg="from-blue-500/20 to-transparent" />
            <BentoBox title="LLM" subtitle="AI Pipeline" bg="from-orange-500/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* Massive CTA */}
      <div className="py-40 relative z-10 overflow-hidden">
        <motion.div variants={floatAnim} animate="animate" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-cyan-500/20 to-fuchsia-500/20 rounded-full blur-[100px] -z-10"></motion.div>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-7xl md:text-[100px] font-black tracking-tighter leading-[0.85] mb-10">
            SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">READY.</span>
          </h2>
          <button onClick={() => setDemoOpen(true)} className="bg-white text-black px-12 py-6 rounded-full font-black text-xl md:text-2xl uppercase tracking-widest hover:scale-110 transition-transform shadow-[0_0_60px_rgba(255,255,255,0.3)]">
            Initialize Sandbox
          </button>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-white/[0.05] py-8 px-6 flex flex-col md:flex-row justify-between items-center text-xs font-bold uppercase tracking-widest text-white/30">
        <div>H&P Solutions © {new Date().getFullYear()}</div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <button onClick={() => setDemoOpen(true)} className="hover:text-white transition-colors">Sandbox</button>
          <button onClick={() => setPrivacyOpen(true)} className="hover:text-white transition-colors">Privacy</button>
          <button onClick={() => setTermsOpen(true)} className="hover:text-white transition-colors">Terms</button>
        </div>
      </footer>

      {/* --- NEW HOLOGRAM DEMO MODAL --- */}
      <AnimatePresence>
        {demoOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setDemoOpen(false)}></motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} className="relative w-full max-w-5xl bg-black border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.1)]">
              
              <div className="p-10 border-b border-white/[0.05] flex justify-between items-end bg-gradient-to-b from-cyan-900/10 to-transparent">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">ACCESS <span className="text-cyan-400">PORTAL.</span></h2>
                  <p className="text-white/40 mt-2 text-sm uppercase tracking-widest font-bold">Select Node to initialize 4-Tier RBAC</p>
                </div>
                <button onClick={() => setDemoOpen(false)} className="text-white/30 hover:text-white transition-colors pb-2">
                  <X size={32} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
                <HoloCard icon={<User size={32} />} title="Client Node" desc="Catalog & AI Bot access." onClick={() => handleDemoSelect('user')} color="cyan" />
                <HoloCard icon={<Users size={32} />} title="Manager Node" desc="Workflow & order approval." onClick={() => handleDemoSelect('manager')} color="fuchsia" />
                <HoloCard icon={<Shield size={32} />} title="Admin Node" desc="User management & metrics." onClick={() => handleDemoSelect('admin')} color="white" />
                <HoloCard icon={<Key size={32} />} title="Super Admin" desc="Full system override & Logs." onClick={() => handleDemoSelect('superadmin')} color="red" />
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

      {/* Custom Global Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-bullet { width: 40px; height: 3px; background: rgba(255,255,255,0.2); display: inline-block; margin: 0 4px; cursor: pointer; transition: all 0.3s; }
        .swiper-pagination-bullet-active.custom-bullet { background: #22d3ee; box-shadow: 0 0 10px #22d3ee; }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 15s linear infinite; }
        .preserve-3d { transform-style: preserve-3d; }
        .perspective-1000 { perspective: 1000px; }
      `}} />
    </div>
  );
}

// --- NEW ULTRA COMPONENTS ---

function UltraCard({ num, icon, title, desc }) {
  return (
    <div className="p-8 border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
      <div className="flex justify-between items-start mb-12">
        <div className="text-white/20 group-hover:text-cyan-400 transition-colors">{icon}</div>
        <div className="text-xs font-black text-white/10 uppercase tracking-widest">{num}</div>
      </div>
      <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">{title}</h3>
      <p className="text-white/40 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function SpecRow({ title, desc }) {
  return (
    <div className="flex items-start gap-4 border-b border-white/[0.05] pb-6">
      <CheckCircle2 className="text-cyan-400 shrink-0 mt-1" size={20} />
      <div>
        <h4 className="text-xl font-bold uppercase tracking-tight mb-2">{title}</h4>
        <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function BentoBox({ title, subtitle, bg }) {
  return (
    <div className={`p-8 border border-white/[0.05] bg-gradient-to-b ${bg} flex flex-col justify-center items-center text-center rounded-2xl`}>
      <h3 className="text-3xl font-black uppercase tracking-tighter">{title}</h3>
      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2">{subtitle}</p>
    </div>
  );
}

function HoloCard({ icon, title, desc, onClick, color }) {
  return (
    <div onClick={onClick} className="p-12 cursor-pointer group relative overflow-hidden bg-black hover:bg-white/[0.02] transition-colors">
      <div className={`text-${color}-500/50 group-hover:text-${color}-400 group-hover:scale-110 transition-all duration-500 mb-6`}>{icon}</div>
      <h4 className="text-3xl font-black uppercase tracking-tighter text-white/50 group-hover:text-white transition-colors mb-2">{title}</h4>
      <p className="text-white/30 text-sm font-medium">{desc}</p>
      
      {/* Laser Scan Effect */}
      <div className={`absolute top-0 left-0 w-full h-[2px] bg-${color}-500 opacity-0 group-hover:opacity-100 group-hover:animate-scan shadow-[0_0_20px_currentColor]`}></div>
      <style>{`@keyframes scan { 0% { top: 0; } 100% { top: 100%; } } .animate-scan { animation: scan 2s linear infinite; }`}</style>
    </div>
  );
}

function Modal({ title, children, close }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={close}></motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-black p-10 border border-white/10 max-w-lg w-full relative z-10 rounded-2xl">
        <h2 className="font-black text-3xl uppercase tracking-tighter mb-6">{title}</h2>
        <div className="text-white/50 font-medium leading-relaxed mb-8">{children}</div>
        <button onClick={close} className="w-full bg-white text-black font-black py-4 uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors">Acknowledge</button>
      </motion.div>
    </div>
  );
}