const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

/**
 * 🔥 BULLETPROOF ROLE BASED QUERY LOGIC
 * User: Sirf apni private notifications dekhega.
 * Manager: Apni personal + sirf wahi global alerts jo Manager ke liye hain (jinka user null hai).
 * Admin/Superadmin: Apni personal + saari global system alerts (jinka user null hai).
 * Master Rule: Agar notification pe user ID lagi hai, toh wo kisi aur (Admin ko bhi) mix hokar nahi dikhegi!
 */
const buildQuery = (user) => {
  // Helper: To strictly find global alerts that don't belong to any specific individual
  const isGlobalAlert = { $or: [{ user: null }, { user: { $exists: false } }] };

  // 1. User: Strictly personal
  if (user.role === "user") {
    return { user: user._id }; 
  }

  // 2. Manager: Personal OR Global Manager Alerts
  if (user.role === "manager") {
    return { 
      $or: [
        { user: user._id }, // Unki khud ki personal notification
        { 
          // Global alerts meant strictly for managers
          ...isGlobalAlert,
          $or: [
            { type: { $in: ["NEW_ORDER_ALERT", "SUPPORT_REQUEST"] } }, 
            { targetRole: { $in: ["manager", "all"] } }
          ]
        }
      ] 
    };
  }

  // 3. Admin / Superadmin: Personal OR All Global System Alerts
  if (user.role === "admin" || user.role === "superadmin") {
    return {
      $or: [
        { user: user._id }, // Unki khud ki personal notification
        { ...isGlobalAlert } // System-wide global alerts (lekin kisi dusre private user ki nahi)
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

    // 🔥 Switching from AuditLog to Notification model for better UI
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(15) // Thoda limit badha diya taaki list achhi dikhe
      .populate("orderId", "status service"); // Order details fetch karne ke liye

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

    // Update only unread notifications mapped to this strict user/role query
    const result = await Notification.updateMany(
      { ...query, isRead: false },
      { $set: { isRead: true } }
    );

    console.log(`✅ NOTIFICATIONS UPDATED: ${result.modifiedCount}`);

    // 🔥 FIX: Fetch fresh list aur usme 'populate' add kiya taaki UI break na ho
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
    
    // 🔥 FIX: Check authorization for deletion
    // If notification has a user, and it's NOT the requesting user, and requester is NOT admin/superadmin -> Block!
    if (notification.user && notification.user.toString() !== req.user._id.toString() && !["admin", "superadmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete" });
  }
};