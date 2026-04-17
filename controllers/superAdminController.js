const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const Order = require("../models/Order");
const Service = require("../models/Service");

/* ================= FETCH AUDIT LOGS ================= */
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("actor", "name email role")
      .populate("target", "name email role")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(logs);
  } catch (err) {
    console.error("AUDIT LOG FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to load audit logs" });
  }
};

/* ================= SYSTEM MONITORING ================= */
exports.getSystemOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalServices,
      recentLogs,
      criticalEvents,
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Service.countDocuments(),

      AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("actor", "name email role"),

      AuditLog.countDocuments({ severity: "critical" }),
    ]);

    res.json({
      systemStats: {
        totalUsers,
        totalOrders,
        totalServices,
        criticalEvents,
      },
      recentActivity: recentLogs,
    });
  } catch (err) {
    console.error("SYSTEM OVERVIEW ERROR:", err);
    res.status(500).json({ message: "Failed to load system overview" });
  }
};

/* ================= SECURITY ALERTS ================= */
exports.getSecurityAlerts = async (req, res) => {
  try {
    const alerts = await AuditLog.find({
      severity: { $in: ["warning", "critical"] },
    })
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(alerts);
  } catch (err) {
    console.error("SECURITY ALERT ERROR:", err);
    res.status(500).json({ message: "Failed to load security alerts" });
  }
};

/* ================= 🔥 GET ALL USERS FOR ROLE MANAGEMENT ================= */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
};

/* ================= 🔥 UPDATE USER ROLE (SUPERADMIN ONLY) ================= */
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    // 🔥 STRICT LOGIC: SuperAdmin can only promote to 'admin' or demote to 'user'
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "SuperAdmin can only manage Admin or User roles." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Enterprise Security: Prevent modifying other SuperAdmins
    if (user.role === 'superadmin') {
        return res.status(403).json({ message: "Cannot modify SuperAdmin accounts." });
    }

    const oldRole = user.role;
    user.role = role;
    
    // Save without triggering other validations like password changes
    await user.save({ validateBeforeSave: false });

    // 🔥 THE BULLETPROOF FIX FOR AUDIT LOGS 🔥
    try {
      if (req.user) {
        await AuditLog.create({
          action: 'ROLE_UPDATED',
          actor: req.user._id,
          actorRole: req.user.role, // <-- REQUIRED FIELD
          target: user._id,         // <-- REQUIRED FIELD
          severity: "warning",
          details: `SuperAdmin changed role of ${user.name} from [${oldRole}] to [${role}]`
        });
      }
    } catch (logErr) {
      // Agar log banane mein error aayi, toh backend crash nahi hoga. Role update succeed hoga.
      console.error("Audit Log Error (Ignored):", logErr.message);
    }

    res.json({ message: `Role updated to ${role} successfully`, user });

  } catch (err) {
    console.error("UPDATE ROLE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};