const Task = require("../models/Task");
const AuditLog = require("../models/AuditLog");

/* ================= CREATE TASK ================= */

const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "Medium",
      assignedTo: req.user._id,
    });

    await AuditLog.create({
      actor: req.user._id,
      actorRole: req.user.role,
      action: "TASK_CREATED",
      target: "Task",
      targetId: task._id,
      severity: "info",
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= USER TASKS ================= */

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .sort("-createdAt");

    res.json(tasks);

  } catch (error) {
    console.error("GET MY TASKS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ALL TASKS (ADMIN / MANAGER) ================= */

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email role")
      .sort("-createdAt");

    res.json(tasks);

  } catch (error) {
    console.error("GET ALL TASKS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE TASK ================= */

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;

    if (status === "Completed") {
      task.completedAt = new Date();
    }

    await task.save();

    await AuditLog.create({
      actor: req.user._id,
      actorRole: req.user.role,
      action: "TASK_STATUS_UPDATED",
      target: "Task",
      targetId: task._id,
      severity: "info",
    });

    res.json({
      message: "Task updated successfully",
      task,
    });

  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= TASK ANALYTICS ================= */

const getTaskAnalytics = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(stats);

  } catch (error) {
    console.error("TASK ANALYTICS ERROR:", error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

module.exports = {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTaskStatus,
  getTaskAnalytics,
};