const Order = require("../models/Order");
const Service = require("../models/Service");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification"); 

/* ================= HELPER: CREATE SMART NOTIFICATION ================= */

const createNotification = async (userId, role, action, message, orderId) => {
  try {
    // 🔥 FIX: AuditLog yahan se hata diya hai. Order updates ab Audit Logs mein kachra nahi karenge.
    // Sirf Notifications table mein jayenge.

    await Notification.create({
      user: userId,
      title: getCatchyTitle(action),
      message: message,
      type: action,
      orderId: orderId,
      isRead: false
    });

  } catch (err) {
    console.error("🔥 NOTIFICATION SYSTEM ERROR:", err.message);
  }
};

const getCatchyTitle = (action) => {
  const titles = {
    ORDER_CREATED: "Order Placed! 🛒",
    ORDER_APPROVED: "Order Approved ✅",
    ORDER_PROCESSING: "Work in Progress ⚙️",
    ORDER_SHIPPED: "On the Way 🚚",
    ORDER_DELIVERED: "Service Completed 📦",
    ORDER_REJECTED: "Order Update ❌",
    NEW_ORDER_ALERT: "Action Required: New Order 📥",
    PAYMENT_SUCCESS: "Payment Received 💳"
  };
  return titles[action] || "Notification Update";
};

/* ================= 🔥 BACKGROUND SYSTEMS (AUTO DELIVERY) ================= */

const fixOldShippedOrders = async () => {
  try {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

    const updated = await Order.updateMany(
      {
        status: "Shipped",
        updatedAt: { $lte: threeHoursAgo },
      },
      {
        status: "Completed",
        completedAt: new Date(),
      }
    );

    if(updated.modifiedCount > 0) console.log("🔥 OLD SHIPPED FIXED:", updated.modifiedCount);
  } catch (err) {
    console.error("OLD FIX ERROR:", err.message);
  }
};

const startAutoDeliveryChecker = () => {
  setInterval(async () => {
    try {
      const orders = await Order.find({ status: "Shipped" });

      for (const o of orders) {
        const hoursPassed = (Date.now() - new Date(o.updatedAt)) / (1000 * 60 * 60);
        const randomHours = 2 + Math.random(); 

        if (hoursPassed >= randomHours) {
          o.status = "Completed";
          o.completedAt = new Date();
          o.resolutionTime = Math.round((o.completedAt - o.createdAt) / (1000 * 60 * 60));

          await o.save({ validateBeforeSave: false });

          await createNotification(
            o.user,
            "user",
            "ORDER_DELIVERED",
            "📦 Excellent news! Your service order has been successfully delivered. Thank you for trusting H&P Solutions!",
            o._id
          );

          console.log("🚀 AUTO DELIVERED:", o._id);
        }
      }
    } catch (err) {
      console.error("AUTO DELIVERY ERROR:", err.message);
    }
  }, 300000); 
};

/* ================= AUTO ORDER LIFECYCLE (THE STEPS) ================= */

