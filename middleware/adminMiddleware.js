module.exports = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!["admin", "superadmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  } catch (err) {
    console.error("ADMIN MIDDLEWARE ERROR:", err);
    res.status(500).json({ message: "Admin middleware failed" });
  }
};
