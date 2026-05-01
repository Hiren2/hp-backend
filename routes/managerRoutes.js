const express = require("express");
const router = express.Router();

const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const {
  getAllOrders,
  updateOrderStatus,
  getManagerStats
} = require("../controllers/orderController");




router.get(
  "/orders",
  authenticate,
  authorizeRoles("manager"),
  getAllOrders
);


router.put(
  "/orders/:id",
  authenticate,
  authorizeRoles("manager"),
  updateOrderStatus
);


router.get(
  "/stats",
  authenticate,
  authorizeRoles("manager"),
  getManagerStats
);

module.exports = router;