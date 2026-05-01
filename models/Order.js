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

    
    managerNotes: {
      type: String,
      default: "", 
    },

    
    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    
    couponCode: {
      type: String,
      default: null, 
    },

    discountValue: {
      type: Number,
      default: 0, 
    },

    
    taxAmount: {
      type: Number,
      default: 0, 
    },
    
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    
    totalAmount: {
      type: Number,
      default: 0, 
    },

    
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "cod", "Online"], 
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "cod", "paid"], 
      default: "Pending", 
    },

    transactionId: {
      type: String,
      default: null, 
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

    
    isDeletedByUser: {
      type: Boolean,
      default: false,
    },

    
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


orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);