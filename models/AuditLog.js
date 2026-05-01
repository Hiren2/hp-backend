const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    actorRole: {
      type: String,
      enum: ["user", "manager", "admin", "superadmin"],
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    target: {
      type: String,
      required: true,
    },

    
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    
    meta: {
      type: mongoose.Schema.Types.Mixed, 
      default: {},
    },

    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      default: "info",
    },

    ipAddress: {
      type: String,
      default: null,
    },

    
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);