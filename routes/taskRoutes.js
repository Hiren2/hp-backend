const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const managerMiddleware = require("../middleware/managerMiddleware");

const {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTaskStatus,
  getTaskAnalytics,
} = require("../controllers/taskController");




router.post("/", authenticate, createTask);


router.get("/my", authenticate, getMyTasks);




router.get(
  "/all",
  authenticate,
  managerMiddleware,
  getAllTasks
);


router.put(
  "/:id",
  authenticate,
  managerMiddleware,
  updateTaskStatus
);


router.get(
  "/analytics",
  authenticate,
  adminMiddleware,
  getTaskAnalytics
);

module.exports = router;