const startOrderLifecycle = (order) => {
  // STEP 1: PROCESSING (After 2 Mins)
  setTimeout(async () => {
    try {
      const o = await Order.findById(order._id);
      if (!o || o.status !== "Approved") return;

      o.status = "Processing";
      await o.save({ validateBeforeSave: false });

      await createNotification(
        o.user,
        "user",
        "ORDER_PROCESSING",
        "⚙️ Your order is now being processed by our experts. We're on it!",
        o._id
      );
    } catch (err) {
      console.error("PROCESSING ERROR:", err.message);
    }
  }, 2 * 60 * 1000);

  // STEP 2: SHIPPED (After 5 Mins)
  setTimeout(async () => {
    try {
      const o = await Order.findById(order._id);
      if (!o || (o.status !== "Processing" && o.status !== "Approved")) return;

      o.status = "Shipped";
      await o.save({ validateBeforeSave: false });

      await createNotification(
        o.user,
        "user",
        "ORDER_SHIPPED",
        "🚚 Your service order has been dispatched and is on the way to your location.",
        o._id
      );
    } catch (err) {
      console.error("SHIPPED ERROR:", err.message);
    }
  }, 5 * 60 * 1000);

  // STEP 3: FINAL DELIVERY (Random 2–3 Hours)
  const randomHours = 2 + Math.random(); 

  setTimeout(async () => {
    try {
      const o = await Order.findById(order._id);
      if (!o || (o.status !== "Shipped" && o.status !== "Processing")) return;

      o.status = "Completed";
      o.completedAt = new Date();
      o.resolutionTime = Math.round((o.completedAt - o.createdAt) / (1000 * 60 * 60));

      await o.save({ validateBeforeSave: false });

      await createNotification(
        o.user,
        "user",
        "ORDER_DELIVERED",
        "📦 Service Complete! We've successfully delivered your order. Rate your experience in the dashboard.",
        o._id
      );
    } catch (err) {
      console.error("DELIVERY ERROR:", err.message);
    }
  }, randomHours * 60 * 60 * 1000); 
};

/* ================= CREATE ORDER (🔥 EXACT FINANCIAL CALCULATIONS 🔥) ================= */

