const Order = require("../models/Order");

exports.handleSupportChat = async (req, res) => {
    try {
        const { message, language } = req.body;
        
        const userName = req.user?.name || req.user?.fullName || "Dost"; 
        const userId = req.user?._id || req.user?.id; 
        const apiKey = process.env.GEMINI_API_KEY;

        // 1. API Key Check
        if (!apiKey) {
            return res.status(200).json({ reply: "🚨 ERROR: .env file mein GEMINI_API_KEY missing hai!" });
        }

        // 2. Fetch User Orders for AI Context
        let orderContext = "No orders found.";
        if (userId) {
            const recentOrders = await Order.find({ user: userId }).populate("service").sort({ createdAt: -1 }).limit(3); 
            if (recentOrders.length > 0) {
                orderContext = recentOrders.map((order, index) => {
                    const sName = order.service?.title || order.service?.name || "Service";
                    return `Order ${index + 1}: ${sName} | Status: ${order.status}`;
                }).join(" || ");
            }
        }

        // 3. THE MASTER PROMPT WITH CONTACT INFO
        const promptText = `You are ServiceBot, the official AI assistant for H&P ServiceHub.
        
        USER INFO:
        - Name: ${userName}
        - Language Preference: ${language || 'English'}
        - Recent Orders: ${orderContext}

        OFFICIAL CONTACT DETAILS:
        - Email: hp12@solution.in
        - Phone: 8050480504

        STRICT INSTRUCTIONS:
        1. If the user asks for contact information, email, phone number, or how to reach the owner/company, provide the details above (8050480504 / hp12@solution.in).
        2. Reply intelligently based on the user's msg: "${message}".
        3. Keep the response to max 2-3 sentences.
        4. Use ONLY English alphabets (Latin Script).`;

        // 4. GOOGLE API URL (🔥 Updated to 1.5 Flash for better stability)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // 5. Direct API Hit
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        // 6. Error Handling from Google
        if (!response.ok) {
            console.error("🔥 GOOGLE API ERROR DETAILS:", data);
            return res.status(200).json({ reply: `🚨 AI Connection Error. Please try again.` });
        }

        // 7. Success Reply
        const aiReply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error("🔥 FATAL ERROR:", error); 
        res.status(200).json({ reply: `🚨 SERVER ERROR: ${error.message}` });
    }
};