const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const Order = require("../models/Order");
const Service = require("../models/Service");
const Notification = require("../models/Notification"); 

exports.getAuditLogs = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.isDemo) {
      const demoUsers = await User.find({ isDemo: true }).select('_id');
      query = { actor: { $in: demoUsers.map(u => u._id) } };
    }

    const logs = await AuditLog.find(query)
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

exports.getSystemOverview = async (req, res) => {
  try {
    let userQuery = {};
    let orderQuery = {};
    let logQuery = {};

    if (req.user && req.user.isDemo) {
      userQuery.isDemo = true;
      const demoUsers = await User.find({ isDemo: true }).select('_id');
      const demoIds = demoUsers.map(u => u._id);
      orderQuery.user = { $in: demoIds };
      logQuery.actor = { $in: demoIds };
    }

    const [
      totalUsers,
      totalOrders,
      totalServices,
      recentLogs,
      criticalEvents,
    ] = await Promise.all([
      User.countDocuments(userQuery),
      Order.countDocuments(orderQuery),
      Service.countDocuments(),

      AuditLog.find(logQuery)
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("actor", "name email role"),

      AuditLog.countDocuments({ ...logQuery, severity: "critical" }),
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

exports.getSecurityAlerts = async (req, res) => {
  try {
    let logQuery = { severity: { $in: ["warning", "critical"] } };
    if (req.user && req.user.isDemo) {
      const demoUsers = await User.find({ isDemo: true }).select('_id');
      logQuery.actor = { $in: demoUsers.map(u => u._id) };
    }

    const alerts = await AuditLog.find(logQuery)
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(alerts);
  } catch (err) {
    console.error("SECURITY ALERT ERROR:", err);
    res.status(500).json({ message: "Failed to load security alerts" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const query = req.user && req.user.isDemo ? { isDemo: true } : {};
    const users = await User.find(query).select("-password -passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    const validRoles = ['user', 'manager', 'admin'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role specified." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔥 STRICT DEMO CHECK
    if (req.user.isDemo && !user.isDemo) {
      return res.status(403).json({ message: "Sandbox Mode: Real users cannot be modified." });
    }

    if (user.role === 'superadmin') {
        return res.status(403).json({ message: "Cannot modify SuperAdmin accounts." });
    }

    const oldRole = user.role;
    user.role = role;
    
    await user.save({ validateBeforeSave: false });

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

    try {
      const adminQuery = req.user.isDemo ? { role: "admin", isDemo: true } : { role: "admin", isDemo: { $ne: true } };
      const systemAdmins = await User.find(adminQuery);
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