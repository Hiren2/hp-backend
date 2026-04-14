const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const Order = require("../models/Order");
const Service = require("../models/Service");

/* ================= FETCH AUDIT LOGS ================= */
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("actor", "name email role")
      .populate("targetId", "name email role")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(logs);
  } catch (err) {
    console.error("AUDIT LOG FETCH ERROR:", err);
    res.status(500).json({
      message: "Failed to load audit logs",
    });
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
    res.status(500).json({
      message: "Failed to load system overview",
    });
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
    res.status(500).json({
      message: "Failed to load security alerts",
    });
  }
};