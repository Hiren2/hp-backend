import React from 'react';
import Chatbot from '../components/Chatbot';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles // 🔥 Yeh missing tha, ab add kar diya hai
} from 'lucide-react';

const Support = () => {
    const contactInfo = [
        { 
            icon: <Phone className="text-blue-600" />, 
            title: "Call Us", 
            detail: "8050480504", 
            sub: "Mon-Sat, 9am - 6pm" 
        },
        { 
            icon: <Mail className="text-indigo-600" />, 
            title: "Email Support", 
            detail: "support@hpsolutions.com", 
            sub: "24/7 Response Rate" 
        },
        { 
            icon: <MapPin className="text-red-600" />, 
            title: "Our Office", 
            detail: "Jamnagar, Gujarat", 
            sub: "Main Business Hub" 
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950 p-4 sm:p-8 transition-colors duration-300">
            {/* Header Section */}
            <div className="max-w-6xl mx-auto text-center mb-12 animate-fadeIn">
                <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-4">
                    How can we <span className="text-blue-600">Help You?</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                    Have a question or need technical assistance? Our AI ServiceBot and support team are here to ensure your H&P ServiceHub experience is seamless.
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
                {/* Contact Cards */}
                <div className="md:col-span-1 space-y-6">
                    {contactInfo.map((item, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">{item.title}</h3>
                            <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">{item.detail}</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">{item.sub}</p>
                        </div>
                    ))}

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl">
                        <ShieldCheck className="mb-4 opacity-80" size={32} />
                        <h3 className="font-bold text-xl mb-2 text-white">Priority Support</h3>
                        <p className="text-sm opacity-90 leading-relaxed text-blue-50">
                            As part of our Role-Based system, Managers and Admins get priority technical assistance for internal queries.
                        </p>
                    </div>
                </div>

                {/* AI Chat Intro Section */}
                <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                        <MessageSquare size={40} className="text-blue-600 animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 tracking-tight">Talk to ServiceBot AI</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md font-medium">
                        Our intelligent assistant can help with order tracking, service details, and general queries in English, Hindi, and Gujarati.
                    </p>
                    <div className="flex gap-4 mb-10">
                        <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300">
                            ⚡ Fast Response
                        </div>
                        <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300">
                            🤖 Order Context
                        </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-3">
                         <Sparkles className="text-blue-600" size={20} />
                         <p className="text-sm text-slate-600 dark:text-blue-300 font-bold">
                            Click the sparkle icon on the bottom right to begin.
                         </p>
                    </div>
                </div>
            </div>

            {/* Chatbot mounting */}
            <Chatbot />
        </div>
    );
};

export default Support;