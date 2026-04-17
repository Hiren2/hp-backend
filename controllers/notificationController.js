const Notification = require("../models/Notification");

/**
 * 🔥 100% STRICT ROLE-BASED QUERY LOGIC (LEAK-PROOF FIREWALL)
 * User: Sirf apni private notifications dekhega.
 * Manager: Apni personal + Manager-specific global alerts.
 * Admin/Superadmin: Apni personal + Admin global alerts (MANAGER KI ALERTS STRICTLY BLOCKED HAIN).
 */
const buildQuery = (user) => {
  const globalCondition = [{ user: null }, { user: { $exists: false } }];

  // 1. USER: Strictly personal
  if (user.role === "user") {
    return { user: user._id }; 
  }

  // 2. MANAGER: Personal + Manager Global Alerts
  if (user.role === "manager") {
    return { 
      $or: [
        { user: user._id }, 
        { 
          $or: globalCondition,
          $or: [
            { type: { $in: ["NEW_ORDER_ALERT", "SUPPORT_REQUEST"] } }, 
            { targetRole: { $in: ["manager", "all"] } }
          ]
        }
      ] 
    };
  }

  // 3. ADMIN / SUPERADMIN: Personal + System Global Alerts
  if (user.role === "admin" || user.role === "superadmin") {
    return {
      $or: [
        { user: user._id }, 
        { 
          $or: globalCondition,
          type: { $nin: ["NEW_ORDER_ALERT", "SUPPORT_REQUEST"] },
          targetRole: { $nin: ["manager", "user"] }
        }
      ]
    };
  }

  // Safe Fallback
  return { user: user._id }; 
};

/* ================= GET NOTIFICATIONS ================= */
exports.getNotifications = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const query = buildQuery(req.user);

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(15) 
      .populate("orderId", "status service"); 

    res.json(notifications);

  } catch (err) {
    console.error("🔥 GET NOTIFICATIONS ERROR:", err.message);
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

/* ================= MARK ALL AS READ ================= */
exports.markAllRead = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const query = buildQuery(req.user);

    const result = await Notification.updateMany(
      { ...query, isRead: false },
      { $set: { isRead: true } }
    );

    const updatedNotifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(15)
      .populate("orderId", "status service");

    res.json({
      message: "All notifications marked as read",
      updatedCount: result.modifiedCount,
      data: updatedNotifications
    });

  } catch (err) {
    console.error("🔥 MARK READ ERROR:", err.message);
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

/* ================= DELETE NOTIFICATION ================= */
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) return res.status(404).json({ message: "Not found" });
    
    if (notification.user && notification.user.toString() !== req.user._id.toString() && !["admin", "superadmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete" });
  }
};