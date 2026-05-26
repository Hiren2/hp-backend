const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "superadmin", "manager", "user"],
      default: "user",
    },

    dob: {
      type: String,
      required: true, 
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      }
    ],

    // --- FAANG-LEVEL DEMO PROTECTION FLAG ---
    // 'default: false' ensures existing live users are NEVER affected.
    isDemo: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);