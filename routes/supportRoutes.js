const express = require("express");
const router = express.Router();


const { handleSupportChat } = require("../controllers/supportController");


const authMiddleware = require("../middleware/authMiddleware");



let protect;
if (typeof authMiddleware.protect === 'function') {
    protect = authMiddleware.protect; 
} else if (typeof authMiddleware === 'function') {
    protect = authMiddleware; 
}


console.log("-----------------------------------------");
console.log("🤖 Chatbot Route Initialization (Attempt 2):");
console.log("👉 Final Protect status:", typeof protect);
console.log("👉 Controller status:", typeof handleSupportChat);
console.log("-----------------------------------------");


if (typeof protect === 'function' && typeof handleSupportChat === 'function') {
    router.post("/chat", protect, handleSupportChat);
    console.log("✅ SUCCESS: AI Chat Route is now LIVE!");
} else {
    console.error("❌ STILL ERROR: 'protect' is still undefined. Please check your authMiddleware.js exports.");
}

module.exports = router;