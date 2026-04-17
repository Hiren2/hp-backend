const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= 🔥 HELPER: CALCULATE AGE & GET AVATAR ================= */
const getSmartAvatar = (name, dob) => {
  try {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    let style = "avataaars"; 

    if (age < 18) {
      style = "adventurer"; 
    } else if (age > 45) {
      style = "bottts-neutral"; 
    }

    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(name)}`;
  } catch (err) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
  }
};

/* ================= REGISTER ================= */
const register = async (req, res) => {
  try {
    let { name, email, password, dob } = req.body;

    if (!name || !email || !password || !dob) {
      return res.status(400).json({ message: "All fields required" });
    }

    email = email.toLowerCase().trim();

    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email exists" });

    if (await User.findOne({ name }))
      return res.status(409).json({ message: "Username exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const smartImage = getSmartAvatar(name, dob);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      dob,
      image: smartImage, 
    });

    await AuditLog.create({
      actor: user._id,
      actorRole: user.role,
      action: "USER_REGISTERED",
      target: user._id, // Fixed target mapping
      severity: "info",
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name,
        email,
        role: user.role,
        image: user.image, 
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Register failed" });
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid login" });
    }

    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        message: "Account suspended. Contact administrator.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      await AuditLog.create({
        actor: user._id,
        actorRole: user.role,
        action: "FAILED_LOGIN_ATTEMPT",
        target: user._id, // Fixed target mapping
        severity: "warning",
      });

      return res.status(400).json({ message: "Invalid login" });
    }

    user.lastLogin = new Date();

    if (!user.image) {
      user.image = getSmartAvatar(user.name, user.dob);
    }

    await user.save({ validateBeforeSave: false });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await AuditLog.create({
      actor: user._id,
      actorRole: user.role,
      action: "USER_LOGIN",
      target: user._id, // Fixed target mapping
      severity: "info",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image, 
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login error" });
  }
};

/* ================= DOB VERIFY ================= */
const verifyDob = async (req, res) => {
  try {
    const { email, dob } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.dob !== dob) {
      return res.status(400).json({
        message: "Invalid email or DOB",
      });
    }

    res.json({ message: "Verified" });
  } catch (err) {
    console.error("DOB VERIFY ERROR:", err);
    res.status(500).json({
      message: "Verification failed",
    });
  }
};

/* ================= RESET PASSWORD ================= */
const resetPasswordWithDob = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    await AuditLog.create({
      actor: user._id,
      actorRole: user.role,
      action: "PASSWORD_RESET",
      target: user._id, // Fixed target mapping
      severity: "warning",
    });

    res.json({ message: "Password updated" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({
      message: "Password reset failed",
    });
  }
};

/* ================= GET WISHLIST ================= */
const getWishlist = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.wishlist);
  } catch (err) {
    console.error("GET WISHLIST ERROR:", err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

/* ================= TOGGLE WISHLIST ================= */
const toggleWishlist = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const { serviceId } = req.body;
    if (!serviceId) return res.status(400).json({ message: "Service ID is required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isLiked = user.wishlist.includes(serviceId);

    if (isLiked) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== serviceId.toString());
    } else {
      user.wishlist.push(serviceId);
    }

    await user.save({ validateBeforeSave: false });

    res.json({
      message: isLiked ? "Removed from wishlist" : "Added to wishlist",
      wishlist: user.wishlist
    });

  } catch (err) {
    console.error("TOGGLE WISHLIST ERROR:", err);
    res.status(500).json({ message: "Failed to update wishlist" });
  }
};

/* ================= 🔥 UPDATE PROFILE (THE LOGOUT FIX) ================= */
const updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    
    const { name, image } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (image) user.image = image;

    await user.save();

    res.json({ 
      message: "Profile updated successfully in DB", 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        image: user.image 
      } 
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to update profile in database" });
  }
};

/* ================= 🔥 NEW: SECURE CHANGE PASSWORD (MANAGERS, ADMINS, SUPERADMINS ONLY) ================= */
const changePassword = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    // 🔥 BACKEND SECURITY: Block standard 'user' role strictly!
    if (req.user.role === "user") {
      return res.status(403).json({ message: "Users must use the 'Forgot Password' link on the login page." });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both current and new passwords" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify current password
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash and update the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save({ validateBeforeSave: false });

    // Generate Audit Log for Security Event
    try {
      await AuditLog.create({
        actor: user._id,
        actorRole: user.role,
        action: "PASSWORD_CHANGED",
        target: user._id,
        severity: "info",
        details: `${user.role} updated their account security credentials.`
      });
    } catch (logErr) {
      console.error("Audit log error ignored:", logErr.message);
    }

    res.json({ message: "Password updated successfully! 🚀" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
};

module.exports = {
  register,
  login,
  verifyDob,
  resetPasswordWithDob,
  getWishlist,    
  toggleWishlist,
  updateProfile,
  changePassword // 🔥 Exported the new function
};