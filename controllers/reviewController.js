const Review = require("../models/Review");
const Order = require("../models/Order");
const Service = require("../models/Service");

/* CREATE REVIEW */
exports.createReview = async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;
    const userId = req.user._id;

    /* CHECK IF USER ORDERED SERVICE & IT IS COMPLETED */
    const order = await Order.findOne({
      user: userId,
      service: serviceId,
      status: "Completed", // Amazon style: Only delivered orders can be reviewed
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

    /* UPDATE SERVICE RATING */
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

/* GET SERVICE REVIEWS */
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      service: req.params.serviceId,
    })
    .populate("user", "name image") // Added image for premium look
    .sort("-createdAt");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to load reviews" });
  }
};