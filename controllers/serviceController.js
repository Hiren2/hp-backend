const Service = require("../models/Service");
const Order = require("../models/Order");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User"); // 🔥 NEW: Imported User for RBAC
const Notification = require("../models/Notification"); // 🔥 NEW: Imported Notification
const mongoose = require("mongoose");

/* ================= 🔥 ENTERPRISE RATING AGGREGATION ================= */
const ratingAggregation = [
  {
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "serviceId",
      as: "reviewsAsObject"
    }
  },
  {
    $addFields: {
      idAsString: { $toString: "$_id" }
    }
  },
  {
    $lookup: {
      from: "reviews",
      localField: "idAsString",
      foreignField: "serviceId",
      as: "reviewsAsString"
    }
  },
  {
    $addFields: {
      allReviewsSafe: { $setUnion: ["$reviewsAsObject", "$reviewsAsString"] }
    }
  },
  {
    $addFields: {
      averageRating: { $ifNull: [{ $avg: "$allReviewsSafe.rating" }, 0] },
      totalReviews: { $size: "$allReviewsSafe" }
    }
  },
  {
    $project: {
      reviewsAsObject: 0,
      reviewsAsString: 0,
      allReviewsSafe: 0,
      idAsString: 0
    }
  }
];

/* ================= GET ================= */
exports.getServices = async (req, res) => {
  try {
    const services = await Service.aggregate([
      {
        $match: {
          $or: [
            { isActive: true },
            { isActive: { $exists: false } }
          ]
        }
      },
      ...ratingAggregation,
      {
        $sort: { popularityScore: -1 }
      }
    ]);

    res.json(services);

  } catch (err) {
    console.error("GET SERVICES ERROR:", err);
    res.status(500).json({ message: "Failed to load services" });
  }
};

/* ================= CREATE ================= */
exports.createService = async (req, res) => {
  try {
    let imagePath = req.body.image;

    if (req.file) {
      const protocol = req.protocol;
      const host = req.get("host");
      imagePath = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    const service = await Service.create({
      ...req.body,
      image: imagePath,
      isActive: true
    });

    await AuditLog.create({
      actor: req.user._id,
      actorRole: req.user.role,
      action: "SERVICE_CREATED",
      target: "Service",
      targetId: service._id,
      severity: "info"
    });

    // 🔥 SMART RBAC: Notify all Superadmins and Admins about new service
    try {
      const systemAdmins = await User.find({ role: { $in: ["admin", "superadmin"] } });
      for (let admin of systemAdmins) {
        // Don't notify the person who actually created it, just the others
        if (admin._id.toString() !== req.user._id.toString()) {
          await Notification.create({
            user: admin._id,
            title: "New Service Added! 🆕",
            message: `Platform Update: '${service.name}' was just added to the catalog by ${req.user.role}.`,
            type: "SERVICE_UPDATED",
            isRead: false
          });
        }
      }
    } catch (notifErr) {
      console.error("Failed to notify admins of new service:", notifErr);
    }

    res.status(201).json(service);

  } catch (err) {
    console.error("CREATE SERVICE ERROR:", err);
    res.status(500).json({ message: "Failed to create service" });
  }
};

/* ================= UPDATE ================= */
exports.updateService = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      const protocol = req.protocol;
      const host = req.get("host");
      updateData.image = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    await AuditLog.create({
      actor: req.user._id,
      actorRole: req.user.role,
      action: "SERVICE_UPDATED",
      target: "Service",
      targetId: service._id,
      severity: "info"
    });

    res.json(service);

  } catch (err) {
    console.error("UPDATE SERVICE ERROR:", err);
    res.status(500).json({ message: "Failed to update service" });
  }
};

/* ================= DELETE ================= */
exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const serviceObjectId = new mongoose.Types.ObjectId(serviceId);

    const orderExists = await Order.findOne({
      service: serviceObjectId
    });

    if (orderExists) {
      return res.status(400).json({
        message: "Service cannot be deleted because orders exist"
      });
    }

    const service = await Service.findByIdAndUpdate(
      serviceId,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    await AuditLog.create({
      actor: req.user._id,
      actorRole: req.user.role,
      action: "SERVICE_DEACTIVATED",
      target: "Service",
      targetId: service._id,
      severity: "warning"
    });

    res.json({
      message: "Service deactivated successfully"
    });

  } catch (err) {
    console.error("DELETE SERVICE ERROR:", err);
    res.status(500).json({ message: "Failed to delete service" });
  }
};

/* ================= ANALYTICS ================= */
exports.getServiceAnalytics = async (req, res) => {
  try {
    const analytics = await Order.aggregate([
      {
        $group: {
          _id: "$service",
          totalOrders: { $sum: 1 }
        }
      },
      {
        $sort: { totalOrders: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json(analytics);

  } catch (err) {
    console.error("SERVICE ANALYTICS ERROR:", err);
    res.status(500).json({
      message: "Failed to load service analytics"
    });
  }
};

/* ================= 🔥 SMART RECOMMENDATIONS ================= */
exports.getRelatedServices = async (req, res) => {
  try {
    const currentServiceId = new mongoose.Types.ObjectId(req.params.id);
    const currentService = await Service.findById(currentServiceId);

    if (!currentService) {
      return res.status(404).json({ message: "Service not found" });
    }

    let related = [];

    if (currentService.category) {
      related = await Service.aggregate([
        {
          $match: {
            _id: { $ne: currentServiceId },
            category: currentService.category,
            $or: [{ isActive: true }, { isActive: { $exists: false } }]
          }
        },
        ...ratingAggregation, 
        { $limit: 4 }
      ]);
    }

    if (related.length < 4) {
      const excludeIds = [currentServiceId, ...related.map(r => r._id)];
      const more = await Service.aggregate([
        {
          $match: {
            _id: { $nin: excludeIds },
            $or: [{ isActive: true }, { isActive: { $exists: false } }]
          }
        },
        ...ratingAggregation,
        { $sort: { popularityScore: -1 } },
        { $limit: 4 - related.length }
      ]);
      
      related = [...related, ...more];
    }

    res.json(related);
  } catch (err) {
    console.error("RELATED SERVICES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch related services" });
  }
};