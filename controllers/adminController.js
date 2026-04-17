const User = require("../models/User");
const Order = require("../models/Order");
const Service = require("../models/Service");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification"); // 🔥 NEW: Imported Notification Model

/* ================= ADMIN ANALYTICS DASHBOARD ================= */
exports.getAdminStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);

    const [
      totalUsers,
      totalServices,
      totalOrders,
      pendingOrders,
      approvedOrders,
      rejectedOrders,
      completedOrders,
      todayOrders,
      processingOrders,
      shippedOrders
    ] = await Promise.all([
      User.countDocuments(),
      Service.countDocuments({
        $or: [
          { isActive: true },
          { isActive: { $exists: false } }
        ]
      }),
      Order.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Approved" }),
      Order.countDocuments({ status: "Rejected" }),
      Order.countDocuments({ status: "Completed" }),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" })
    ]);

    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const topServices = await Order.aggregate([
      {
        $group: {
          _id: "$service",
          orders: { $sum: 1 }
        }
      },
      { $sort: { orders: -1 } },
      { $limit: 5 }
    ]);

    const populatedTopServices = await Service.populate(topServices, {
      path: "_id",
      select: "name category price"
    });

    const managerPerformance = await Order.aggregate([
      { $match: { processedBy: { $ne: null } } },
      {
        $group: {
          _id: "$processedBy",
          processedOrders: { $sum: 1 }
        }
      },
      { $sort: { processedOrders: -1 } }
    ]);

    res.json({
      totalUsers,
      totalServices,
      totalOrders,
      pendingOrders,
      approvedOrders,
      rejectedOrders,
      completedOrders,
      todayOrders,
      processingOrders,
      shippedOrders,
      analytics: {
        monthlyOrders,
        topServices: populatedTopServices,
        managerPerformance
      }
    });

  } catch (err) {
    console.error("ADMIN ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Failed to load admin analytics" });
  }
};

/* ================= USERS LIST ================= */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role totalOrders createdAt lastLogin dob accountStatus");

    res.json(users);

  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
};

/* ================= UPDATE USER ROLE ================= */
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["user","manager","admin","superadmin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Auth missing" });
    }

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res.status(403).json({ message: "Super Admin role is protected" });
    }

    const oldRole = user.role;

    if (oldRole === role) {
      return res.status(400).json({ message: "User already has this role" });
    }

    user.role = role;
    await user.save({ validateBeforeSave:false });

    await AuditLog.create({
      actor: req.user._id,
      actorRole: req.user.role,
      action: "ROLE_CHANGED",
      target: "User",
      targetId: user._id,
      meta: { from: oldRole, to: role, message: `Role upgraded to ${role.toUpperCase()}` }, 
      severity: "warning"
    });

    // 🔥 SMART RBAC: Notify Superadmin/Admins about Role Change
    try {
      const systemAdmins = await User.find({ role: { $in: ["admin", "superadmin"] } });
      for (let admin of systemAdmins) {
        if (admin._id.toString() !== req.user._id.toString()) {
          await Notification.create({
            user: admin._id,
            title: "Access Control Update 🔐",
            message: `Admin ${req.user.email} changed ${user.name}'s role from ${oldRole} to ${role}.`,
            type: "SYSTEM_ALERT",
            isRead: false
          });
        }
      }
    } catch (notifErr) {
      console.error("Failed to notify admins of role change:", notifErr);
    }

    res.json({ message: "User role updated successfully" });

  } catch (err) {
    console.error("UPDATE ROLE ERROR:", err);
    res.status(500).json({ message: "Failed to update role" });
  }
};

/* ================= 🔥 KILL SWITCH (SUSPEND/ACTIVATE USER) ================= */
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    
    if (!req.user) return res.status(401).json({ message: "Auth missing" });

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot suspend your own account" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "superadmin") {
      return res.status(403).json({ message: "Cannot modify superadmin status" });
    }

    user.accountStatus = status;
    await user.save({ validateBeforeSave: false });

    await AuditLog.create({
      actor: req.user._id,
      actorRole: req.user.role,
      action: status === "suspended" ? "USER_SUSPENDED" : "USER_REACTIVATED",
      target: "User",
      targetId: user._id,
      meta: { message: `Account forced into ${status.toUpperCase()} state by Admin` }, 
      severity: status === "suspended" ? "critical" : "info",
    });

    // 🔥 SMART RBAC: Notify Superadmin/Admins about Suspend/Activate
    try {
      const systemAdmins = await User.find({ role: { $in: ["admin", "superadmin"] } });
      for (let admin of systemAdmins) {
        if (admin._id.toString() !== req.user._id.toString()) {
          await Notification.create({
            user: admin._id,
            title: status === "suspended" ? "Security Action: User Suspended ⛔" : "Security Action: User Reactivated 🟢",
            message: `Admin ${req.user.email} has ${status} the account of ${user.name} (${user.email}).`,
            type: "SYSTEM_ALERT",
            isRead: false
          });
        }
      }
    } catch (notifErr) {
      console.error("Failed to notify admins of user status change:", notifErr);
    }

    res.json({ message: `Account ${status} successfully`, user });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: "Failed to update account status" });
  }
};

/* ================= AUDIT LOGS ================= */
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("actor","name email role") 
      .sort({ createdAt:-1 })
      .limit(300); 

    res.json(logs);

  } catch (err) {
    console.error("AUDIT LOG ERROR:", err);
    res.status(500).json({ message: "Failed to load audit logs" });
  }
};