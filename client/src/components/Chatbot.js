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

    // 🔥 ENHANCED HANDLER FOR SEAMLESS NLP INTEGRATION
    const handleSend = async (manualMsg = null, langChoice = null, hiddenIntent = false) => {
        const msgText = manualMsg || input;
        if (!msgText.trim() && !langChoice) return;

        const currentLang = langChoice || selectedLang || "English";
        
        // If user is selecting a language, set it
        if (langChoice) setSelectedLang(langChoice);

        // Display user message
        setMessages(prev => [...prev, { text: msgText, isBot: false }]);
        setInput('');
        setIsTyping(true);

        try {
            // We pass the exact message to our advanced backend NLP
            const response = await api.post("/support/chat", { 
                message: msgText, 
                language: currentLang 
            });
            
            setMessages(prev => [...prev, { text: response.data.reply, isBot: true }]);
            setIsTyping(false);
        } catch (err) {
            console.error("Chat Error:", err);
            setIsTyping(false);
            setMessages(prev => [...prev, { text: "Network anomaly detected. Please try again.", isBot: true }]);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-full text-white shadow-2xl hover:scale-110 transition-all">
                    <Sparkles className="animate-pulse" size={24} />
                </button>
            )}

            {isOpen && (
                <div className="bg-white dark:bg-slate-900 w-[360px] h-[550px] shadow-2xl rounded-3xl flex flex-col border border-gray-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-5 text-white flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                            <span className="font-bold tracking-wide">ServiceBot AI</span>
                        </div>
                        <X className="cursor-pointer hover:bg-white/20 rounded-full p-1" onClick={() => setIsOpen(false)} />
                    </div>

                    <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950">
                        {messages.map((m, i) => (
                            <div key={i} className={`${m.isBot ? 'text-left' : 'text-right'}`}>
                                <div className={`inline-block p-3.5 rounded-2xl text-[14px] shadow-sm max-w-[85%] ${m.isBot ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border dark:border-slate-700' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                                    {/* Using dangerouslySetInnerHTML to parse the bold tags we sent from backend */}
                                    <span dangerouslySetInnerHTML={{__html: m.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}} />
                                </div>
                                {m.isLangSelect && !selectedLang && (
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        <button onClick={() => handleSend("I prefer English", "English")} className="bg-white border-2 border-blue-500 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">English</button>
                                        <button onClick={() => handleSend("मुझे हिंदी पसंद है (Hindi)", "Hindi")} className="bg-white border-2 border-blue-500 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">हिंदी</button>
                                        <button onClick={() => handleSend("મને ગુજરાતી ગમે છે (Gujarati)", "Gujarati")} className="bg-white border-2 border-blue-500 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">ગુજરાતી</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="bg-white dark:bg-slate-800 w-14 p-3 rounded-2xl border dark:border-slate-700 flex gap-1 shadow-sm">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex items-center gap-3">
                        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} className="flex-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl outline-none text-sm dark:text-white focus:ring-2 focus:ring-blue-200" placeholder="Type a message..." />
                        <button onClick={() => handleSend()} className="bg-blue-600 hover:bg-blue-700 p-3 text-white rounded-xl shadow-lg"><Send size={18} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;