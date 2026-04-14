const express = require("express");
const router = express.Router();

const Service = require("../models/Service");
const Order = require("../models/Order");
const User = require("../models/User");

/* PUBLIC STATS */

router.get("/stats", async (req, res) => {

  try {

    /* COUNT ALL SERVICES */

    const services = await Service.countDocuments();

    /* COUNT ALL ORDERS */

    const orders = await Order.countDocuments();

    /* COUNT USERS */

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