const Review = require("../models/Review");
const Order = require("../models/Order");
const Service = require("../models/Service");
const User = require("../models/User"); 

exports.createReview = async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;
    const userId = req.user._id;

    const order = await Order.findOne({
      user: userId,
      service: serviceId,
      status: "Completed", 
    });

    if (!order) {
      return res.status(403).json({
        message: "You must have a completed order to review this service",
      });
    }

    const review = await Review.create({
      service: serviceId,
      user: userId,
      rating,
      comment,
    });

    const reviews = await Review.find({ service: serviceId });
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await Service.findByIdAndUpdate(serviceId, {
      averageRating: avg,
      totalReviews: reviews.length,
    });

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Review failed" });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      service: req.params.serviceId,
    })
    .populate("user", "name image") 
    .sort("-createdAt");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to load reviews" });
  }
};

// 🔥 NEW: For Admin Feedback Hub
exports.getAllReviews = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.isDemo) {
      const demoUsers = await User.find({ isDemo: true }).select('_id');
      query.user = { $in: demoUsers.map(u => u._id) };
    } else {
      const realUsers = await User.find({ isDemo: { $ne: true } }).select('_id');
      query.user = { $in: realUsers.map(u => u._id) };
    }

    const reviews = await Review.find(query)
      .populate("user", "name email image isDemo")
      .populate("service", "name category")
      .sort("-createdAt");

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load all reviews" });
  }
};

// 🔥 NEW: For Admin to delete fake/toxic reviews
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Parallel Universe Protection
    const reviewOwner = await User.findById(review.user);
    if (req.user && req.user.isDemo && (!reviewOwner || !reviewOwner.isDemo)) {
      return res.status(403).json({ message: "Sandbox Mode: Cannot delete real user reviews." });
    }

    const serviceId = review.service;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate average rating for the service
    const reviews = await Review.find({ service: serviceId });
    const avg = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
    
    await Service.findByIdAndUpdate(serviceId, {
      averageRating: avg,
      totalReviews: reviews.length,
    });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete review" });
  }
};