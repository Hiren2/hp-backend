module.exports = (req, res, next) => {
  if (req.user && req.user.role === "manager") {
    return next();
  }

  return res.status(403).json({
    message: "Access denied: Manager only",
  });
};
