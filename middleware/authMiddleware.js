const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

const authenticate = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, authentication denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        message: "Account suspended. Contact administrator.",
      });
    }

    req.user = user;

    // --- FAANG-LEVEL DEMO PROTECTION LAYER START ---
    // Allowed POST/PUT so demo users can test the platform with their own fake data.
    // Only DELETE operations are blocked to prevent accidental data wipes.
    if (req.user.isDemo && ['DELETE'].includes(req.method)) {
      
      if (req.originalUrl.includes('/chat') || req.originalUrl.includes('/bot') || req.originalUrl.includes('/gemini')) {
        return next();
      }

      return res.status(403).json({
        message: "Sandbox Mode Active: Deletion is locked in demo mode."
      });
    }
    // --- DEMO PROTECTION LAYER END ---

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    res.status(401).json({ message: "Token invalid" });
  }
};

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!roles.includes(req.user.role)) {
        try {
          await AuditLog.create({
            actor: req.user._id,
            actorRole: req.user.role,
            action: "UNAUTHORIZED_ACCESS_ATTEMPT",
            target: "ProtectedRoute",
            severity: "warning",
          });
        } catch (logErr) {
          console.error("AUDIT LOG FAILED:", logErr.message);
        }

        return res.status(403).json({
          message: "Access denied. Insufficient permissions.",
        });
      }

      next();
    } catch (err) {
      console.error("ROLE AUTH ERROR:", err.message);
      res.status(500).json({ message: "Authorization error" });
    }
  };
};

module.exports = {
  authenticate,
  protect: authenticate, 
  authorizeRoles, 
};