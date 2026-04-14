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

/* USER */

// create task
router.post("/", authenticate, createTask);

// my tasks
router.get("/my", authenticate, getMyTasks);

/* ADMIN / MANAGER */

// all tasks
router.get(
  "/all",
  authenticate,
  managerMiddleware,
  getAllTasks
);

// update task
router.put(
  "/:id",
  authenticate,
  managerMiddleware,
  updateTaskStatus
);

// analytics
router.get(
  "/analytics",
  authenticate,
  adminMiddleware,
  getTaskAnalytics
);

module.exports = router;