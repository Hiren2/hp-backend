const express = require("express");
const router = express.Router();

// 1. Controller import
const { handleSupportChat } = require("../controllers/supportController");

// 2. Middleware import
const authMiddleware = require("../middleware/authMiddleware");

// 🛡️ SMART PROTECT LOGIC: 
// Ye line check karegi ki 'protect' function kahan hai
let protect;
if (typeof authMiddleware.protect === 'function') {
    protect = authMiddleware.protect; // Agar { protect } format hai
} else if (typeof authMiddleware === 'function') {
    protect = authMiddleware; // Agar module.exports = protect format hai
}

// ================= DEBUGGING =================
console.log("-----------------------------------------");
console.log("🤖 Chatbot Route Initialization (Attempt 2):");
console.log("👉 Final Protect status:", typeof protect);
console.log("👉 Controller status:", typeof handleSupportChat);
console.log("-----------------------------------------");

// ================= ROUTE REGISTER =================
if (typeof protect === 'function' && typeof handleSupportChat === 'function') {
    router.post("/chat", protect, handleSupportChat);
    console.log("✅ SUCCESS: AI Chat Route is now LIVE!");
} else {
    console.error("❌ STILL ERROR: 'protect' is still undefined. Please check your authMiddleware.js exports.");
}

module.exports = router;