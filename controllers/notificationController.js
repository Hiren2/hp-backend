const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

/**
 * 🔥 ROLE BASED QUERY LOGIC
 * User: Sirf apni notifications dekhega.
 * Manager/Admin: Users ke orders aur system alerts dekhenge.
 */
const buildQuery = (user) => {
  if (user.role === "user") {
    return { user: user._id }; // Sirf logged-in user ki notifications
  }

  if (user.role === "manager") {
    // Manager sees alerts for new orders and user activities
    return { 
      $or: [
        { user: user._id }, 
        { type: "NEW_ORDER_ALERT" }
      ] 
    };
  }

  if (user.role === "admin" || user.role === "superadmin") {
    return {}; // Admins see everything
  }

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

    // Update only unread notifications for this user/role
    const result = await Notification.updateMany(
      { ...query, isRead: false },
      { $set: { isRead: true } }
    );

    console.log(`✅ NOTIFICATIONS UPDATED: ${result.modifiedCount}`);

    // Fetch fresh list after updating
    const updatedNotifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(15);

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

/* ================= DELETE NOTIFICATION (Optional but good for UI) ================= */
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) return res.status(404).json({ message: "Not found" });
    
    // Only owner or admin can delete
    if (notification.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete" });
  }
};