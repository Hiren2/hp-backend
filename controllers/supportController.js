const Order = require("../models/Order");

// =====================================================================
// 🔥 ULTRA PRO MAX NLP ENGINE (NO API NEEDED) 🔥
// Supports: English, Hindi, Gujarati with Database Sync
// =====================================================================
const getUltraProMaxResponse = (msg, lang, name, latestOrder) => {
    const text = (msg || "").toLowerCase().trim();
    const l = (lang || "English").toLowerCase();

    // -- HELPER: Extract Order Details --
    const oName = latestOrder ? (latestOrder.service?.title || latestOrder.service?.name || "Service") : "None";
    const oStatus = latestOrder ? latestOrder.status : "N/A";

    // ================= 1. ENGLISH RESPONSES =================
    if (l === "english") {
        if (text.includes("order") || text.includes("status") || text.includes("track") || text.includes("history") || text.includes("last")) {
            if (latestOrder) {
                return `Your most recent order is '${oName}' and its current status is: **${oStatus}**. You can view full details in your Orders tab.`;
            }
            return `You haven't placed any orders yet, ${name}. Explore our catalog to get started!`;
        }
        if (text.includes("hi") || text.includes("hello") || text.includes("hey")) return `Hello ${name}! 👋 I am ServiceBot. How can I assist you with your enterprise needs today?`;
        if (text.includes("delivery") || text.includes("time") || text.includes("when") || text.includes("long")) return "Our standard service delivery and installation time is usually between 2 to 4 hours after manager approval.";
        if (text.includes("contact") || text.includes("support") || text.includes("email") || text.includes("call") || text.includes("number")) return "You can reach our 24/7 enterprise support team at hp12@solution.in or call 8050480504.";
        if (text.includes("owner") || text.includes("who") || text.includes("ceo") || text.includes("founder")) return "H&P Solutions is proudly developed and managed by Hiren Pabari and team. We specialize in B2B SaaS platforms.";
        if (text.includes("price") || text.includes("cost") || text.includes("refund")) return "For pricing, refunds, or custom enterprise quotes, please check the specific service details or contact our billing team at hp12@solution.in.";
        
        return `I understand you are asking about "${text.substring(0, 20)}...". For specific account actions, please use the dashboard menus, or contact us at 8050480504.`;
    }

    // ================= 2. HINDI RESPONSES (हिंदी) =================
    if (l === "hindi") {
        if (text.includes("order") || text.includes("status") || text.includes("track") || text.includes("history") || text.includes("last") || text.includes("ऑर्डर") || text.includes("स्टेटस")) {
            if (latestOrder) {
                return `आपका पिछला आर्डर '${oName}' था, और उसका स्टेटस अभी **${oStatus}** है। पूरी जानकारी के लिए 'My Orders' सेक्शन चेक करें।`;
            }
            return `आपने अभी तक कोई आर्डर नहीं किया है, ${name}। कृपया हमारी सर्विसेज चेक करें!`;
        }
        if (text.includes("hi") || text.includes("hello") || text.includes("hey") || text.includes("नमस्ते") || text.includes("हेलो")) return `नमस्ते ${name}! 👋 मैं सर्विसबॉट हूँ। मैं आज आपकी क्या मदद कर सकता हूँ?`;
        if (text.includes("delivery") || text.includes("time") || text.includes("कब") || text.includes("समय") || text.includes("डिलीवरी")) return "मैनेजर के अप्रूवल के बाद, हमारी सर्विस डिलीवरी और इंस्टालेशन में आमतौर पर 2 से 4 घंटे का समय लगता है।";
        if (text.includes("contact") || text.includes("support") || text.includes("email") || text.includes("नंबर") || text.includes("संपर्क") || text.includes("कॉल")) return "आप हमारी सपोर्ट टीम से hp12@solution.in पर ईमेल द्वारा या 8050480504 पर कॉल करके 24/7 संपर्क कर सकते हैं।";
        if (text.includes("owner") || text.includes("who") || text.includes("मालिक") || text.includes("किसने")) return "H&P Solutions को हिरेन पबारी और उनकी टीम द्वारा डेवलप किया गया है। हम बेहतरीन B2B SaaS प्लेटफॉर्म बनाते हैं।";
        
        return `क्षमा करें, मुझे यह ठीक से समझ नहीं आया। अधिक जानकारी के लिए कृपया डैशबोर्ड का उपयोग करें या 8050480504 पर कॉल करें।`;
    }

    // ================= 3. GUJARATI RESPONSES (ગુજરાતી) =================
    if (l === "gujarati") {
        if (text.includes("order") || text.includes("status") || text.includes("track") || text.includes("history") || text.includes("last") || text.includes("ઓર્ડર") || text.includes("સ્ટેટસ")) {
            if (latestOrder) {
                return `તમારો છેલ્લો ઓર્ડર '${oName}' હતો, અને તેનું સ્ટેટસ અત્યારે **${oStatus}** છે. વધુ માહિતી માટે 'My Orders' ટેબ જુઓ.`;
            }
            return `તમે હજુ સુધી કોઈ ઓર્ડર નથી કર્યો, ${name}. કૃપા કરીને અમારી સર્વિસ ચેક કરો!`;
        }
        if (text.includes("hi") || text.includes("hello") || text.includes("hey") || text.includes("નમસ્તે") || text.includes("હેલો")) return `નમસ્તે ${name}! 👋 હું સર્વિસબોટ છું. આજે હું તમારી શું મદદ કરી શકું?`;
        if (text.includes("delivery") || text.includes("time") || text.includes("ક્યારે") || text.includes("સમય") || text.includes("ડિલિવરી")) return "મેનેજરની મંજૂરી પછી, અમારી સર્વિસ ડિલિવરી અને ઇન્સ્ટોલેશનમાં સામાન્ય રીતે 2 થી 4 કલાકનો સમય લાગે છે.";
        if (text.includes("contact") || text.includes("support") || text.includes("email") || text.includes("નંબર") || text.includes("સંપર્ક") || text.includes("કોલ")) return "તમે અમારી સપોર્ટ ટીમને hp12@solution.in પર ઈમેલ દ્વારા અથવા 8050480504 પર કોલ કરીને 24/7 સંપર્ક કરી શકો છો.";
        if (text.includes("owner") || text.includes("who") || text.includes("માલિક") || text.includes("કોણે")) return "H&P Solutions હિરેન પબારી અને તેમની ટીમ દ્વારા બનાવવામાં આવ્યું છે. અમે શ્રેષ્ઠ B2B SaaS પ્લેટફોર્મ બનાવીએ છીએ.";
        
        return `માફ કરશો, મને આ બરાબર સમજાયું નથી. વધુ માહિતી માટે કૃપા કરીને ડેશબોર્ડનો ઉપયોગ કરો અથવા 8050480504 પર કૉલ કરો.`;
    }

    // Fallback
    return `Thank you for reaching out! Please contact support at 8050480504 for specific queries.`;
};

exports.handleSupportChat = async (req, res) => {
    try {
        const { message, language } = req.body;
        
        const userName = req.user?.name || req.user?.fullName || "Guest"; 
        const userId = req.user?._id || req.user?.id; 

        // 1. Fetch Exact Latest Order from DB for Real Data
        let latestOrder = null;
        if (userId) {
            latestOrder = await Order.findOne({ user: userId }).populate("service").sort({ createdAt: -1 });
        }

        // 2. Direct Call to Ultra Pro Max Engine (No Google API Delay/Errors)
        const botReply = getUltraProMaxResponse(message, language, userName, latestOrder);

        // 3. Simulated "Thinking" Delay (Optional, makes it look like real AI)
        setTimeout(() => {
            return res.status(200).json({ reply: botReply });
        }, 800); // 800ms delay to make it look natural

    } catch (error) {
        console.error("🔥 FATAL ERROR IN BOT:", error.message); 
        res.status(200).json({ reply: `Service is currently offline for maintenance. Please call 8050480504.` });
    }
};