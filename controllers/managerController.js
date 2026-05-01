const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/authMiddleware");
const managerMiddleware = require("../middleware/managerMiddleware");

const {
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");



router.get(
  "/orders",
  authenticate,
  managerMiddleware,
  getAllOrders
);



router.put(
  "/orders/:id",
  authenticate,
  managerMiddleware,
  updateOrderStatus
);

module.exports = router;