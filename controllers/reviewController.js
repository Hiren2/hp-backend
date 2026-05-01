const Review = require("../models/Review");
const Order = require("../models/Order");
const Service = require("../models/Service");


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