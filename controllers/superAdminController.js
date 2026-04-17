const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const Order = require("../models/Order");
const Service = require("../models/Service");
const Notification = require("../models/Notification"); // 🔥 NEW: Imported Notification Model

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

    // 🔥 FULL POWER TO SUPERADMIN
    const validRoles = ['user', 'manager', 'admin'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role specified." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Enterprise Security: Prevent modifying other SuperAdmins
    if (user.role === 'superadmin') {
        return res.status(403).json({ message: "Cannot modify SuperAdmin accounts." });
    }

    const oldRole = user.role;
    user.role = role;
    
    // Save without triggering other validations
    await user.save({ validateBeforeSave: false });

    // 🔥 THE BULLETPROOF FIX FOR AUDIT LOGS
    try {
      if (req.user) {
        await AuditLog.create({
          action: 'ROLE_UPDATED',
          actor: req.user._id,
          actorRole: req.user.role, 
          target: user._id,         
          severity: "warning",
          details: `SuperAdmin changed role of ${user.name} from [${oldRole}] to [${role}]`
        });
      }
    } catch (logErr) {
      console.error("Audit Log Error (Ignored):", logErr.message);
    }

    // 🔥 SMART RBAC: Notify Admins of Superadmin Action
    try {
      const systemAdmins = await User.find({ role: "admin" });
      for (let admin of systemAdmins) {
        await Notification.create({
          user: admin._id,
          title: "SuperAdmin Action Report 🛡️",
          message: `SuperAdmin has reassigned ${user.name}'s role from ${oldRole} to ${role}.`,
          type: "SYSTEM_ALERT",
          isRead: false
        });
      }
    } catch (notifErr) {
      console.error("Failed to notify admins of superadmin role change:", notifErr);
    }

    res.json({ message: `Role updated to ${role} successfully`, user });

  } catch (err) {
    console.error("UPDATE ROLE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};