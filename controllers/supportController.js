const Order = require("../models/Order");

exports.handleSupportChat = async (req, res) => {
    try {
        const { message, language } = req.body;
        const userName = req.user?.name || req.user?.fullName || "Dost"; 
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(200).json({ reply: "🚨 ERROR: API Key missing in Render Environment!" });
        }

        const promptText = `You are ServiceBot, the official AI assistant for H&P ServiceHub.
        USER INFO: Name: ${userName}, Language: ${language || 'English'}.
        CONTACT: Email: hp12@solution.in, Phone: 8050480504.
        Reply to: "${message}" in 2-3 sentences max. Use only English alphabets.`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("🔥 GOOGLE ERROR:", data);
            // 🔥 NEW: Ab ye asli Google ka error tere Chatbot screen par dikhayega
            return res.status(200).json({ reply: `🚨 Google API Error: ${data.error?.message || 'Check Render Logs'}` });
        }

        const aiReply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: aiReply });

    } catch (error) {
        res.status(200).json({ reply: `🚨 SERVER ERROR: ${error.message}` });
    }
};