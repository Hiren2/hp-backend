const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

/**
 * 🔥 BULLETPROOF ROLE BASED QUERY LOGIC
 * User: Sirf apni notifications dekhega.
 * Manager/Admin: Sirf apne personal alerts aur system-wide relevant alerts dekhenge, dusro ki private nahi.
 */
const buildQuery = (user) => {
  // 1. Agar normal user hai, toh sirf uska apna private data (No mixup)
  if (user.role === "user") {
    return { user: user._id }; 
  }

  // 2. Manager ke liye
  if (user.role === "manager") {
    return { 
      $or: [
        { user: user._id }, // Unki khud ki personal notification
        { type: { $in: ["NEW_ORDER_ALERT", "SUPPORT_REQUEST"] } }, // General alerts for manager
        { targetRole: "manager" } // Agar schema mein explicitly manager defined ho
      ] 
    };
  }

  // 3. Admin / Superadmin ke liye 
  // (🔥 FIX: Pehle yahan 'return {}' tha jisse sabka private data aa raha tha)
  if (user.role === "admin" || user.role === "superadmin") {
    return {
      $or: [
        { user: user._id }, // Unki khud ki
        { user: null }, // Global system alerts jinka koi specific user nahi hota
        { user: { $exists: false } },
        { type: { $in: ["NEW_ORDER_ALERT", "SYSTEM_ALERT", "PAYMENT_RECEIVED", "NEW_USER_REGISTERED", "SUPPORT_REQUEST", "SERVICE_UPDATED"] } },
        { targetRole: { $in: ["admin", "superadmin", "all"] } }
      ]
    };
  }

  return { user: user._id }; // Safe Fallback
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

    // Update only unread notifications for this user/role
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
    
    // 🔥 FIX: Added superadmin support for deletion
    if (notification.user && notification.user.toString() !== req.user._id.toString() && !["admin", "superadmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete" });
  }
};