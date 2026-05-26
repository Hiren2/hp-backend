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
  Key
} from "lucide-react";

export default function Home() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false); // New Demo State
  const navigate = useNavigate();

  const scrollToExpertise = () => {
    const section = document.getElementById("expertise-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Logic to handle Demo Selection
  const handleDemoSelect = (role) => {
    setDemoOpen(false);
    // Passing the selected role to the login page securely via state
    navigate('/login', { state: { autoLoginRole: role } });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      
      {/* Premium Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
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
              {/* Intelligent Interactive Demo Button */}
              <button 
                onClick={() => setDemoOpen(true)} 
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-bold text-gray-900 rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all mt-2"
              >
                <span className="relative px-6 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0 flex items-center gap-2">
                  <Zap size={16} className="text-blue-600 group-hover:text-white" />
                  Live Interactive Demo
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-20">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="h-[600px] w-full"
        >
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
                    Premium B2B SaaS Platform
                  </span>
                  <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                    Deploy Your Own <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Enterprise Marketplace</span>
                  </h1>
                  <p className="text-lg text-slate-300 mb-8 font-medium max-w-xl leading-relaxed">
                    H&P Solutions delivers a ready-to-scale, highly secure 4-Tier RBAC architecture. Experience full control, immutable audit logs, and AI-driven automation.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setDemoOpen(true)} 
                      className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105"
                    >
                      Try Live Sandbox <ArrowRight size={20} />
                    </button>
                    <button onClick={scrollToExpertise} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-slate-700">
                      Explore Architecture
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
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
                    Experience advanced Role-Based Access Control, Gemini API AI Chatbots, and automated workflows right out of the box.
                  </p>
                  <button onClick={() => setDemoOpen(true)} className="bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-4 rounded-full font-extrabold text-lg flex items-center gap-2 transition-all shadow-xl hover:scale-105 mx-auto w-max">
                    Launch Demo Environment
                  </button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Services Section */}
      <div id="expertise-section" className="py-20 bg-slate-100 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-2">Enterprise Solutions</h2>
            <h3 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
              The Complete E-Commerce Ecosystem
            </h3>
            <p className="mt-4 text-lg text-slate-500 font-medium">
              When you acquire the H&P Solutions architecture, you receive a full-stack, white-label ecosystem engineered for scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard 
              icon={<Code size={36} className="text-blue-500 group-hover:text-white transition-colors" />}
              title="White-label Storefront"
              desc="Sell physical products and services directly through a high-conversion, responsive UI."
              delay={0.1}
            />
            <CategoryCard 
              icon={<ShieldCheck size={36} className="text-emerald-500 group-hover:text-white transition-colors" />}
              title="4-Tier RBAC System"
              desc="Strictly isolated authorization layers (SuperAdmin, Admin, Manager, User) preventing role bleed."
              delay={0.2}
            />
            <CategoryCard 
              icon={<Zap size={36} className="text-purple-500 group-hover:text-white transition-colors" />}
              title="AI Gemini Integration"
              desc="Deploy our intelligent NLP ServiceBot to handle customer queries 24/7 autonomously."
              delay={0.3}
            />
            <CategoryCard 
              icon={<LineChart size={36} className="text-rose-500 group-hover:text-white transition-colors" />}
              title="Live Telemetry & Audits"
              desc="Real-time monitoring and immutable backend audit logs for 100% operational accountability."
              delay={0.4}
            />
          </div>
        </div>
      </div>

      {/* Reviews (Kept Intact as requested) */}
      <div className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-blue-400 tracking-widest uppercase mb-2">Trusted By Global Tech</h2>
              <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                What CTOs Are Saying
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-white/10 border border-white/20 px-4 py-2 rounded-xl">
              <span className="font-extrabold text-2xl mr-2">4.9</span>
              <Star size={20} fill="#FBBF24" className="text-yellow-400" />
              <Star size={20} fill="#FBBF24" className="text-yellow-400" />
              <Star size={20} fill="#FBBF24" className="text-yellow-400" />
              <Star size={20} fill="#FBBF24" className="text-yellow-400" />
              <Star size={20} fill="#FBBF24" className="text-yellow-400" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ReviewCard 
              name="David Mitchell"
              role="Tech Lead, Silicon Valley"
              text="H&P Solutions completely transformed our architecture. The automated workflows and the MERN RBAC system are flawlessly coded."
              delay={0.1}
            />
            <ReviewCard 
              name="Sarah Jenkins"
              role="Product Manager, UK"
              text="We needed a secure white-label platform fast. H&P delivered a scalable product. The live telemetry dashboard is a game-changer!"
              delay={0.2}
            />
            <ReviewCard 
              name="Amit Patel"
              role="Managing Director, India"
              text="The AI ServiceBot integration saved our support team hundreds of hours. Exceptional B2B SaaS architecture and clean codebase."
              delay={0.3}
            />
          </div>
        </div>
      </div>

      {/* CTA Footer Section */}
      <div className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between text-white">
            <div className="max-w-xl mb-8 md:mb-0">
              <h2 className="text-3xl font-extrabold mb-4">Ready to test the architecture?</h2>
              <p className="text-blue-100 text-lg font-medium mb-6">Enter our Sandbox Environment to experience Data Isolation and Role Management in real-time.</p>
            </div>
            <div>
              <button onClick={() => setDemoOpen(true)} className="bg-white text-indigo-700 px-8 py-4 rounded-full font-extrabold text-lg transition-all shadow-xl hover:scale-105 hover:bg-slate-50 inline-block">
                Launch Live Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 tracking-tight">H&P Solutions Architecture © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm font-semibold text-slate-500">
            <button onClick={() => setDemoOpen(true)} className="hover:text-blue-600 transition-colors">Test Sandbox</button>
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-blue-600 transition-colors">Privacy Policy</button>
            <button onClick={() => setTermsOpen(true)} className="hover:text-blue-600 transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>

      {/* --- THE NEW DEMO SELECTION MODAL --- */}
      {demoOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 relative">
              <button onClick={() => setDemoOpen(false)} className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
              <h2 className="font-extrabold text-3xl text-white mb-2">Select Sandbox Environment</h2>
              <p className="text-blue-100 font-medium">Experience our 4-Tier RBAC architecture. Select a role below to auto-login into the isolated demo database.</p>
            </div>
            
            <div className="p-8 grid sm:grid-cols-2 gap-4">
              <DemoCard 
                icon={<User size={24} className="text-emerald-500" />}
                title="Client / User"
                desc="Browse catalog, manage cart, and chat with AI Bot."
                onClick={() => handleDemoSelect('user')}
                bg="bg-emerald-50 hover:bg-emerald-100 border-emerald-100"
              />
              <DemoCard 
                icon={<Users size={24} className="text-blue-500" />}
                title="Manager Level"
                desc="Review orders, approve workflows, and add notes."
                onClick={() => handleDemoSelect('manager')}
                bg="bg-blue-50 hover:bg-blue-100 border-blue-100"
              />
              <DemoCard 
                icon={<Shield size={24} className="text-purple-500" />}
                title="Admin Level"
                desc="Manage user accounts, activations, and system metrics."
                onClick={() => handleDemoSelect('admin')}
                bg="bg-purple-50 hover:bg-purple-100 border-purple-100"
              />
              <DemoCard 
                icon={<Key size={24} className="text-rose-500" />}
                title="Super Admin"
                desc="Full system override and Immutable Audit Log access."
                onClick={() => handleDemoSelect('superadmin')}
                bg="bg-rose-50 hover:bg-rose-100 border-rose-100"
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

// Sub-components
function DemoCard({ icon, title, desc, onClick, bg }) {
  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${bg}`}
    >
      <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm">
        {icon}
      </div>
      <h4 className="font-extrabold text-slate-800 text-lg mb-1">{title}</h4>
      <p className="text-sm text-slate-600 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function CategoryCard({ icon, title, desc, delay }) {
  // Existing logic kept exactly same
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

function ReviewCard({ name, role, text, delay }) {
   // Existing logic kept exactly same
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-slate-800 border border-slate-700 p-8 rounded-3xl relative hover:bg-slate-800/80 transition-colors"
    >
      <MessageSquareQuote size={40} className="absolute top-6 right-6 text-slate-700 opacity-50" />
      <div className="flex text-yellow-400 mb-4">
        <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
      </div>
      <p className="text-slate-300 italic mb-6 leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-inner">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-extrabold text-white">{name}</h4>
          <p className="text-xs text-slate-400 font-medium">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  // Existing logic kept exactly same
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
   // Existing logic kept exactly same
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-fadeIn">
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