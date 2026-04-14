const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Processing", "Shipped", "Completed"],
      default: "Pending",
    },

    /* 🔥 NEW — ADDRESS (PRO LEVEL) */
    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    /* 🔥 NEW — COUPON & DISCOUNT ENGINE (ENTERPRISE LEVEL) */
    couponCode: {
      type: String,
      default: null, // Stores the applied coupon code (e.g., 'ELEC2')
    },

    discountValue: {
      type: Number,
      default: 0, // Stores how much money was saved
    },

    /* 🔥 NEW — EXACT FINANCIAL SNAPSHOT FOR INVOICES */
    taxAmount: {
      type: Number,
      default: 0, // 18% GST Amount
    },
    
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    
    totalAmount: {
      type: Number,
      default: 0, // Final Net Payable Amount
    },

    /* 🔥 PAYMENT (UPGRADED FOR GATEWAY) */
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "cod", "Online"], // 'Online' added for gateway
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "cod", "paid"], // Merged old and new logic
      default: "Pending", // Default is Pending until they pay
    },

    transactionId: {
      type: String,
      default: null, // Stores the TXN_ ID after success
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    processedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    resolutionTime: {
      type: Number,
      default: null,
    },

    /* 🔥 NEW — SOFT DELETE (USER SIDE ONLY) */
    isDeletedByUser: {
      type: Boolean,
      default: false,
    },

    /* 🔥 NEW — STATUS TRACKING (ULTRA PRO 🔥) */
    statusHistory: [
      {
        status: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

/* 🔥 INDEXES (PERFORMANCE BOOST) */
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);