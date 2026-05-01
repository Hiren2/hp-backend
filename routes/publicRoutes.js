const express = require("express");
const router = express.Router();

const Service = require("../models/Service");
const Order = require("../models/Order");
const User = require("../models/User");



router.get("/stats", async (req, res) => {

  try {

    

    const services = await Service.countDocuments();

    

    const orders = await Order.countDocuments();

    

    const users = await User.countDocuments();

    res.json({
      services,
      orders,
      users
    });

  } catch (err) {

    console.error("Stats error:", err);

    res.status(500).json({
      message: "Failed to load stats"
    });

  }

});

module.exports = router;