const createOrder = async (req, res) => {
  try {
    const { serviceId, priority, address, paymentMethod, couponCode, discountValue } = req.body;

    if (!serviceId) return res.status(400).json({ message: "serviceId is required" });
    if (!address || !address.fullName || !address.phone || !address.city) {
      return res.status(400).json({ message: "Complete address is required" });
    }

    // 1. Service detail fetch karo taaki exact DB calculations ho sake
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const basePrice = service.price || 0;
    const discount = Number(discountValue) || 0;
    const discountedPrice = Math.max(0, basePrice - discount);
    
    // 2. Taxes aur Delivery calculate karo
    const taxAmount = Math.round(discountedPrice * 0.18);
    const deliveryCharge = discountedPrice === 0 ? 0 : (discountedPrice > 1000 ? 0 : 49);
    
    // 3. Final Net Amount
    const totalAmount = discountedPrice + taxAmount + deliveryCharge;

    const order = await Order.create({
      user: req.user._id,
      service: serviceId,
      status: "Pending", // Always pending on creation
      paymentMethod: paymentMethod || "Online", 
      paymentStatus: "Pending", 
      priority: priority || "Medium",
      address,
      couponCode: couponCode || null,
      discountValue: discount,
      taxAmount: taxAmount,          // 🔥 Exact Tax Saved
      deliveryCharge: deliveryCharge, // 🔥 Exact Delivery Saved
      totalAmount: totalAmount        // 🔥 Exact Final Price Saved
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { totalOrders: 1 } });
    await Service.findByIdAndUpdate(serviceId, { $inc: { totalOrders: 1, popularityScore: 1 } });

    await createNotification(
      req.user._id,
      req.user.role,
      "ORDER_CREATED",
      "🛒 Order placed successfully. A manager will review and approve it shortly.",
      order._id
    );

    const managers = await User.find({ role: { $in: ["manager", "admin", "superadmin"] } });
    for (let m of managers) {
        await Notification.create({
            user: m._id,
            title: "New Service Request! 📥",
            message: `A new order #${order._id.toString().slice(-6).toUpperCase()} is waiting for your approval.`,
            type: "NEW_ORDER_ALERT",
            orderId: order._id
        });
    }

    res.status(201).json(order);

  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= USER ORDERS ================= */

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("service")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("GET MY ORDERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN / MANAGER ORDERS ================= */

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "email name")
      .populate("service")
      .populate("processedBy", "email role")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("GET ALL ORDERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ORDER STATUS ================= */

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Order already processed" });
    }

    order.status = status;
    order.processedBy = req.user._id;
    order.processedAt = new Date();

    await order.save({ validateBeforeSave: false });

    // 🔥 REAL RBAC FLOW: Manager approves, THEN lifecycle starts
    if (status === "Approved") {
      await createNotification(
        order.user,
        "user",
        "ORDER_APPROVED",
        "✅ Great news! Your order has been approved. We are preparing to start the service.",
        order._id
      );
      startOrderLifecycle(order);
    }

    if (status === "Rejected") {
      await createNotification(
        order.user,
        "user",
        "ORDER_REJECTED",
        "❌ We regret to inform you that your order was rejected. Please contact support for details.",
        order._id
      );
    }

    res.json(order);

  } catch (err) {
    console.error("🔥 UPDATE ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ORDER ================= */

const deleteMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

    if (order.status !== "Completed") {
      return res.status(400).json({ message: "Only delivered orders can be deleted" });
    }

    await Order.findByIdAndDelete(order._id);
    res.json({ message: "Order deleted successfully" });

  } catch (err) {
    console.error("DELETE ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= MANAGER STATS ================= */

const getManagerStats = async (req, res) => {
  try {
    const stats = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: "Pending" }),
        Order.countDocuments({ status: "Approved" }),
        Order.countDocuments({ status: "Rejected" }),
        Order.countDocuments({ status: "Processing" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Completed" })
    ]);

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });

    res.json({
      totalOrders: stats[0], todayOrders, pendingOrders: stats[1], approvedOrders: stats[2],
      rejectedOrders: stats[3], processingOrders: stats[4], shippedOrders: stats[5], completedOrders: stats[6]
    });

  } catch (err) {
    console.error("MANAGER STATS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN STATS ================= */

const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalServices, totalOrders] = await Promise.all([
        User.countDocuments(),
        Service.countDocuments(),
        Order.countDocuments()
    ]);

    const stats = await Promise.all([
        Order.countDocuments({ status: "Pending" }),
        Order.countDocuments({ status: "Approved" }),
        Order.countDocuments({ status: "Rejected" }),
        Order.countDocuments({ status: "Processing" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Completed" })
    ]);

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const ordersWithService = await Order.find({
      createdAt: { $gte: sevenDaysAgo },
      status: { $ne: "Rejected" } 
    }).populate("service", "price");

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let revenueTrend = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      revenueTrend.push({ 
        name: days[d.getDay()], 
        revenue: 0,
        dateString: d.toDateString()
      });
    }

    ordersWithService.forEach(order => {
      const orderDateStr = new Date(order.createdAt).toDateString();
      const trendItem = revenueTrend.find(item => item.dateString === orderDateStr);
      // 🔥 Using totalAmount for revenue analytics instead of base price!
      const revAmount = order.totalAmount !== undefined ? order.totalAmount : (order.service ? order.service.price : 0);
      
      if (trendItem && revAmount) {
        trendItem.revenue += revAmount;
      }
    });

    res.json({
      totalUsers, totalServices, totalOrders, todayOrders,
      pendingOrders: stats[0], approvedOrders: stats[1], rejectedOrders: stats[2], 
      processingOrders: stats[3], shippedOrders: stats[4], completedOrders: stats[5], revenueTrend 
    });

  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= 🔥 MOCK PAYMENT GATEWAY ================= */
const capturePayment = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "success") {
      order.paymentStatus = "Paid";
      order.transactionId = "TXN_" + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      order.status = "Pending"; // User ka order manager ke liye pending hi rahega
      await order.save({ validateBeforeSave: false });

      await createNotification(
        order.user, "user", "PAYMENT_SUCCESS", 
        "💳 Payment Successful! Your order has been placed and is waiting for manager approval.", 
        order._id
      );

      res.json({ message: "Payment Captured & Order Pending Approval", order });
    } else {
      order.paymentStatus = "Failed";
      await order.save({ validateBeforeSave: false });
      res.status(400).json({ message: "Payment Failed" });
    }
  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= 🔥 INIT ================= */

fixOldShippedOrders();
startAutoDeliveryChecker();

/* ================= EXPORT ================= */

module.exports = {
  createOrder, getMyOrders, getAllOrders, updateOrderStatus,
  deleteMyOrder, getManagerStats, getAdminStats, capturePayment 
};