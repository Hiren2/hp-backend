import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import api from '../utils/api'; 

const Chatbot = () => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const rawRole = storedUser.role || "guest";
    const userRole = String(rawRole).toLowerCase().trim();

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([]);
    const [selectedLang, setSelectedLang] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (userRole !== "user") return;

        const hour = new Date().getHours();
        let greeting = "Good Evening";
        if (hour >= 5 && hour < 12) greeting = "Good Morning";
        else if (hour >= 12 && hour < 17) greeting = "Good Afternoon";

        const name = storedUser.name || "User";

        setMessages([
            { text: `${greeting}, ${name}! 👋 I am ServiceBot AI.`, isBot: true },
            { text: "Which language are you comfortable with? (English, Hindi, Gujarati)", isBot: true, isLangSelect: true }
        ]);
    }, [userRole, storedUser.name]);

    useEffect(() => { 
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
    }, [messages, isTyping]);

    if (userRole !== "user") {
        return null;
    }

    // 🔥 THE EXTREME OFFLINE AI ENGINE (FAANG-LEVEL FALLBACK) 🔥
    const getOfflineFallback = (msg, lang) => {
        const text = msg.toLowerCase();
        
        // 1. GUJARATI NATIVE RESPONSES
        if (lang === "Gujarati" || text.includes("kem cho") || text.includes("gujarati")) {
            if (text.includes("order") || text.includes("kyare aavse") || text.includes("status")) {
                return "Tamaro order track karva mate, krupya 'My Orders' page par jao. Tya tamne live status dekhase. 📦";
            }
            if (text.includes("paisa") || text.includes("refund") || text.includes("cancel")) {
                return "Refund ke cancellation mate, manager ni approval jaruri che. Tame order page thi request muki shako cho. 💳";
            }
            if (text.includes("ac") || text.includes("cooling") || text.includes("pankha")) {
                return "Ame AC servicing, cooling system optimization, ane maintenance ni suvidha aapiye chiye. Vadhu mahiti mate Services catalog juo. ❄️";
            }
            if (text.includes("namaste") || text.includes("kem cho") || text.includes("hi")) {
                return "Kem cho! Majama? Hu tamari su madad kari shaku? (Puchela prashno: Order Status, Services, ke Payment)";
            }
            return "Maaf karjo, maru network connection thodu slow che. Krupya thodi vaar pachi fari try karo, ya menu mathi direct service pasand karo. 🙏";
        }

        // 2. HINDI NATIVE RESPONSES
        if (lang === "Hindi" || text.includes("namaste") || text.includes("hindi")) {
            if (text.includes("order") || text.includes("kahan hai") || text.includes("kab aayega")) {
                return "Aap apne order ka live status 'My Orders' section mein jaakar dekh sakte hain. 📦";
            }
            if (text.includes("paise") || text.includes("refund") || text.includes("cancel")) {
                return "Order cancel karne par refund manager ke approval ke baad aapke account mein bhej diya jayega. 💳";
            }
            if (text.includes("hi") || text.includes("hello") || text.includes("namaste")) {
                return "Namaste! Main aapki kya sahayata kar sakta hu? Aap mujhse Order, Payment ya Services ke baare me pooch sakte hain.";
            }
            return "Kshama karein, mera network abhi theek se kaam nahi kar raha hai. Kripya thodi der baad prayas karein. 🙏";
        }

        // 3. ENGLISH ADVANCED INTELLIGENCE (MASSIVE KEYWORD DATABASE)
        
        // Order Tracking & Status
        if (text.match(/(track|where|status|pending|shipped|dispatch|when|delivery)/)) {
            return "You can track your exact delivery status in real-time by navigating to the **My Orders** section in your dashboard. If your order shows 'Processing', our team is actively working on it! 🚚";
        }
        
        // Billing, Payment & Refunds
        if (text.match(/(pay|payment|upi|card|failed|decline|refund|cancel|money|invoice|receipt)/)) {
            return "For payment failures, the amount is automatically refunded by your bank within 48 hours. If you wish to cancel an active order and request a refund, please do so from the **My Orders** page. Manager approval may be required. 💳";
        }

        // Specific Service Offerings (Tailored Knowledge)
        if (text.match(/(ac|air conditioner|cooling|fan|temperature|service|maintenance)/)) {
            return "We provide professional **AC Servicing & Cooling System Optimization**. Whether it's fan tuning or full maintenance, you can book a certified technician directly from our **Services** catalog. ❄️";
        }

        if (text.match(/(edit|photo|image|design|pdf|word|document|margin|header|resolution)/)) {
            return "Looking for digital editing? We offer expert **Document Formatting (Word/PDF)**, layout design, and **High-Resolution Photo Editing** (including object removal). Check our digital offerings in the Services tab! 🖥️";
        }

        if (text.match(/(bird|pet|budgie|animal)/)) {
            return "While we specialize in technical and home services, taking care of your environment is important! If you need specific habitat maintenance services, browse our catalog or contact human support. 🦜";
        }

        // Coupons & Discounts
        if (text.match(/(coupon|discount|offer|promo|code|welcome100)/)) {
            return "Active promotions can be applied directly at Checkout! If this is your first time, try using the code **WELCOME100** for an exclusive first-order bonus. 🎉";
        }

        // Account & Security
        if (text.match(/(password|login|account|delete|profile|change)/)) {
            return "You can update your security settings, change your password, or modify your profile details by clicking on **Account Settings > Profile Overview** in the side menu. 🔒";
        }

        // Greetings & Small Talk
        if (text.match(/(hi|hello|hey|morning|afternoon|evening)/)) {
            return "Hello there! I am currently operating in **Offline Fast-Mode** to save bandwidth, but I can still answer queries about your orders, payments, and our services. How can I help? 🤖";
        }

        // Human Support Escalation
        if (text.match(/(human|person|agent|contact|call|email|support)/)) {
            return "If my automated responses aren't helping, you can reach our human support team directly at **support@hpsolutions.com** or call our toll-free enterprise desk. 📞";
        }

        // Ultimate Catch-All
        return "I am currently experiencing a network anomaly with my main AI server. However, you can find most of what you need in your **Dashboard** or **Services** catalog. Please try asking about your 'Order Status' or 'Refunds'. ⚡";
    };

    const handleSend = async (manualMsg = null, langChoice = null) => {
        const msgText = manualMsg || input;
        if (!msgText.trim() && !langChoice) return;

        const currentLang = langChoice || selectedLang || "English";
        
        if (langChoice) setSelectedLang(langChoice);

        setMessages(prev => [...prev, { text: msgText, isBot: false }]);
        setInput('');
        setIsTyping(true);

        try {
            // First, try to hit the live backend API
            const response = await api.post("/support/chat", { 
                message: msgText, 
                language: currentLang 
            });
            
            setMessages(prev => [...prev, { text: response.data.reply, isBot: true }]);
            setIsTyping(false);

        } catch (err) {
            console.error("Live AI Server unreachable. Switching to Offline Engine...");
            
            // 🔥 IF API FAILS, THE OFFLINE ENGINE TAKES OVER 🔥
            setTimeout(() => {
                const smartFallbackReply = getOfflineFallback(msgText, currentLang);
                setMessages(prev => [...prev, { text: smartFallbackReply, isBot: true }]);
                setIsTyping(false);
            }, 800); // Small delay to simulate "thinking" so it feels real
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-full text-white shadow-[0_10px_25px_rgba(37,99,235,0.4)] hover:scale-110 transition-all duration-300 border border-white/20">
                    <Sparkles className="animate-pulse" size={24} />
                </button>
            )}

            {isOpen && (
                <div className="bg-white dark:bg-slate-900 w-[360px] h-[550px] shadow-2xl rounded-3xl flex flex-col border border-slate-100 dark:border-slate-800 overflow-hidden animate-fadeIn">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white/30 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                            <span className="font-extrabold tracking-wide text-lg">ServiceBot AI</span>
                        </div>
                        <X className="cursor-pointer hover:bg-white/20 rounded-full p-1.5 transition-colors" onClick={() => setIsOpen(false)} />
                    </div>

                    <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`${m.isBot ? 'text-left' : 'text-right'} animate-slideUp`}>
                                <div className={`inline-block p-3.5 rounded-2xl text-[14px] shadow-sm max-w-[85%] leading-relaxed ${m.isBot ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700' : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none font-medium'}`}>
                                    <span dangerouslySetInnerHTML={{__html: m.text.replace(/\*\*(.*?)\*\*/g, '<b class="font-black text-blue-600 dark:text-blue-400">$1</b>')}} />
                                </div>
                                {m.isLangSelect && !selectedLang && (
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        <button onClick={() => handleSend("English", "English")} className="bg-white border-2 border-blue-500 text-blue-600 px-5 py-1.5 rounded-full text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">English</button>
                                        <button onClick={() => handleSend("Hindi", "Hindi")} className="bg-white border-2 border-blue-500 text-blue-600 px-5 py-1.5 rounded-full text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">Hindi</button>
                                        <button onClick={() => handleSend("Gujarati", "Gujarati")} className="bg-white border-2 border-blue-500 text-blue-600 px-5 py-1.5 rounded-full text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">Gujarati</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="bg-white dark:bg-slate-800 w-16 p-3.5 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 flex justify-center gap-1.5 shadow-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                            className="flex-1 bg-slate-100 dark:bg-slate-800 p-3.5 rounded-xl outline-none text-sm dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all border border-transparent dark:border-slate-700" 
                            placeholder="Type a message..." 
                        />
                        <button 
                            onClick={() => handleSend()} 
                            disabled={!input.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 p-3.5 text-white rounded-xl shadow-md transition-all active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;